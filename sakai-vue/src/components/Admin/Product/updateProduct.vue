<script setup>
import { useForm, useField, defineRule } from 'vee-validate';
import * as yup from 'yup';
import { reactive, ref, computed ,onMounted} from 'vue';
import TableLoai from './DataTableLoai.vue';
import TableThuongHieu from './DataTableThuongHieu.vue';
import TableMauSac from './DataTableMauSac.vue';
import TablevatLieu from './DataTableVatLieu.vue';
import TableTrongLuong from './DataTableTrongLuong.vue';
import { ProductStore } from '../../../service/Admin/product/product.api';
import { useToast } from 'primevue/usetoast';
import { useCounterStore } from '../../../service/Admin/ThuongHieu/ThuongHieuService.js';
import { SizeStore } from '../../../service/Admin/Size/SizeService';
const toast = useToast();
const productStore = ProductStore();
const thuongHieuService = useCounterStore();
const sizeStore = SizeStore();
const props = defineProps({
    myProp: {}
});


const schema = yup.object().shape({
    ten: yup.string()
        .required('Tên sản phẩm không được để trống')
        .min(4, 'Tên sản phẩm phải có ít nhất 4 ký tự')
        .matches(/^[a-zA-Z0-9đĐáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬêÊếẾềỀểỂễỄệỆôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢùÙúÚụỤủỦũŨưỨỨửỬữỮựỰýÝỳỲỷỶỹỸỵỴ\s]*$/, 'Tên không được chứa kí tự đặc biệt!'),
    soLuongTon: yup.number()
        .required('số lượng không được để trống')
        .typeError('Số lượng tồn phải là một số')
        .min(1, 'Số lượng phải lớn hơn hoặc bằng 1')
        .max(1000, 'số lượng quá lớn')
        .nullable(),
    giaBan: yup.number()
        .required('Giá bán không được để trống')
        .min(50000, 'giá phải lớn hơn hoặc bằng 50 nghìn')
        .max(10000000, 'Giá bán không lớn hơn 10 triệu'),
    giaNhap: yup.number()
        .required('Giá nhập không được để trống')
        .min(50000, 'giá phải lớn hơn hoặc bằng 50 nghìn')
        .max(10000000, 'Giá bán không lớn hơn 10 triệu'),
    quaiDeo: yup.string()
        .required('Bạn cần chọn quai đeo cho sản phẩm'),
    loai: yup.number()
        .required('loại sản phẩm không được để trống'),
    thuongHieu: yup.number()
        .required('vui lòng chọn Thương hiệu sản phẩm '),
    idMauSac: yup.array()
        .required('vui lòng chọn màu sắc sản phẩm '),
    vatLieu: yup.number()
        .required(' vui lòng chọn Vật liệu sản phẩm '),
    demLot: yup.string()
        .required(' vui lòng chọn đệm lót sản phẩm '),
    idSize: yup.array()
        .required('Bạn cần chọn ít nhất một kích thước sản phẩm'),
    soLuongSize: yup.array()
        .required('bạn cần nhập số lượng size')
        .min(1, 'Số lượng phải lớn hơn hoặc bằng 1').nullable(),
    trongLuong: yup.string()
        .required('vui lòng chọn trọng lượng sản phẩm'),
    imgMauSac: yup.array()
        .required('vui lòng chọn ảnh màu sắc sản phẩm'),
    trangThai: yup.number()
        .required('vui lòng chọn trạng thái của sản phẩm'),
    moTa: yup.string()
        .required('Vui lòng điền mô tả sản phẩm')
        .min(10, 'Mô tả sản phẩm phải có ít nhất 10 ký tự'),
    imagesProduct: yup.array()
        .required('Vui lòng chọn ảnh cho sản phẩm'),
});



const { handleSubmit, resetForm } = useForm({
    validationSchema: schema,
});

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

const isOpen = ref(true);

const productDialog = ref(false);
const product = ref({});
// mở form


//đóng form
const hideDialog = () => {
    ten.value = props.myProp.ten;
    productDialog.value = false;
    // submitted.value = false;
};

const onSubmit = handleSubmit(async (values) => {
    try {
        // Kiểm tra trùng lặp trước khi thêm sản phẩm
        const isDuplicate = await productStore.checkDuplicateName(name.value);
        if (isDuplicate) {
            // Hiển thị thông báo lỗi hoặc xử lý theo nhu cầu của bạn
            toast.add({ severity: 'error', summary: 'Error ', detail: 'Tên sản phẩm đã tồn tại', life: 3000 });
        } else {
            // Nếu không trùng lặp, thêm sản phẩm vào store
            await productStore.edit(values);
            toast.add({ severity: 'success', summary: 'Success Message', detail: 'Thêm thành công', life: 3000 });
            reset();
        }
    } catch (error) {
        console.error('Lỗi xử lý dữ liệu:', error);
    }
});


