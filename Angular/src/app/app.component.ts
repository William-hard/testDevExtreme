import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { ClickEvent } from 'devextreme/ui/button';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import type { DataChange } from 'devextreme/common/grids';
import dxDataGrid, { Row } from 'devextreme/ui/data_grid';
import notify from 'devextreme/ui/notify';
import { Customer, Service } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Service],
})
export class AppComponent implements AfterViewChecked {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent | undefined;

  checked: Boolean = false;

  changes: DataChange[] = [];

  pattern = /^\(\d{3}\) \d{3}-\d{4}$/i;

  customers: Customer[];

  constructor(service: Service) {
    this.customers = service.getCustomers();
    this.validateVisibleRows = this.validateVisibleRows.bind(this);
  }

  validateVisibleRows(): void {
    const dataGridInstance: dxDataGrid | undefined = this?.dataGrid?.instance;
    const fakeChanges: DataChange[] | undefined = dataGridInstance
      ? dataGridInstance.getVisibleRows().map((row: Row) => ({ type: 'update', key: row.key, data: {} }))
      : [];
    this.changes = [...this.changes, ...fakeChanges];
    this.checked = true;
  }

  ngAfterViewChecked(): void {
    if (this.changes.length && this.checked) {
      this.checked = false;
      const dataGridInstance: any = this?.dataGrid?.instance;
      dataGridInstance?.repaint();
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
}
