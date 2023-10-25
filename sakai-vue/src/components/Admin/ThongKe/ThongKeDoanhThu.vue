
<template>
    <div class="p-fluid formgrid grid">
        <div class="Field col-12 md:col-12"
            style=" background: rgb(255, 255, 255); width: 100%; height: 120px;margin-bottom: 10px;display: flex;">
            <div class="Field col-12 md:col-2" style="margin-right: 10px;height: 30px; margin-left: -25px;">
                <Panel header="Tổng Doanh Thu" style=" width: 150px;  height: 40px;">
                    <p class="m-0">1567</p>
                </Panel>
            </div>
            <div class="Field col-12 md:col-2" style="margin-right: 10px;height: 30px;">
                <Panel header="Loại" style=" width: 150px">
                    <div>
                        <span class="p-float-label" style="height: 30px;">
                            <Dropdown id="dropdown" :options="dataLoai" v-model="selectedLoai" optionLabel="ten"
                                :class="{ 'p-invalid': loaiError }" @change="onloaiChange" style="height: 30px;">
                            </Dropdown>
                            <label for="dropdown">Loại</label>
                        </span>
                    </div>
                </Panel>
            </div>
            <div class="Field col-12 md:col-2" style="margin-right: 20px;">
                <Panel header="Thương hiệu" style=" width: 160px; height: 30px;">
                    <span class="p-float-label" style="height: 30px">
                        <Dropdown id="dropdown" :options="dataThuongHieu" v-model="selectedCity" optionLabel="ten"
                            @change="onCityChange" style="height: 30px;">
                        </Dropdown>
                        <label for="dropdown">Thương Hiệu</label>
                    </span>
                </Panel>
            </div>
            <div class="Field col-12 md:col-2" style="margin-right: 20px;">
                <Panel header="Sản phẩm" style=" width: 160px; height: 30px;">
                    <span class="p-float-label" style="height: 30px">
                        <Dropdown id="dropdown" :options="dataThuongHieu" v-model="selectedCity" optionLabel="ten"
                            @change="onCityChange" style="height: 30px;">
                        </Dropdown>
                        <label for="dropdown">Sản phẩm</label>
                    </span>
                </Panel>
            </div>
            <div class="Field col-6 md:col-4" style="height: 30px;">
                <Panel header="Tìm kiếm" style=" width: 100%">
                    <div class="flex flex-wrap gap-3">
                        <div class="flex align-items-center">
                            <RadioButton v-model="modalTimKiem" type="radio" inputId="ingredient1" name="nam"
                                value="theoNam" @change="openModalTimKiem" />
                            <label for="ingredient1" class="ml-2">Theo năm</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="modalTimKiem" type="radio" inputId="ingredient2" name="thang"
                                value="theoThang" @change="openModalTimKiem" />
                            <label for="ingredient2" class="ml-2">Theo Tháng</label>
                        </div>
                    </div>
                </Panel>
            </div>


        </div>
        <div class="Field col-12 md:col-12" style="background: rgb(255, 255, 255);display: flex; margin-left: 3px;">

            <div>
                <div class="Field col-12 md:col-3"
                    style="margin-bottom: 10px;background: rgb(255, 255, 255); width: 240px; height: 250px;border-radius: 20px; border: 1px solid black">
                    <Chart type="polarArea" :data="chartLoai" :options="chartOptionsLoai" class="w-full md:w-17rem"
                        style="margin-left: -10px;" />
                </div>
                <div class="Field col-12 md:col-3"
                    style="margin-bottom: 10px; background: rgb(255, 255, 255); width: 240px;height: 260px;border-radius: 20px;border-radius: 20px; border: 1px solid black">
                    <Chart type="polarArea" :data="chartLoai" :options="chartOptionsLoai" class="w-full md:w-17rem"
                        style="margin-left: -10px;" />
                </div>
            </div>

            <div class="Field col-12 md:col-9" style="margin-bottom: 10px; background: rgb(255, 255, 255);">
                <div class="Field col-12 md:col-9"
                    style="margin-bottom: 10px; background: rgb(255, 255, 255); width: 100%; height: 250px; border-radius: 20px;order-radius: 20px; border: 1px solid black">
                    <h5 style="margin-top: 2px;">Doanh Thu Theo Tháng</h5>
                    <Chart type="line" :data="chartData" :options="chartOptions" class="h-15rem" />
                </div>
                <div class="Field col-12 md:col-9"
                    style="margin-bottom: 10px; background: rgb(255, 255, 255);width: 100%; height: 260px; display: flex;">
                    <div class="Field col-12 md:col-6"
                        style="margin-bottom: 10px; background: rgb(255, 255, 255); height: 260px;border-radius: 20px; margin-right: 10px;order-radius: 20px; border: 1px solid black">
                        <h5 style="margin-top: 2px;">Top Sản phẩm doanh thu cao nhất</h5>
                        <Chart type="bar" :data="chartDataSPCao" :options="chartOptionsSPCao" class="h-15rem"
                            style="margin-top: -10px;margin-left: -10px;" />
                    </div>
                    <div class="Field col-12 md:col-6"
                        style="margin-bottom: 10px; background: rgb(255, 255, 255); height: 260px;border-radius: 20px;order-radius: 20px; border: 1px solid black">
                        <h5 style="margin-top: 2px;">Top Sản phẩm doanh thu thấp nhất</h5>
                        <Chart type="bar" :data="chartDataSPThap" :options="chartOptionsSPThap" class="h-15rem"
                            style="margin-top: -10px;margin-left: -10px;" />
                    </div>
                </div>
            </div>


        </div>
    </div>




    <Dialog v-model:visible="modal" header="Tìm kiếm theo năm" :style="{ width: '400px' }" :position="position"
        :modal="true" :draggable="false">
        <H6>Hãy chọn năm</H6>
        <div v-for="o in loadNam" style="display: inline-flex; margin-right: 10px; margin-bottom: 10px;">
            <div class="flex align-items-center">
                <RadioButton v-model="vNam" type="radio" inputId="ingredient1" name="nam" value="{{ o.name }}" />
                <label for="ingredient1" class="ml-2">{{ o.name }}</label>
            </div>
        </div>
        <template #footer>

        </template>
    </Dialog>
    <Dialog v-model:visible="modal2" header="Tìm kiếm theo tháng" :style="{ width: '400px' }" :position="position"
        :modal="true" :draggable="false">
        <form @submit="">
            <div style="display: flex; margin-top: 20px;">
                <span class="p-float-label" style="height: 40px; margin-right: 50px;">
                    <Dropdown id="dropdown" :options="loadThang" v-model="vThang" optionLabel="name" @change="onCityChange"
                        style="width: 120px;height:40px;">
                    </Dropdown>
                    <label for="dropdown">Start month</label>
                </span>

                <span class="p-float-label" style="height: 40px">
                    <Dropdown id="dropdown" :options="loadThang" v-model="vThang" optionLabel="name" @change="onCityChange"
                        style="width: 120px;height:40px;">
                    </Dropdown>
                    <label for="dropdown">End month</label>
                </span>
            </div>


        </form>

    </Dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    chartLoai.value = setChartLoai();
    chartOptionsLoai.value = setChartOptionsLoai();
    chartDataSPCao.value = setChartDataSpCao();
    chartOptionsSPCao.value = setChartOptionsSpCao();
    chartDataSPThap.value = setChartDataSpThap();
    chartOptionsSPThap.value = setChartOptionsSpThap();

    loadNam.value = nam;
    loadThang.value = thang;
});

