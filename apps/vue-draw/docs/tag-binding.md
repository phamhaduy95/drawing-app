Tag binding

#### Definition

Tag binding is the process of binding a data source to a graphical object's properties such as color, label, border-color, dimenstion.

The Measurement data object and Tag data is defined below:

```typescript
export type TagDataType = 'number' | 'string' | 'boolean' | 'date' | 'time';

export interface MeasurementType {
	id: string; //uuid;
	label: TagValue;
	description: TagValue;
	value: TagValue;
	server: Server;
	functionBlock: FunctionBlock;
	unit: TagValue;
}

export interface TagValue {
	id: string; ;
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

Note: The any field inside Meassurement that is assigned TagBalue type such as value, description, unit and so on is considered as a tag.

The tag id often follow this format:
Root.server.functionBlock.Measurement_field_name

For example:
tagId: 'Root.OPCUA.FB001.Value'
tagId: 'Root.OPCUA.FB001.Description'
tagId: 'Root.OPCUA.FB001.Unit'

You can find type definition on `apps/vue-draw/src/modules/designer/types/Tag.type.ts`

To be able to bind tag value to any node property:
The datatype of the tag value must be compatible with the property's datatype.

#### Tag binding management

We will use pinia store to store mapping between tag value to node property.

One tag can be bound to multiple node properties.
One node property can be bound to one tag value only at the time.

type BindingDataRecord = {
tagId: string;
nodeId: string;
field: string;
updateFunction: (value: any) => void;
}

The data structure to store tag binding is Map<string,BindingDataRecord[]>
detail spec:

The tag binding pinia store:
state:

{ tagBindings: Map<string,BindingDataRecord[]> }

methods:

- addTagBinding(data:BindingDataRecord): void
- removeTagBinding(data:Pick<BindingDataRecord, 'tagId' | 'nodeId' | 'field'>): void
- removeTag(tagId: string): void
- clear():void

useTagRegister composable: register node's tag bindings to the tag binding store.

- registerTag(data:BindingDataRecord): void
- unregisterTag(data:Pick<BindingDataRecord, 'tagId' | 'nodeId' | 'field'>): void

#### Tag management store

The Tag management store is a pinia store that stores the available MeasurementType and user can register tags to this store.

state:
{ tags: MeasurementType[] }

methods:

- addTags(tags: MeasurementType[]): void
- removeTags(tagIds: string[]): void
- clear():void

- create pinia store and its extended composiable.
- currently we will use mocked tag lists from
  `apps/vue-draw/src/modules/designer/constant/defaultTags.ts`

#### Tag Binding Dialog

The Tag Binding Dialog is a dialog where user can bind tag value to node property.
To open this dialog, from the NodePropertyPanel, user can click on the link icon on the right side of any Properties field
There are three available modes for binding:

- **Direct binding**
- **Expression**
- **Conditional expression**

1. Direct Binding

Direct binding is the simplest way to link a tag. It maps the raw value of a selected tag straight into the node property.

- **How it works:** Use the Combobox dropdown to browse or search for a specific tag from the list of compatible tag values.

The options :{
label: {{}}
value: {{tagId}}
}

- **Features:** The component supports keyword search, making it easy to find specific tags in a large industrial dataset.

2. Expression

The Expression mode allows you to write custom arithmetic or logical formulas combining one or more tags.

- **How it works:** You can specify an expression directly in the input field. It supports standard arithmetic operators (such as plus, minus, multiply, divide).
- **Autocomplete:** This field uses a `SuggestionInput` component. Simply type `@` to trigger an autocomplete menu that helps you quickly search and insert tag paths.
- **Example:** You can write expressions like `(@Root.Server1.FB00PDI01.label.value + 10) / 1000` to scale or manipulate data before it is applied to the property.

---

3. Conditional Expression

Last but not least, for more complex logic that requires conditional branching, you can use the Conditional Expression builder. This allows the node property to change dynamically based on the state of various tags.

The Spec:

The state of the TagBindingDialog live in pinia store:
isOpen: boolean
selectedMode: ENUM {direct | expression | conditional}
expressionValue: string
selectedTag: string
selectedNode: {
nodeId: string
field: string
}

the we have public composiable useTagBindingDialog

- openDialog(node: { nodeId: string; field: string },
  tag?: string,
  updateFunction?: (value: any) => void, // function for updating node property
  mode: TagBindingMode = 'direct'): void
  tag is tagId that bind to property. User can get the bounded tagId from node's data.bindings.

- closeDialog(): void

When user click on save button:

- if selectedMode is direct
  - Unregister the old tag binding if exist
  - register the new tag binding
  - update tag bindings from node's data.bindings
  - close the dialog
- if selectedMode is expression.`
  NOT IMPLEMENTED at this version
- if selectedMode is conditional
  NOT IMPLEMENTED at this version

Step 5: Implement real-time tag sync

apps/vue-draw/src/modules/designer/composables/useTagRegister.ts,

observe when the registered tag's value change, we need to execute registered update functions

Note: the update process will run while app in running mode. Please use useSimulation to check the mode.

When in run mode, on the NodePropertyPanel, The PropertyField instead of showing the name of binded tag, it should show the live value of the binded tag.

Step 6: evaluate Simple Expression in TagBindingDialog simple expression input
using mathjs. Two main tasks:

1. evaluate the expression and return the result
2. get all tag id from the expression.

The tag id is always in this format: Root.server.functionBlock.measurement_field_name

since mathJs can not understand this format, we need to wrap around any string that belong this format with vars[""]

Example: "@Root.Server1.FB00PDI01.label.value + 10" -> "vars[\"Root.Server1.FB00PDI01.label.value\"] + 10"

compile the expression using mathJs compile function

Create a variable as function to update the node property where user can pass array args into which present a list of variable get from expression
Example:

const compiledExpression = compile("vars[arg0] + vars[arg1]");
get variable 'pathName' from the tags list that match the "vars[index]"
Example:
const variablePathName = ast.filter(n=>n.nsymbol).map(n=>n.name)

const updateNode = (args:MeasurementType[])=>{
//extract variable from tagsData using path and pass it to compiledExpression.
from the args extract all value using the variablePathName
compiledExpression.evaluate({"vars":args})

}

then register to useTagRegister as expressionUpdater

in useTagRegister:
create a new ref called expressionUpdaters with this type Map<string, updateFunction>
where key is nodeId.field-path format

Watch the tags store change to execute every register updatedFunction
