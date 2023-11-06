
<template>
    <div class="p-fluid formgrid grid">
        <div class="Field col-12 md:col-12"
            style=" background: rgb(255, 255, 255); width: 100%; height: 120px;margin-bottom: 10px;display: flex;">
            <div class="Field col-12 md:col-2" style="margin-right: 10px;height: 30px; margin-left: -25px;">
                <Panel header="Tổng Doanh Thu" style=" width: 150px;  height: 40px; ">
                    <div style="display: flex;">
                        <div style="margin-right: 20px; text-align: center;">
                            <p class="m-0" style="text-align: center; font-weight: 900; font-size: 1.4rem;">{{
                                formatCurrency(tongDoanhThu) }}</p>
                        </div>
                        <div>

                        </div>

                    </div>
                </Panel>

            </div>
            <div class="Field col-12 md:col-2" style="margin-right: 10px;height: 30px;">
                <Panel header="Loại" style=" width: 150px">
                    <div>
                        <span class="p-float-label" style="height: 40px;">
                            <Dropdown id="dropdown" :options="dataLoai" v-model="selectedLoai" optionLabel="ten"
                                :class="{ 'p-invalid': loaiError }" style="height: 40px;">
                            </Dropdown>
                            <label for="dropdown">Loại</label>
                        </span>
                    </div>
                </Panel>
            </div>
            <div class="Field col-12 md:col-2" style="margin-right: 20px;">
                <Panel header="Thương hiệu" style=" width: 160px; height: 50px;">
                    <span class="p-float-label" style="height: 40px">
                        <Dropdown id="dropdown" :options="dataThuongHieu" v-model="selectedCity" optionLabel="ten"
                            @change="onCityChange" style="height: 40px;">
                        </Dropdown>
                        <label for="dropdown">Thương Hiệu</label>
                    </span>
                </Panel>
            </div>
            <div class="Field col-12 md:col-2" style="margin-right: 20px;">
                <Panel header="Sản phẩm" style=" width: 160px; height: 30px;">
                    <span class="p-float-label" style="height: 40px">
                        <Dropdown id="dropdown" :options="products" v-model="selectedProduct" optionLabel="ten"
                            @change="onCityChange" style="height: 40px;">
                        </Dropdown>
                        <label for="dropdown">Sản phẩm</label>
                    </span>
                </Panel>
            </div>
            <div class="Field col-6 md:col-4" style="height: 40px;">
                <Panel header="Tìm kiếm" style=" width: 100%; height: 40px;">
                    <div class="flex flex-wrap gap-3" style="display: flex;">
                        <Button type="button" label="Năm" @click="toggle"
                            style="width: 70px; height: 40px;background: none;   color: black;" />
                        <OverlayPanel ref="op">

                            <H6>Hãy chọn năm</H6>
                            <div v-for="(o, index) in loadNam"
                                style="display: inline-block; margin-right: 10px; margin-bottom: 10px;">
                                <div class="flex align-items-center">
                                    <RadioButton v-model="vNam" type="radio" :inputId="'ingredient' + index" name="nam"
                                        :value="o.name" />
                                    <label :for="'ingredient' + index" class="ml-2">{{ o.name }}</label>
                                </div>
                            </div>

                        </OverlayPanel>
                        <Button type="button" label="Tháng" @click="toggle1"
                            style="width: 80px; height: 40px;background: none;   color: black;" />
                        <Button type="button" label="Tháng" @click="load()"
                            style="width: 70px; height: 40px;background: none;    color: black;"> <i 
                                class="pi pi-replay" style="font-size: 1.8rem; margin-right: 200px;"></i></Button>

                        <OverlayPanel ref="op1" style="height: 100px;">

                            <div style="display: flex; height: 50px;">

                                <div class="" style="height: 30px; margin-right: 20px;  display: block;">
                                    <label style="width: 100px;">start month</label>
                                    <span class="p-float-label">

                                        <InputText type="datetime-local" style="width: 160px;" />
                                        <!-- <label  style="width: 100px;">start month</label> -->
                                    </span>
                                </div>
                                <div class="" style="height: 30px; margin-right: 20px;  display: block;">
                                    <label style="width: 100px;">end month</label>
                                    <span class="p-float-label">

                                        <InputText type="datetime-local" style="width: 160px;" />
                                        <!-- <label  style="width: 100px;">start month</label> -->
                                    </span>
                                </div>
                                <Button style="background: none; height: 50px; border: none; margin-top: 10px;"><i
                                        class="pi pi-search" style="font-size: 1.8rem; color: blue"></i></Button>
                            </div>

                        </OverlayPanel>


                    </div>
                </Panel>
            </div>


        </div>
        <div class="Field col-12 md:col-12"
            style="background: rgb(255, 255, 255);display: flex; margin-left: 3px; margin-top: 10px;">

            <div>
                <div class="Field col-12 md:col-3"
                    style="margin-bottom: 10px;background: rgb(255, 255, 255); width: 240px; height: 250px;border-radius: 20px; border: 1px solid black">
                    <Chart type="polarArea" :data="chartLoai" :options="chartOptionsLoai" class="w-full md:w-17rem"
                        style="margin-left: -10px;" />
                </div>
                <div class="Field col-12 md:col-3"
                    style="margin-bottom: 10px; background: rgb(255, 255, 255); width: 240px;height: 260px;border-radius: 20px;border-radius: 20px; border: 1px solid black">
                    <Chart type="polarArea" :data="chartThuongHieu" :options="chartOptionsThuongHieu"
                        class="w-full md:w-17rem" style="margin-left: -10px;" />
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
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { ThongKeStore } from "../../../service/Admin/ThongKe/ThongKe.api";
import { useLoaiService } from '../../../service/Admin/Loai/LoaiService';
import { useCounterStore } from '../../../service/Admin/ThuongHieu/ThuongHieuService.js';
import { ProductStore } from '../../../service/Admin/product/product.api';

