<script setup>
import { useForm, useField, defineRule } from 'vee-validate';
import * as yup from 'yup';
import { reactive, ref, computed, onMounted } from 'vue';
import TableLoai from './DataTableLoai.vue';
import TableThuongHieu from './DataTableThuongHieu.vue';
import TableMauSac from './DataTableMauSac.vue';
import TablevatLieu from './DataTableVatLieu.vue';
import TableTrongLuong from './DataTableTrongLuong.vue';
import { ProductStore } from '../../../service/Admin/product/product.api';
import { useToast } from 'primevue/usetoast';
import { useCounterStore } from '../../../service/Admin/ThuongHieu/ThuongHieuService.js';
import { SizeStore } from '../../../service/Admin/Size/SizeService';
import { useLoaiService } from '../../../service/Admin/Loai/LoaiService';
import { useMauSacService } from '../../../service/Admin/MauSac/MauSacService';
import { TrongLuongStore } from '../../../service/Admin/TrongLuong/TrongLuong.api';
import { VatLieuStore } from '../../../service/Admin/VatLieu/VatLieu.api';

const toast = useToast();
const productStore = ProductStore();
const thuongHieuService = useCounterStore();
const sizeStore = SizeStore();
const mauSacStore = useMauSacService();
const loaiStore = useLoaiService();
const trongLuongStore = TrongLuongStore();
const vatLieuStore = VatLieuStore();
const props = defineProps({
    myProp: {}
});


const { value: id, errorMessage: idError } = useField('id');
const { value: name, errorMessage: nameError } = useField('ten');
const { value: soluong, errorMessage: soLuongError } = useField('soLuongTon');
const { value: GiaBan, errorMessage: giaBanError } = useField('giaBan');
const { value: GiaNhap, errorMessage: giaNhapError } = useField('giaNhap');
const { value: QuaiDeo, errorMessage: quaiDeoError } = useField('quaiDeo');
const { value: Loai, errorMessage: loaiError } = useField('loai');
const { value: ThuongHieu, errorMessage: thuongHieuError } = useField('thuongHieu');
const { value: vatLieu, errorMessage: vatLieuError } = useField('vatLieu');
const { value: idMauSac, errorMessage: mauSacError } = useField('idMauSac');
const { value: DemLot, errorMessage: demLotError } = useField('demLot');
const { value: Size, errorMessage: SizeError } = useField('idSize');
const { value: SoLuongSize, errorMessage: soLuongSizeError } = useField('soLuongSize');
const { value: TrongLuong, errorMessage: trongLuongError } = useField('trongLuong');
const { value: imgMauSac, errorMessage: ImgMauSacError } = useField('imgMauSac');
const { value: TrangThai, errorMessage: TrangThaiSacError } = useField('trangThai');
const { value: MoTa, errorMessage: MoTaSacError } = useField('moTa');
const { value: imagesProduct, errorMessage: imagesProductError } = useField('imagesProduct');
const { value: imagesChinh, errorMessage: imagestError } = useField('anh');

const isOpen = ref(true);

const productDialog = ref(false);
const product = ref({});
// mở form


//đóng form
const hideDialog = () => {
    productDialog.value = false;
};




const selectedCity = ref(null);
const selectedLoai = ref(null);
const selectedMauSac = ref(null);
const selectedvatLieu = ref(null);
const selectedTrongLuong = ref(null);
const selectedSizes = ref(null);
const array = ref([]);





const arrayImgMauSac = ref([]);
const ImagesProduct = ref([]);

const dataThuongHieu = ref([]);
//load data thương hiệu tất cả
const loadDataThuongHieu = async () => {
    await thuongHieuService.fetchData();
    dataThuongHieu.value = thuongHieuService.data;
    // ThuongHieu.value =  dataThuongHieu.value.ten;
};

const dataSize = ref([]);

//load data size tất cả
const loadDataSize = async () => {
    await sizeStore.fetchData();
    dataSize.value = sizeStore.data;
};

