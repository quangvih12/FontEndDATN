<script setup>
import { ref, onMounted, watch } from 'vue';
import { gioHangStore } from '@/service/KhachHang/Giohang/GiohangCTService.js';
import { useDetailProductStore } from '@/service/KhachHang/DetailService.js';
import { da } from 'date-fns/locale';
import { useToast } from 'primevue/usetoast';
const productStore = useDetailProductStore();

const gioHangService = gioHangStore();
const toast = useToast();
const selectedMauSac = ref('');
const selectedSize = ref('');
const dataGHCT = ref();
const dataVoucher = ref();
const selectVoucher = ref();
let prevDataSizeLength = ref(null);
let prevDataMauLength = ref(null);

onMounted(async () => {
    await loadDataGioHang();
    await loadDataVoucher();
    prevDataSizeLength.value = dataSize.value.length;
    prevDataMauLength.value = dataMauSac.value.length;

});


const loadDataGioHang = async () => {
    const token = localStorage.getItem('token');
    await gioHangService.getAllGHCT(token);
    dataGHCT.value = gioHangService.data;

};

const loadDataVoucher = async () => {
    const token = localStorage.getItem('token');
    await gioHangService.getListVoucher(token);
    dataVoucher.value = gioHangService.voucher;

};

const updateSoLuong = (product, event) => {
    const newValue = parseInt(event.target.value, 10); // Đảm bảo giá trị nhập vào là số
    if (!isNaN(newValue)) {
        product.soLuong = newValue;
    }
};

const fakedata = ref(null);
const increment = async (idGHCT) => {
    const token = localStorage.getItem('token');
    await gioHangService.congSL(idGHCT, token);
    fakedata.value = gioHangService.fakedata;
    if (fakedata.value !== '') {

        dataGHCT.value = gioHangService.data;
        return;
    } else {
        toast.add({ severity: 'warn', summary: '', detail: 'Số lượng nhiều hơn số lượng tồn', life: 3000 });
        return;
    }

};



const decrement = async (idGHCT) => {
    const token = localStorage.getItem('token');
    await gioHangService.truSL(idGHCT, token);
    dataGHCT.value = gioHangService.data; // Tăng giá trị soLuong lên 1 đơn vị
    //  loadDataGioHang();
};

const selectedGHCT = ref();

const dataMauSac = ref([]);


const selectedSizeMauSac = ref(false);
const dataSize = ref([]);
const ghct = ref({});
const getSize = ref(null);
const idMau = ref(null);
const idSanPhamChiTiet = ref(null);
const editProduct = async (data) => {
    ghct.value = { ...data };
    await loadDataSize(ghct.value.idSP)
    await loadDataMauSac(ghct.value.idSP);

    selectedSizeMauSac.value = true;
};

const datagh = ref(null);
watch([getSize, idMau], async ([newGetSize, newIdMau]) => {
    await productStore.fetchIdSPCT(ghct.value.idSP, getSize.value, idMau.value);
    datagh.value = productStore.products;
    console.log(datagh.value)
    idSanPhamChiTiet.value = datagh.value.id;
});

let isFirstRun = true;

watch([dataSize, dataMauSac], async ([newDataSize, newDataMau]) => {
    if (newDataSize.length !== prevDataSizeLength.value || newDataMau.length !== prevDataMauLength.value) {

        if (isFirstRun && newDataSize.length > 0 && newDataMau.length > 0) {

            selectedMauSac.value = newDataMau[0];
            idMau.value = selectedMauSac.value.id;
            getSize.value = newDataSize[0].id;
            isFirstRun = false;
        }
        else if (newDataSize.length === 0 && newDataMau.length > 0) {
            selectedMauSac.value = newDataMau[0];
            idMau.value = selectedMauSac.value.id;
        }else{
            selectedMauSac.value = newDataMau[0];
            idMau.value = selectedMauSac.value.id;
        }
        prevDataSizeLength.value = newDataSize.length;
        prevDataMauLength.value = newDataMau.length;
    }
});

