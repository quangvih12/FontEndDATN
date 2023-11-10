<!-- eslint-disable no-unused-vars -->
<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import DetailHoaDon from './DetailHoaDon.vue';
import { HDStore } from '../../../service/Admin/HoaDon/HoaDonService';

const toast = useToast();
const useHD = HDStore();
const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const products = ref(null);
const idHD = ref(null);
const data = ref([]);
// confirm xác nhận
const addProductDialog = ref(false);

// confirm huy
const huyDialog = ref(false);

//hiện confirm
const confirmAddProduct = (id) => {
    idHD.value = id;
    addProductDialog.value = true;
};

//hiện confirm huy
const confirmHuy = (id) => {
    huyDialog.value = true;
    idHD.value = id;
};

watch(addProductDialog, (newVal) => {
    if (addProductDialog.value == false) {
        idHD.value = null;
    }
});
const loadData = async () => {
    await useHD.fetchDataByStatus(5);
    data.value = useHD.dataDangGiao;
};
//chạy cái hiện data luôn
onMounted(() => {
    loadData();
});

const hienThiTrangThai = (trangThai) => {
    if (trangThai == 0) {
        return { text: 'Đã hủy', severity: 'danger' };
    } else if (trangThai == 1) {
        return { text: 'Chờ thanh toán', severity: 'secondary' };
    } else if (trangThai == 2) {
        return { text: 'Yêu cầu xác nhận', severity: 'success' };
    } else if (trangThai == 3) {
        return { text: 'Hoàn thành', severity: 'info' };
    } else if (trangThai == 4) {
        return { text: 'Đang chuẩn bị hàng', severity: 'success' };
    } else if (trangThai == 5) {
        return { text: 'Giao cho đơn vị vận chuyển', severity: 'help' };
    } else if (trangThai == 6) {
        return { text: 'Yêu cầu đổi trả', severity: 'warning' };
    } else {
        return { text: 'Xác nhận đổi trả', severity: 'success' };
    }
};

const btnXacNhan = () => {
    useHD.hoanThanh(idHD.value);
    toast.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận thành công', life: 3000 });
    addProductDialog.value = false;
};

const btnXacNhanHuy = () => {
    useHD.huyHoaDon(idHD.value, 'Người dùng không nhận hàng');
    toast.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận giao thất bại thành công', life: 3000 });
    huyDialog.value = false;
};

const columns = ref([
    { field: 'nguoiTao', header: 'Người tạo' },
    { field: 'ngayTao', header: 'Ngày tạo' },
    { field: 'ngaySua', header: 'Ngày sửa' },
    { field: 'tienShip', header: 'Tiền ship' },
    { field: 'tienSauKhiGiam', header: 'Tiền sau giảm' },
    { field: 'tenPTTT', header: 'Phương thức thanh toán' },
    { field: 'ngayThanhToan', header: 'Ngày thanh toán' },
    { field: 'ngayShip', header: 'Ngày ship' },
    { field: 'ngayNhan', header: 'Ngày nhận' }
]);
const startDate = ref(null);
const endDate = ref([null]);
const typeSearchDate = ref(null);

const searchDate = async () => {
    if (typeSearchDate.value == null) {
        const respone = await useHD.searchDateByTrangThai(startDate.value, endDate.value, 'ngayTao', 5);
        data.value = respone;
    } else {
        const respone = await useHD.searchDateByTrangThai(startDate.value, endDate.value, typeSearchDate.value.value, 5);
        data.value = respone;
    }
};

const selectedColumns = ref(null);

const onToggle = (val) => {
    selectedColumns.value = columns.value.filter((col) => val.includes(col));
};

const customerService = new CustomerService();
const productService = new ProductService();

