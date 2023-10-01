<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onMounted } from 'vue';

// biểu đồ

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: [65, 59, 80, 81, 56, 55, 40, 76, 45, 65, 70, 73]
            }
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
};
</script>
<template>
    <div style="width: 1000px">
        <div class="col-12 flex" style="padding-left: 0;">
            <div class="p-inputgroup" style="width: 50%">
                <span class="p-inputgroup-addon">Ngày bắt đầu</span>
                <input type="datetime-local" />
            </div>
            <div class="p-inputgroup">
                <span class="p-inputgroup-addon">Ngày kêt thúc</span>
                <input type="datetime-local" />
                <Button style="background: none; height: 40px; border: none"><i class="pi pi-search" style="font-size: 2rem; color: blue"></i></Button>
            </div>
        </div>
        <div class="col-12 flex" style="padding-left: 0;">
            <Panel header="Hôm nay" style="margin-right: 20px; width: 230px">
                <p class="m-0">100.000</p>
            </Panel>
            <Panel header="7 ngày trước" style="margin-right: 20px; width: 230px">
                <p class="m-0">200.000</p>
            </Panel>
            <Panel header="28 ngày trước" style="margin-right: 20px; width: 230px">
                <p class="m-0">700.000</p>
            </Panel>
            <Panel header="6 tháng trước" style="margin-right: 20px; width: 230px">
                <p class="m-0">10.000.000</p>
            </Panel>
            <Panel header="1 năm trước" style="margin-right: 20px; width: 230px">
                <p class="m-0">100.000.000</p>
            </Panel>
        </div>

        <div>
            <Chart type="bar" :data="chartData" :options="chartOptions" class="h-30rem" />
        </div>
    </div>
</template>
