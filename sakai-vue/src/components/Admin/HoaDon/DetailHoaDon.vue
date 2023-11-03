<script setup>
import { ref, onMounted } from 'vue';
import Divider from 'primevue/divider';
import { da } from 'date-fns/locale';
import { HDStore } from '../../../service/Admin/HoaDon/HoaDonService';

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

const loadDataHDCT = async (idHD) => {
    const respone = await useHD.findHdctByIdHd(idHD);
    dataHDCT.value = respone;
    // console.log(respone);
};

const tinhTongTien = (tienShip, tongTien) => {
    return parseInt(tienShip) + parseInt(tongTien);
};

//đóng form
</script>
<template>
    <Button label="Xem" class="p-button-outlined p-button-info mr-2 mb-2" @click="editProduct()" />
    <Dialog v-model:visible="productDialog" :style="{ width: '1020px' }" :header="code" :modal="true" class="p-fluid">
        <div class="flex">
            <div class="p-col-12" style="text-align: center">
                <div class="bills-col">
                    <div class="card p-fluid" style="background: #ffffff">
                        <div>
                            <h3>Shop...</h3>
                            <label>139 Cầu Giấy, Phường Quan Hoa, Hà Nội</label>
                            <h5>Hóa đơn thanh toán</h5>
                        </div>
                        <hr />
                        <table>
                            <tr>
                                <th>#</th>
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
                                <td style="width: 30px">{{ index+1 }}</td>
                                <td style="width: 20%"><img :src="item.sanPhamChiTiet.sanPham.anh" style="width: 50%" alt="HoaDon Image" /></td>
                                <td>{{ item.sanPhamChiTiet.sanPham.ten }}</td>
                                <td>Đỏ, xanh</td>
                                <td>X</td>
                                <td>{{ item.soLuong }}</td>
                                <td>{{ item.donGia }} <span>VNĐ</span></td>
                                <td>{{ item.soLuong * item.donGia }} <span>VNĐ</span></td>
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
                                    <p>Tổng tiền các sản phẩm: {{ props.myProp.tongTien }}<span>VNĐ</span></p>
                                    <p>Phí vận chuyển: {{ props.myProp.tienShip }}<span>VNĐ</span></p>
                                    <p>
                                        Tổng tiền: <span style="color: #ff3333; font-size: 20px">{{ tinhTongTien(props.myProp.tienShip, props.myProp.tongTien) }} VNĐ</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <label>Chúc quý khách vui vẻ! Hẹn gặp lại!</label>
                    </div>
                    <Button label="Xuất hóa đơn" severity="danger" />
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
