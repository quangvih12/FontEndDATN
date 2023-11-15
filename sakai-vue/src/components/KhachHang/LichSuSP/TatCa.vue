<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount, onMounted } from 'vue';
import { HDKHStore } from '../../../service/KhachHang/HoaDonKHService';
import DetailHoaDon from './TrangThaiDonHang.vue';
import { useRouter } from 'vue-router';
import { gioHangStore } from '../../../service/KhachHang/Giohang/GiohangCTService';

const router = useRouter();

const redirectToTrangThaiDonHang = (idHDA) => {
    // Chuyển hướng đến trang trang-thai-don-hang và truyền ID của hóa đơn qua URL
    router.push({ name: 'trangThaiDonHang', params: { id: idHDA } });
};
const gioHangService = gioHangStore();
const useHD = HDKHStore();
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
    const token = localStorage.getItem('token');
    if (token.length > 0 || token != null) {
        await useHD.fetchData(token);
        data.value = useHD.dataAll;
    }
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
        return { text: 'Đang giao', severity: 'help' };
    } else if (trangThai == 7) {
        return { text: 'Yêu cầu đổi trả ', severity: 'warning' };
    } else if (trangThai == 9) {
        return { text: 'Yêu cầu đổi trả thất bại', severity: 'warning' };
    } else {
        return { text: 'Xác nhận đổi trả thành công', severity: 'success' };
    }
};