const dataMauSac = ref([]);
const loadDataMauSac = async () => {
    await mauSacStore.fetchData();
    dataMauSac.value = mauSacStore.data;

};

const dataLoai = ref([]);
const loadDataLoai = async () => {
    await loaiStore.fetchData();
    dataLoai.value = loaiStore.data;

};

const dataTrongLuong = ref([]);
const loadDataTrongLuong = async () => {
    await trongLuongStore.fetchAll();
    dataTrongLuong.value = trongLuongStore.data;
};

const dataVatLieu = ref([]);
const loadDataVatLieu = async () => {
    await vatLieuStore.fetchAll();
    dataVatLieu.value = vatLieuStore.data;
};

onMounted(() => {
    loadDataThuongHieu();
    loadDataSize();
    loadDataMauSac();
    loadDataLoai();
    loadDataTrongLuong();
    loadDataVatLieu();
    // console.log('list update: ', props.myProp);

});

const arrayImageMauSac = ref([]);
const arrayImage = ref([]);

const editProduct = () => {
    id.value = props.myProp.id;
    name.value = props.myProp.ten;
    soluong.value = props.myProp.soLuongTon;
    GiaBan.value = props.myProp.giaBan;
    QuaiDeo.value = props.myProp.quaiDeo;
    GiaNhap.value = props.myProp.giaNhap;
    DemLot.value = props.myProp.demLot;
    TrangThai.value = props.myProp.trangThai.toString();
    MoTa.value = props.myProp.moTa;
    imagesChinh.value = props.myProp.anh;
    selectedLoai.value = props.myProp.loai;

    const selectedThuongHieu = dataThuongHieu.value.find(item => item.ten === props.myProp.thuongHieu);
    selectedCity.value = selectedThuongHieu;
    if (selectedCity.value) {
        //   console.log(selectedCity.value)
        ThuongHieu.value = selectedCity.value.id;
    } else {
        ThuongHieu.value = null;
    }

    const selectedLoais = dataLoai.value.find(item => item.ten === props.myProp.loai);
    selectedLoai.value = selectedLoais;
    if (selectedLoai.value) {
        //    console.log(selectedLoai.value)
        Loai.value = selectedLoai.value.id;
    } else {
        Loai.value = null;
    }

    const selectedVatLieus = dataVatLieu.value.find(item => item.ten === props.myProp.vatLieu);
    selectedvatLieu.value = selectedVatLieus;
    if (selectedvatLieu.value) {
        vatLieu.value = selectedvatLieu.value.id;
    } else {
        vatLieu.value = null;
    }

    const selectedTrongLuongs = dataTrongLuong.value.find(item => item.value === parseInt(props.myProp.trongLuong, 10));
    selectedTrongLuong.value = selectedTrongLuongs;
    if (selectedTrongLuong.value) {
        TrongLuong.value = selectedTrongLuong.value.id;
    } else {
        TrongLuong.value = null;
    }

    const tenSize = props.myProp.size.map(size => size.size.ten);
    const soLuongSize = props.myProp.size.map(size => size.soLuong);

    //size và số lượng size
    const selectedSizeIds = [];
    for (const ten of tenSize) {
        const selectedSizeId = dataSize.value.find(i => i.ten === ten);
        if (selectedSizeId) {
            selectedSizeIds.push(selectedSizeId);
        }
    }
    selectedSizes.value = selectedSizeIds;
    if (selectedSizes.value.length > 0) {
        const selectedIds = selectedSizes.value.map(item => item.id);
        Size.value = selectedIds.join(',').split(',').map(Number);
    } else {
        Size.value = null;
    }
    for (let i = 0; i < selectedSizes.value.length; i++) {
        const size = selectedSizes.value[i].id;
        const soLuong = soLuongSize[i];
        array.value[i] = soLuong;
        //   console.log(`Size: ${size}, Số lượng: ${soLuong}`);
    }
    if (array.value.length > 0) {
        SoLuongSize.value = array.value.join(',').replace(/^,/, '').split(',').map(Number);
    } else {
        SoLuongSize.value = null;
    }

    //màu sắc và ảnh màu sắc
    const tenMauSac = props.myProp.mauSac.map(s => s.mauSac.ten);
    const anhMauSac = props.myProp.mauSac.map(s => s.anh);
    const selectedMauSacTen = [];
    for (const ten of tenMauSac) {
        const selected = dataMauSac.value.find(i => i.ten === ten);
        if (selected) {
            selectedMauSacTen.push(selected);
        }
    }
    selectedMauSac.value = selectedMauSacTen;
    if (selectedMauSac.value.length > 0) {
        const selectedIds = selectedMauSac.value.map(item => item.id);
        idMauSac.value = selectedIds.join(',').split(',').map(Number);
        //  console.log(idMauSac.value);
    } else {
        idMauSac.value = null;
    }
    for (let i = 0; i < selectedMauSac.value.length; i++) {
        const mauSac = selectedMauSac.value[i].ten;
        const anh = anhMauSac[i];
        arrayImageMauSac.value[i] = anh;
        selectedMauSac.value[i].anh = anh;
    }

    for (const img of selectedMauSac.value) {
        arrayImgMauSac.value.push(img.anh);
        imgMauSac.value = arrayImgMauSac.value.join(",").replace(/^,/, '').split(',');
    }


    // ảnh của sản phẩm
    arrayImage.value = props.myProp.img;
    for (const img of arrayImage.value) {
        //  console.log(img.anh);
        ImagesProduct.value.push(img.anh);
        imagesProduct.value = ImagesProduct.value.join(",").replace(/^,/, '').split(',');
        //  console.log(imagesProduct.value)
    }

    product.value = { ...editProduct };
    productDialog.value = true;
};