const loadDataMauSac = async (idProduct) => {
    await productStore.fetchAllMauSac(idProduct);
    dataMauSac.value = productStore.mauSacs;
    // console.log(dataMauSac.value, 'dataMauSac');
};

const loadDataSize = async (idProduct) => {
    await productStore.fetchAllSize(idProduct);
    dataSize.value = productStore.sizes;
};

const deleteGioHang = async (idghct) => {
    await gioHangService.xoaGHCT(idghct);
    dataGHCT.value = gioHangService.data;
    toast.add({ severity: 'warn', summary: '', detail: 'Xoá thành công', life: 3000 });
    loadDataGioHang();
};

const updateMauSacSize = async (idghct) => {
    //  console.log(idSanPhamChiTiet.value)
    await gioHangService.updateMauSacSize(idghct, idSanPhamChiTiet.value);
 ///   dataGHCT.value = gioHangService.data;
   loadDataGioHang();
    toast.add({ severity: 'success', summary: '', detail: 'Cập nhật thành công', life: 3000 });

    selectedSizeMauSac.value = false;
};



const hideDialog = () => {
    selectedSizeMauSac.value = false;
};

const selectMauSac = async (mauSacs) => {
    // Loại bỏ viền đỏ của màu sắc đã chọn trước đó (nếu có)
    if (selectedMauSac.value) {
        selectedMauSac.value.selected = false;
    }

    // Nếu màu sắc đã được chọn thì hủy chọn
    if (mauSacs === selectedMauSac.value) {
        selectedMauSac.value = null;
    } else {
        // Nếu màu sắc chưa được chọn, thêm viền đỏ và đánh dấu đã chọn
        selectedMauSac.value = mauSacs;
        selectedMauSac.value.selected = true;
        idMau.value = selectedMauSac.value.id;

        //  await getSizeByMauSac(mauSacs.id);
    }
};

const isMauSacSelected = (mauSacs) => {
    return mauSacs === selectedMauSac.value;
};

const selectSize = (size) => {
    if (selectedSize.value) {
        selectedSize.value.selected = false;
    }

    // Nếu size đã được chọn thì hủy chọn
    if (size === selectedSize.value) {
        selectedSize.value = null;
    } else {
        // Nếu size chưa được chọn, thêm viền đỏ và đánh dấu đã chọn
        selectedSize.value = size;
        selectedSize.value.selected = true;
    }
};



const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const checked = ref([]);
let checkedValues = []; // Mảng để lưu giá trị đã chọn
const TongTien = ref(0);
const TongSoLuong = ref(0);
const onSizeChange = (id, isChecked) => {
    if (isChecked) {
        // Nếu checkbox được chọn, thêm giá trị vào mảng
        checkedValues.push(id);
    } else {
        // Nếu checkbox bị bỏ chọn, xóa giá trị khỏi mảng
        checkedValues = checkedValues.filter(value => value !== id);
    }
    let tong = 0;
    let tongSoLuong = 0;
      for (const check of checkedValues){
           tong += check.giaBan * check.soLuong;
           tongSoLuong += check.soLuong;
      }
      TongTien.value = tong;
      TongSoLuong.value = tongSoLuong;
};

const dieuKien = ref(0);
const tienGiam = ref(0);
const TongTienCu = ref(0);

const onloaiChange = () => {
    if (selectVoucher.value) {
        dieuKien.value = selectVoucher.value.dieuKien;  
    } else {
        dieuKien.value = 0;
    }
    
};
const ThanhToan = () => {
    //console.log( checkedValues) 
};
const apDung = () =>{
   // TongTienCu.value =  TongTien.value;
    tienGiam.value = TongTien.value / dieuKien.value;
    TongTienCu.value  =TongTien.value  - TongTien.value / dieuKien.value;
}

const reset = ()=>{
    selectVoucher.value = null;
     dieuKien.value = 0;
 tienGiam.value = 0;
 TongTienCu.value =0;
}