const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};


const sizes = ref([
    { value: 'M', label: 'M', id: 1 },
    { value: 'L', label: 'L', id: 2 },
    { value: 'XL', label: 'XL', id: 3 },
    { value: 'LL', label: 'LL', id: 4 },
    // Thêm các Size khác tùy ý
]);


const colors = ref([
    { value: 'M', label: 'M', id: 1 },
    { value: 'L', label: 'L', id: 2 },
    { value: 'XL', label: 'XL', id: 3 },
    // Thêm các item khác tùy ý
]);

const selectedCity = ref(null);
const selectedLoai = ref(null);
const selectedMauSac = ref(null);
const selectedvatLieu = ref(null);
const selectedTrongLuong = ref(null);
const selectedSizes = ref(null);

const array = ref([]);

const check = async () => {
    try {
        const isDuplicate = await productStore.checkDuplicateName(name.value);

    } catch (error) {
        console.error('Lỗi khi kiểm tra trùng lặp tên sản phẩm:', error);
        // Xử lý lỗi nếu cần thiết
    }
};



const reset = () => {
    resetForm();
    array.value = 1;
    selectedSizes.value = null;
    selectedMauSac.value = null;
    selectedLoai.value = null;
    selectedCity.value = null;
    selectedvatLieu.value = null;
    ImagesProduct.value = null;
};

const handleInputChange = (sizeId) => {
    if (array.value.length > 0) {
        SoLuongSize.value = array.value.join(',').replace(/^,/, '').split(',').map(Number);
    } else {
        SoLuongSize.value = null;
    }
};


const onCityChange = () => {
    if (selectedCity.value) {
        console.log(selectedCity.value)
        ThuongHieu.value = selectedCity.value.id;
    } else {
        ThuongHieu.value = null;
    }
};


const onTrongLuongChange = () => {
    if (selectedTrongLuong.value) {
        TrongLuong.value = selectedCity.value.id;
    } else {
        TrongLuong.value = null;
    }
};

const onloaiChange = () => {
    if (selectedLoai.value) {
        console.log(selectedLoai.value)
        Loai.value = selectedLoai.value.id;
    } else {
        Loai.value = null;
    }
};

const onMauSacChange = () => {
    if (selectedMauSac.value.length > 0) {
        const selectedIds = selectedMauSac.value.map(item => item.id);
        idMauSac.value = selectedIds.join(',').split(',').map(Number);
        console.log(idMauSac.value);
    } else {
        idMauSac.value = null;
    }
};

const onSizeChange = () => {
    if (selectedSizes.value.length > 0) {
        const selectedIds = selectedSizes.value.map(item => item.id);
        Size.value = selectedIds.join(',').split(',').map(Number);
    } else {
        Size.value = null;
    }
};

const onvatLieuChange = () => {
    if (selectedvatLieu.value) {
        vatLieu.value = selectedvatLieu.value.id;
    } else {
        vatLieu.value = null;
    }
};

// const selectedItems = computed(() => {
//     return sizes.value.filter(item => item.isChecked);

// });
sizes.value.forEach(item => {
    item.showInput = false; // Initialize the showInput property for each item
});

const arrayImgMauSac = ref([]);
function onFileInputImageMauSac(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const objectURL = URL.createObjectURL(file);
        arrayImgMauSac.value.push(objectURL);

        imgMauSac.value = arrayImgMauSac.value.join(",").replace(/^,/, '').split(',');
    }
}

const ImagesProduct = ref([]);
function onFileInputImageProduct(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const objectURL = URL.createObjectURL(file);
        ImagesProduct.value.push(objectURL);
        imagesProduct.value = ImagesProduct.value.join(",").replace(/^,/, '').split(',');
    }

};

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


onMounted(() => {
    loadDataThuongHieu();
    loadDataSize();
});

const editProduct = () => {
    name.value = props.myProp.ten;
    soluong.value = props.myProp.soLuongTon;
    GiaBan.value = props.myProp.giaBan;
    QuaiDeo.value = props.myProp.quaiDeo;
    selectedLoai.value = props.myProp.loai;
    
    const selectedThuongHieu = dataThuongHieu.value.find(item => item.ten === props.myProp.thuongHieu);
    selectedCity.value = selectedThuongHieu;

    const selectedSize = dataSize.value.find(item => item.ten === props.myProp.size);

    product.value = { ...editProduct };
    productDialog.value = true;
};

</script>