onBeforeMount(() => {
    productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    customerService.getCustomersLarge().then((data) => {
        customer1.value = data;
        loading1.value = false;
        customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    customerService.getCustomersLarge().then((data) => (customer2.value = data));
    customerService.getCustomersMedium().then((data) => (customer3.value = data));
    loading2.value = false;

    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const formatCurrency = (value) => {
    return parseInt(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
</script>
<template>
    <Toast />
    <div class="col-12 flex" style="margin-right: 10px; padding-left: 0">
        <Dropdown v-model="typeSearchDate" :options="dataSearchDate" optionLabel="label" placeholder="Ngày tạo" class="w-full md:w-14rem" style="height: 40px" />
        <div class="p-inputgroup flex-1" style="margin-left: 20px">
            <span class="p-inputgroup-addon" style="height: 40px">Ngày bắt đầu</span>
            <input type="datetime-local" v-model="startDate" style="min-width: 13rem; height: 40px" />
        </div>
        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon" style="height: 40px">Ngày kết thúc</span>
            <input type="datetime-local" v-model="endDate" style="min-width: 13rem; height: 40px" />
        </div>
        <div style="margin-left: 5px">
            <Button label="Seach" @click="searchDate()" icon="pi pi-search" class="p-button-rounded p-button-primary mr-2 mb-2" />
        </div>
    </div>
    <DataTable
        ref="dt"
        :value="data"
        v-model:selection="selectedProducts"
        dataKey="id"
        :paginator="true"
        :rows="5"
        :filters="filters1"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        responsiveLayout="scroll"
    >
        <template #header>
            <div class="col-12 flex">
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <MultiSelect icon="pi pi-plus" placeholder="Select Columns" :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle" display="tag" />
                </div>
                <span class="p-input-icon-left" style="margin-left: 20px">
                    <i class="pi pi-search" />
                    <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="min-width: 13rem; height: 40px" />
                </span>
            </div>
        </template>
        <Column field="stt" header="STT" :sortable="true" headerStyle="width:14%; min-width:1rem;">
            <template #body="slotProps">
                <span class="p-column-title">stt</span>
                {{ slotProps.data.stt }}
            </template>
        </Column>
        <Column field="maHD" header="Mã hoá đơn" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">maHD</span>
                {{ slotProps.data.maHD }}
            </template>
        </Column>
        <Column field="tenNguoiNhan" header="Người nhận" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">tenNguoiNhan</span>
                {{ slotProps.data.tenNguoiNhan }}
            </template>
        </Column>
        <Column field="tongTien" header="Tổng tiền" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">tongTien</span>
               {{ formatCurrency(slotProps.data.tongTien) }}
            </template>
        </Column>
        <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header" :key="col.field + '_' + index" :sortable="true" headerStyle="width:14%; min-width:10rem;"></Column>
        <Column field="diaChi" header="Địa chỉ" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">diaChi</span>
                {{ slotProps.data.diaChiCuThe }}, {{ slotProps.data.tenPhuongXa }}, {{ slotProps.data.tenQuanHuyen }}, {{ slotProps.data.tenTinhThanh }}
            </template>
        </Column>
        <Column field="trangThai" header="Trạng thái" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">trangThai</span>
                <Tag :value="hienThiTrangThai(slotProps.data.trangThai).text" :severity="hienThiTrangThai(slotProps.data.trangThai).severity" />
            </template>
        </Column>
        <Column header="Hành động" headerStyle="min-width:10rem;">
            <template #body="slotProps">
                <DetailHoaDon :my-prop="slotProps.data"></DetailHoaDon>
                <Button label="Hoàn thành" class="p-button-outlined p-button-info mr-2 mb-2" @click="confirmAddProduct(slotProps.data.idHD)" />
                <Button label="Thất bại" class="p-button-outlined p-button-info mr-2 mb-2" @click="confirmHuy(slotProps.data.idHD)" />
            </template>
        </Column>
    </DataTable>
    <Dialog v-model:visible="addProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Bạn có chắc chắn muốn hoàn thành không ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="addProductDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="btnXacNhan()" />
        </template>
    </Dialog>
    <!-- comfirm huỷ -->
    <Dialog v-model:visible="huyDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Bạn có chắc chắn đơn hàng đã giao thất bại không ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="huyDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="btnXacNhanHuy()" />
        </template>
    </Dialog>
</template>
