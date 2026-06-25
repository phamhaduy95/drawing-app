Floating toolbar provides short cut for certain common actions. It will be displayed when the user click to select a node.

The floating toolbar would popup on the top side, horizontally centered relative to the selected nodes.

The common actions are divided into 4 groups

group1: copy, paste, duplidate
group2: group, ungroup
group3: bring to front, send to back
group4: go to trend, go to Alarm and Event

When multiple nodes are selected, certain action will be disabled:

- group4: go to trend, go to Alarm and Event will be disabled

Implementation steps

1. Create the FloatingToolbar.vue component base on the 'apps/vue-draw/src/modules/designer/layouts/DesignToolbar/DesignToolbar.vue'
2. Add FloatingToolbar component to Canvas in 'DesignerPage.vue'
