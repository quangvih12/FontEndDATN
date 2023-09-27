<!-- eslint-disable no-unused-vars -->
<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount } from 'vue';
import DetailHoaDon from './DetailHoaDon.vue';
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
</script>
<template>
    <div class="col-12 flex" style="margin-right: 10px; padding-left: 0">
        <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="min-width: 13rem; height: 40px;" />
        </span>
        <div class="p-inputgroup flex-1" style="margin-left: 20px">
            <span class="p-inputgroup-addon" style="height: 40px;">Ngày bắt đầu</span>
            <input type="datetime-local" style="min-width: 13rem; height: 40px;" />
        </div>
        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon" style="height: 40px;">Ngày kết thúc</span>
            <input type="datetime-local" style="min-width: 13rem; height: 40px;" />
        </div>
        <div style="margin-left: 5px">
            <Button label="Seach" icon="pi pi-search" class="p-button-rounded p-button-primary mr-2 mb-2" />
        </div>
    </div>
    <DataTable
        :value="customer1"
        :paginator="true"
        class="p-datatable-gridlines"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters1"
        filterDisplay="menu"
        :loading="loading1"
        :filters="filters1"
        responsiveLayout="scroll"
        :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
    >
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>
        <Column field="id" header="Id hóa đơn" style="min-width: 12rem">
            <template #body="{ data }">
                {{ data.id }}
            </template>
            <template #filter="{ filterModel }">
                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by id" />
            </template>
        </Column>
        <Column field="name" header="Khách hàng" style="min-width: 12rem">
            <template #body="{ data }">
                {{ data.name }}
            </template>
            <template #filter="{ filterModel }">
                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
            </template>
        </Column>
        <Column header="Địa chỉ" filterField="country.name" style="min-width: 12rem">
            <template #body="{ data }">
                <img src="/demo/images/flag/flag_placeholder.png" :alt="data.country.name" :class="'flag flag-' + data.country.code" width="30" />
                <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.country.name }}</span>
            </template>
            <template #filter="{ filterModel }">
                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by diaChi" />
            </template>
            <template #filterclear="{ filterCallback }">
                <Button type="button" icon="pi pi-times" @click="filterCallback()" class="p-button-secondary"></Button>
            </template>
            <template #filterapply="{ filterCallback }">
                <Button type="button" icon="pi pi-check" @click="filterCallback()" class="p-button-success"></Button>
            </template>
        </Column>
        <Column header="Ngày tạo" filterField="date" dataType="date" style="min-width: 10rem">
            <template #body="{ data }">
                {{ formatDate(data.date) }}
            </template>
            <template #filter="{ filterModel }">
                <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
            </template>
        </Column>
        <Column header="Ngày cập nhật" filterField="date" dataType="date" style="min-width: 10rem">
            <template #body="{ data }">
                {{ formatDate(data.date) }}
            </template>
            <template #filter="{ filterModel }">
                <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
            </template>
        </Column>
        <Column field="status" header="Trạng thái" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
            <template #body="{ data }">
                <span :class="'customer-badge status-' + data.status">{{ data.status }}</span>
            </template>
            <template #filter="{ filterModel }">
                <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" :showClear="true">
                    <template #value="slotProps">
                        <span :class="'customer-badge status-' + slotProps.value" v-if="slotProps.value">{{ slotProps.value }}</span>
                        <span v-else>{{ slotProps.placeholder }}</span>
                    </template>
                    <template #option="slotProps">
                        <span :class="'customer-badge status-' + slotProps.option">{{ slotProps.option }}</span>
                    </template>
                </Dropdown>
            </template>
        </Column>
        <Column header="Tổng tiền" filterField="balance" dataType="numeric" style="min-width: 10rem">
            <template #body="{ data }">
                {{ formatCurrency(data.balance) }}
            </template>
            <template #filter="{ filterModel }">
                <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
            </template>
        </Column>
        <Column field="trangThai" header="Ghi chú" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
            <template #body="{ data }">
                <i class="pi" :class="{ 'text-green-500 pi-check-circle': data.verified, 'text-pink-500 pi-times-circle': !data.verified }"></i>
            </template>
            <template #filter="{ filterModel }">
                <TriStateCheckbox v-model="filterModel.value" />
            </template>
        </Column>
        <Column header="Chức năng" filterField="chucNang" bodyStyle="text-align: center">
            <template #body="{ data }">
                {{ data.chucNang }}
                <DetailHoaDon></DetailHoaDon>
                <Button label="Hoàn thành" class="p-button-outlined p-button-info mr-2 mb-2" />
            </template>
        </Column>
    </DataTable>
</template>