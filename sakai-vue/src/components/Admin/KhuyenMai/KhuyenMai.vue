<script setup>
import { ref, onMounted , computed } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import  KhuyenMaiService  from '@/service/KhuyenMaiService.js'
import { PrimeIcons } from 'primevue/api';
import axios from 'axios';

const filters = ref();
const khuyenmais = ref();
const khuyenmai = ref({});
const khuyenMaiDialog = ref(false);
const khuyenmaiService = new KhuyenMaiService();

onMounted(() => {
    khuyenmaiService.getKhuyenMai().then((data) => (khuyenmais.value = data));
});

const openNew = () => {
    khuyenMaiDialog.value = true;
};
const hideDialog = () => {
    khuyenMaiDialog.value = false;
}
const initFilters1 = () => {
    filters.value = {
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        trangThai: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    
    };
};


const columns = ref([
    {field: 'ma', header: 'Mã'},
    {field: 'ten', header: 'Tên'},
    {field: 'thoiGianBatDau', header: 'Ngày Bắt Đầu'},
    {field: 'thoiGianKetThuc', header: 'Ngày Kết Thúc'},
    {field: 'moTa', header: 'Mô Tả'},
    {field: 'giamToiDa', header: 'Giảm Tối Đa'},
    {field: 'soLuong', header: 'Số Lượng'},
    {field: 'giaTri', header: 'Giá Trị'},
    {field: 'ngaySua', header: 'Ngày Sửa'},
    {field: 'ngayTao', header: 'Ngày Tạo'},
    
]);

// hàm để tắt/mở cột
const selectedColumns = ref(columns.value);

const onToggle = (val) => {
    selectedColumns.value = columns.value.filter(col => val.includes(col));
};

const editKhuyenMai = (editKhuyenMai) => {
    khuyenmai.value = { ...editKhuyenMai};
    console.log(khuyenmai)
    khuyenMaiDialog.value = true;
};

const clearFilter = () => {
    initFilters1();
};
initFilters1()


//hàm hiển thị trạng thái
const getStatusLabel = (trangThai) => {
    switch (trangThai) {
        case '1':
            return { text: 'Active', severity: 'success' };

        case '2':
            return { text: 'InActive', severity: 'danger' };

        case '3':
            return 'danger';

        default:
            return null;
    }
};

// const exportExcel = async () => {
//   try {
//     const response = await axios.get('http://localhost:8080/customer/export');
//     const blob = await response.blob();

//     // Tạo một URL cho blob và tạo một liên kết để tải tệp Excel
//     const blobUrl = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = blobUrl;
//     link.download = 'danh-sach-nguoi-dung.xlsx';
//     link.click();
//     window.URL.revokeObjectURL(blobUrl);
//   } catch (error) {
//     console.error('Lỗi khi xuất Excel:', error);
//   }
// };


</script>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger"   />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportExcel" />
                    </template>

                </Toolbar>
                
                <DataTable
                    v-model:filters="filters"
                    v-model:selection="selected"
                    :value = "khuyenmais"
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
                            <MultiSelect icon="pi pi-plus" :modelValue="selectedColumns" :options="columns" optionLabel="header"  @update:modelValue="onToggle"    
                              display="tag"  placeholder="Select Columns"                             
                              />

                              <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText  placeholder="Search..." />
                            </span>  
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>    
                            
                    <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header" :key="col.field + '_' + index " :sortable="true" headerStyle="width:14%; min-width:10rem;"></Column>
                    
                    <Column field="trangThai" header="Trạng Thái" sortable style="min-width:12rem">
                        <template #body="slotProps">
                            <Tag :value="getStatusLabel(slotProps.data.trangThai).text" :severity="getStatusLabel(slotProps.data.trangThai).severity" />
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2 " @click="editKhuyenMai(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteKhuyenMai(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="khuyenMaiDialog" header="Flex Scroll" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }" class="p-fluid">

                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Khuyến Mãi</h5>
                        </div>
                    </template>

                    <div class="card p-fluid">
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="ma">Mã</label>
                                <InputText id="ma" v-model.trim="khuyenmai.ma" required="true" autofocus :class="{ 'p-invalid': submitted && !khuyenmai.ma }" />
                                <small class="p-invalid" v-if="submitted && !khuyenmai.ma">Mã không được để trống.</small>
                               
                            </div>                          
                            <div class="field col">
                                <label for="ten">Tên</label>
                                <InputText id="ten" v-model.trim="khuyenmai.ten" required="true" autofocus :class="{ 'p-invalid': submitted && !khuyenmai.ten }" />
                                <small class="p-invalid" v-if="submitted && !khuyenmai.ten">Tên không được để trống.</small>
                            </div>
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="thoiGianBatDau">Ngày Bắt Đầu</label>
                                <Calendar id="thoiGianBatDau" v-model="khuyenmai.thoiGianBatDau" dateFormat="yy/mm/dd" showIcon />
                            </div>
                            <div class="field col">
                                <label for="thoiGianKetThuc">Ngày Kết Thúc</label>
                                <Calendar id="thoiGianKetThuc" v-model="khuyenmai.thoiGianKetThuc" dateFormat="yy/mm/dd" showIcon />
                            </div>
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="soLuong">Số Lượng</label>
                                <InputNumber id="soLuong" v-model="khuyenmai.soLuong" />                           
                            </div>
                            <div class="field col">
                                <label for="giatri">Giá Trị Giảm (%)</label>
                                <InputNumber id="giatri" v-model="khuyenmai.giaTri" />      
                            </div>
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="name2">Mô Tả</label>
                                <Textarea v-model.trim="khuyenmai.moTa" required="true" :autoResize="true" rows="3" cols="30" />
                            </div>
                        </div>
                    </div>
                  
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" @click="khuyenMaiDialog = false" />
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