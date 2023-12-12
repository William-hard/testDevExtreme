import React, { useCallback, useState } from 'react';
import Button from 'devextreme-react/button';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import type { DataChange } from 'devextreme/common/grids';
import { Row } from 'devextreme/ui/data_grid';
import DataGrid, {
  Column, Editing, PatternRule, RequiredRule, StringLengthRule, Toolbar, Item,
} from 'devextreme-react/data-grid';
import notify from 'devextreme/ui/notify';
import { customers } from './data';

function App(): JSX.Element {
  let grid = React.useRef<DataGrid>(null);
  const [changes, setChanges] = useState<DataChange[]>([]);

  const onChangesChange = useCallback((changes: DataChange[]): void => {
    setChanges(changes);
  }, [changes]);

  const validateVisibleRows = React.useCallback(() => {
    let dataGrid: any = grid?.current?.instance;
    // dataGrid.focus();
    const fakeChanges = dataGrid?.getVisibleRows().map((row: Row) => ({ type: 'update', key: row.key, data: {} }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // doesn't work
    setChanges([...changes, ...fakeChanges]);
    // works
    // dataGrid.option('editing.changes', [...changes, ...fakeChanges]);
    dataGrid.repaint();
    dataGrid.getController('validating').validate(true).then((result: Boolean) => {
      const message = result ? 'Validation is passed' : 'Validation is failed';
      const type = result ? 'success' : 'error';
      notify(message, type);
    });
  }, []);

  return (
    <div className="demo-container">
      <div className="placeholder">Top Content</div>
      <DataGrid
        ref={grid}
        id="grid-container"
        dataSource={customers}
        keyExpr="ID"
        showBorders={true}
      >
        <Editing
          onChangesChange={onChangesChange}
          changes={changes}
          mode="batch"
          allowUpdating={true}
        />
        <Column
          dataField="CompanyName"
          fixed={true}
          width={80}
          fixedPosition="left"
        >
          <RequiredRule />
        </Column>
        <Column dataField="City">
          <StringLengthRule min={4} />
        </Column>
        <Column dataField="Phone">
          <RequiredRule />
          <PatternRule
            message="Your phone must have '(555) 555-5555 format!'"
            pattern={/^\(\d{3}\) \d{3}-\d{4}$/i}
          />
        </Column>
        <Column dataField="Fax"></Column>
        <Column dataField="State"></Column>
        <Toolbar>
          <Item name="saveButton" />
          <Item name="revertButton" />
          <Item location="before">
            <Button
              text="Validate DataGrid"
              stylingMode="outlined"
              onClick={validateVisibleRows}
            />
          </Item>
        </Toolbar>
      </DataGrid>
    </div>
  );
}

export default App;
