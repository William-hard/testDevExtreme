import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import notify from 'devextreme/ui/notify';
import { Row, SelectionChangedEvent } from "devextreme/ui/data_grid";
import { CustomItemCreatingEvent, ValueChangedEvent } from 'devextreme/ui/select_box';
import { ExecutionItem, Lot, Service } from './app.service';
import DataSource from 'devextreme/data/data_source';
import DevExpress from "devextreme";
import DataChange = DevExpress.common.grids.DataChange;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Service],
})
export class AppComponent implements AfterViewChecked {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent | undefined;

  checked = false;

  changes: DataChange[] = [];

  executionItems: ExecutionItem[];

  selectedItemKeys: any[] = [];

  dataSource: DataSource;

  constructor(service: Service) {
    this.executionItems = service.getCustomers();
    this.dataSource = new DataSource({
      store: {
        data: this.executionItems,
        type: 'array',
        key: 'Id',
      }
    });
    this.validateVisibleRows = this.validateVisibleRows.bind(this);
  }

  validateVisibleRows(): void {
    const dataGridInstance = this?.dataGrid?.instance;
    const fakeChanges = dataGridInstance
      ? dataGridInstance.getSelectedRowsData().map((row: Row): DataChange => ({ type: 'update', key: row.key, data: {} }))
      : [];
    this.changes = [...this.changes, ...fakeChanges];
    this.checked = true;
  }

  ngAfterViewChecked(): void {
    if (this.changes.length && this.checked) {
      this.checked = false;
      const dataGridInstance = this?.dataGrid?.instance;
      dataGridInstance?.repaintRows([0]);
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
    const isRequiredLot = !!e.data.IsBatch;
    return !isRequiredLot;
  }

  onValueMovementChange(datas: any, e: any): void {
    datas.data.movements = e.value;
    if (datas.data.movements > 0 && datas.data.IsBatch) {
      datas.row.isSelected = true;
      this.validateVisibleRows();
    }
  }

  onSelectionChanged({ selectedRowKeys }: SelectionChangedEvent): void {
    this.selectedItemKeys = selectedRowKeys;
  }

  setLotItem(mydatas: any, e: ValueChangedEvent): void {
    mydatas.data.Lot = e.value;
  }

  onCustomItemCreating(data: CustomItemCreatingEvent): void {
    if (!data.text) {
      data.customItem = null;
      // return;
    }

    const newLot = {
      Id: 7,
      LotNumber: 'New Lot',
    };
  }
}
