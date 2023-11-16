<script setup>
import { ref, onMounted, watch } from 'vue';
import { useForm, useField } from 'vee-validate';
import Divider from 'primevue/divider';
import { da } from 'date-fns/locale';
import { HDStore } from '../../../service/Admin/HoaDon/HoaDonService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const useHD = HDStore();
const productDialog = ref(false);
const code = ref('');
const dataHDCT = ref([]);
const idHD = ref(null);

//nhận dữ liệu từ cha
const props = defineProps({
    myProp: {}
});

// onMounted(() => {
//     code.value = props.myProp;
// });
// mở form
const editProduct = () => {
    console.log(props.myProp);
    code.value = 'Hoá đơn: ' + props.myProp.maHD;
    productDialog.value = true;
    loadDataHDCT(props.myProp.idHD);
    ngayDat.value = props.myProp.ngayTao;
    ngayThanhToan.value = props.myProp.ngayThanhToan;
    ngayGiao.value = props.myProp.ngayShip;
    ngayNhan.value = props.myProp.ngayNhan;
};

const ngayDat = ref('');
const ngayThanhToan = ref('');
const ngayGiao = ref('');
const ngayNhan = ref('');

onMounted(() => {});

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
const HienLyDoHuy = (value) => {
    if (parseInt(value) == 0) {
        return true;
    } else {
        return false;
    }
};

const HienLyDoHuyDoiTra = (value) => {
    if (parseInt(value) == 9 || parseInt(value) == 7 || parseInt(value) == 8 || parseInt(value) == 10) {
        return true;
    } else {
        return false;
    }
};

const HienDoiTra = (value) => {
    if (parseInt(value) == 7) {
        return true;
    } else {
        return false;
    }
};

const HienXNDoiTra = (value) => {
    if (parseInt(value) == 8) {
        return true;
    } else {
        return false;
    }
};

const HienXuatHoaDon = (value) => {
    if (parseInt(value) == 3 || parseInt(value) == 10) {
        return true;
    } else {
        return false;
    }
};

const HienDangGiao = (value) => {
    if (parseInt(value) == 5) {
        return true;
    } else {
        return false;
    }
};

const HienMaGHN = (value) => {
    if (parseInt(value) == 5 || parseInt(value) == 3) {
        return true;
    } else {
        return false;
    }
};

// màn đổi trả
//show dialog lý do đổi trả
const lyDoDialogDoiTra = ref(false);
// confirm xác nhận đổi trả
const addProductDialogDoiTra = ref(false);
// confirm huy
const huyDialogDoiTra = ref(false);

//hiện dialog lý do đổi trả
const showDialogLyDoDoiTra = (id) => {
    idHD.value = id;
    lyDoDialogDoiTra.value = true;
};

//hiện confirm đổi trả
const confirmAddProductDoiTra = (id) => {
    idHD.value = id;
    addProductDialogDoiTra.value = true;
};

//hiện confirm huy đổi trả
const confirmHuyDoiTra = () => {
    huyDialogDoiTra.value = true;
};
const { value: lyDoDoiTra, errorMessage: LyDoDoiTraError } = useField('lyDo');
const btnXacNhanHuyDoiTra = () => {
    if (lyDoDoiTra.value == null || lyDoDoiTra.value.length <= 0) {
        toast.add({ severity: 'error', summary: 'Thông báo', detail: 'Lý do không được trống', life: 3000 });
        lyDoDoiTra.value = '';
        huyDialogDoiTra.value = false;
    } else {
        useHD.huyHoaDonDoiTra(idHD.value, lyDoDoiTra.value, 7);
        toast.add({ severity: 'success', summary: 'Thông báo', detail: 'Huỷ thành công', life: 3000 });
        lyDoDoiTra.value = '';
        huyDialogDoiTra.value = false;
        lyDoDialogDoiTra.value = false;
        productDialog.value = false;
    }
};
const btnXacNhanDoiTra = () => {
    useHD.traHang(idHD.value);
    toast.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận thành công', life: 3000 });
    addProductDialogDoiTra.value = false;
    productDialog.value = false;
};

// màn xác nhận đổi trả
//show dialog lý do đổi trả
const lyDoDialogXNDoiTra = ref(false);
// confirm xác nhận đổi trả
const addProductDialogXNDoiTra = ref(false);
// confirm huy
const huyDialogXNDoiTra = ref(false);

//hiện dialog lý do đổi trả
const showDialogLyDoXNDoiTra = (id) => {
    idHD.value = id;
    lyDoDialogXNDoiTra.value = true;
};

