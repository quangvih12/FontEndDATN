<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount } from 'vue';

const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const products = ref(null);
const representatives = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

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

const selectedCities = ref([]);
const cities = ref([
    { name: 'Tất cả', code: 'NY' },
    { name: 'Đã hoàn thành', code: 'NY' },
    { name: 'Đang giao', code: 'RM' },
    { name: 'Đã huỷ', code: 'LDN' }
]);
</script>
<template>
    <div class="col-12 flex" style="padding-left: 0">
        <!-- <div>
            <span class="p-input-icon-left" style="margin-right: 20px">
                <InputNumber v-model="value3" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5" placeholder="Giá nhỏ nhất" />
            </span>
            <span class="p-input-icon-left" style="margin-right: 20px">
                <InputNumber v-model="value3" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5" placeholder="Giá lớn nhất" />
            </span>
        </div> -->
        <div>
            <div class="col-12 flex" style="padding-top: 0; padding-left: 0; padding-bottom: 0">
                <div class="p-inputgroup" style="height: 40px; margin-right: 20px">
                    <span class="p-inputgroup-addon">Ngày bắt đầu</span>
                    <input type="datetime-local" />
                </div>
                <div class="p-inputgroup" style="height: 40px">
                    <span class="p-inputgroup-addon">Ngày kêt thúc</span>
                    <input type="datetime-local" />
                </div>
                <Button style="background: none; height: 40px; border: none"><i class="pi pi-search" style="font-size: 2rem; color: blue"></i></Button>
            </div>
        </div>
    </div>
    <div class="col-12 flex" style="margin-bottom: 20px; padding-left: 0">
        <Panel header="Tổng đơn hàng" style="margin-right: 20px; width: 230px">
            <p class="m-0">2</p>
        </Panel>
        <Panel header="Tổng đơn hàng hoành thành" style="margin-right: 20px; width: 230px">
            <p class="m-0">3</p>
        </Panel>
        <Panel header="Tổng đơn hàng đang giao" style="margin-right: 20px; width: 230px">
            <p class="m-0">4</p>
        </Panel>
        <Panel header="Tổng đơn hàng đã huỷ" style="margin-right: 20px; width: 230px">
            <p class="m-0">1</p>
        </Panel>
        <Panel header="Tổng đơn hàng hoàn trả" style="margin-right: 20px; width: 230px">
            <p class="m-0">1</p>
        </Panel>
    </div>

    <!-- <div class="col-12 flex">
        <div>
            <span class="p-input-icon-left" style="margin-right: 20px">
                <i class="pi pi-search" />
                <InputText v-model="value1" placeholder="Mã hoá đơn, nhân viên, khách hàng, địa chỉ" style="width: 380px" />
                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="min-width: 13rem" />
            </span>
        </div>
        <Dropdown v-model="selectedCities" :options="cities" optionLabel="name" placeholder="Tất cả" class="w-full md:w-14rem ml-auto" />
    </div> -->
    <div>
        <!-- <TreeTable :value="nodes">
            <Column field="ma" header="Mã hoá đơn" expander></Column>
            <Column field="nhanVien" header="Tên nhân viên"></Column>
            <Column field="khachHang " header="Tên khách hàng"></Column>
            <Column field="tienShip " header="Tiền ship"></Column>
            <Column field="tongTien " header="Tổng tiền"></Column>
            <Column field="diaChi " header="Địa chỉ"></Column>
            <Column field="trangThai " header="Trạng thái"></Column>
            <Column field="ngayTao " header="Ngày tạo"></Column>
            <Column field="ngayThanhToan " header="Ngày thanh toán"></Column>
            <Column field="ngayGiao " header="Ngày giao"></Column>
            <Column field="phuongThucThanhToan " header="Phương thức thanh toán"></Column>
            <Column field="action " header="Hành động"></Column>
        </TreeTable> -->
        <DataTable
            ref="dt"
            :value="products"
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
            <Column field="code" header="Mã hoá đơn" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </Column>
            <Column field="tenNhanVien" header="Tên nhân viên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Name</span>
                    {{ slotProps.data.name }}
                </template>
            </Column>
            <Column field="tenKhachHang" header="Tên khách hàng" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Name</span>
                    {{ slotProps.data.name }}
                </template>
            </Column>
            <Column field="tienShip" header="Tiền ship" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Price</span>
                    {{ formatCurrency(slotProps.data.price) }}
                </template>
            </Column>
            <Column field="tongTien" header="Tổng tiền" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Price</span>
                    {{ formatCurrency(slotProps.data.price) }}
                </template>
            </Column>
            <Column field="diaChi" header="Địa chỉ" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Category</span>
                    {{ slotProps.data.category }}
                </template>
            </Column>
            <Column header="Trạng thái" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Image</span>
                    <img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
                </template>
            </Column>
            <Column field="ngayTao" header="Ngày tạo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Status</span>
                    <span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{ slotProps.data.inventoryStatus }}</span>
                </template>
            </Column>
            <Column field="ngayThanhToan" header="Ngày thanh toán" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Status</span>
                    <span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{ slotProps.data.inventoryStatus }}</span>
                </template>
            </Column>
            <Column field="ngayGiao" header="Ngày giao" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Status</span>
                    <span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{ slotProps.data.inventoryStatus }}</span>
                </template>
            </Column>
            <Column field="phuongThucThanhToan" header="Phương thức thanh toán" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Status</span>
                    <span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{ slotProps.data.inventoryStatus }}</span>
                </template>
            </Column>
            <!-- <Column header="Hành động" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Status</span>
                    <span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{ slotProps.data.inventoryStatus }}</span>
                </template>
            </Column> -->
        </DataTable>
    </div>
</template>
