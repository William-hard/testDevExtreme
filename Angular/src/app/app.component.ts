import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { EditorPreparingEvent, Row, RowValidatingEvent } from 'devextreme/ui/data_grid';
import { CustomItemCreatingEvent } from 'devextreme/ui/select_box';
import DevExpress from 'devextreme';
import DataSource from 'devextreme/data/data_source';
import { ValidationCallbackData } from 'devextreme/common';
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
      this.mapLotSelectionRowId.set(ei.Id, new DataSource({
        store: {
          data: ei.LotSelection || [],
          type: 'array',
          key: 'Id',
        },
      }));
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
      dataGridInstance?.repaint();
      // @ts-expect-error - getController is a private method
      dataGridInstance?.getController('validating').validate(true).then((result: Boolean) => {
        const message = result ? 'Validation is passed' : 'Validation is failed';
        const type = result ? 'success' : 'error';
      });
    }
  }

  validateLots(e: ValidationCallbackData): boolean {
    if (!e.data.IsBatch) {
      return true;
    }
    const validate: boolean = e.data.Lot !== '' && e.data.Movement > 0 && e.data.IsBatch;
    console.log('---->', validate);

    return validate;
  }

  onEditorPreparing(e: EditorPreparingEvent<ExecutionItem>): void {
    if (e.parentType === 'dataRow') {
      if (e.dataField === 'Movement' && e.value > 0) {
        e.editorOptions.readOnly = true;
      }
    }
  }

  addCustomItem(e: CustomItemCreatingEvent, data: any): void {
    if (!e.text) {
      e.customItem = null;
      return;
    }
    const lotExist = data.data.LotSelection.some((lot: Lot) => lot.LotNumber === e.text);

    const ids: number[] = data.data.LotSelection.map((lot: Lot) => lot.Id);
    const maxId: number = Math.max(...ids);
    const newId: number = maxId + 1;

    if (!lotExist) {
      const newLotItem: Lot = {
        Id: newId,
        LotNumber: e.text,
      };

      const lotSelection = this.mapLotSelectionRowId.get(data.key);
      console.log(lotSelection?.items().length);

      if (lotSelection) {
        e.customItem = lotSelection.store().insert(newLotItem)
          .then(() => lotSelection.load())
          .then(() => {
            newLotItem;

            const dataGridInstance = this?.dataGrid?.instance;
            // @ts-ignore
            dataGridInstance.cellValue(data.rowIndex, 'Lot', newLotItem.LotNumber);

            // comment setter lot pour cette row ??
          })
          .catch((error) => {
            throw error;
          });
      }
    }
  }

  getLotsDataSource(datas: any): DataSource {
    const dataSource = this.mapLotSelectionRowId.get(datas.data.Id);

    if (!dataSource) {
      throw '';
    }

    return dataSource;
  }

  onFocusedRowChanging(e: any): void {
    console.log(e);
  }

  onRowValidating(e: RowValidatingEvent): void {
    console.log(e);
    // const dii = this?.dataGrid?.instance;
    // dii?.deselectRows($event.key);

    if (e.isValid) {
      this?.dataGrid?.instance.deselectRows(e.key).catch((e) => console.error(e));
    }
  }
}
