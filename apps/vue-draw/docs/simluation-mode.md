simulation-mode
There will be new section on toolbar(apps/vue-draw/src/modules/designer/layouts/DesignToolbar/DesignToolbar.vue) for simulation mode:

- run button
- stop button
- design button

when user click on design button, the app will switch to design mode.
While in design mode, user can drag, drop, move, delete, rotate, scale, connect nodes,select nodes

when user click on run button, the app will switch to simulation mode.
While in simulation mode, user can't drag, drop, move, delete, rotate, scale, connect nodes however, user is still abloe to select node to inspect the node properties on the left side.

Code implementation

Step 1: Create a useSimulation composable where state is stored in pinia store.

- The state is a object:
  {
  mode: 'design' | 'simulation';
  status: "RUN" | "STOP" | "PAUSE";  
  }

Step 2: Create a new button group for useSimulation on DesignToolBar

- while in design mode, the design button is disabled or grey out.
- while in simulation mode, the run / pause / stop buttons are enabled.

Step 3: Implement node locking when app is in running mode.

- in DesignerPage.vue get current mode via useSimulation composable and use it to lock user from doing certain operations while app is in run mode: - draggable: false - resizable: false - rotatable: false - connectable: false - deletable: false - copyable: false - pasteable: false - selectable: true
  in apps/vue-draw/src/modules/designer/layouts/DesignRightPanel/NodePropertiesPanel.vue, get current mode via useSimulation composable and use it to make every field read-only while app is in run mode.
