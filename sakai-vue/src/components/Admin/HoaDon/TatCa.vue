<!-- eslint-disable no-unused-vars -->
<script setup>
import { format } from 'date-fns';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onBeforeMount, onMounted, watch } from 'vue';
import DetailHoaDon from './DetailHoaDon.vue';
import { HDStore } from '../../../service/Admin/HoaDon/HoaDonService';

const useHD = HDStore();
const filters1 = ref(null);

const data = ref([]);

const loadData = async () => {
    await useHD.fetchData();
    data.value = useHD.dataAll;
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
    } else if (trangThai == 7) {
        return { text: 'Yêu cầu trả hàng', severity: 'warning' };
    } else if (trangThai == 8) {
        return { text: 'Đã trả hàng', severity: 'warning' };
    } else if (trangThai == 10) {
        return { text: 'đổi trả thành công', severity: 'success' };
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

const dataSearchDate = ref([
    { label: 'Ngày tạo', value: 'ngayTao' },
    { label: 'Ngày sửa', value: 'ngaySua' },
    { label: 'Ngày thanh toán', value: 'ngayThanhToan' },
    { label: 'Ngày ship', value: 'ngayShip' },
    { label: 'Ngày nhận', value: 'ngayNhan' }
]);

const dataComboBoxHinhThucGiao = ref([
    { label: 'Tất cả', value: 'tatCa' },
    { label: 'Tại quầy', value: '1' },
    { label: 'Giao hàng', value: '2' }
]);

const dataPhuongThucThanhToan = ref([
    { label: 'Tất cả', value: 'tatCa' },
    { label: 'Tiền mặt', value: '1' },
    { label: 'Chuyển khoản', value: '2' }
]);

const startDate = ref(null);
const endDate = ref(null);
const typeSearchDate = ref(null);
const selectedColumns = ref(null);

const searchDate = async () => {
    if ((hinhThucGiao.value == 'tatCa' || hinhThucGiao.value == null) && (phuongThucThanhToan.value == 'tatCa' || phuongThucThanhToan.value == null)) {
        if (startDate.value == null || startDate.value.length <= 0 || endDate.value == null || endDate.value.length <= 0) {
            loadData();
        } else if (typeSearchDate.value == null) {
            const respone = await useHD.searchDate(startDate.value, endDate.value, 'ngayTao');
            data.value = respone;
        } else {
            const respone = await useHD.searchDate(startDate.value, endDate.value, typeSearchDate.value.value);
            data.value = respone;
        }
        console.log('cả 2 null');
    } else if (phuongThucThanhToan.value == 'tatCa' || phuongThucThanhToan.value == null) {
        console.log('phuongThucThanhToan null');
        if (startDate.value == null || startDate.value.length <= 0 || endDate.value == null || endDate.value.length <= 0) {
            loadDataByHinhThucGiao(parseInt(hinhThucGiao.value.value));
        } else if (typeSearchDate.value == null) {
            const respone = await useHD.searchDateByHinhThucGiao(startDate.value, endDate.value, 'ngayTao', parseInt(hinhThucGiao.value.value));
            data.value = respone;
        } else {
            const respone = await useHD.searchDateByHinhThucGiao(startDate.value, endDate.value, typeSearchDate.value.value, parseInt(hinhThucGiao.value.value));
            data.value = respone;
        }
    } else if (hinhThucGiao.value == 'tatCa' || hinhThucGiao.value == null) {
        console.log('hinhThucGiao null');
        if (startDate.value == null || startDate.value.length <= 0 || endDate.value == null || endDate.value.length <= 0) {
            loadDataByPttt(parseInt(phuongThucThanhToan.value.value));
        } else if (typeSearchDate.value == null) {
            const respone = await useHD.searchDateByPttt(startDate.value, endDate.value, 'ngayTao', parseInt(phuongThucThanhToan.value.value));
            data.value = respone;
        } else {
            const respone = await useHD.searchDateByPttt(startDate.value, endDate.value, typeSearchDate.value.value, parseInt(phuongThucThanhToan.value.value));
            data.value = respone;
        }
    } else {
        console.log('cả 2 k null');
        if (startDate.value == null || startDate.value.length <= 0 || endDate.value == null || endDate.value.length <= 0) {
            loadDataByHinhThucGiaoAndPttt(parseInt(hinhThucGiao.value.value), parseInt(phuongThucThanhToan.value.value));
        } else if (typeSearchDate.value == null) {
            const respone = await useHD.searchDateByPtttAndHtgh(startDate.value, endDate.value, 'ngayTao', parseInt(phuongThucThanhToan.value.value), parseInt(hinhThucGiao.value.value));
            data.value = respone;
        } else {
            const respone = await useHD.searchDateByPtttAndHtgh(startDate.value, endDate.value, typeSearchDate.value.value, parseInt(phuongThucThanhToan.value.value), parseInt(hinhThucGiao.value.value));
            data.value = respone;
        }
    }
};

const onToggle = (val) => {
    selectedColumns.value = columns.value.filter((col) => val.includes(col));
};

onBeforeMount(() => {
    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const formatCurrency = (value) => {
    if (value == null || value.length <= 0) {
        return null;
    } else {
        return parseInt(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
};

const formatDate = (dateTime) => {
    if (dateTime == null || dateTime.length <= 0) {
        return null;
    } else {
        return format(new Date(dateTime), 'yyyy/MM/dd HH:mm:ss');
    }
};

const loadDataByHinhThucGiao = async (data) => {
    await useHD.fetchDataByHinhThucGiao(data);
};

const loadDataByPttt = async (pttt) => {
    await useHD.fetchDataByPttt(pttt);
};

const loadDataByHinhThucGiaoAndPttt = async (data, pttt) => {
    await useHD.fetchDataByHinhThucGiaoAndPttt(data, pttt);
};

const hinhThucGiao = ref();

//thay đổi cbb
watch(hinhThucGiao, (newVal) => {
    if (phuongThucThanhToan.value == null || phuongThucThanhToan.value.value == 'tatCa') {
        if (hinhThucGiao.value.value == 'tatCa') {
            loadData();
        } else if (hinhThucGiao.value.value == '1') {
            loadDataByHinhThucGiao(1);
        } else {
            loadDataByHinhThucGiao(2);
        }
    } else {
        if (hinhThucGiao.value.value == 'tatCa') {
            loadDataByPttt(phuongThucThanhToan.value.value);
        } else if (hinhThucGiao.value.value == '1') {
            loadDataByHinhThucGiaoAndPttt(1, parseInt(phuongThucThanhToan.value.value));
        } else {
            loadDataByHinhThucGiaoAndPttt(2, parseInt(phuongThucThanhToan.value.value));
        }
    }
});
const phuongThucThanhToan = ref();

watch(phuongThucThanhToan, (newVal) => {
    if (hinhThucGiao.value == null || hinhThucGiao.value.value == 'tatCa') {
        if (phuongThucThanhToan.value.value == 'tatCa') {
            loadData();
        } else if (phuongThucThanhToan.value.value == '1') {
            loadDataByPttt(phuongThucThanhToan.value.value);
        } else {
            loadDataByPttt(phuongThucThanhToan.value.value);
        }
    } else {
        if (phuongThucThanhToan.value.value == 'tatCa') {
            loadDataByHinhThucGiao(hinhThucGiao.value.value);
        } else if (phuongThucThanhToan.value.value == '1') {
            loadDataByHinhThucGiaoAndPttt(hinhThucGiao.value.value, parseInt(phuongThucThanhToan.value.value));
        } else {
            loadDataByHinhThucGiaoAndPttt(hinhThucGiao.value.value, parseInt(phuongThucThanhToan.value.value));
        }
    }
});
</script>
<template>
    <div class="col-12 flex" style="padding-left: 0">
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
        :value="useHD.dataAll"
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
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <MultiSelect icon="pi pi-plus" placeholder="Select Columns" :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle" display="chip" />
                    <Dropdown v-model="hinhThucGiao" :options="dataComboBoxHinhThucGiao" optionLabel="label" placeholder="Hình thức giao hàng" class="w-full md:w-14rem" style="margin-left: 20px" />
                    <Dropdown v-model="phuongThucThanhToan" :options="dataPhuongThucThanhToan" optionLabel="label" placeholder="Phương thức thanh toán" class="w-full md:w-14rem" style="margin-left: 20px" />
                </div>

                <span class="p-input-icon-left" style="margin-left: 20px">
                    <i class="pi pi-search" />
                    <InputText v-model="filters1['global'].value" placeholder="Search..." style="min-width: 13rem; height: 40px" />
                </span>
            </div>
        </template>
        <Column field="stt" header="STT" :sortable="true" headerStyle="width:5%; min-width:1rem;">
            <template #body="slotProps">
                <span class="p-column-title">stt</span>
                {{ slotProps.data.stt }}
            </template>
        </Column>
        <Column field="maHD" header="Mã hoá đơn" :sortable="true" headerStyle="width:10%; min-width:8rem;">
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
        <Column field="tongTien" header="Tổng tiền" :sortable="true" headerStyle="width:10%; min-width:9rem;">
            <template #body="slotProps">
                <span class="p-column-title">tongTien</span>
                {{ formatCurrency(slotProps.data.tienSauKhiGiam == null ? parseInt(slotProps.data.tongTien) + parseInt(slotProps.data.tienShip == null ? 0:slotProps.data.tienShip) : slotProps.data.tienSauKhiGiam) }}
            </template>
        </Column>
        <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header" :key="col.field + '_' + index" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">{{ col.field }}</span>
                {{
                    col.field === 'tienShip' || col.field === 'tienSauKhiGiam'
                        ? formatCurrency(slotProps.data[col.field])
                        : ['ngayTao', 'ngaySua', 'ngayShip', 'ngayNhan'].includes(col.field)
                        ? formatDate(slotProps.data[col.field])
                        : slotProps.data[col.field]
                }}
            </template>
        </Column>

        <Column field="hinhThucGiaoHang" header="Hình thức giao" :sortable="false" headerStyle="width:10%; min-width:9rem;">
            <template #body="slotProps">
                <span class="p-column-title">diaChi</span>
                {{ slotProps.data.hinhThucGiaoHang == 1 ? 'Tại quầy' : 'Giao hàng' }}
            </template>
        </Column>
        <Column field="tenPTTT" header="Phương thức thanh toán" :sortable="false" headerStyle="width:10%; min-width:9rem;">
            <template #body="slotProps">
                <span class="p-column-title">diaChi</span>
                {{ slotProps.data.tenPTTT }}
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
                <!-- <DetailSize :my-prop="slotProps.data"></DetailSize>
                <UpdateSize :my-prop="slotProps.data"></UpdateSize>
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data.id)" /> -->
                <DetailHoaDon :my-prop="slotProps.data"></DetailHoaDon>
            </template>
        </Column>
    </DataTable>
</template>