//hiện confirm đổi trả
const confirmAddProductXNDoiTra = (id) => {
    idHD.value = id;
    addProductDialogXNDoiTra.value = true;
};

//hiện confirm huy đổi trả
const confirmHuyXNDoiTra = () => {
    huyDialogXNDoiTra.value = true;
};
const { value: lyDoXNDoiTra, errorMessage: LyDoXNDoiTraError } = useField('lyDo');
const btnXacNhanHuyXNDoiTra = () => {
    if (lyDoXNDoiTra.value == null || lyDoXNDoiTra.value.length <= 0) {
        toast.add({ severity: 'error', summary: 'Thông báo', detail: 'Lý do không được trống', life: 3000 });
        lyDoXNDoiTra.value = '';
        huyDialogXNDoiTra.value = false;
    } else {
        useHD.huyHoaDonDoiTra(idHD.value, lyDoXNDoiTra.value, 8);
        toast.add({ severity: 'success', summary: 'Thông báo', detail: 'Huỷ thành công', life: 3000 });
        lyDoXNDoiTra.value = '';
        huyDialogXNDoiTra.value = false;
        lyDoDialogXNDoiTra.value = false;
        productDialog.value = false;
    }
};
const btnXacNhanXNDoiTra = () => {
    useHD.hoanThanhDoiTra(idHD.value);
    toast.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận thành công', life: 3000 });
    addProductDialogXNDoiTra.value = false;
    productDialog.value = false;
};

//Màn giao hàng
// confirm xác nhận
const addProductDialogGH = ref(false);

// confirm huy
const huyDialogGH = ref(false);

//hiện confirm
const confirmAddProductGH = (id) => {
    idHD.value = id;
    addProductDialogGH.value = true;
};

//hiện confirm huy
const confirmHuyGH = (id) => {
    huyDialogGH.value = true;
    idHD.value = id;
};

const btnXacNhanGH = () => {
    useHD.hoanThanh(idHD.value);
    toast.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận thành công', life: 3000 });
    addProductDialogGH.value = false;
    productDialog.value = false;
};