</script>


<template>
    <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="editProduct()" />
    <Dialog v-model:visible="productDialog" :style="{ width: '1050px' }" header="Product Details" :modal="true"
        class="p-fluid">
        <form @submit="onSubmit" style="margin-top: 30px;">
            <div class="p-fluid formgrid grid">

                <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <span class="p-float-label">
                            <InputText id="name" name="name" type="text" v-model="name" :class="{ 'p-invalid': nameError }" disabled>
                            </InputText>
                            <label for="username">Tên sản phẩm</label>
                        </span>
                        <small class="p-error">{{ nameError }}</small>
                    </div>

                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <span class="p-float-label">
                            <InputNumber id="soluong" v-model="soluong" :class="{ 'p-invalid': soLuongError }" disabled>
                            </InputNumber>
                            <label for="SoLuongTon">Số lượng tồn</label>
                        </span>
                        <small class="p-error">{{ soLuongError }}</small>
                    </div>

                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <span class="p-float-label">
                            <InputNumber id="Field" v-model="GiaNhap" :class="{ 'p-invalid': giaNhapError }" disabled>
                            </InputNumber>
                            <label for="Field">Giá Nhập</label>
                        </span>
                        <small class="p-error">{{ giaNhapError }}</small>
                    </div>
                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">

                        <span class="p-float-label">
                            <InputNumber id="number-input" name="GiaBan" v-model="GiaBan"
                                :class="{ 'p-invalid': giaBanError }" disabled></InputNumber>
                            <label for="Field">Giá bán</label>
                        </span>
                        <small class="p-error">{{ giaBanError }}</small>
                    </div>
                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <label for="address">Quai Đeo</label>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex align-items-center">
                                <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient1" name="QuaiDeo"
                                    value="Quai đeo cố định" :class="{ 'p-invalid': quaiDeoError }" disabled/>
                                <label for="ingredient1" class="ml-2">Quai đeo cố định</label>
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient2" name="QuaiDeo"
                                    value="Quai đeo dạng Y" :class="{ 'p-invalid': quaiDeoError }" disabled/>
                                <label for="ingredient2" class="ml-2">Quai đeo dạng Y</label>
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient3" name="QuaiDeo"
                                    value="Quai đeo đặc biệt" :class="{ 'p-invalid': quaiDeoError }" disabled/>
                                <label for="ingredient3" class="ml-2" :class="{ 'p-invalid': equaiDeoError }">Quai đeo
                                    đặc biệt</label>
                            </div>

                        </div>
                        <small class="p-error">{{ quaiDeoError }}</small>
                    </div>
                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <label for="address">Đệm lót</label>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex align-items-center">
                                <RadioButton v-model="DemLot" inputId="ingredient1" name="pizza" value="Bọt biển "
                                    :class="{ 'p-invalid': demLotError }" disabled/>
                                <label for="ingredient1" class="ml-2">Bọt biển </label>
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton v-model="DemLot" inputId="ingredient2" name="pizza" value="Vật liệu mềm"
                                    :class="{ 'p-invalid': demLotError }" disabled/>
                                <label for="ingredient2" class="ml-2">Vật liệu mềm</label>
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton v-model="DemLot" inputId="ingredient4" name="pizza"
                                    value="Đệm lót chống xốp nhiễu" :class="{ 'p-invalid': demLotError }" disabled/>
                                <label for="ingredient4" class="ml-2">Đệm lót chống xốp nhiễu</label>
                            </div>
                        </div>
                        <small class="p-error">{{ demLotError }}</small>
                    </div>
                    <div class="field col-12 md:col-12" style="margin-bottom: 30px">
                        <label for="address">Trạng thái</label>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex align-items-center">
                                <RadioButton v-model="TrangThai" inputId="ingredient1" name="pizza" value="1"
                                    :class="{ 'p-invalid': TrangThaiSacError }" disabled/>
                                <label for="ingredient1" class="ml-2">Sẵn sàng để bán</label>
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton v-model="TrangThai" inputId="ingredient2" name="pizza" value="2"
                                    :class="{ 'p-invalid': TrangThaiSacError }" disabled/>
                                <label for="ingredient2" class="ml-2">tồn kho</label>
                            </div>

                        </div>
                        <small class="p-error">{{ TrangThaiSacError }}</small>
                    </div>
                    <div class="p-fluid formgrid grid">
                        <div class="Field col-6 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="dataLoai" v-model="selectedLoai" optionLabel="ten"
                                        :class="{ 'p-invalid': loaiError }" @change="onloaiChange" disabled>
                                    </Dropdown>
                                    <label for="dropdown">Loại</label>
                                </span>
                               
                            </div>

                            <small class="p-error">{{ loaiError }}</small>
                        </div>
                        <div class="Field col-6 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <MultiSelect v-model="selectedMauSac" :options="dataMauSac" optionLabel="ten"
                                        :filter="false" :maxSelectedLabels="3" :class="{ 'p-invalid': mauSacError }"
                                        @change="onMauSacChange" disabled>
                                    </MultiSelect> 
                                    <label for="multiselect">Màu sắc</label>
                                </span>

                             
                            </div>
                            <small class="p-error">{{ mauSacError }}</small>
                        </div>


                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="dataVatLieu" v-model="selectedvatLieu"
                                        :class="{ 'p-invalid': vatLieuError }" optionLabel="ten" @change="onvatLieuChange" disabled>
                                    </Dropdown>
                                    <label for="dropdown">Vật liệu</label>
                                </span>
                              
                            </div>
                            <small class="p-error">{{ vatLieuError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="dataTrongLuong" v-model="selectedTrongLuong" disabled
                                        optionLabel="value" :class="{ 'p-invalid': trongLuongError }"
                                        @change="onTrongLuongChange">
                                    </Dropdown>
                                    <label for="dropdown">Trọng Lượng</label>
                                </span>
                               
                            </div>
                            <small class="p-error">{{ trongLuongError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 150px">
                                    <MultiSelect v-model="selectedSizes" :options="dataSize" optionLabel="ten"
                                        :filter="false" :maxSelectedLabels="3" :class="{ 'p-invalid': SizeError }" disabled
                                        @change="onSizeChange">
                                    </MultiSelect>
                                    <label for="multiselect">Size</label>
                                </span>
                            
                            </div>
                            <small class="p-error">{{ SizeError }}</small>
                        </div>

                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="dataThuongHieu" v-model="selectedCity" disabled
                                        optionLabel="ten" @change="onCityChange" :class="{ 'p-invalid': thuongHieuError }">
                                    </Dropdown>
                                    <label for="dropdown">Thương Hiệu</label>
                                </span>
                               
                            </div>

                            <small class="p-error">{{ thuongHieuError }}</small>
                        </div>
                        <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                            <div style="display: flex;">
                                <div style="width: 150px;">
                                    <p>nhập số lượng size: </p>
                                </div>
                                <div style="display: flex; flex-wrap: wrap;">
                                    <Div v-for="(size, index) in selectedSizes" :key="index" style="margin-top: 10px;">
                                        <label :for="`input-${size.id}`" style="margin-right: 10px; margin-left: 10px;  ">{{
                                            size.ten }}</label>
                                        <input type="number" :id="`input-${size.id}`" v-model="array[index]"
                                            @change="handleInputChange()" :class="{ 'p-invalid': soLuongSizeError }"
                                            style="height: 20px; width: 60px; " disabled />
                                    </Div>
                                </div>
                            </div>
                            <small class="p-error">{{ soLuongSizeError }}</small>
                        </div>
                        <div class="field col-12 md:col-12" style="margin-bottom: 30px">
                            <label for="address">Mô tả</label>
                            <Textarea id="address" rows="4" v-model="MoTa"
                                :class="{ 'p-invalid': MoTaSacError }" disabled></Textarea>
                            <small class="p-error">{{ MoTaSacError }}</small>
                        </div>
                    </div>
                </div>
                <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                    <div class="p-fluid formgrid grid">
                        <div class="Field col-12 md:col-6"
                            style="margin-bottom: 30px; height: 300px;margin-top: 10px; display: inline-flex; justify-content: center; align-items: center;">
                            <div style="display: block; margin-left: 200px;">
                                <div class="t"
                                    style="border: 1px solid black; border-radius: 10px; width: 300px; height:240px; margin-top: -60px;">
                                    <img :src="imagesChinh" alt=""
                                        style="width: 275px; height: 230px; top: 50%; left: 50%;  transform: translate(4%, 2%);">
                                </div>
                                <div class="buton" style="margin-top: 10px;">
                                  
                                </div>
                                <small class="p-error">{{ imagestError }}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-12">
                            <div v-for="(img, index) in arrayImage" :key="index" class="mausac-container"
                                style="display:  inline-block;margin-left: 30px; margin-bottom: 15px; height:90x ; width: 100px;">
                                <div>
                                    <img :src="img.anh" alt=""
                                        style="width: 100px; height: 90px; top: 50%; left: 50%;  transform: translate(4%, 2%); margin: 10px 0px 15px 0px;">

                                </div>

                            </div>

                        </div>
                        <div class="field col-12 md:col-12" style="display:inline-block;">
                            <div v-for="(color, index) in selectedMauSac" :key="index" class="mausac-container"
                                style="display: inline-block;margin-left: 30px; margin-bottom: 15px; height:90x ; width: 100px;">
                                <div>
                                    Màu :
                                    <span class="product-name">{{ color.ten }}</span>
                                    <img :src="color.anh" alt=""
                                        style="width: 50px; height: 50px; top: 50%; left: 50%;  transform: translate(4%, 2%); margin: 10px 0px 15px 0px;">
                                
                                </div>

                             
                            </div>

                            <br />
                            <small class="p-error">{{ ImgMauSacError }}</small>
                        </div>

                    </div>
                    <div class="field col-12 md:col-12">
                      
                    </div>
                </div>
                <div style="width: 1000px; text-align: center;">
                    <Button class="p-button-outlined" outlined severity="secondary"
                        style="width: 200px; height: auto; margin: 10px;" @click="hideDialog()" label="Đóng"></Button>
                </div>

            </div>
        </form>
    </Dialog>
</template>