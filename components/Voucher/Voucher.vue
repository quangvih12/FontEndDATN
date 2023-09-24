<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';

import VoucherService from '@/service/VoucherService.js'
const toast = useToast();

const vouchers = ref([]);
const voucherDialog = ref(false);
const deleteVoucherDialog = ref(false);
const deleteProductsDialog = ref(false);
const voucher = ref({
    ten:'',
    thoiGianBatDau:'',
    thoiGianKetThuc:'',
    moTa:'',
    giamToiDa:0,
    trangThai:0
});

// const selectedProducts = ref(null);
const selectedVoucher = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'Còn hạn', value: 0 },
    { label: 'Hết hạn', value: 1 },
    { label: 'Chưa bắt đầu', value: 2 }
]);

onMounted( () => {   
      VoucherService.getVoucher().then(data => {  vouchers.value = data});

      console.log(typeof vouchers);
});

watch( voucherDialog.value, ()=> {

    VoucherService.getVoucher().then(data => {  vouchers.value = data});
    console.log(typeof vouchers);
})
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    voucher.value = {};
    submitted.value = false;
    voucherDialog.value = true;
};

const hideDialog = () => {
    voucherDialog.value = false;
    submitted.value = false;
};

const save = () =>{
    submitted.value = true;
    if(voucher.value.ten && voucher.value.ten.trim() ){
        if(voucher.value.id){
             VoucherService.updateVoucher(voucher.value,voucher.value.id)
             toast.add({ severity: 'success', summary: 'Successful', detail: 'Voucher Updated', life: 3000 });
        }else{
             const response = VoucherService.createVoucher(voucher.value)
            //  console.log(response)
            //  voucher.value = [...response, voucher.value]
             toast.add({ severity: 'success', summary: 'Successful', detail: 'Voucher Created', life: 3000 });
        }
        onMounted()
        voucherDialog.value = false;

    }

}

const editProduct = (editProduct) => {
    voucher.value = { ...editProduct };
    console.log(voucher);
    voucherDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    voucher.value = editProduct;
    deleteVoucherDialog.value = true;
};

const deleteProduct = () => {
    vouchers.value = vouchers.value.filter((val) => val.id !== voucher.value.id);
    deleteVoucherDialog.value = false;
    voucher.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};



const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

//hàm hiển thị trạng thái
const getStatusLabel = (trangThai) => {
    switch (trangThai) {
        case 0:
            return { text: 'Active', severity: 'success' };

        case 1:
            return { text: 'InActive', severity: 'warning' };

        case 2:
        return { text: 'InStock', severity: 'danger' };

        default:
            return null;
    }
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
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
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedVoucher || !selectedVoucher.length" />
                        </div>
                       <!-- <Add /> -->
                    </template>
                   
                    
                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="vouchers"
                    v-model:selection="selectedVoucher"
                    dataKey="id"
                    :paginator="true"
                    :rows="5"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Products</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText  placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="ten" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Tên</span>
                            {{ slotProps.data.ten }}
                        </template>
                    </Column>
                    <Column field="thoiGianBatDau" header="Ngày Bắt Đầu" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Ngày Bắt Đầu</span>
                            {{ slotProps.data.thoiGianBatDau}}
                          
                        </template>
                    </Column>
                
                    <Column field="thoiGianKetThuc" header="Ngày Kết Thúc" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Ngày Kết Thúc</span>
                            {{ slotProps.data.thoiGianKetThuc}}
                        </template>
                    </Column>
                    <Column field="giamToiDa" header="Giảm Tối Đa" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Giảm Tối Đa</span>
                            {{ slotProps.data.giamToiDa }}
                        </template>
                    </Column>
                    <Column field="moTa" header="Mô Tả" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Mô Tả</span>
                            {{ slotProps.data.moTa }}
                        </template>
                    </Column>
                    
                    <Column field="trangThai" header="Trạng Thái" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :value="getStatusLabel(slotProps.data.trangThai).text" :severity="getStatusLabel(slotProps.data.trangThai).severity" />
                            <!-- <span :class="'product-badge status-'">{{ slotProps.data.trangThai }}</span> -->
                        </template>
                    </Column>

                    <Column field="soLuong" header="Số Lượng" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Số Lượng</span>
                            {{ slotProps.data.soLuong}}
                        </template>
                    </Column>
                
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                             
                <Dialog v-model:visible="voucherDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
                
                    <div class="field">
                        <label for="ten">Tên</label>
                        <InputText id="ten" v-model.trim="voucher.ten" required="true"  />
                        <small class="p-invalid" v-if="submitted && !voucher.ten">Tên không được để trống.</small>
                    </div>
                    <div class="field">
                        <label for="thoiGianBatDau">Ngày Bắt Đầu</label>
                        <Calendar id="thoiGianBatDau" v-model="voucher.thoiGianBatDau" dateFormat="yy/mm/dd" showIcon />
                    </div>
                    <div class="field">
                        <label for="thoiGianKetThuc">Ngày Kết Thúc</label>
                        <Calendar id="thoiGianKetThuc" v-model="voucher.thoiGianKetThuc" dateFormat="yy/mm/dd" showIcon />
                    </div>
                    <div class="field">
                        <label for="moTa">Mô Tả</label>
                        <InputText id="moTa" v-model.trim="voucher.moTa" required="true"  />
                    </div>

                    <div class="field">
                        <label for="soLuong">Số Lượng</label>
                        <InputText id="soLuong" v-model.trim="voucher.soLuong" required="true"  />
                    </div>
                    
                    <div class="field">
                            <label for="price">Giảm Tối Đa</label>
                            <InputNumber id="price" v-model="voucher.giamToiDa" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !voucher.giamToiDa}" :required="true" />
                            <small class="p-invalid" v-if="submitted && !voucher.giamToiDa">Giảm tối đa không được để trống</small>
                    </div>
              
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button type="submit" label="Save" icon="pi pi-check" class="p-button-text" @click="save" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteVoucherDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="voucher"
                            >Are you sure you want to delete <b>{{ voucher.ten }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteVoucherDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="voucher">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
<!-- <style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style> -->