import OverlayPanel from 'primevue/overlaypanel';


const loaiStore = useLoaiService();
const thongKeStore = ThongKeStore();
const thuongHieuService = useCounterStore();
const productStore = ProductStore();

const data = ref([]);
const tongDoanhThu = ref(0);
const lstAdminThongKeLoaiResponses = ref([]);
const lstAdminThongKeSanPhamCaoResponses = ref([]);
const lstAdminThongKeSanPhamThapResponses = ref([]);
const lstAdminThongKeThangResponses = ref([]);
const lstAdminThongKeThuongHieuResponses = ref([]);
const lstAdminThongKeThangNamResponses = ref([]);

const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
};

const op1 = ref();
const toggle1 = (event) => {
    op1.value.toggle(event);
};

const formatCurrency = (value) => {
    return value ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 0;
};


const loadData = async () => {
    await thongKeStore.fetchAll();
    data.value = thongKeStore.data;
    tongDoanhThu.value = thongKeStore.tongDoanhThu;
    lstAdminThongKeLoaiResponses.value = thongKeStore.lstAdminThongKeLoaiResponses;
    lstAdminThongKeSanPhamCaoResponses.value = thongKeStore.lstAdminThongKeSanPhamCaoResponses;
    lstAdminThongKeSanPhamThapResponses.value = thongKeStore.lstAdminThongKeSanPhamThapResponses;
    lstAdminThongKeThangResponses.value = thongKeStore.lstAdminThongKeThangResponses;
    lstAdminThongKeThuongHieuResponses.value = thongKeStore.lstAdminThongKeThuongHieuResponses;
    lstAdminThongKeThangNamResponses.value = thongKeStore.lstAdminThongKeThangNamResponses;
    //console.log(lstAdminThongKeLoaiResponses.value)

    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    chartLoai.value = setChartLoai();
    chartOptionsLoai.value = setChartOptionsLoai();
    chartThuongHieu.value = setChartThuongHieu();
    chartOptionsThuongHieu.value = setChartOptionsThuongHieu();
    chartDataSPCao.value = setChartDataSpCao();
    chartOptionsSPCao.value = setChartOptionsSpCao();
    chartDataSPThap.value = setChartDataSpThap();
    chartOptionsSPThap.value = setChartOptionsSpThap();

};

const load = () => {
    loadData();
    selectedLoai.value = null;
    selectedCity.value = null;
    selectedProduct.value = null;
}


const dataLoai = ref([]);
const selectedLoai = ref(null);
const loadDataLoai = async () => {
    await loaiStore.fetchDataByStatus(1);
    dataLoai.value = loaiStore.dataByStatus1;
};

