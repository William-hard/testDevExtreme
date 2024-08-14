import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { DxDataGridComponent, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import notify from 'devextreme/ui/notify';
import { ExecutionItem, Service } from './app.service';
import DevExpress from "devextreme";
import RowPreparedEvent = DevExpress.ui.dxDataGrid.RowPreparedEvent;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Service],
})
export class AppComponent implements AfterViewChecked {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent | undefined;

  checked = false;

  changes: DxDataGridTypes.DataChange[] = [];

  executionItems: ExecutionItem[];

  constructor(service: Service) {
    this.executionItems = service.getCustomers();
    this.validateVisibleRows = this.validateVisibleRows.bind(this);
  }

  validateVisibleRows(): void {
    const dataGridInstance = this?.dataGrid?.instance;
    const fakeChanges = dataGridInstance
      ? dataGridInstance.getSelectedRowsData().map((row: DxDataGridTypes.Row): DxDataGridTypes.DataChange => ({ type: 'update', key: row.key, data: {} }))
      : [];
    this.changes = [...this.changes, ...fakeChanges];
    this.checked = true;
  }

  ngAfterViewChecked(): void {
    if (this.changes.length && this.checked) {
      this.checked = false;
      const dataGridInstance = this?.dataGrid?.instance;
      dataGridInstance?.repaint();
      // @ts-expect-error - getController is a private method
      dataGridInstance?.getController('validating').validate(true).then((result: Boolean) => {
        const message = result ? 'Validation is passed' : 'Validation is failed';
        const type = result ? 'success' : 'error';
        notify({
          message,
          type,
          position: {
            offset: '0 50',
            at: 'bottom',
            of: '.demo-container',
          },
        });
      });
    }
  }

  validateLot(e: any): boolean {
    return !!e.value;
  }

  onValueMovementChange(datas: any, e: any): void {
    datas.data.movements = e.value;
    if (datas.data.movements > 0 && datas.data.IsBatch) {
      datas.row.isSelected = true;
      this.validateVisibleRows();
    }
  }
}
