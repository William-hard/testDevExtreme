<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/723096689/23.1.3%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1202789)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
<!-- default badges end -->
# DataGrid for DevExtreme - How to Validate Unchanged Cells

This example demonstrates how to validate unchanged cells in the DataGrid component on button click. To implement this functionality, define the `validateVisibleRows` function:

1. To trigger DataGrid [changes](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/changes/), map an array of all [visible rows](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#getVisibleRows) into change objects and assign it to the changes property.

2. [Repaint](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#repaint) DataGrid.

3. Use **private** `getController` method to validate unchanged cells.

![DataGrid with validated unchanged cells](/data-grid-validate-unchanged-cells.png)

If you want to validate unchanged cells after DataGrid is loaded, you can call the `validateVisibleRows` function in the [onContentReady](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onContentReady) event handler.

## Files to Review

- **jQuery**
    - [index.js](jQuery/src/index.js)
- **Angular**
    - [app.component.html](Angular/src/app/app.component.html)
    - [app.component.ts](Angular/src/app/app.component.ts)
- **Vue**
    - [Home.vue](Vue/src/components/HomeContent.vue)
- **React**
    - [App.tsx](React/src/App.tsx)
- **NetCore**    
    - [Index.cshtml](ASP.NET%20Core/Views/Home/Index.cshtml)

## Documentation

- [editing.changes](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/changes/)
- [getVisibleRows()](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#getVisibleRows)
- [onContentReady](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onContentReady)