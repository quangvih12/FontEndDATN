<script setup>
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { khuyenMaiStore } from '@/service/Admin/KhuyenMai/KhuyenMaiService.js';
import { useToast } from 'primevue/usetoast';
import AddKhuyenMai from './AddKhuyenMai.vue';
import UpdateKhuyenMai from './UpdateKhuyenMai.vue';
import DeleteKhuyenMai from './DeleteKhuyenMai.vue';
import ApplyKM from './ApplyKM.vue';

const toast = useToast();
const filters = ref();
const khuyenmais = ref([]);
const khuyenmai = ref({});
const selectedKhuyenMai = ref([]);
const deleteKhuyenMaiDialog = ref(false);
const selectedStatus = ref(null);
const expandedRows = ref([]);
const khuyenmaiService = khuyenMaiStore();

onMounted(() => {
    loadDataKhuyenmai();
});

const loadDataKhuyenmai = async () => {
    await khuyenmaiService.getKhuyenMai();
    khuyenmais.value = khuyenmaiService.data;
};

const initFilters1 = () => {
    filters.value = {
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        trangThai: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};

const statuses = ref([
    { label: 'Còn hạn', value: 0 },
    { label: 'Hết hạn', value: 1 },
    { label: 'Chưa hoạt động', value: 2 },
    { label: 'Hết khuyến mại', value: 3 }
]);

const columns = ref([
    { field: 'ma', header: 'Mã' },
    { field: 'ten', header: 'Tên' },
    { field: 'thoiGianBatDau', header: 'Ngày Bắt Đầu' },
    { field: 'thoiGianKetThuc', header: 'Ngày Kết Thúc' },
    { field: 'moTa', header: 'Mô Tả' },
    { field: 'soLuong', header: 'Số Lượng' },
    { field: 'giaTriGiam', header: 'Giá Trị (%)' },
    { field: 'ngaySua', header: 'Ngày Sửa' },
    { field: 'ngayTao', header: 'Ngày Tạo' }
]);

// hàm để tắt/mở cột
const selectedColumns = ref(columns.value);

const onToggle = (val) => {
    selectedColumns.value = columns.value.filter((col) => val.includes(col));
};

const confirmDeleteKhuyenMai = (editKhuyenMai) => {
    khuyenmai.value = editKhuyenMai;
    deleteKhuyenMaiDialog.value = true;
};

const deleteKhuyenMai = () => {
    khuyenmaiService.deleteKhuyenMai(khuyenmai.value, khuyenmai.value.id);
    toast.add({ severity: 'warn', summary: '', detail: 'Khuyến mại đã được xoá', life: 3000 });
    deleteKhuyenMaiDialog.value = false;
};

initFilters1();

// dùng để lọc khuyến mại theo trạng thái trên CBB 
const filteredVoucher = computed(() => {
    if (!selectedStatus.value) {
        return khuyenmais.value; // Trả về dữ liệu ban đầu nếu không có trạng thái nào được chọn
    }
    return khuyenmais.value.filter((customer) => customer.trangThai === selectedStatus.value.value);
});

const getStatusLabel = (trangThai) => {
    switch (trangThai) {
        case 0:
            return { text: 'Còn hạn', severity: 'success' };

        case 1:
            return { text: 'Hết hạn', severity: 'danger' };

        case 2:
            return { text: 'Chưa hoạt động', severity: 'warning' };

        case 3:
            return { text: 'Hết khuyến mại  ', severity: 'info' };

        default:
            return null;
    }
};

// dùng để cập nhật lại số lượng khuyến mại
const updateKhuyenMai = (idkm, sl) => {
    khuyenmaiService.updateSLKhuyenMai(idkm, sl);
    loadDataKhuyenmai();
};
</script>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <AddKhuyenMai />
                            <DeleteKhuyenMai :selectedKhuyenMai="selectedKhuyenMai" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportExcel" />
                    </template>
                </Toolbar>

                <DataTable
                    v-model:filters="filters"
                    v-model:selection="selectedKhuyenMai"
                    v-model:expandedRows="expandedRows"
                    :value="filteredVoucher"
                    :columns="visibleColumns"
                    :paginator="true"
                    :rows="5"
                    filterDisplay="menu"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                    :globalFilterFields="['thoiGianBatDau', 'thoiGianKetThuc', 'trangThai']"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <MultiSelect icon="pi pi-plus" placeholder="Select Columns" :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle" display="tag"  />
                            <Dropdown v-model="selectedStatus" :options="statuses" :optionLabel="(option) => option.label" placeholder="Trạng thái" class="p-column-filter" style="min-width: 12rem" :showClear="true">
                                <template #option="slotProps">
                                    <Tag :value="getStatusLabel(slotProps.option.value).text" :severity="getStatusLabel(slotProps.option.value).severity" />
                                </template>
                            </Dropdown>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                    <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header" :key="col.field + '_' + index" :sortable="true" headerStyle="width:14%; min-width:10rem;"></Column>
                    

                    <Column field="trangThai" header="Trạng Thái" sortable style="min-width: 12rem">
                        <template #body="slotProps">
                            <Tag :value="getStatusLabel(slotProps.data.trangThai).text" :severity="getStatusLabel(slotProps.data.trangThai).severity" />
                        </template>
                    </Column>
                    <Column headerStyle="min-width:15rem;">
                        <template #body="slotProps">
                            <UpdateKhuyenMai :my-prop="slotProps.data" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteKhuyenMai(slotProps.data)" />
                            <ApplyKM :my-prop="slotProps.data" @update="updateKhuyenMai" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="deleteKhuyenMaiDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="khuyenmai"
                            >Bạn có chắc chắn muốn xoá khuyến mại <b>{{ khuyenmai.ten }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteKhuyenMaiDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteKhuyenMai" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
// @import '@/assets/demo/styles/badges.scss';

// ::v-deep(.p-datatable-frozen-tbody) {
//     font-weight: bold;
// }

// ::v-deep(.p-datatable-scrollable .p-frozen-column) {
//     font-weight: bold;
// }
</style>
