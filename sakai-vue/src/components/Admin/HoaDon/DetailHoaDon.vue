<script setup>
import { ref } from 'vue';
import Divider from 'primevue/divider';

const productDialog = ref(false);
const mess = "Đơn hàng:";
const code = "MH1283947114310";
const messCode = mess+' '+code;

// mở form
const editProduct = () => {
    productDialog.value = true;
};

//đóng form

</script>
<template>
    <Button label="Xem" class="p-button-outlined p-button-info mr-2 mb-2" @click="editProduct()" />
    <Dialog v-model:visible="productDialog" :style="{ width: '1020px' }" :header="messCode" :modal="true" class="p-fluid">
        <div class="flex">
            <!-- Cột phải -->
            <div class="p-col-6">
                <div class="col-12">
                    <div class="flex">
                        <div class="p-col-6">
                            <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/EL1ADfIMG_6410.jpg" style="width: 150px" alt="HoaDon Image" />
                        </div>
                        <div class="p-col-6">
                            <div class="col-12">
                                <h3>Mũ bảo hiểm vjppro</h3>
                                <h5>Giá Bán: <span>15.000.000</span><span>VNĐ</span></h5>
                                <label>Số lượng: <span>3</span></label>
                                <br><p></p>
                                <label>Màu sắc: <span>Đỏ xanh</span></label>
                                <br><p></p>
                                <label>Mô tả: <span>Sang xịn mịn</span></label>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div class="col">
                        <div class="row flex">
                            <div class="flex" style="min-width: 200px">
                                <p>Địa chỉ:</p>
                            </div>
                            <div class="flex" style="min-width: 200px">
                                <p>Ngõ 342 Hồ Tùng Mậu</p>
                            </div>
                        </div>
                        <br />
                        <div class="row flex">
                            <div class="flex" style="min-width: 200px">
                                <p>Tổng tiền các sản phẩm</p>
                            </div>
                            <div class="flex" style="min-width: 200px">
                                <p>45.000.000 <span>VNĐ</span></p>
                            </div>
                        </div>
                        <br />
                        <div class="row flex">
                            <div class="flex" style="min-width: 200px">
                                <p>Phí vận chuyển</p>
                            </div>
                            <div class="flex" style="min-width: 200px">
                                <p>30.000 <span>VNĐ</span></p>
                            </div>
                        </div>
                        <br />
                        <div class="row flex">
                            <div class="flex" style="min-width: 200px">
                                <p>Tổng thanh toán:</p>
                            </div>
                            <div class="flex" style="min-width: 200px">
                                <h4 style="color: #ff3333">45.030.000 <span>VNĐ</span></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- cột trái -->
            <div class="p-col-6" style="text-align: center">
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
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                            <hr>
                            <tr>
                                <td style="width: 30px;">1</td>
                                <td >Mũ bảo hiểm vjppro</td>
                                <td>3</td>
                                <td>15.000.000 <span>VNĐ</span></td>
                                <td>45.000.000 <span>VNĐ</span></td>
                            </tr>
                        </table>
                        <hr />
                        <div class="col">
                            <div class="row flex">
                                <div class="flex" style="min-width: 200px">
                                    <p>Đơn giá các sản phẩm:</p>
                                </div>
                                <div class="flex" style="min-width: 200px">
                                    <p>45.000.00 <span>VNĐ</span></p>
                                </div>
                            </div>
                            <div class="row flex">
                                <div class="flex" style="min-width: 200px">
                                    <p>Phí vận chuyển</p>
                                </div>
                                <div class="flex" style="min-width: 200px">
                                    <p>30.000 <span>VNĐ</span></p>
                                </div>
                            </div>
                            <div class="row flex">
                                <div class="flex" style="min-width: 200px">
                                    <p>Tổng tiền</p>
                                </div>
                                <div class="flex" style="min-width: 200px">
                                    <p style="color: #ff3333">45.030.000 <span>VNĐ</span></p>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <label>Chúc quý khách vui vẻ! Hẹn gặp lại!</label>
                    </div>
                    <Button label="Xuất hóa đơn" severity="danger" />
                </div>
            </div>
        </div>
    </Dialog>
</template>