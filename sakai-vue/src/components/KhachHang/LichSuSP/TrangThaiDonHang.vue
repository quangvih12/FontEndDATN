<script setup>
import { ref, onMounted, watch } from 'vue';
import Timeline from 'primevue/timeline';
import { useRoute } from 'vue-router';
import { HDKHStore } from '../../../service/KhachHang/HoaDonKHService';

const router = useRoute();
const useHD = HDKHStore();
const idHD = router.params.id;
const dataSP = ref([]);
const dataHD = ref({});
onMounted(() => {
    loadData();
    loadDataHD();
});
const loadData = async () => {
    dataSP.value = await useHD.findHdctByIdHd(idHD);
};

const loadDataHD = async () => {
    dataHD.value = await useHD.findHdByIdHd(idHD);
    console.log(dataHD.value);
};

const ngayDat = ref('');
const ngayThanhToan = ref('');
const ngayGiao = ref('');
const ngayNhan = ref('');
watch(dataHD, (newVal) => {
    ngayDat.value = dataHD.value.ngayTao;
    ngayThanhToan.value = dataHD.value.ngayThanhToan;
    ngayGiao.value = dataHD.value.ngayShip;
    ngayNhan.value = dataHD.value.ngayNhan;
});

const events = ref([
    { status: 'Ngày đã đặt', date: ngayDat, icon: 'pi pi-wallet', color: '#9C27B0' },
    { status: 'Ngày đã thanh toán', date: ngayThanhToan, icon: 'pi pi-money-bill', color: '#673AB7' },
    { status: 'Đã giao cho ĐVVC', date: ngayGiao, icon: 'pi pi-car', color: '#FF9800' },
    { status: 'Đã nhận được hàng', date: ngayNhan, icon: 'pi pi-box', color: '#607D8B' },
    { status: 'Đánh giá', date: '17/10/2020', icon: 'pi pi-star', color: '#F55C3B' }
]);

const tinhTongTien = (tienShip, tongTien) => {
    return parseInt(tienShip) + parseInt(tongTien);
};
const formatCurrency = (value) => {
    return parseInt(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const hienThiTrangThai = (trangThai) => {
    if (parseInt(trangThai) == 0) {
        return { text: 'Đã hủy', severity: 'danger' };
    } else if (parseInt(trangThai) == 1) {
        return { text: 'Chờ thanh toán', severity: 'secondary' };
    } else if (parseInt(trangThai) == 2) {
        return { text: 'Yêu cầu xác nhận', severity: 'success' };
    } else if (parseInt(trangThai) == 3) {
        return { text: 'Hoàn thành', severity: 'info' };
    } else if (parseInt(trangThai) == 4) {
        return { text: 'Đang chuẩn bị hàng', severity: 'success' };
    } else if (parseInt(trangThai) == 5) {
        return { text: 'Đang giao', severity: 'help' };
    } else if (parseInt(trangThai) == 6) {
        return { text: 'Yêu cầu đổi trả', severity: 'warning' };
    } else {
        return { text: 'Xác nhận đổi trả', severity: 'success' };
    }
};
</script>
<template>
    <div class="container">
        <div class="card">
            <div>
                <div class="flex">
                    <div>
                        <h3>Trạng thái đơn hàng</h3>
                    </div>
                    <div style="margin-left: 600px; font-size: 18px">
                        <label for=""
                            >Mã đơn hàng: <span> {{ dataHD.maHD }} </span></label
                        >
                        <span> | </span>
                        <label for="" style="color: red">{{ hienThiTrangThai(dataHD.trangThai).text }}</label>
                    </div>
                    <!-- <div style="margin-left: 10px">
                        <span> | </span>
                        <label for="" style="color: red; margin-left: 10px">{{ hienThiTrangThai(dataHD.trangThai).text }}</label>
                    </div> -->
                </div>
                <div>
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
                <Divider />
                <div class="flex">
                    <div>
                        <p>Cảm ơn bạn đã mua sắm tại VNK!</p>
                    </div>
                    <div style="margin-left: 600px">
                        <Button type="button" label="Liên hệ" icon="pi pi-users" badgeClass="p-badge-danger" style="width: 200px; margin-left: 20px" outlined />
                    </div>
                </div>
                <Divider />
                <div v-for="(hdct, index) in dataSP" :key="index">
                    <div class="flex">
                        <div>
                            <Image :src="hdct.anh" alt="Image" width="150" preview />
                        </div>
                        <div class="product-details">
                            <h5 class="flex details">{{ hdct.tenSP }}</h5>
                            <div class="flex details">
                                <div>
                                    <p>
                                        Size: <span>{{ hdct.tenSize }}</span>
                                    </p>
                                    <p>
                                        Màu sắc: <span>{{ hdct.tenMS }}</span>
                                    </p>
                                    <p>
                                        Số lượng: x<span>{{ hdct.soLuong }}</span>
                                    </p>
                                </div>
                                <div class="price">
                                    <h6 style="color: red">{{ formatCurrency(hdct.giaBan) }}</h6>
                                    <Button type="button" label="Mua lại" style="width: 200px" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider />
                </div>

                <div class="flex">
                    <div>
                        <h4>Địa chỉ nhận hàng</h4>
                        <p>{{ dataHD.tenNguoiNhan }}</p>
                        <p>{{ dataHD.sdt }}</p>
                        <p>{{ dataHD.diaChiCuThe }}, {{ dataHD.tenPhuongXa }}, {{ dataHD.tenQuanHuyen }}, {{ dataHD.tenTinhThanh }}</p>
                    </div>
                    <div class="c2">
                        <p>Tổng tiền hàng</p>
                        <p>Phí vận chuyển</p>

                        <p>Thành tiền</p>
                    </div>
                    <div class="c2">
                        <p>{{ formatCurrency(dataHD.tongTien) }}</p>
                        <p>{{ formatCurrency(dataHD.tienShip) }}</p>

                        <p style="font-weight: bold; color: red">{{ formatCurrency(tinhTongTien(dataHD.tienShip, dataHD.tongTien)) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container {
    margin-top: 80px;
}

.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.product-details {
    flex: 1; /* Để cho phần tử này mở rộng và lấp đầy khoảng trống trong flex container */
}

.details {
    margin-left: 20px; /* Khoảng cách giữa thông tin sản phẩm và giá tiền */
}

.price {
    text-align: right; /* Đặt giá tiền ở bên phải */
}
</style>