</script>
<template>
    <div class="grid">

        <div class="col-12">
            <div class="p-fluid formgrid grid">
                <div class="Field col-12 md:col-9">

                    <div class="trai">

                        <DataTable :value="dataGHCT" v-model:selection="selectedGHCT" dataKey="id" :filters="filters"
                            paginatorTemplate="FirstPageLink Pr
                            evPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown">
                            <Column headerStyle="width: 1rem">
                                <template #body="slotProps">
                                    <Checkbox v-model="checked[dataGHCT.indexOf(slotProps.data)]" :binary="true"
                                        @change="onSizeChange(slotProps.data, checked[dataGHCT.indexOf(slotProps.data)])"   :disabled ="slotProps.data.soLuongTon == 0"/>
                                </template>
                            </Column>

                            <Column field="code" header="Giỏ hàng" headerStyle="width:20%; min-width:14rem;">
                                <template #body="slotProps">
                                    <div class="product-container">
                                        <div class="thumbnail">
                                            <img :src="slotProps.data.anh" alt="Ảnh sản phẩm" class="shadow-2" width="50" />
                                        </div>
                                        <div class="details">
                                            <p style="margin-top: 10px; font-size: 15px">{{ slotProps.data.tenSP }} </p>
                                        </div>
                                    </div>
                                </template>
                            </Column>

                            <Column field="code" header="" headerStyle="width:10%; min-width:5rem;">
                                <template #body="slotProps">
                                    <div @click="  slotProps.data.soLuongTon != 0 && editProduct(slotProps.data)" style="width: 100px;">
                                        <p v-if ="slotProps.data.soLuongTon != 0">Phân loại hàng:</p>  
                                        <p style="font-size: 13px; margin-top: -10px;"   v-if ="slotProps.data.soLuongTon != 0">{{ slotProps.data.tenMauSac }}, {{ slotProps.data.tenSize
                                        }}</p>
                                        <p   v-if ="slotProps.data.soLuongTon == 0">Hết sản phẩm</p>
                                    </div>
                                </template>
                            </Column>

                            <Column field="tenSP" header="" headerStyle="width:14%; min-width:5rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Code</span>

                                    <span v-if="slotProps.data.giaSPSauGiam === null">{{
                                        formatCurrency(slotProps.data.giaBan) }}</span>
                                    <div v-else>
                                        <span :class="{ strikethrough: true }">{{ formatCurrency(slotProps.data.giaBan)
                                        }}</span>
                                        <span>{{ formatCurrency(slotProps.data.giaSPSauGiam) }}</span>
                                    </div>
                                </template>
                            </Column>
                            <Column field="name" header="" headerStyle="width:10%; min-width:5rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Code</span>

                                    <div class="quantity">
                                        <button @click="decrement(slotProps.data.idGHCT)" class="pi pi-minus"
                                        :disabled ="slotProps.data.soLuongTon == 0"   style="width: 30px ; height: 30px; border-radius: 10px 0px 0px 10px; border: 1px solid rgb(177, 173, 173); ">
                                        </button>
                                        <input :value="slotProps.data.soLuong"
                                            @input="updateSoLuong(slotProps.data, $event)" class="input-soluong"
                                            style="width: 30px ; height: 30px;"   :disabled ="slotProps.data.soLuongTon == 0" />
                                        <button @click="increment(slotProps.data.idGHCT)" class="pi pi-plus"
                                            style="width: 30px ; height: 30px; border-radius: 0px 10px 10px 0px; border: 1px solid rgb(177, 173, 173); "   :disabled ="slotProps.data.soLuongTon == 0">

                                        </button>
                                    </div>
                                </template>
                            </Column>
                            <Column field="giaBan" header="" headerStyle="min-width:5rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Code</span>
                                    <p style="font-size: 15px ;color: red;">{{ formatCurrency(slotProps.data.soLuong *
                                        slotProps.data.giaBan) }}</p>
                                </template>
                            </Column>
                            <Column headerStyle="min-width:2rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                        @click="deleteGioHang(slotProps.data.idGHCT)" />
                                </template>
                            </Column>
                        </DataTable>

                        <Dialog v-model:visible="selectedSizeMauSac" :style="{ width: '450px' }"
                            header="Cập nhật phân loại hàng" :modal="true">
                            <p class="ms" v-if="datagh == ''" style="color: red; font-size: 20px;">Hết Hàng</p>
                            <label class="ms">Màu sắc</label>
                            <br />

                            <div class="rounded-content-list">
                                <div v-for="(mauSacs, index) in dataMauSac" :key="index" class="rounded-content"
                                    @click="selectMauSac(mauSacs)" :class="{ selected: isMauSacSelected(mauSacs) }">
                                    <img class="rounded-image" :src="mauSacs.anh" alt="Hình ảnh" />
                                    <a class="rounded-text">{{ mauSacs.ten }}</a>
                                </div>
                            </div>


                            <br />
                            <label class="ms">Size</label>
                            <br />
                            <div class="rounded-content-list">
                                <div v-for="(size, index) in dataSize" :key="index" style="margin-right: 10px;">

                                    <RadioButton v-model="getSize" inputId="ingredient2" name="pizza" :value="size.id"
                                        style="margin-right: 10px; color: white;" />
                                    <label>{{ size.ten }} </label>

                                </div>
                            </div>

                            <template #footer>
                           
                                <Button label="Trở lại" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button type="Xác nhận" label="Save" icon="pi pi-check" class="p-button-text"
                                    @click="updateMauSacSize(ghct.idGHCT)"  :disabled="datagh == ''"  />
                            </template>
                        </Dialog>
                    </div>
                </div>

                <div class="Field col-12 md:col-3">
                    <div class="phai">
                        <p class="TieuDePhai">CỘNG GIỎ HÀNG</p>
                        <hr class="gach-ngang" />
                        <p class="content" style="font-size: 13px;">Tổng số lượng sản phẩm: <span style="font-size: 16px;">{{ TongSoLuong }}</span></p>
                        <p class="content"  style="font-size: 13px;">
                            Tổng tiền: <span style="text-align: right" class="gia">{{ formatCurrency(TongTien) ==''?0:formatCurrency(TongTien) }}</span>
                        </p>
                        <p class="content" v-if="tienGiam !== 0" style="font-size: 13px;">số tiền giảm: <span style="color: red; font-size: 15px;">{{ formatCurrency(tienGiam) }}</span></p>
                        <p class="content" v-if="tienGiam !== 0" style="font-size: 13px;">
                            Tổng tiền giảm: <span style="text-align: right;font-size: 19px;" class="gia">{{ formatCurrency(TongTienCu) == ''?0:formatCurrency(TongTienCu) }}</span>
                        </p>
                      
                        
                        <Button label="thanh toán" severity="danger" class="btn-thanh-toan"
                            style="width: 130px; height: 40px; margin-left:30px; " @click="ThanhToan" />
                        <div class="phieu-uu-dai">
                            <p class="tieu-de-phieu-uu-dai">Phiếu ưu đãi</p>
                            <hr class="gach-ngang" />
                            <div style="display: flex;">
                                <span class="p-float-label" style="width: 140px; margin-top: 20px;">
                                                <Dropdown id="dropdown" :options="dataVoucher" v-model="selectVoucher"
                                                    optionLabel="ten" :class="{ 'p-invalid': loaiError }"
                                                    @change="onloaiChange"> </Dropdown>
                                                <label for="dropdown">voucher</label>
                                            </span>
                                            <Button  class="pi pi-refresh" style="width: 50px; height: 40px; margin-top: 20px; margin-left: 10px;" @click="reset"/>
                            </div>
                           
                            <Button label="Áp dụng" severity="success" class="btn-ap-dung"  @click="apDung"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<style scoped>