const goToProductDetail = (productId) => {
    router.push({ name: 'ProductDetail', params: { id: productId } });
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
    { field: 'tenNguoiNhan', header: 'Tên người nhận' },
    { field: 'tongTien', header: 'Tổng tiền' },
    { field: 'tienSauKhiGiam', header: 'Tiền sau giảm' }
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
    return parseInt(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const muaLaiDialog = ref(false);
const dataSP = ref([]);
const showDialogMuaLai = async (idHD) => {
    dataSP.value = await useHD.findHdctByIdHd(idHD);
    muaLaiDialog.value = true;
};

const addCart = async (soLuong, idCTSP) => {
    const cartItem = {
        soLuong: soLuong,
        sanPhamChiTiet: idCTSP
    };
    const token = localStorage.getItem('token');

    await gioHangService.addToCart(cartItem, token);
    router.push({ name: 'gio-hang' });

};
</script>

<template>
    <div v-for="(hd, index) in data" :key="index">
        <div style="width: 1060px; background: rgb(255, 255, 255); ">

            <div style="width: 1060px; background: rgb(252, 246, 246);  ">
                <div class="flex">
                    <div style="margin-top: 10px; display: flex;">
                        <svg width="17" height="16" viewBox="0 0 17 16" class="_0RxYUS"
                            style="margin-top: 2px; margin-right: 10px; margin-left: 10px;">
                            <title>Shop Icon</title>
                            <path
                                d="M1.95 6.6c.156.804.7 1.867 1.357 1.867.654 0 1.43 0 1.43-.933h.932s0 .933 1.155.933c1.176 0 1.15-.933 1.15-.933h.984s-.027.933 1.148.933c1.157 0 1.15-.933 1.15-.933h.94s0 .933 1.43.933c1.368 0 1.356-1.867 1.356-1.867H1.95zm11.49-4.666H3.493L2.248 5.667h12.437L13.44 1.934zM2.853 14.066h11.22l-.01-4.782c-.148.02-.295.042-.465.042-.7 0-1.436-.324-1.866-.86-.376.53-.88.86-1.622.86-.667 0-1.255-.417-1.64-.86-.39.443-.976.86-1.643.86-.74 0-1.246-.33-1.623-.86-.43.536-1.195.86-1.895.86-.152 0-.297-.02-.436-.05l-.018 4.79zM14.996 12.2v.933L14.984 15H1.94l-.002-1.867V8.84C1.355 8.306 1.003 7.456 1 6.6L2.87 1h11.193l1.866 5.6c0 .943-.225 1.876-.934 2.39v3.21z"
                                stroke-width=".3" stroke="#333" fill="#333" fill-rule="evenodd"></path>
                        </svg>
                        <h5 style="font-weight: 700;margin-top: -2px;">cửa hàng VNK</h5>
                    </div>
                    <div style="margin-left: 100px; font-size: 15px;margin-top: 10px; margin-right: 50px;">
                        <label for="">Mã đơn hàng: <span>{{ hd.maHD }} </span></label>
                        <span> | </span>
                        <label for="" style="color: red">{{ hienThiTrangThai(hd.trangThai).text }}</label>
                    </div>
                    <!-- <div style="margin-left: 10px">
                        <span> | </span>
                        <label for="" style="color: red; margin-left: 10px">{{ hienThiTrangThai(dataHD.trangThai).text }}</label>
                    </div> -->
                </div>

            </div>
            <Divider />
            <div v-for="(sp, index) in hd.sanPhamChiTiet" :key="index">
                <div style="width: 1060px; background: rgb(255, 255, 255); height: 120px; margin-top: 10px;">
                    <div class="flex">
                        <div style="margin-left: 20px; margin-top: 20px;">
                            <Image :src="sp.anh" alt="Image" width="90" preview />
                        </div>
                        <div class="product-details" style="margin-top: 10px; margin-left: 20px;">
                            <h5 class="flex details">{{ sp.tenSP }}</h5>
                            <div class="flex details">
                                <div>
                                    <p>
                                        Phân loại: <span>{{ sp.tenMauSac }}</span> <span
                                            v-if="sp.tenSize !== '' || sp.tenSize !== null">,{{ sp.tenSize }}</span>
                                    </p>
                                    <p>
                                    </p>
                                    <p>
                                        Số lượng: <span>{{ sp.soLuong }}</span>
                                    </p>
                                </div>
                                <div class="price">
                                    <h4 style="color: rgb(7, 6, 6); margin-left: -130px; margin-top: -20px;">{{
                                        formatCurrency(sp.donGia) }}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            <div style="width: 1060px; background: rgb(29, 23, 23);">
                <div style="display: flex; width: 100%; background: rgb(255, 255, 255);">
                    <div style="background: rgb(255, 255, 255);width: 30%; height: 100px; margin-top: ;">
                        <h5 style="color: rgb(253, 1, 1);margin-top: 30px;margin-left: -50px; margin-bottom: 20px;">Thành
                            tiền: <span>{{ formatCurrency(hd.tongTien) }}</span> </h5>
                    </div>

                    <div style="display: flex;justify-content: flex-end; width: 70%;">

                        <div style=" height: 100%; margin-top: 30px;">

                            <Button type="button" :disabled="hd.trangThai == 2 || hd.trangThai == 5 || hd.trangThai == 7"
                                label="Mua lại" style="width: 100px;margin-right: 10px; "
                                @click="showDialogMuaLai(hd.idHD)" />
                            <Button severity="secondary" label="Xem chi tiết" style="width: 150px"
                                @click="redirectToTrangThaiDonHang(hd.idHD)" />
                        </div>

                    </div>
                </div>




            </div>
        </div>
    </div>

    <Dialog v-model:visible="muaLaiDialog" :style="{ width: '550px' }" header="Thêm vào giỏ hàng" :modal="true">
        <div class="card">


            <div v-for="(sp, index) in dataSP" :key="index">
                <div style="width: 300px; background: rgb(255, 255, 255); height: 120px; margin-top: 0px;">
                    <div class="flex" style="width: 450px;  background: rgb(255, 255, 255);">
                        <div style="margin-left: 20px; margin-top: 20px;">
                            <Image :src="sp.anh" alt="Image" width="90" preview />
                        </div>
                        <div class="product-details"
                            style="margin-top: 10px; margin-left: 20px; background: rgb(255, 255, 255);">
                            <h5 class="flex details">{{ sp.tenSP }}</h5>
                            <div class="flex details" style=" width: 250px;">
                                <div style="display: flex;">
                                    <p style="margin-right: 0px;">
                                        Phân loại: <span>{{ sp.tenMauSac }}</span> <span
                                            v-if="sp.tenSize !== '' || sp.tenSize !== null">,{{ sp.tenSize }}</span>
                                    </p>
                                    <p style="margin-left: 40px;" v-if="sp.soLuongTon < sp.soLuong">
                                        Hết hàng
                                    </p>
                                    <p style="margin-left: 40px;" v-if="sp.soLuongTon > sp.soLuong">
                                        x <span>{{ sp.soLuong }}</span>
                                    </p>
                                </div>

                            </div>

                        </div>
                        <Button icon="pi pi-shopping-cart" class="p-button-rounded p-button-warning mt-2" style=""
                            @click="addCart(sp.soLuong, sp.idSPCT)" :disabled="sp.soLuongTon < sp.soLuong" />
                    </div>
                </div>
            </div>

        </div>
        <template #footer>
            <Button label="Đóng" icon="pi pi-times" class="p-button-text" @click="muaLaiDialog = false" />
        </template>
    </Dialog>
</template>

<style scoped>
.sreach {
    margin-bottom: 10px;
}

.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.product-details {
    flex: 1;
    /* Để cho phần tử này mở rộng và lấp đầy khoảng trống trong flex container */
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
    background: rgb(19, 111, 224);
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
    vertical-align: middle;
    /* Điều chỉnh vị trí của icon theo chiều dọc */
}

.san-pham::after {
    content: '';
    width: 100%;
    height: 1px;
    /* Độ dày của dấu gạch ngang */
    background-color: black;
    /* Màu sắc của dấu gạch ngang */
    position: absolute;
    bottom: 0;
}

.hoan-thanh {
    color: red;
    /* Đặt màu cam cho chữ HOÀN THÀNH */
}

.giao-thanh-cong {
    color: gray;
    /* Đặt màu ghi cho chữ Đơn hàng đã được giao thành công */
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
    width: 150px;
    /* Điều chỉnh kích thước của ảnh */
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
