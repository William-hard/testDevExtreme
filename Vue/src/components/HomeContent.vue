<template>
  <div>
    <DxDataGrid
      ref="dataGridRef"
      :data-source="customers"
      key-expr="ID"
      :show-borders="true"
    >
      <DxEditing
        v-model:changes="changes"
        mode="batch"
        :allow-updating="true"
      />
      <DxColumn
        data-field="CompanyName"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn data-field="City">
        <DxStringLengthRule :min="4"/>
      </DxColumn>
      <DxColumn data-field="Phone">
        <DxRequiredRule/>
        <DxPatternRule
          message="Your phone must have '(555) 555-5555 format!'"
          :pattern="pattern"
        />
      </DxColumn>
      <DxColumn data-field="Fax"/>
      <DxColumn data-field="State"/>
      <DxToolbar>
        <DxItem>
          <DxButton
            text="Validate DataGrid"
            styling-mode="outlined"
            @click="validateVisibleRows"
          />
        </DxItem>
        <DxItem name="saveButton"/>
        <DxItem name="revertButton"/>
      </DxToolbar>
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { customers } from '@/data';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DxButton from 'devextreme-vue/button';
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxPatternRule,
  DxRequiredRule,
  DxStringLengthRule,
  DxToolbar,
  DxItem,
  DxDataGridTypes
} from 'devextreme-vue/data-grid';
import type dxDataGrid from 'devextreme/ui/data_grid';

const pattern = /^\(\d{3}\) \d{3}-\d{4}$/i;
const changes = ref<DxDataGridTypes.DataChange[]>([]);
const clicked = ref(false);
const dataGridRef = ref<DxDataGrid>();
const obj = reactive({ changes });

const validateVisibleRows = () => {
  const dataGridInstance = dataGridRef.value?.instance! as dxDataGrid;
  const fakeChanges = dataGridInstance
    ? dataGridInstance
      .getVisibleRows()
      .map((row: DxDataGridTypes.Row) : DxDataGridTypes.DataChange => ({
        type: 'update',
        key: row.key,
        data: {}
      }))
    : [];
  obj.changes = [...changes.value, ...fakeChanges];
  clicked.value = true;
};

watch(changes, () => {
  requestAnimationFrame(() => {
    const dataGridInstance = dataGridRef.value?.instance! as dxDataGrid;
    dataGridInstance?.repaint();
    dataGridInstance?.getController('validating').validate(true).then((result: Boolean) => {
      const message = result ? 'Validation is passed' : 'Validation is failed';
      const type = result ? 'success' : 'error';
      console.log(type);
    });
    clicked.value = false;
  });

}, {});

</script>
