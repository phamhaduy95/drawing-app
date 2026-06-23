# Data Navigation

Data Navigation is a feature that allows users to navigate to a specific trend page or alarm page associated with the tag data connected to a given node.

Currently, these two pages are not yet implemented. In the meantime, you can use mocked URLs for them.

**Examples:**

- `/alarm-page`
- `/trend-page`

## Usage

Users can access this feature in two ways:

1. **Context Menu:** Right-click a node and select "Go to Trend" or "Go to Alarm".
2. **Toolbar:** Select a node and click the Trend or Alarm icon in the top toolbar.

\_Note: These options are disabled if the node has no linked measurement data.

Navigation opens the target page in a new browser tab.

### Implementation

- Step 1: Create svg icon for Trend and Alarm.

- Step 2: add 2 Icon for showing trend and showing alarms on the TopToolbar. the default state is disabled.

- Step3: add 2 options for navigating to trend page and alarm page on the CanvasContextMenu

Note: Icon on toolbar and ContextMenu are the same.

- To check if tag linked to node, you can use useNodeTagBinding composable. it returns the tagIds that are linked to the node. If the array is empty, then the node has no linked tag.