const dataThuongHieu = ref([]);
const selectedCity = ref(null);
const loadDataThuongHieu = async () => {
    await thuongHieuService.fetchDataByStatus(1);
    dataThuongHieu.value = thuongHieuService.dataByStatus1;
    // ThuongHieu.value =  dataThuongHieu.value.ten;
};

const products = ref([]);
const selectedProduct = ref(null);
const loadProducts = async () => {
    await productStore.fetchAll(); // Gọi hàm fetchAll từ Store
    products.value = productStore.products;
};

const onloaiChangeLoai = async (id) => {
    await thongKeStore.fetchAllByLoai(id);
    tongDoanhThu.value = thongKeStore.tongDoanhThu;
    lstAdminThongKeLoaiResponses.value = thongKeStore.lstAdminThongKeLoaiResponses;
    lstAdminThongKeSanPhamCaoResponses.value = thongKeStore.lstAdminThongKeSanPhamCaoResponses;
    lstAdminThongKeSanPhamThapResponses.value = thongKeStore.lstAdminThongKeSanPhamThapResponses;
    lstAdminThongKeThangResponses.value = thongKeStore.lstAdminThongKeThangResponses;
    lstAdminThongKeThuongHieuResponses.value = thongKeStore.lstAdminThongKeThuongHieuResponses;
    lstAdminThongKeThangNamResponses.value = thongKeStore.lstAdminThongKeThangNamResponses;
};
watch(selectedLoai, async (newVal) => {
    await onloaiChangeLoai(selectedLoai.value.id);
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    chartLoai.value = setChartLoai();
    chartOptionsLoai.value = setChartOptionsLoai();
    chartThuongHieu.value = setChartThuongHieu();
    chartOptionsThuongHieu.value = setChartOptionsThuongHieu();
    chartDataSPCao.value = setChartDataSpCao();
    chartOptionsSPCao.value = setChartOptionsSpCao();
    chartDataSPThap.value = setChartDataSpThap();
    chartOptionsSPThap.value = setChartOptionsSpThap();
});

const onloaiChangeThuongHieu = async (id) => {
    await thongKeStore.fetchAllByThuongHieu(id);
    tongDoanhThu.value = thongKeStore.tongDoanhThu;
    lstAdminThongKeLoaiResponses.value = thongKeStore.lstAdminThongKeLoaiResponses;
    lstAdminThongKeSanPhamCaoResponses.value = thongKeStore.lstAdminThongKeSanPhamCaoResponses;
    lstAdminThongKeSanPhamThapResponses.value = thongKeStore.lstAdminThongKeSanPhamThapResponses;
    lstAdminThongKeThangResponses.value = thongKeStore.lstAdminThongKeThangResponses;
    lstAdminThongKeThuongHieuResponses.value = thongKeStore.lstAdminThongKeThuongHieuResponses;
    lstAdminThongKeThangNamResponses.value = thongKeStore.lstAdminThongKeThangNamResponses;
};
watch(selectedCity, async (newVal) => {
    await onloaiChangeThuongHieu(selectedCity.value.id);
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    chartLoai.value = setChartLoai();
    chartOptionsLoai.value = setChartOptionsLoai();
    chartThuongHieu.value = setChartThuongHieu();
    chartOptionsThuongHieu.value = setChartOptionsThuongHieu();
    chartDataSPCao.value = setChartDataSpCao();
    chartOptionsSPCao.value = setChartOptionsSpCao();
    chartDataSPThap.value = setChartDataSpThap();
    chartOptionsSPThap.value = setChartOptionsSpThap();
});

