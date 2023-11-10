<script setup>
import { ref, onMounted, watch } from 'vue';
import Divider from 'primevue/divider';
import { da } from 'date-fns/locale';
import { HDStore } from '../../../service/Admin/HoaDon/HoaDonService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const useHD = HDStore();
const productDialog = ref(false);
const code = ref('');
const dataHDCT = ref([]);

//nhận dữ liệu từ cha
const props = defineProps({
    myProp: {}
});

// onMounted(() => {
//     code.value = props.myProp;
// });
// mở form
const editProduct = () => {
    code.value = 'Hoá đơn: ' + props.myProp.maHD;
    productDialog.value = true;
    loadDataHDCT(props.myProp.idHD);
};

const ngayDat = ref('');
const ngayThanhToan = ref('');
const ngayGiao = ref('');
const ngayNhan = ref('');

onMounted(() => {
    ngayDat.value = props.myProp.ngayTao;
    ngayThanhToan.value = props.myProp.ngayThanhToan;
    ngayGiao.value = props.myProp.ngayShip;
    ngayNhan.value = props.myProp.ngayNhan;
});

const events = ref([
    { status: 'Ngày đã đặt', date: ngayDat, icon: 'pi pi-wallet', color: '#9C27B0' },
    { status: 'Ngày đã thanh toán', date: ngayThanhToan, icon: 'pi pi-money-bill', color: '#673AB7' },
    { status: 'Đã giao cho ĐVVC', date: ngayGiao, icon: 'pi pi-car', color: '#FF9800' },
    { status: 'Đã nhận được hàng', date: ngayNhan, icon: 'pi pi-box', color: '#607D8B' },
    { status: 'Đánh giá', date: '17/10/2020', icon: 'pi pi-star', color: '#F55C3B' }
]);

const loadDataHDCT = async (idHD) => {
    const respone = await useHD.findHdctByIdHd(idHD);
    dataHDCT.value = respone;
};

const tinhTongTien = (tienShip, tongTien) => {
    return parseInt(tienShip) + parseInt(tongTien);
};
const formatCurrency = (value) => {
    return parseInt(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const hienTimeLine = (value) => {
    if (parseInt(value) == 0 || parseInt(value) == 5 || parseInt(value) == 3) {
        return true;
    } else {
        return false;
    }
};

const exportToPDF = () => {
    const content = document.getElementById('pdf-content');
    html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('hoa-don.pdf');
    });
};
</script>
<template>
    <Button label="Xem" class="p-button-outlined p-button-info mr-2 mb-2" @click="editProduct()" />
    <Dialog v-model:visible="productDialog" :style="{ width: '1020px' }" :header="code" :modal="true" class="p-fluid">
        <div class="flex">
            <div class="p-col-12" style="text-align: center">
                <div class="bills-col">
                    <div id="pdf-content" class="card p-fluid" style="background: #ffffff">
                        <div>
                            <h3>Shop...</h3>
                            <label>139 Cầu Giấy, Phường Quan Hoa, Hà Nội</label>
                            <h5>Hóa đơn thanh toán</h5>
                        </div>
                        <div v-if="hienTimeLine(props.myProp.trangThai)">
                            <Timeline :value="events" layout="horizontal" align="bottom" class="customized-timeline">
                                <template #marker="slotProps">
                                    <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" :style="{ backgroundColor: slotProps.item.color }">
                                        <i :class="slotProps.item.icon"></i>
                                    </span>
                                </template>
                                <template #opposite="slotProps">
                                    <small class="p-text-secondary">{{ slotProps.item.date }}</small>
                                </template>
                                <template #content="slotProps">
                                    {{ slotProps.item.status }}
                                </template>
                            </Timeline>
                        </div>
                        <hr />
                        <table>
                            <tr>
                                <th>Stt</th>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Màu săc</th>
                                <th>Size</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                            <hr />
                            <tr v-for="(item, index) in dataHDCT" :key="index">
                                <td style="width: 30px">{{ index + 1 }}</td>
                                <td style="width: 20%"><img :src="item.anh" style="width: 50%" alt="HoaDon Image" /></td>
                                <td>{{ item.tenSP }}</td>
                                <td>{{ item.tenMauSac }}</td>
                                <td>{{ item.tenSize == null ? 'Không có' : item.tenSize }}</td>
                                <td>{{ item.soLuong }}</td>
                                <td>{{ formatCurrency(item.donGia) }}</td>
                                <td>{{ formatCurrency(item.soLuong * item.donGia) }}</td>
                            </tr>
                        </table>
                        <hr />
                        <div class="flex">
                            <div class="p-col-6" style="width: 100%">
                                <div class="row flex">
                                    <div class="flex" style="min-width: 200px">
                                        <p>Địa chỉ:</p>
                                        <p>{{ props.myProp.diaChiCuThe }}, {{ props.myProp.tenPhuongXa }}, {{ props.myProp.tenQuanHuyen }}, {{ props.myProp.tenTinhThanh }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="p-col-6" style="width: 100%">
                                <div class="ben-phai">
                                    <p>Tổng tiền các sản phẩm: {{ formatCurrency(props.myProp.tongTien) }}</p>
                                    <p>Phí vận chuyển: {{ formatCurrency(props.myProp.tienShip) }}</p>
                                    <p>
                                        Tổng tiền: <span style="color: #ff3333; font-size: 20px; font-weight: bold">{{ formatCurrency(tinhTongTien(props.myProp.tienShip, props.myProp.tongTien)) }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <label>Chúc quý khách vui vẻ! Hẹn gặp lại!</label>
                    </div>
                    <Button label="Xuất hóa đơn" severity="danger" @click="exportToPDF" />
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.ben-phai {
    text-align: right;
}
</style>
