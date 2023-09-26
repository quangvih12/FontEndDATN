<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onMounted } from 'vue';

// biểu đồ
onMounted(() => {
    chartData.value = setChartData();
});

const chartData = ref();
const chartOptions = ref({
    cutout: '60%'
});

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['Dụng', 'Vũ', 'Vinh'],
        datasets: [
            {
                data: [540, 325, 702],
                backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
            }
        ]
    };
};

// dữ liệu thẻ select
const selectedCity = ref();
const cities = ref([
    { name: 'Hôm nay', code: 'NY' },
    { name: '7 ngày trước', code: 'RM' },
    { name: '28 ngày trước', code: 'LDN' },
    { name: '6 tháng trước', code: 'IST' },
    { name: '1 năm trước', code: 'IST' }
]);
</script>
<template>
    <div style="width: 1000px">
        <div class="col-12 flex" style="padding-left: 0">
            <div style="margin-right: 20px">
                <Dropdown v-model="selectedCity" :options="cities" showClear optionLabel="name" placeholder="Hôm nay" class="w-full md:w-14rem" />
            </div>
            <div class="p-inputgroup" style="width: 70%">
                <span class="p-inputgroup-addon">Ngày bắt đầu</span>
                <input type="datetime-local" />
            </div>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">Ngày kêt thúc</span>
                <input type="datetime-local" />
                <Button style="background: none; height: 40px; border: none"><i class="pi pi-search" style="font-size: 2rem; color: blue"></i></Button>
            </div>
        </div>
        <div class="col-12 flex" style="padding-left: 0">
            <Panel header="Tổng số sản phẩm bán được" style="margin-right: 20px; width: 230px">
                <p class="m-0">1567</p>
            </Panel>
            <Panel header="Sản phẩm bán chạy nhất" style="margin-right: 20px; width: 230px">
                <p class="m-0">Vinh: <span>702</span></p>
            </Panel>
            <Panel header="Sản phẩm bán kém nhất" style="margin-right: 20px; width: 230px">
                <p class="m-0">Vũ: <span>325</span></p>
            </Panel>
        </div>

        <div>
            <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
        </div>
    </div>
</template>
