# Software Requirements Specification (SRS) for Data Navigation

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to outline the software requirements for the "Data Navigation" feature within the application. This feature empowers users to seamlessly navigate from a selected node on the canvas to corresponding data visualization pages, specifically Trend and Alarm pages, based on the node's linked tag data.

### 1.2 Scope

This specification covers the UI elements, user interactions, and underlying logic required to implement the Data Navigation functionality. It includes the addition of navigation controls in the Canvas Context Menu and the Top Toolbar, as well as the conditional logic to enable or disable these controls based on active data binding states. The actual implementation of the target Trend and Alarm pages is outside the scope of this document; mocked URLs will be utilized in the interim.

## 2. Overall Description

### 2.1 User Interfaces

The Data Navigation feature introduces modifications to two primary user interface components:

- **Top Toolbar:** Introduction of new interactive icons for "Trend" and "Alarm".
- **Canvas Context Menu:** Introduction of new actionable menu items for "Go to Trend" and "Go to Alarm".

### 2.2 User Characteristics

The intended users are system operators or designers interacting with the node-based canvas interface, who require rapid access to historical trends or current alarms related to specific equipment or data points represented by the nodes.

### 2.3 Assumptions and Dependencies

- The `useNodeTagBinding` composable is available and functioning correctly to accurately determine if a node has linked tags.
- The browser environment permits opening new tabs via standard web APIs (e.g., `window.open`).

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 UI Components

- **FR1:** The system shall display a dedicated "Trend" SVG icon and an "Alarm" SVG icon within the Top Toolbar.
- **FR2:** The system shall display "Go to Trend" and "Go to Alarm" options within the context menu when a user right-clicks on a node.
- **FR3:** The visual icons representing these actions must be identical across both the Top Toolbar and the Canvas Context Menu to maintain visual consistency.

#### 3.1.2 Interaction Logic & State Management

- **FR4:** The "Trend" and "Alarm" options (in both the toolbar and context menu) shall be **disabled** by default or when the currently selected node has no linked measurement data.
- **FR5:** The system shall utilize the `useNodeTagBinding` composable to retrieve the array of `tagIds` linked to the selected node.
- **FR6:** If the array returned by `useNodeTagBinding` is empty, the navigation options must remain disabled.
- **FR7:** The "Trend" and "Alarm" options shall be dynamically **enabled** only when a node is actively selected and the `useNodeTagBinding` composable returns a non-empty array of `tagIds`.

#### 3.1.3 Navigation Execution

- **FR8:** Upon user activation of the "Trend" action, the system shall open the Trend page in a new browser tab.
- **FR9:** Upon user activation of the "Alarm" action, the system shall open the Alarm page in a new browser tab.
- **FR10:** Pending the full implementation of the target pages, the system shall navigate to the following predefined mocked URLs:
  - Trend Page: `/trend-page`
  - Alarm Page: `/alarm-page`

### 3.2 Non-Functional Requirements

- **Usability:** The SVG icons designed for Trend and Alarm should be intuitive, utilizing standard industry metaphors to clearly represent their respective functions.
- **Responsiveness:** The enabled/disabled state of the context menu items and toolbar icons must update reactively and instantaneously upon node selection changes or modifications to the node's data bindings.

## 4. Implementation Steps

1. **Asset Creation:** Design and implement SVG icons for the "Trend" and "Alarm" actions.
2. **Toolbar Integration:** Integrate the newly created SVG icons into the `TopToolbar` component. Implement the default disabled state.
3. **Context Menu Integration:** Append the "Go to Trend" and "Go to Alarm" items to the `CanvasContextMenu` component.
4. **State Management Integration:** Import and apply `useNodeTagBinding` to reactively monitor the `tagIds` of the currently selected node. Use this data to conditionally toggle the enabled/disabled state of the navigation controls.
5. **Routing & Navigation:** Implement click event handlers for both the toolbar icons and context menu items to trigger tab navigation (`window.open(url, '_blank')`) to the specified mocked URLs.

### USE CASE
