# Tag Binding Architecture

## 1. Overview

Tag binding is the process of linking a data source (a tag) to a graphical object's properties, such as color, label, border-color, or dimension. To bind a tag to a node property, the data type of the tag's value must be compatible with the target property's data type.

### 1.1 Tag Binding via Drag and Drop

Users can quickly establish a direct binding by dragging a tag value from the right-hand panel (Tag Explorer) into a property field on the left-hand panel (Properties). This action is functionally equivalent to configuring a **Direct Binding** via the Tag Binding Dialog.

Depend on the type comptiblilty between tag and property field, any imcompatible field would be grey-out.

When hovering dragging tag and move it over property field that compatible with tag's data type, the property field will be highlighted with a blue border.

---

## 2. Data Models

The core data structures involved in tag binding are `MeasurementType` and `TagValue`. Any field inside a `MeasurementType` that is assigned a `TagValue` type (e.g., `value`, `description`, `unit`) is considered an independent tag.

```typescript
export type TagDataType = 'number' | 'string' | 'boolean' | 'date' | 'time';

export interface MeasurementType {
	id: string; // uuid
	label: TagValue;
	description: TagValue;
	value: TagValue;
	server: Server;
	functionBlock: FunctionBlock;
	unit: TagValue;
}

export interface TagValue {
	id: string;
	value: string;
	quality: string;
	timestamp: string;
	dataType: TagDataType;
}

export interface Server {
	id: string;
	name: string;
}

export interface FunctionBlock {
	id: string;
	name: string;
	label: string;
}
```

### 2.1 Tag ID Format

A unique tag ID typically follows a dot-notation path format:
`Root.<server>.<functionBlock>.<Measurement_field_name>`

**Examples:**

- `Root.OPCUA.FB001.Value`
- `Root.OPCUA.FB001.Description`
- `Root.OPCUA.FB001.Unit`

_(Type definitions are located in `apps/vue-draw/src/modules/designer/types/Tag.type.ts`)_

---

## 3. State Management

### 3.1 Tag Management Store

A Pinia store responsible for maintaining the available industrial tags in the system.

- **State:** `{ tags: MeasurementType[] }`
- **Actions:**
  - `addTags(tags: MeasurementType[]): void`
  - `removeTags(tagIds: string[]): void`
  - `clear(): void`

_Note: The system currently uses mocked tag lists sourced from `apps/vue-draw/src/modules/designer/constant/defaultTags.ts`._

### 3.2 Tag Binding Store

A Pinia store managing the mapping between tag values and specific node properties.

- **Rule:** One tag can be bound to multiple node properties, but a single node property can only be bound to one tag at a time.

- **Data Structure:** `Map<string, BindingDataRecord[]>`

```typescript
type BindingDataRecord = {
	tagId: string;
	nodeId: string;
	field: string;
	updateFunction: (value: any) => void;
};
```

- **State:** `{ tagBindings: Map<string, BindingDataRecord[]> }`
- **Actions:**
  - `addTagBinding(data: BindingDataRecord): void`
  - `removeTagBinding(data: Pick<BindingDataRecord, 'tagId' | 'nodeId' | 'field'>): void`
  - `removeTag(tagId: string): void`
  - `clear(): void`

### 3.3 `useTagRegister` Composable

Provides an interface for nodes to register and unregister their tag bindings to the central store.

- `registerTag(data: BindingDataRecord): void`
- `unregisterTag(data: Pick<BindingDataRecord, 'tagId' | 'nodeId' | 'field'>): void`

---

## 4. Real-time Tag Sync

The system must observe changes to registered tags and dynamically execute the associated `updateFunction` to reflect live data on the canvas.

- **Implementation Location:** `apps/vue-draw/src/modules/designer/composables/useTagRegister.ts`
- **Execution Context:** Updates should only process when the application is in `running` mode (verified via the `useSimulation` composable).
- **UI Behavior:** In run mode, the `PropertyField` on the Node Property Panel displays the live, bound value instead of the tag name.

