import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import notify from 'devextreme/ui/notify';
import { EditorPreparingEvent, Row, SelectionChangedEvent } from 'devextreme/ui/data_grid';
import { CustomItemCreatingEvent, ValueChangedEvent } from 'devextreme/ui/select_box';
import DataSource from 'devextreme/data/data_source';
import DevExpress from 'devextreme';
import { ExecutionItem, Lot, Service } from './app.service';
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
      },
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

  validateLots(e: any): boolean {
    if (e.value) {
      e.data.Lot = e.value;
    }
    if (!e.data.IsBatch) {
      return true;
    }
    const validate: boolean = e.data.Lot !== '' && e.data.Movement > 0 && e.data.IsBatch;
    return validate;
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

  onEditorPreparing(e: EditorPreparingEvent<ExecutionItem>): void {
    if (e.parentType === 'dataRow') {
      if (e.dataField === 'Movement' && e.value > 0) {
        e.editorOptions.readOnly = true;
      }
      if (e.dataField === 'Lot' && e.row !== undefined) {
        if (e.row.data.Movement > 0) {
          e.editorOptions.readOnly = true;
        }
      }
    }
  }

  addCustomItem(data: CustomItemCreatingEvent, item: ExecutionItem): void {
    if (!data.text) {
      data.customItem = null;
      return;
    }

    const lotExist = item.LotSelection.some((lot) => lot.LotNumber === data.text);

    const newLotItem: Lot = {
      Id: 25,
      LotNumber: data.text,
    };

    if (!lotExist) {
      item.LotSelection.push(newLotItem);
    }
  }
}
