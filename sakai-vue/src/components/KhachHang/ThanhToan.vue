<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/service/KhachHang/GioHang/useCartStore.js';
import { useDiaChi } from '@/service/KhachHang/DiaChiService.js';
import { phiShipStore } from '@/service/KhachHang/PhiGiaoHangService.js';
import { checkoutStore } from '@/service/KhachHang/HoaDonService.js';
import { voucherStore } from '@/service/KhachHang/KHVoucherService.js';
import tokenService from '@/service/Authentication/TokenService.js';
import userKHService from '@/service/KhachHang/UserService.js';
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
// import {userStore} from '@/service/KhachHang/UserService.js';
import { useRouter } from 'vue-router';
const toast = useToast();
const router = useRouter();
const checkoutService = checkoutStore();
const store = useCartStore();
const voucherService = voucherStore();
const diaChiService = useDiaChi();
const phiGiaoHangService = phiShipStore();
const selectedVoucher = ref([]);
const giamGia = ref();
const tongThanhToan = ref();
// const userKHService = userStore();
const selectedCity = ref();
const diaChi = ref();
const phiShip = ref();
const dataVoucher = ref([]);
const phuongThucThanhToan = ref(2);

// const selectedProducts = ref([]);
// const tongTien = ref(0);
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

const route = useRoute();
const selectedProducts = store.selectedProducts;
const dataGHCT = ref([]);
const loaddataGHCT = () => {
    dataGHCT.value = selectedProducts;
    
};
onMounted(async () => {
    await loadUser();
    loaddataGHCT();
    loadDataVoucher();
   
});

const tinhTongTienChoTungSanPham = (soLuong, giaSauGiam, giaBan) => {
    if (giaSauGiam === '' || giaSauGiam === null) {
        return soLuong * giaBan;
    } else {
        return soLuong * giaSauGiam;
    }
};

const tongTien = ref(0);

// Phương thức tính tổng giá trị
const calculateTotalAmount = () => {
    tongTien.value = dataGHCT.value.reduce((total, item) => {
        return total + tinhTongTienChoTungSanPham(item.soLuong, item.giaSPSauGiam, item.giaBan);
    }, 0);
};

// Theo dõi thay đổi trong dataGHCT và tính tổng lại khi có sự thay đổi
watchEffect(() => {
    calculateTotalAmount();
});

const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const loadUser = async () => {
    const token = localStorage.getItem('token');
    const userName = await tokenService.getUserNameByToken(token);

    const user = await userKHService.getUserByUsername(userName);

    await diaChiService.fetchAllDiaChi(user.id);
    diaChi.value = diaChiService.diaChi;

    await phiGiaoHangService.phiShip(diaChi.value);
    phiShip.value = phiGiaoHangService.phiShip;

    return diaChi.value;
};

const diaChiDialog = ref(false);

const editDiaChi = () => {
    diaChiDialog.value = true;
};

const saveDiaChi = () => {
    diaChiDialog.value = false;
};

const dataHoaDon = ref([]);
const thanhtoan = async () => {
    const token = localStorage.getItem('token');
    const userName = await tokenService.getUserNameByToken(token);

    const user = await userKHService.getUserByUsername(userName);

    const forms = dataGHCT.value.map((item) => {
        return {
            idCTSP: item.idCTSP,
            soLuong: item.soLuong,
            donGia: tongThanhToan.value
        };
    });
    const form = {
        tongTien: tongTien.value,
        tienShip: phiShip.value,
        idPayMethod: parseInt(phuongThucThanhToan.value),
        idUser: user.id,
        listHDCT: forms
    };

    await checkoutService.checkout(form);
    dataHoaDon.value = checkoutService.checkOut;
    toast.add({ severity: 'success', summary: '', detail: 'Thanh toán thành công', life: 3000 });
    router.push('/gio-hang');
};

const selectedVoucherDialog = ref(false);

const selectVoucher = () => {
    selectedVoucherDialog.value = true;
};

const loadDataVoucher = async () => {
    await voucherService.getListVoucher();
    dataVoucher.value = voucherService.data;
};

const formatDate = (dateTime) => {
    return format(new Date(dateTime), 'yyyy/MM/dd');
};

const applyVoucher = () => {

    giamGia.value = selectedVoucher.value.giamToiDa;
    tongThanhToan.value = tongTien.value+phiShip.value-giamGia.value;
    toast.add({ severity: 'success', summary: '', detail: 'Áp dụng voucher thành công', life: 3000 });
    selectedVoucherDialog.value = false;

};