const modalTimKiem = ref(null);
const modal = ref(false);
const modal2 = ref(false);
const openModalTimKiem = () => {
    if (modalTimKiem.value === 'theoNam') {
        modal.value = true;
    } else if (modalTimKiem.value === 'theoThang') {
        modal2.value = true;
    }

};

const loadNam = ref([]);
const nam = [{ name: '2018' }, { name: '2019' }, { name: '2020' }, { name: '2021' }, { name: '2022' }, { name: '2023' }];
const loadThang = ref([]);
const thang = [{ name: '01' }, { name: '02' }, { name: '03' }, { name: '04' }, { name: '05' }, { name: '06' }, { name: '07' }, { name: '08' }, { name: '09' }, { name: '10' }, { name: '11' }, { name: '12' }];
const vNam = ref();
const vThang = ref();

const chartLoai = ref();
const chartOptionsLoai = ref();

const chartData = ref();
const chartOptions = ref();

const chartDataSPCao = ref();
const chartOptionsSPCao = ref();

const chartDataSPThap = ref();
const chartOptionsSPThap = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                tension: 0.4
            },
            {
                label: 'Second Dataset',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--pink-500'),
                tension: 0.4
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
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

const setChartLoai = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        datasets: [
            {
                data: [11, 16, 7, 3, 14],
                backgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                    documentStyle.getPropertyValue('--bluegray-500'),

                ],
                label: 'My dataset'
            }
        ],
        labels: ['Red', 'Green', 'Yellow', 'Grey']
    };
};
const setChartOptionsLoai = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}
const setChartDataSpCao = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };
};
const setChartOptionsSpCao = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
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
}

const setChartDataSpThap = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };
};
const setChartOptionsSpThap = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
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
}
</script>