const onloaiChangeSanPham = async (id) => {
    await thongKeStore.fetchAllBySanPham(id);
    tongDoanhThu.value = thongKeStore.tongDoanhThu;
    lstAdminThongKeLoaiResponses.value = thongKeStore.lstAdminThongKeLoaiResponses;
    lstAdminThongKeSanPhamCaoResponses.value = thongKeStore.lstAdminThongKeSanPhamCaoResponses;
    lstAdminThongKeSanPhamThapResponses.value = thongKeStore.lstAdminThongKeSanPhamThapResponses;
    lstAdminThongKeThangResponses.value = thongKeStore.lstAdminThongKeThangResponses;
    lstAdminThongKeThuongHieuResponses.value = thongKeStore.lstAdminThongKeThuongHieuResponses;
    lstAdminThongKeThangNamResponses.value = thongKeStore.lstAdminThongKeThangNamResponses;
};
watch(selectedProduct, async (newVal) => {
    await onloaiChangeSanPham(selectedProduct.value.id);
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    chartLoai.value = setChartLoai();
    chartOptionsLoai.value = setChartOptionsLoai();
    chartThuongHieu.value = setChartThuongHieu();
    chartOptionsThuongHieu.value = setChartOptionsThuongHieu();
    chartDataSPCao.value = setChartDataSpCao();
    chartOptionsSPCao.value = setChartOptionsSpCao();
    chartDataSPThap.value = setChartDataSpThap();
    chartOptionsSPThap.value = setChartOptionsSpThap();
});

onMounted(async () => {
    loadDataLoai();
    await loadData();
    loadDataThuongHieu();
    loadProducts();
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
const currentYear = new Date().getFullYear();
const startYear = 2018;
const nam = Array.from({ length: currentYear - startYear + 1 }, (_, i) => ({ name: (startYear + i).toString() }));

const loadThang = ref([]);
const thang = [{ name: '01' }, { name: '02' }, { name: '03' }, { name: '04' }, { name: '05' }, { name: '06' }, { name: '07' }, { name: '08' }, { name: '09' }, { name: '10' }, { name: '11' }, { name: '12' }];
const vNam = ref();
const vThang = ref();

const chartLoai = ref();
const chartOptionsLoai = ref();
const chartThuongHieu = ref();
const chartOptionsThuongHieu = ref();

const chartData = ref();
const chartOptions = ref();

const chartDataSPCao = ref();
const chartOptionsSPCao = ref();

const chartDataSPThap = ref();
const chartOptionsSPThap = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const tongTien = {};
    const tongTienNam = {};
    const namHienTai = [];
    const namTruoc = [];
    for (const o of lstAdminThongKeThangNamResponses.value) {
        tongTienNam[o.thang] = o.tongTien;
        namTruoc.push(o.nam);

    }
    for (const o of lstAdminThongKeThangResponses.value) {
        tongTien[o.thang] = o.tongTien;
        namHienTai.push(o.nam);
    }

    const thang = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const dataTongTien = thang.map(t => tongTien[t] || 0);
    const dataTongTienNam = thang.map(t => tongTienNam[t] || 0)

    return {
        labels: thang,
        datasets: [
            {
                label: namTruoc[0] ? namTruoc[0] : '',
                data: dataTongTienNam,
                fill: false,
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                tension: 0.4
            },
            {
                label: namHienTai[0] ? namHienTai[0] : '',
                data: dataTongTien,
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
    const ten = [];
    const tongTien = [];

    for (const o of lstAdminThongKeLoaiResponses.value) {
        ten.push(o.ten);
        tongTien.push(o.tongTien);
    }
    return {
        datasets: [
            {
                data: tongTien,
                backgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                    documentStyle.getPropertyValue('--bluegray-500'),

                ],
                label: 'My dataset'
            }
        ],
        labels: ten
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
};
const setChartThuongHieu = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const ten = [];
    const tongTien = [];
    // console.log(lstAdminThongKeThuongHieuResponses.value)
    for (const o of lstAdminThongKeThuongHieuResponses.value) {
        ten.push(o.ten);
        tongTien.push(o.tongTien);
    }
    return {
        datasets: [
            {
                data: tongTien,
                backgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                    documentStyle.getPropertyValue('--bluegray-500'),

                ],
                label: 'My dataset'
            }
        ],
        labels: ten
    };
};
const setChartOptionsThuongHieu = () => {
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
};

const setChartDataSpCao = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const ten = [];
    const tongTien = [];
    for (const o of lstAdminThongKeSanPhamCaoResponses.value) {
        ten.push(o.ma);
        tongTien.push(o.tongTien);
    }
    return {
        labels: ten,
        datasets: [
            {
                label: 'doanh thu',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: tongTien
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
    const ten = [];
    const tongTien = [];
    for (const o of lstAdminThongKeSanPhamThapResponses.value) {
        ten.push(o.ma);
        tongTien.push(o.tongTien);
    }
    return {
        labels: ten,
        datasets: [
            {
                label: 'doanh thu',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: tongTien
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