---

## 5. Tag Binding Dialog

The Tag Binding Dialog provides a detailed interface for binding a tag value to a node property. It can be accessed by clicking the "link" icon next to any property field in the Node Properties Panel.

### 5.1 Dialog State Management

The dialog relies on a Pinia store and the `useTagBindingDialog` composable.

- **State:**

```typescript
{
	isOpen: boolean;
	selectedMode: 'direct' | 'expression' | 'conditional';
	expressionValue: string;
	selectedTag: string;
	selectedNode: {
		nodeId: string;
		field: string;
	} | null;
}
```

- **Actions (`useTagBindingDialog`):**
  - `openDialog(node: { nodeId: string, field: string }, tag?: string, updateFunction?: (value: any) => void, mode: TagBindingMode = 'direct'): void`
    _(Note: `tag` is the tagId that binds to the property. Users can get the bound tagId from `node.data.bindings`.)_
  - `closeDialog(): void`

**Save Action Workflow:**
When the user clicks the "Save" button:

- **Direct Mode:**
  1. Unregister the existing tag binding (if any).
  2. Register the new tag binding.
  3. Update tag bindings inside the node's `data.bindings`.
  4. Close the dialog.
- **Expression / Conditional Modes:** _(Not implemented in the current version)._

### 5.2 Binding Modes

#### Mode 1: Direct Binding

The simplest method to link a tag. It maps the raw value of the selected tag directly into the node property.

- **UI Layout:** A split-pane design with the header "Select tag binding".
  - **Left Pane:** Search bar and hierarchical Tag TreeView.
  - **Right Pane:** Selected tag details (Name, Description, Unit, Upper Limit, Lower Limit).
- **Features:** Supports keyword searching to quickly locate tags within large industrial datasets.

#### Mode 2: Expression

Allows users to write custom arithmetic or logical formulas combining one or more tags.

- **Input:** Standard mathematical operators (`+`, `-`, `*`, `/`) are supported.
- **Autocomplete:** Powered by the `SuggestionInput` component. Typing `%` triggers an autocomplete dropdown for tag paths.
- **Example:** `(%Root.Server1.FB00PDI01.value + 10) / 1000`

**Expression Evaluation Integration:**
Evaluating simple expressions relies on `mathjs`.

1. **Parsing Tag Paths:** Since `mathjs` cannot parse the dot-notation path natively, valid tag strings must be wrapped.
   - Example: `%Root.Server1.FB00PDI01.value + 10` is transformed to `vars["Root.Server1.FB00PDI01.value"] + 10`.
2. **Compilation:** Compile the wrapped expression using `mathjs`'s `compile()` function.
   ```typescript
   const compiledExpression = compile('vars[arg0] + vars[arg1]');
   ```
3. **Execution & Updaters:**
   - Extract required tag paths from the expression AST (`const variablePathName = ast.filter(n => n.nsymbol).map(n => n.name)`).
   - Create an `updateNode` function that maps live tag values to these variables and evaluates `compiledExpression.evaluate({ "vars": args })`.
   - Store these updater functions in a reactive `Map<string, updateFunction>` called `expressionUpdaters` (keyed by `nodeId.field-path`) within `useTagRegister`.
   - Watch the tags store for changes to trigger the registered expression updaters.

#### Mode 3: Conditional Expression

For complex logic requiring conditional branching, allowing node properties to change dynamically based on tag states.

- **UI Layout:** A table-based rule builder.
  - **Columns:** `Order` | `Continue` (Checkbox) | `Condition` (Expression via SuggestionInput) | `Value` (Expression via SuggestionInput) | `Action` (Delete Row Icon)
  - **Controls:** An "Add row" button at the bottom.
  - **Interactivity:** Users can reorder rows via drag-and-drop using `@dnd-kit/vue` (currently mocked, underlying expression logic pending).