const hideDialog = () => {
    selectedVoucherDialog.value = false;
}
</script>
<template>
    <div class="card">
        <div class="grid">
            <div class="flex">
                <!-- Cột trái -->
                <div class="p-col-5">
                    <div class="trai">
                        <h5>THÔNG TIN THANH TOÁN</h5>

                        <h4 style="color: red"><i class="pi pi-user" style="margin-right: 15px"></i> Địa chỉ nhận hàng</h4>

                        <p style="font-weight: bold">{{ diaChi?.user?.ten }} - {{ diaChi?.user?.sdt }}</p>
                        <p>
                            {{ diaChi?.diaChi }}, {{ diaChi?.tenphuongXa }}, {{ diaChi?.tenQuanHuyen }}, {{ diaChi?.tenTinhThanh }}

                            <label style="color: blue; margin-left: 50px; font-size: 15px; font-weight: bold" @click="editDiaChi">Thay đổi</label>
                        </p>

                        <Dialog v-model:visible="diaChiDialog" modal header="Header" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                            <template #header>
                                <div class="inline-flex align-items-center justify-content-center gap-2">
                                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                                    <span class="font-bold white-space-nowrap">Amy Elsner</span>
                                </div>
                            </template>
                            <p class="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                                id est laborum.
                            </p>
                            <template #footer>
                                <Button label="Xác nhận" icon="pi pi-check" @click="saveDiaChi" autofocus />
                            </template>
                        </Dialog>

                        <Textarea v-model="value" rows="4" cols="87" style="margin-top: 25px" placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay địa điểm giao hàng chi tiết hơn" />
                    </div>
                </div>
                <!-- cột phải -->
                <div class="p-col-7">
                    <div class="phai">
                        <div class="card">
                            <h5>ĐƠN HÀNG CỦA BẠN</h5>
                            <DataTable
                                :value="dataGHCT"
                                dataKey="id"
                                :filters="filters"
                                paginatorTemplate="FirstPageLink Pr
                            evPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            >
                                <Column field="code" header="Sản phẩm" headerStyle="width:38%; min-width:14rem;">
                                    <template #body="slotProps">
                                        <img :src="slotProps.data.anh" alt="Ảnh sản phẩm" class="shadow-2" width="50" />
                                        <span style="margin-left: 10px">{{ slotProps.data.tenSP }}</span>
                                    </template>
                                </Column>

                                <Column field="code" header="Phân loại hàng" headerStyle="width:10%; min-width:5rem;">
                                    <template #body="slotProps">
                                        <div style="width: 100px">
                                            <!-- <p v-if="slotProps.data.soLuongTon != 0">Phân loại hàng:</p> -->
                                            <p style="font-size: 13px; margin-top: -10px">{{ slotProps.data.tenMauSac }}, {{ slotProps.data.tenSize }}</p>
                                        </div>
                                    </template>
                                </Column>

                                <Column field="tenSP" header="Đơn giá" headerStyle="width:14%; min-width:5rem;">
                                    <template #body="slotProps">
                                        <div style="display: block">
                                            <div>{{ formatCurrency(slotProps.data.giaSPSauGiam) }}</div>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="name" header="Số lượng" headerStyle="width:15%; min-width:5rem;">
                                    <template #body="slotProps">
                                        <div class="quantity">
                                            <span>{{ slotProps.data.soLuong }}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="giaBan" header="Tổng tiền" headerStyle="min-width:5rem;">
                                    <template #body="slotProps">
                                        <span class="p-column-title">Code</span>
                                        <p style="font-size: 15px; color: red">
                                            {{ formatCurrency(tinhTongTienChoTungSanPham(slotProps.data.soLuong, slotProps.data.giaSPSauGiam, slotProps.data.giaBan)) }}
                                        </p>
                                    </template>
                                </Column>
                            </DataTable>

                            <Divider style="margin-bottom: 10px" />
                            <div class="flex">
                                <div class="p-col-6">
                                    <div class="flex-container">
                                        <h6>Tổng tiền hàng</h6>
                                    </div>
                                </div>
                                <div class="p-col-6" style="margin-left: 470px">
                                    <h6 style="height: 20px; width: 80px">{{ formatCurrency(tongTien) }}</h6>
                                </div>
                            </div>
                            <Divider style="margin-top: -10px" />
                            <h6 style="margin-top: 10px">Giao hàng</h6>
                            <!-- <span style="font-weight: bold; margin-bottom: 15px;"><input type="radio" name="shipping" value="fast" /> Giao hàng miễn phí</span> -->
                            <label>
                                <input type="radio" name="shipping" value="free" /> Phí giao nhanh:
                                <span style="margin-left: 470px; font-weight: bold"> {{ formatCurrency(phiShip) }}</span>
                            </label>
                            <Divider />

                            <div class="flex">
                                <div class="p-col-6">
                                    <div class="flex-container">
                                        <h6>Voucher</h6>
                                    </div>
                                </div>
                                <div class="p-col-6" style="margin-left: 490px; margin-bottom: 10px">
                                    <span style="color: blue" @click="selectVoucher">Chọn voucher</span>
                                </div>
                            </div>

                            <Dialog v-model:visible="selectedVoucherDialog" header="Flex Scroll" :style="{ width: '50vw' }" maximizable modal :contentStyle="{ height: '300px' }" class="p-fluid">
                                <template #header>
                                    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                        <h5 class="m-0">Voucher</h5>
                                    </div>
                                </template>
                                <div class="card p-fluid">
                                    <DataTable
                                        :value="dataVoucher"
                                        v-model:selection="selectedVoucher"
                                        paginator
                                        :rows="5"
                                        :rowsPerPageOptions="[5, 10, 20, 50]"
                                        tableStyle="min-width: 40rem"
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                        responsiveLayout="scroll"
                                    >
                                        <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                                        <Column field="ten" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                            <template #body="slotProps">
                                                <span class="p-column-title">Tên</span>
                                                {{ slotProps.data.ten }}
                                            </template>
                                        </Column>
                                        <Column field="giamToiDa" header="Giảm Tối Đa" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                                            <template #body="slotProps">
                                                <span class="p-column-title">Giảm Tối Đa</span>
                                                {{ slotProps.data.giamToiDa }}
                                            </template>
                                        </Column>
                                        <Column field="moTa" header="Mô Tả" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                                            <template #body="slotProps">
                                                <span class="p-column-title">Mô Tả</span>
                                                {{ slotProps.data.moTa }}
                                            </template>
                                        </Column>
                                        <Column header="Ngày Kết Thúc" filterField="date" dataType="date" headerStyle="width:14%; min-width:8rem;">
                                            <template #body="{ data }">
                                                {{ formatDate(data.thoiGianKetThuc) }}
                                            </template>
                                            <template #filter="{ filterModel }">
                                                <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                                            </template>
                                        </Column>
                                        <Column field="soLuong" header="Số Lượng" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                                            <template #body="slotProps">
                                                <span class="p-column-title">Số Lượng</span>
                                                {{ slotProps.data.soLuong }}
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>

                                <template #footer>
                                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                    <Button label="Save" icon="pi pi-check" @click="applyVoucher" />
                                </template>
                            </Dialog>

                            <div class="flex">
                                <div class="p-col-6">
                                    <div class="flex-container">
                                        <h6>Giảm giá</h6>
                                    </div>
                                </div>
                                <div class="p-col-6" style="margin-left: 520px">
                                    <h6 style="height: 20px; width: 80px">{{ formatCurrency(giamGia) }} <span></span></h6>
                                </div>
                            </div>



                            <div class="flex">
                                <div class="p-col-6">
                                    <div class="flex-container">
                                        <h6>Tổng thanh toán</h6>
                                    </div>
                                </div>
                                <div class="p-col-6" style="margin-left: 470px">
                                    <h6 style="height: 20px; width: 80px">{{ formatCurrency(tongThanhToan) }} <span></span></h6>
                                </div>
                            </div>
                            <Divider style="margin-top: -10px" />
                            <span style="font-weight: bold">
                                <input type="radio" id="chuyenkhoan" value="1" v-model="phuongThucThanhToan" />

                                Payment Credit Card / Visa / Master Card / Amex</span
                            >
                            <br />

                            <Divider style="margin-top: -10px" />
                            <span style="font-weight: bold">
                                <input type="radio" id="tienmat" value="2" v-model="phuongThucThanhToan" />
                                Trả tiền mặt khi nhận hàng</span
                            >
                            <br />
                            <!-- <div class="p-inputgroup flex-1">
                                <InputText placeholder="Mã ưu đãi" />
                                <Button label="Áp dụng" severity="warning" />
                            </div> -->
                            <br />
                            <span> <input type="checkbox" id="agreeCheckbox" /> Tôi đã đọc và đồng ý với điều khoản và điều kiện của website * </span>
                            <br />
                            <Button label="Đặt hàng" severity="danger" @click="thanhtoan" />
                            <br />
                            <label for="">Bộ phận CSKH sẽ liên hệ bạn qua số điện thoại để xác nhận đơn hàng.</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.grid {
    /* margin-top: 70px; */
    /* position: absolute;
    top: 0;
    left: 0;
    right: 0; */
    margin: auto;
    margin-top: 70px;
    margin-bottom: 30px;
    width: 1100px;
    /* background: white; */
    display: flex;
    justify-content: center;
    /* align-items: center; */
}
.trai {
    padding: 20px 20px 30px 20px;
    width: 630px;
    /* height: 300px; */
    background: white;
    margin-right: 20px;
    border-radius: 10px;
}

.phai {
    padding: 20px 20px 30px 20px;
    margin-top: 30px;
    width: 755px;
    background: white;
    /* height: 400px; */
    border-radius: 10px;
}

.flex-container {
    display: flex;
}

span {
    font-weight: bold;
}
</style>
