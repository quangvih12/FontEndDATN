<script setup>
import { ref } from 'vue';
import RadioButton from 'primevue/radiobutton';
const selectedCity = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
</script>
<template>
    <div class="card">
        <div class="grid">
            <div class="flex">
                <!-- Cột trái -->
                <div class="p-col-6">
                    <div class="trai">
                        <Divider />
                        <h5>THÔNG TIN THANH TOÁN</h5>
                        <InputText style="width: 100%" placeholder="Họ tên của bạn" />
                        <div class="flex">
                            <div class="p-col-6">
                                <div class="">
                                    <InputText type="text" v-model="value" style="width: 100%; margin-top: 25px" placeholder="Số điện thoại của bạn" />
                                </div>
                                <div class="drd">
                                    <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City" class="w-full md:w-20rem" style="margin-top: 25px" />
                                </div>
                                <div class="drd">
                                    <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City" class="w-full md:w-20rem" style="margin-top: 25px" />
                                </div>
                            </div>
                            <div class="p-col-6">
                                <div class="">
                                    <InputText type="text" v-model="value" style="width: 88%; margin-top: 25px; margin-left: 35px" placeholder="Email của bạn" />
                                </div>
                                <div class="drd">
                                    <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City" class="w-full md:w-20rem" style="margin-left: 35px; margin-top: 25px" />
                                </div>
                                <div class="">
                                    <InputText type="text" v-model="value" style="width: 90%; margin-left: 35px; margin-top: 25px" placeholder="Ví dụ: Số nhà, tên đư" />
                                </div>
                            </div>
                        </div>
                        <Textarea v-model="value" rows="4" cols="87" style="margin-top: 25px" placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay địa điểm giao hàng chi tiết hơn" />
                    </div>
                </div>
                <!-- cột phải -->
                <div class="p-col-6">
                    <div class="phai">
                        <div class="card" style="margin-top: 15px">
                            <h5>ĐƠN HÀNG CỦA BẠN</h5>
                            <h5 style="margin-top: 1px">your oder</h5>
                            <div class="flex">
                                <div class="p-col-6"><h6>PRODUCT</h6></div>
                                <div class="p-col-6" style="margin-left: 240px"><h6>TOTAL</h6></div>
                            </div>
                            <Divider style="margin-top: 1px" />
                            <div class="flex">
                                <div class="p-col-6">
                                    <div class="flex-container" style="margi-right: 100px; height: 50px">
                                        <label>Royal M268 Dragonboy<span style="font-weight: bold"> x1</span></label>
                                    </div>
                                </div>
                                <div class="p-col-6" style="margin-left: 100px">
                                    <h6 style="height: 20px; width: 80px">544,000 <span>₫</span></h6>
                                </div>
                            </div>
                            <Divider style="margin-bottom: 10px" />
                            <div class="flex">
                                <div class="p-col-6">
                                    <div class="flex-container">
                                        <h6>Subtotal</h6>
                                    </div>
                                </div>
                                <div class="p-col-6" style="margin-left: 215px">
                                    <h6 style="height: 20px; width: 80px">544,000 <span>₫</span></h6>
                                </div>
                            </div>
                            <Divider style="margin-top: -10px" />
                            <h6 style="margin-top: -10px">Giao hàng</h6>
                            <span style="font-weight: bold"><input type="radio" name="shipping" value="fast" /> Giao hàng miễn phí</span>
                            <label> <input type="radio" name="shipping" value="free" /> Phí giao nhanh: <span style="font-weight: bold"> 30,000 ₫</span> </label>
                            <Divider />
                            <div class="flex">
                                <div class="p-col-6">
                                    <div class="flex-container">
                                        <h6>Total</h6>
                                    </div>
                                </div>
                                <div class="p-col-6" style="margin-left: 240px">
                                    <h6 style="height: 20px; width: 80px">544,000 <span>₫</span></h6>
                                </div>
                            </div>
                            <Divider style="margin-top: -10px" />
                            <span style="font-weight: bold"><input type="radio" name="phuongThucThanhToan" /> Payment Credit Card / Visa / Master Card / Amex</span>
                            <br />
                            <a href=""
                                ><h4>Vui lòng <a href="">NHẤP VÀO LIÊN KẾT ĐẢM BẢO</a> để bắt đầu thanh toán</h4></a
                            >
                            <Divider style="margin-top: -10px" />
                            <span style="font-weight: bold"><input type="radio" name="phuongThucThanhToan" /> Trả tiền mặt khi nhận hàng</span>
                            <br />
                            <div class="p-inputgroup flex-1">
                                <InputText placeholder="Mã ưu đãi" />
                                <Button label="Áp dụng" severity="warning" />
                            </div>
                            <br />
                            <span> <input type="checkbox" id="agreeCheckbox" /> Tôi đã đọc và đồng ý với điều khoản và điều kiện của website * </span>
                            <br />
                            <Button label="Đặt hàng" severity="danger" />
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
    width: 450px;
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
