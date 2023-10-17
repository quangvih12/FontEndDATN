<!-- eslint-disable no-unused-vars -->
<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount, onMounted } from 'vue';
import DetailHoaDon from './DetailHoaDon.vue';
import { HDStore } from '../../../service/Admin/HoaDon/HoaDonService';

const useHD = HDStore();
const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const products = ref(null);
const data = ref([]);

const loadData = async () => {
    await useHD.fetchDataByStatus(8);
    data.value = useHD.dataDaHoanTra;
};
//chạy cái hiện data luôn
onMounted(() => {
    loadData();
});

const hienThiTrangThai = (trangThai) => {
    if (trangThai == 0) {
        return 'Đã hủy';
    } else if (trangThai == 1) {
        return 'Chờ thanh toán';
    } else if (trangThai == 2) {
        return 'Yêu cầu xác nhận';
    } else if (trangThai == 3) {
        return 'Hoàn thành';
    } else if (trangThai == 4) {
        return 'Đang chuẩn bị hàng';
    } else if (trangThai == 5) {
        return 'Giao cho đơn vị vận chuyển';
    } else if (trangThai == 6) {
        return 'Yêu cầu đổi trả';
    } else {
        return 'Xác nhận đổi trả';
    }
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
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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
    <div class="col-12 flex" style="margin-right: 10px; padding-left: 0">
        <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="min-width: 13rem; height: 40px" />
        </span>
        <div class="p-inputgroup flex-1" style="margin-left: 20px">
            <span class="p-inputgroup-addon" style="height: 40px">Ngày bắt đầu</span>
            <input type="datetime-local" style="min-width: 13rem; height: 40px" />
        </div>
        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon" style="height: 40px">Ngày kết thúc</span>
            <input type="datetime-local" style="min-width: 13rem; height: 40px" />
        </div>
        <div style="margin-left: 5px">
            <Button label="Seach" icon="pi pi-search" class="p-button-rounded p-button-primary mr-2 mb-2" />
        </div>
    </div>
    <DataTable
        ref="dt"
        :value="data"
        v-model:selection="selectedProducts"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        responsiveLayout="scroll"
    >
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
        <Column field="nguoiTao" header="Người tạo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">ten</span>
                {{ slotProps.data.nguoiTao }}
            </template>
        </Column>
        <Column field="ngayTao" header="Ngày tạo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">ten</span>
                {{ slotProps.data.ngayTao }}
            </template>
        </Column>
        <Column field="ngaySua" header="Ngày sửa" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">ten</span>
                {{ slotProps.data.ngaySua }}
            </template>
        </Column>
        <Column field="tenNguoiNhan" header="Người nhận" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">mota</span>
                {{ slotProps.data.tenNguoiNhan }}
            </template>
        </Column>
        <Column field="tienShip" header="Tiền ship" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">mota</span>
                {{ slotProps.data.tienShip }}
            </template>
        </Column>
        <Column field="tongTien" header="Tổng tiền" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">mota</span>
                {{ slotProps.data.tongTien }}
            </template>
        </Column>
        <Column field="tienSauKhiGiam" header="Tiền sau giảm" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">mota</span>
                {{ slotProps.data.tienSauKhiGiam }}
            </template>
        </Column>
        <Column field="trangThai" header="Trạng thái" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">Category</span>
                {{ hienThiTrangThai(slotProps.data.trangThai) }}
            </template>
        </Column>
        <Column field="tenPTTT" header="Phương thức thanh toán" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">Category</span>
                {{ slotProps.data.tenPTTT }}
            </template>
        </Column>
        <Column field="ngayThanhToan" header="Ngày thanh toán" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">Category</span>
                {{ slotProps.data.ngayThanhToan }}
            </template>
        </Column>
        <Column field="diaChi" header="Địa chỉ" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">Category</span>
                {{ slotProps.data.diaChi }}
            </template>
        </Column>
        <Column field="ngayShip" header="Ngày ship" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">Category</span>
                {{ slotProps.data.ngayShip }}
            </template>
        </Column>
        <Column field="ngayNhan" header="Ngày nhận" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">Category</span>
                {{ slotProps.data.ngayNhan }}
            </template>
        </Column>
        <Column field="hinhThucGiaoHang" header="Hình thức giao" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">Category</span>
                {{ slotProps.data.hinhThucGiaoHang }}
            </template>
        </Column>
        <Column header="Hành động" headerStyle="min-width:10rem;">
            <template #body="slotProps">
                <!-- <DetailSize :my-prop="slotProps.data"></DetailSize>
                <UpdateSize :my-prop="slotProps.data"></UpdateSize>
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data.id)" /> -->
                <DetailHoaDon></DetailHoaDon>
            </template>
        </Column>
    </DataTable>
</template>