<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct()" />
    <Dialog v-model:visible="productDialog" :style="{ width: '1050px' }" header="Product Details" :modal="true"
        class="p-fluid">
        <form @submit="onSubmit" style="margin-top: 30px;">
                    <div class="p-fluid formgrid grid">
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <span class="p-float-label">
                                <InputText id="name" name="name" type="text" v-model="name"
                                    :class="{ 'p-invalid': nameError }" />
                                <label for="username">Tên sản phẩm</label>
                            </span>
                            <small class="p-error">{{ nameError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">

                            <span class="p-float-label">
                                <InputNumber id="soluong" v-model="soluong" :class="{ 'p-invalid': soLuongError }" />
                                <label for="SoLuongTon">Số lượng tồn</label>
                            </span>
                            <small class="p-error">{{ soLuongError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <span class="p-float-label">
                                <InputNumber id="Field" v-model="GiaNhap" :class="{ 'p-invalid': giaNhapError }">
                                </InputNumber>
                                <label for="Field">Giá Nhập</label>
                            </span>
                            <small class="p-error">{{ giaNhapError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">

                            <span class="p-float-label">
                                <InputNumber id="number-input" name="GiaBan" v-model="GiaBan"
                                    :class="{ 'p-invalid': giaBanError }"></InputNumber>
                                <label for="Field">Giá bán</label>
                            </span>
                            <small class="p-error">{{ giaBanError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <label for="address">Quai Đeo</label>
                            <div class="flex flex-wrap gap-3">
                                <div class="flex align-items-center">
                                    <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient1" name="QuaiDeo"
                                        value="Quai đeo cố định" :class="{ 'p-invalid': quaiDeoError }" />
                                    <label for="ingredient1" class="ml-2">Quai đeo cố định</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient2" name="QuaiDeo"
                                        value="Quai đeo dạng Y" :class="{ 'p-invalid': quaiDeoError }" />
                                    <label for="ingredient2" class="ml-2">Quai đeo dạng Y</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient3" name="QuaiDeo"
                                        value="Quai đeo đặc biệt" :class="{ 'p-invalid': quaiDeoError }" />
                                    <label for="ingredient3" class="ml-2" :class="{ 'p-invalid': equaiDeoError }">Quai đeo
                                        đặc biệt</label>
                                </div>

                            </div>
                            <small class="p-error">{{ quaiDeoError }}</small>
                        </div>
                        <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="cities" v-model="selectedLoai" optionLabel="name"
                                        :class="{ 'p-invalid': loaiError }" @change="onloaiChange">
                                    </Dropdown>
                                    <label for="dropdown">Loại</label>
                                </span>
                                <TableLoai :tableId="'tableLoai'" :rightGhId="'right_ghLoai'" :tableClass="'tableLoai'"
                                    :rightGhClass="'right_ghLoai'" />
                            </div>

                            <small class="p-error">{{ loaiError }}</small>
                        </div>
                        <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="dataThuongHieu" v-model="selectedCity" optionLabel="ten"
                                        @change="onCityChange" :class="{ 'p-invalid': thuongHieuError }"></Dropdown>
                                    <label for="dropdown">Thương Hiệu</label>
                                </span>
                                <TableThuongHieu :tableId="'TableThuongHieu'" :rightGhId="'right_ghThuongHieu'"
                                    :tableClass="'TableThuongHieu'" :rightGhClass="'right_ghThuongHieu'" />
                            </div>

                            <small class="p-error">{{ thuongHieuError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <label for="address">Đệm lót</label>
                            <div class="flex flex-wrap gap-3">
                                <div class="flex align-items-center">
                                    <RadioButton v-model="DemLot" inputId="ingredient1" name="pizza" value="Bọt biển "
                                        :class="{ 'p-invalid': demLotError }" />
                                    <label for="ingredient1" class="ml-2">Bọt biển </label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="DemLot" inputId="ingredient2" name="pizza" value="Vật liệu mềm"
                                        :class="{ 'p-invalid': demLotError }" />
                                    <label for="ingredient2" class="ml-2">Vật liệu mềm</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="DemLot" inputId="ingredient4" name="pizza"
                                        value="Đệm lót chống xốp nhiễu" :class="{ 'p-invalid': demLotError }" />
                                    <label for="ingredient4" class="ml-2">Đệm lót chống xốp nhiễu</label>
                                </div>
                            </div>
                            <small class="p-error">{{ demLotError }}</small>
                        </div>
                        <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <MultiSelect v-model="selectedMauSac" :options="colors" optionLabel="label"
                                        :filter="false" :maxSelectedLabels="3" :class="{ 'p-invalid': mauSacError }"
                                        @change="onMauSacChange">
                                    </MultiSelect>
                                    <label for="multiselect">Màu sắc</label>
                                </span>

                                <TableMauSac :tableId="'TableMauSac'" :rightGhId="'right_ghMauSac'"
                                    :tableClass="'TableMauSac'" :rightGhClass="'right_ghMauSac'" />
                            </div>
                            <small class="p-error">{{ mauSacError }}</small>
                        </div>
                        <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="cities" v-model="selectedvatLieu"
                                        :class="{ 'p-invalid': vatLieuError }" optionLabel="name" @change="onvatLieuChange">
                                    </Dropdown>
                                    <label for="dropdown">Vật liệu</label>
                                </span>
                                <TablevatLieu :tableId="'TablevatLieu'" :rightGhId="'right_ghvatLieu'"
                                    :tableClass="'TablevatLieu'" :rightGhClass="'right_ghvatLieu'" />
                            </div>
                            <small class="p-error">{{ vatLieuError }}</small>
                        </div>
                        <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                            <label for="address">Trạng thái</label>
                            <div class="flex flex-wrap gap-3">
                                <div class="flex align-items-center">
                                    <RadioButton v-model="TrangThai" inputId="ingredient1" name="pizza" value="1"
                                        :class="{ 'p-invalid': TrangThaiSacError }" />
                                    <label for="ingredient1" class="ml-2">Sẵn sàng để bán</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="TrangThai" inputId="ingredient2" name="pizza" value="2"
                                        :class="{ 'p-invalid': TrangThaiSacError }" />
                                    <label for="ingredient2" class="ml-2">tồn kho</label>
                                </div>

                            </div>
                            <small class="p-error">{{ TrangThaiSacError }}</small>
                        </div>

                        <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="cities" v-model="selectedTrongLuong"
                                        optionLabel="name" :class="{ 'p-invalid': trongLuongError }"
                                        @change="onTrongLuongChange"></Dropdown>
                                    <label for="dropdown">Trọng Lượng</label>
                                </span>
                                <TableTrongLuong :tableId="'TableTrongLuong'" :rightGhId="'right_ghTrongLuong'"
                                    :tableClass="'TableTrongLuong'" :rightGhClass="'right_ghTrongLuong'" />
                            </div>
                            <small class="p-error">{{ trongLuongError }}</small>
                        </div>
                        <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 150px">
                                    <MultiSelect v-model="selectedSizes" :options="dataSize" optionLabel="ten"
                                        :filter="false" :maxSelectedLabels="3" :class="{ 'p-invalid': SizeError }"
                                        @change="onSizeChange">
                                    </MultiSelect>
                                    <label for="multiselect">Size</label>
                                </span>
                                <TableMauSac :tableId="'TableMauSac'" :rightGhId="'right_ghMauSac'"
                                    :tableClass="'TableMauSac'" :rightGhClass="'right_ghMauSac'" />
                            </div>
                            <small class="p-error">{{ SizeError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                          <div style="display: flex;">
                            <div style="width: 150px;">
                                <p >nhập số lượng size: </p>
                            </div>
                            <div style="display: flex; flex-wrap: wrap;">
                                <div v-for="(size, index) in selectedSizes" :key="index" style="margin-top: 10px;">
                                    <label :for="`input-${size.id}`" style="margin-right: 10px; margin-left: 10px;  ">{{
                                        size.ten }}</label>
                                    <input type="number" :id="`input-${size.id}`" v-model="array[index]"
                                        @change="handleInputChange(size.id)" :class="{ 'p-invalid': soLuongSizeError }"
                                        style="height: 20px; width: 60px; " />
                                </div>
                            </div>
                          </div>
                            <small class="p-error">{{ soLuongSizeError }}</small>
                        </div>
                     
                        <div class="field col-12 md:col-6">
                            <div v-for="(color, index) in selectedMauSac" :key="index" class="mausac-container"
                                style="display: inline-block;margin-left: 30px; margin-bottom: 15px; height:90x ; width: 150px;">
                                <div>
                                    Màu :
                                    <span class="product-name">{{ color.label }}</span>
                                </div>
                                <FileUpload mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000"
                                    @input="onFileInputImageMauSac" />
                            </div>
                            <br />
                            <small class="p-error">{{ ImgMauSacError }}</small>
                        </div>
                        <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                            <label for="address">Mô tả</label>
                            <Textarea id="address" rows="4" v-model="MoTa"
                                :class="{ 'p-invalid': MoTaSacError }"></Textarea>
                            <small class="p-error">{{ MoTaSacError }}</small>
                        </div>
                        <div class="field col-12 md:col-6">
                            <file-upload :upload-url="uploadUrl" :multiple="true" :maxFileSize="2000000"
                                @input="onFileInputImageProduct" :class="{ 'p-invalid': imagesProductError }"></file-upload>
                            <small class="p-error">{{ imagesProductError }}</small>
                        </div>
                        <div style="width: 1000px; text-align: center;">
                            <Button type="submit" class="p-button-outlined"
                                style="width: 200px; height: auto; margin: 10px;" label="Lưu"></Button>
                            <Button class="p-button-outlined" outlined severity="secondary"
                                style="width: 200px; height: auto; margin: 10px;" @click="reset()" label="clear"></Button>
                        </div>

                    </div>
                </form>
    </Dialog>
</template>