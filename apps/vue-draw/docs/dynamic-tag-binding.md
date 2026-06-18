# Dynamic Tag Binding

Dynamic tag binding allows you to map real-time industrial data (tags) directly to the properties of nodes within the designer canvas.

## Accessing the Tag Binding Dialog

There are two primary ways to initiate tag binding:

1. **Direct Dragging:** You can bind data via direct dragging from the tag tree onto the canvas.
2. **Properties Panel:** From the properties panel, you can click on the **Link icon** located on the right side of any supported input field.

This opens the **Tag Bindings** dialog, where you can manage exactly how tag data should be injected into the selected property. There are three available modes for binding:

- **Direct binding**
- **Expression**
- **Conditional expression**

---

### 1. Direct Binding

Direct binding is the simplest way to link a tag. It maps the raw value of a selected tag straight into the node property.

- **How it works:** Use the Combobox dropdown to browse or search for a specific tag from the list of compatible tag values.
- **Features:** The component supports keyword search, making it easy to find specific tags in a large industrial dataset.

![[Pasted image 20260616145939.png]]

---

### 2. Expression

The Expression mode allows you to write custom arithmetic or logical formulas combining one or more tags.

- **How it works:** You can specify an expression directly in the input field. It supports standard arithmetic operators (such as plus, minus, multiply, divide).
- **Autocomplete:** This field uses a `SuggestionInput` component. Simply type `@` to trigger an autocomplete menu that helps you quickly search and insert tag paths.
- **Example:** You can write expressions like `(@Root.Server1.FB00PDI01.label.value + 10) / 1000` to scale or manipulate data before it is applied to the property.

---

### 3. Conditional Expression

Last but not least, for more complex logic that requires conditional branching, you can use the Conditional Expression builder. This allows the node property to change dynamically based on the state of various tags.
![[Pasted image 20260616150247.png]]

#### Managing Rules

By default, there are no rules applied. To add a new rule, click on the **Add Rule** button.
![[Pasted image 20260616150742.png]]

![[Pasted image 20260616150730.png]]

Each rule consists of two parts:

- **Condition:** A logical statement that evaluates to true or false (e.g., `@tag1 > 10 AND @tag2 == 1`).
- **Expression:** The value or formula to apply if the condition is met (e.g., `@tag1 * 2`).
  Both fields support the `@` trigger character for tag autocomplete.

#### Rule Evaluation & Ordering

Rules are evaluated from top to bottom. The expression of the _first_ rule whose condition evaluates to `true` will be applied.

- **Reordering:** You can easily swap the rule position by grabbing the drag handle (☰) on the left side of a rule and dragging it up or down.
  ![[Pasted image 20260616150911.png]]

#### Removing Rules

You can also remove an obsolete rule by clicking on the **Bin icon** on the right side of the rule block.
![[Pasted image 20260616151346.png|671]]

---

## Saving Bindings

When you click on **Save**, the tag binding configuration will be persisted and bound to the node's properties.

## Bound Properties

Once a node property is successfully bound, its UI in the Properties Panel updates to reflect the active binding.

![[Pasted image 20260616151919.png]]

- **Status Indicator:** The property label will display a **Tag** badge for direct bindings, or an **Expression** badge when a custom or conditional expression is applied.
- **Editing Bindings:** You can modify the current binding configuration by clicking on the **Edit icon** next to the badge. This will reopen the Tag Bindings dialog, allowing you to update the binding mode or modify your expressions.
- **Removing Bindings:** To completely clear an existing binding and revert the property to its default state, click the **Remove (Trash) icon**.