div.selected {
    border: 2px solid red;
}

div.border-red {
    border-color: red;
    /* Đặt màu viền thành đỏ */
    border-width: 2px;
    /* Hoặc thiết lập kiểu viền khác tùy ý */
}

.rounded-content-list {
    display: flex;
    flex-wrap: wrap;
}

.rounded-content-size {
    display: flex;
    align-items: center;
    padding: 3px;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    margin: 4px;
    width: 80px;
    height: 40px;
    /* flex-basis: calc(25% - 8px); 
    max-width: calc(25% - 8px);  */
    box-sizing: border-box;
}

.rounded-content {
    display: flex;
    align-items: center;
    padding: 1px;
    border: 1px solid #ccc;
    border-radius: 10px;
    cursor: pointer;
    margin: 4px;
    flex-basis: calc(25% - 8px);
    /* Đặt kích thước ban đầu của mỗi ô, chừa khoảng cách 8px giữa các ô */
    max-width: calc(25% - 8px);
    /* Đặt giới hạn kích thước tối đa của mỗi ô */
    box-sizing: border-box;
    width: 100px;
}

.rounded-image {
    width: 50px;
    height: 40px;
    border-radius: 50%;
    margin-right: 8px;
}

.rounded-text {
    font-size: 15px;
    color: #333;
}

