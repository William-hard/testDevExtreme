import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import notify from 'devextreme/ui/notify';
import { EditorPreparingEvent, Row, SelectionChangedEvent } from 'devextreme/ui/data_grid';
import { CustomItemCreatingEvent, ValueChangedEvent } from 'devextreme/ui/select_box';
import DevExpress from 'devextreme';
import { ExecutionItem, Lot, Service } from './app.service';
import DataChange = DevExpress.common.grids.DataChange;
import DataSource from 'devextreme/data/data_source';
import { ValidationCallbackData } from 'devextreme/common';

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

  mapLotSelectionRowId: Map<number, DataSource> = new Map<number, DataSource>();

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

    this.executionItems.forEach((ei, index) => {
      if (ei.LotSelection && ei.LotSelection.length > 0) {
        this.mapLotSelectionRowId.set(ei.Id, new DataSource({
          store: {
            data: ei.LotSelection,
            type: 'array',
            key: 'Id',
          },
        }));
      }
    });

    console.log(this.mapLotSelectionRowId);

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
        // @ts-expect-error
        if (e.row.data.Movement > 0) {
          e.editorOptions.readOnly = true;
        }
      }
    }
  }
  validateBatch(e: ValidationCallbackData){
    if(e.data.Movement > 0 && e.data.Lot > 0) 
       return true;
    else return false
  }
  addCustomItem(data: CustomItemCreatingEvent, item: any): void {
    if (!data.text) {
      data.customItem = null;
      return;
    }
    const lotExist = item.data.LotSelection.some((lot: Lot) => lot.LotNumber === data.text);

    const ids: number[] = item.data.LotSelection.map((lot: Lot) => lot.Id);
    const maxId: number = Math.max(...ids);
    const newId: number = maxId + 1;

    if (!lotExist) {
      const newLotItem: Lot = {
        Id: newId,
        LotNumber: data.text,
      };

      const lotSelection = this.mapLotSelectionRowId.get(item.key);

      if (lotSelection) {
        data.customItem = lotSelection.store().insert(newLotItem)
          .then(() => lotSelection.load())
          .then(() => newLotItem)
          .catch((error) => {
            throw error;
          });
      }
    }
  }

  getLotsDataSource(datas: any): DataSource {
    const x = this.mapLotSelectionRowId.get(datas.data.Id);

    if (!x) {
      throw '';
    }

    return x;
  }
}