const btnXacNhanHuyGH = () => {
    useHD.huyHoaDon(idHD.value, 'Người dùng không nhận hàng', 5);
    toast.add({ severity: 'success', summary: 'Thông báo', detail: 'Xác nhận giao thất bại thành công', life: 3000 });
    huyDialogGH.value = false;
    productDialog.value = false;
};
</script>
<template>
    <Button label="Xem" class="p-button-outlined p-button-info mr-2 mb-2" @click="editProduct()" />
    <Dialog v-model:visible="productDialog" :style="{ width: '850px' }" :header="code" :modal="true" class="p-fluid">
        <Toast />
        <div class="flex" style="margin-left: 30px;">
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
                                        <p style="margin-left: 10px">{{ props.myProp.diaChiCuThe }}, {{ props.myProp.tenPhuongXa }}, {{ props.myProp.tenQuanHuyen }}, {{ props.myProp.tenTinhThanh }}</p>
                                    </div>
                                    <div class="flex" style="min-width: 200px" v-if="HienLyDoHuy(props.myProp.trangThai)">
                                        <p style="margin-top: 3px">Lý do:</p>
                                        <p style="margin-left: 10px; color: #ff3333; font-weight: bold; font-size: 18px">{{ props.myProp.lyDo }}</p>
                                    </div>
                                    <div class="flex" style="min-width: 200px" v-if="HienLyDoHuyDoiTra(props.myProp.trangThai)">
                                        <p style="margin-top: 3px">Lý do:</p>
                                        <p style="margin-left: 10px; color: #ff3333; font-weight: bold; font-size: 18px">{{ props.myProp.moTa }}</p>
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
                        <label v-if="HienXuatHoaDon(props.myProp.trangThai)">Chúc quý khách vui vẻ! Hẹn gặp lại!</label>
                    </div>
                    <!-- đổi trả -->
                    <div class="flex" v-if="HienDoiTra(props.myProp.trangThai)">
                        <div class="p-col-6" style="width: 100%">
                            <Button label="Huỷ" class="p-button-outlined p-button-info mr-2 mb-2" severity="help" @click="showDialogLyDoDoiTra(props.myProp.idHD)" style="width: 400px" />
                        </div>
                        <div class="p-col-6" style="width: 100%">
                            <Button label="Xác nhận" severity="danger" @click="confirmAddProductDoiTra(props.myProp.idHD)" style="width: 400px" />
                        </div>
                    </div>
                    <!--Xác nhận đổi trả -->
                    <div class="flex" v-if="HienXNDoiTra(props.myProp.trangThai)">
                        <div class="p-col-6" style="width: 100%">
                            <Button label="Huỷ" class="p-button-outlined p-button-info mr-2 mb-2" severity="help" @click="showDialogLyDoXNDoiTra(props.myProp.idHD)" style="width: 300px" />
                        </div>
                        <div class="p-col-6" style="width: 100%">
                            <Button label="Xác nhận" severity="danger" @click="confirmAddProductXNDoiTra(props.myProp.idHD)" style="width: 300px" />
                        </div>
                    </div>
                    <!--Giao hàng -->
                    <div class="flex" v-if="HienDangGiao(props.myProp.trangThai)">
                        <div class="p-col-6" style="width: 100%">
                            <Button label="Thất bại" class="p-button-outlined p-button-info mr-2 mb-2" @click="confirmHuyGH(props.myProp.idHD)" style="width: 300px" />
                        </div>
                        <div class="p-col-6" style="width: 100%">
                            <Button label="Hoàn thành" severity="danger" @click="confirmAddProductGH(props.myProp.idHD)" style="width: 300px" />
                        </div>
                    </div>
                    <Button label="Xuất hóa đơn" severity="danger" @click="exportToPDF" v-if="HienXuatHoaDon(props.myProp.trangThai)" />
                </div>
            </div>
        </div>
    </Dialog>
    <!-- đổi trả -->
    <Dialog v-model:visible="addProductDialogDoiTra" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Bạn có chắc chắn muốn xác nhận không ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="addProductDialogDoiTra = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="btnXacNhanDoiTra()" />
        </template>
    </Dialog>
    <Dialog v-model:visible="lyDoDialogDoiTra" :style="{ width: '450px' }" header="Huỷ hoá đơn" :modal="true">
        <div class="card">
            <form @submit="onSubmit">
                <div class="p-fluid formgrid grid">
                    <div class="field col-12" style="margin-bottom: 30px">
                        <label for="address">Lý do</label>
                        <Textarea id="lyDo" rows="4" v-model.trim="lyDoDoiTra" :class="{ 'p-invalid': LyDoDoiTraError }" required="true" autofocus></Textarea>
                        <small class="p-error">{{ LyDoDoiTraError }}</small>
                    </div>
                </div>
            </form>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="lyDoDialogDoiTra = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="confirmHuyDoiTra" />
        </template>
    </Dialog>
    <!-- comfirm huỷ -->
    <Dialog v-model:visible="huyDialogDoiTra" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Bạn có chắc chắn muốn huỷ không ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="huyDialogDoiTra = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="btnXacNhanHuyDoiTra()" />
        </template>
    </Dialog>

    <!-- xác nhận đổi trả -->
    <Dialog v-model:visible="addProductDialogXNDoiTra" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Bạn có chắc chắn muốn xác nhận không ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="addProductDialogXNDoiTra = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="btnXacNhanXNDoiTra()" />
        </template>
    </Dialog>
    <Dialog v-model:visible="lyDoDialogXNDoiTra" :style="{ width: '450px' }" header="Huỷ hoá đơn" :modal="true">
        <div class="card">
            <form @submit="onSubmit">
                <div class="p-fluid formgrid grid">
                    <div class="field col-12" style="margin-bottom: 30px">
                        <label for="address">Lý do</label>
                        <Textarea id="lyDo" rows="4" v-model.trim="lyDoXNDoiTra" :class="{ 'p-invalid': LyDoXNDoiTraError }" required="true" autofocus></Textarea>
                        <small class="p-error">{{ LyDoXNDoiTraError }}</small>
                    </div>
                </div>
            </form>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="lyDoDialogXNDoiTra = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="confirmHuyXNDoiTra" />
        </template>
    </Dialog>
    <!-- comfirm huỷ -->
    <Dialog v-model:visible="huyDialogXNDoiTra" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Bạn có chắc chắn muốn huỷ không ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="huyDialogXNDoiTra = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="btnXacNhanHuyXNDoiTra()" />
        </template>
    </Dialog>
    <!-- màn giao hàng -->
    <Dialog v-model:visible="addProductDialogGH" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Bạn có chắc chắn muốn hoàn thành không ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="addProductDialogGH = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="btnXacNhanGH()" />
        </template>
    </Dialog>
    <!-- comfirm huỷ -->
    <Dialog v-model:visible="huyDialogGH" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Bạn có chắc chắn đơn hàng đã giao thất bại không ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="huyDialogGH = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="btnXacNhanHuyGH()" />
        </template>
    </Dialog>
</template>

<style scoped>
.ben-phai {
    text-align: right;
}
</style>