.strikethrough {
    text-decoration: line-through;
    color: red;
    /* Màu chữ cho giá bán gạch ngang (tuỳ chọn) */
}

.grid {
    /* margin-top: 70px; */
    /* position: absolute;
    top: 0;
    left: 0;
    right: 0; */
    margin: auto;
    margin-top: 50px;
    margin-bottom: 30px;
    width: 1100px;
    /* background: white; */
    display: flex;
    justify-content: center;
    /* align-items: center; */
}

.trai {
    padding: 20px 20px 30px 20px;
    /* width: 780px; */
    /* height: 300px; */
    background: white;
    margin-right: 20px;
    border-radius: 10px;
}

.tieu-de-trai {
    font-size: 18px;
    font-weight: bold;
}

.content-trai {
    font-size: 16px;
    max-width: 100px;
    /* Đặt giới hạn độ rộng của ô chứa tên sản phẩm */
    white-space: normal;
}

.tong-sl-sp {
    width: 100%;
}

.ten-sp {
    margin-bottom: 0;
}

.product-container {
    display: flex;
    align-items: flex-start;
}

.thumbnail {
    margin-right: 10px;
}

.thumbnail img {
    width: 60px;
    height: auto;
}

.details {
    /* margin-top: 10px; */
    text-align: left;
    /* flex: 1; */
}

.phai {
    padding: 20px 20px 30px 20px;
    /* width: 300px; */
    background: white;
    /* height: 400px; */
    border-radius: 10px;
}

.gach-ngang {
    border: none;
    border-top: 3px solid rosybrown;
    margin-top: -10px;
}

.TieuDePhai {
    font-size: 18px;
    font-weight: bold;
}

.content {
    font-size: 16px;
}

.gia {
    text-align: right;
    font-size: 18px;
    font-weight: bold;
}

.quantity {
    display: flex;
    align-items: center;
}

.minus,
.plus {
    cursor: pointer;
    font-size: 15px;
    background-color: #ffffff;
    color: black;
    padding: 10px 12px;
    margin: 0;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    transition: background-color 0.3s ease;
    border: 1px solid #ccc;
}

.input-soluong {
    font-size: 17px;
    height: 44px;
    border: 1px solid #ccc;
    /* Đặt viền màu ghi và kích thước to */
    color: #333;
    /* Đặt màu chữ */
    /* padding: 0 12px;  */
    text-align: center;
    width: 30px;
    box-sizing: border-box;
}

.plus-phai {
    cursor: pointer;
    font-size: 15px;
    background-color: #ffffff;
    color: black;
    padding: 10px 12px;
    margin: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    transition: background-color 0.3s ease;
    border: 1px solid #ccc;
}

.btn-thanh-toan {
    width: 100%;
    font-size: 18px;
    background: red;
}

.phieu-uu-dai {
    margin-top: 20px;
}

.tieu-de-phieu-uu-dai {
    font-weight: bold;
    font-size: 18px;
}

.input-phieu-uu-dai {
    width: 100%;
}

.btn-ap-dung {
    margin-top: 20px;
    width: 100%;
}
</style>
