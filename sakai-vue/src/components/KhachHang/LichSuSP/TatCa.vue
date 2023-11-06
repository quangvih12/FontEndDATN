<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount, onMounted } from 'vue';
import { HDStore } from '../../../service/Admin/HoaDon/HoaDonService';
import DetailHoaDon from './TrangThaiDonHang.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const redirectToTrangThaiDonHang = (id) => {
    // Chuyển hướng đến trang trang-thai-don-hang và truyền ID của hóa đơn qua URL
    router.push({ name: 'trang-thai-don-hang', params: { id: id } });
};
const useHD = HDStore();
const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const products = ref(null);

const customerService = new CustomerService();
const productService = new ProductService();
const data = ref([]);

const loadData = async () => {
    await useHD.fetchData();
    data.value = useHD.dataAll;
    // console.log(data.value);
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

const getStatusLabel = (trangThai) => {
    switch (trangThai) {
        case 1:
            return { text: 'Còn Hàng', severity: 'success' };

        case 2:
            return { text: 'hết Hàng', severity: 'danger' };

        case 3:
            return { text: 'tồn kho', severity: 'danger' };

        default:
            return { text: 'Trạng thái không xác định', severity: 'info' };
    }
};

const columns = ref([
    { field: 'maHD', header: 'Mã hoá đơn' },
    { field: 'nguoiTao', header: 'Người tạo' },
    { field: 'ngayTao', header: 'Ngày tạo' },
    { field: 'ngaySua', header: 'Ngày sửa' },
    { field: 'tenNguoiNhan', header: 'Tên người nhận' },
    { field: 'tienShip', header: 'Tiền ship' },
    { field: 'tongTien', header: 'Tổng tiền' },
    { field: 'tienSauKhiGiam', header: 'Tiền sau giảm' },
    { field: 'tenPTTT', header: 'Phương thức thanh toán' },
    { field: 'ngayThanhToan', header: 'Ngày thanh toán' },
    { field: 'ngayShip', header: 'Ngày ship' },
    { field: 'ngayNhan', header: 'Ngày nhận' }
]);

const dataSearchDate = ref([
    { label: 'Ngày tạo', value: 'ngayTao' },
    { label: 'Ngày sửa', value: 'ngaySua' },
    { label: 'Ngày thanh toán', value: 'ngayThanhToan' },
    { label: 'Ngày ship', value: 'ngayShip' },
    { label: 'Ngày nhận', value: 'ngayNhan' }
]);
const startDate = ref(null);
const endDate = ref([null]);
const typeSearchDate = ref(null);
const selectedColumns = ref(columns.value);

const searchDate = async () => {
    if (typeSearchDate.value == null) {
        const respone = await useHD.searchDate(startDate.value, endDate.value, 'ngayTao');
        data.value = respone;
    } else {
        const respone = await useHD.searchDate(startDate.value, endDate.value, typeSearchDate.value.value);
        data.value = respone;
    }
};

const onToggle = (val) => {
    selectedColumns.value = columns.value.filter((col) => val.includes(col));
};

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
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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
    <!-- <div class="col-12 flex" style="margin-right: 10px; padding-left: 0">
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
    </div> -->
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
                <span class="p-column-title">nguoiTao</span>
                {{ slotProps.data.nguoiTao }}
            </template>
        </Column>
        <Column field="ngayTao" header="Ngày tạo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">ngayTao</span>
                {{ slotProps.data.ngayTao }}
            </template>
        </Column>
        <Column field="ngaySua" header="Ngày sửa" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">ngaySua</span>
                {{ slotProps.data.ngaySua }}
            </template>
        </Column>
        <Column field="tenNguoiNhan" header="Người nhận" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">tenNguoiNhan</span>
                {{ slotProps.data.tenNguoiNhan }}
            </template>
        </Column>
        <Column field="tienShip" header="Tiền ship" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">tienShip</span>
                {{ slotProps.data.tienShip }}
            </template>
        </Column>
        <Column field="tongTien" header="Tổng tiền" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">tongTien</span>
                {{ slotProps.data.tongTien }}
            </template>
        </Column>
        <Column field="tienSauKhiGiam" header="Tiền sau giảm" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">tienSauKhiGiam</span>
                {{ slotProps.data.tienSauKhiGiam }}
            </template>
        </Column>
        <Column field="trangThai" header="Trạng thái" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">trangThai</span>
                {{ hienThiTrangThai(slotProps.data.trangThai) }}
            </template>
        </Column>
        <Column field="tenPTTT" header="Phương thức thanh toán" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">tenPTTT</span>
                {{ slotProps.data.tenPTTT }}
            </template>
        </Column>
        <Column field="ngayThanhToan" header="Ngày thanh toán" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">ngayThanhToan</span>
                {{ slotProps.data.ngayThanhToan }}
            </template>
        </Column>
        <Column field="diaChi" header="Địa chỉ" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">diaChi</span>
                {{ slotProps.data.diaChi }}
            </template>
        </Column>
        <Column field="ngayShip" header="Ngày ship" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">ngayShip</span>
                {{ slotProps.data.ngayShip }}
            </template>
        </Column>
        <Column field="ngayNhan" header="Ngày nhận" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">ngayNhan</span>
                {{ slotProps.data.ngayNhan }}
            </template>
        </Column>
        <Column field="hinhThucGiaoHang" header="Hình thức giao" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">hinhThucGiaoHang</span>
                {{ slotProps.data.hinhThucGiaoHang }}
            </template>
        </Column>
        <Column header="Hành động" headerStyle="min-width:10rem;">
            <template #body="slotProps">
                <!-- <DetailSize :my-prop="slotProps.data"></DetailSize>
                <UpdateSize :my-prop="slotProps.data"></UpdateSize>
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data.id)" /> -->
                <Button :my-prop="slotProps.data" @click="redirectToTrangThaiDonHang(data.id)" label="Xem" class="p-button-outlined p-button-info mr-2 mb-2" />
            </template>
        </Column>
    </DataTable>
</template>

<style scoped>
.sreach {
    margin-bottom: 10px;
}
.rong {
    position: absolute;
    /* top: 100px; */
    left: 0;
    right: 0;
    margin: auto;
    width: 1100px;
    width: 100%;
    height: 20px;
    background: rgb(239, 243, 248);
}
.san-pham {
    margin-top: 20px;
    padding-top: 20px;
    display: flex;
    justify-content: flex-start;
    position: relative;
    align-items: center;
}
.san-pham i.pi-truck {
    font-size: 1.5rem;
    vertical-align: middle; /* Điều chỉnh vị trí của icon theo chiều dọc */
}

.san-pham::after {
    content: '';
    width: 100%;
    height: 1px; /* Độ dày của dấu gạch ngang */
    background-color: black; /* Màu sắc của dấu gạch ngang */
    position: absolute;
    bottom: 0;
}
.hoan-thanh {
    color: red; /* Đặt màu cam cho chữ HOÀN THÀNH */
}

.giao-thanh-cong {
    color: gray; /* Đặt màu ghi cho chữ Đơn hàng đã được giao thành công */
}
.gach {
    font-size: 20px;
}

.thong-tin-sp {
    /* padding-bottom: 10px; */
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.product-container {
    display: flex;
    align-items: flex-start;
}

.thumbnail {
    margin-right: 20px;
}

.thumbnail img {
    width: 150px; /* Điều chỉnh kích thước của ảnh */
    height: auto;
}

.details {
    text-align: left;
    /* flex: 1; */
}

.my-button {
    margin-top: 10px;
}
</style>
