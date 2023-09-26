<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { reactive, ref, computed } from 'vue';
import TableLoai from './DataTableLoai.vue';
import TableThuongHieu from './DataTableThuongHieu.vue';
import TableMauSac from './DataTableMauSac.vue';
import TableVatLieu from './DataTableVatLieu.vue';
import TableKhuyenMai from './DataTableKhuyenMai.vue';
import TableTrongLuong from './DataTableTrongLuong.vue';

const schema = yup.object().shape({
    TenSanPham: yup.string().required('Tên sản phẩm không được để trống').min(4, 'Tên sản phẩm phải có ít nhất 4 ký tự'),
    SoLuongTon: yup.number().required('số lượng không được để trống').typeError('Số lượng tồn phải là một số').min(1, 'Số lượng phải lớn hơn hoặc bằng 1').nullable(),
    GiaBan: yup.number().required('Giá bán không được để trống').min(50000,'giá phải lớn hơn hoặc bằng 50 nghìn').max(10000000, 'Giá bán không lớn hơn 10 triệu'),
    GiaNhap: yup.number().required('Giá nhập không được để trống').min(50000,'giá phải lớn hơn hoặc bằng 50 nghìn').max(10000000, 'Giá bán không lớn hơn 10 triệu'),
    QuaiDeo: yup.string().required('Bạn cần chọn quai đeo cho sản phẩm'),
    Loai: yup.number().required('loại sản phẩm không được để trống'),
    ThuongHieu: yup.number().required('vui lòng chọn Thương hiệu sản phẩm '),
    MauSac: yup.string().required('vui lòng chọn màu sắc sản phẩm '),
    VatLieu: yup.number().required(' vui lòng chọn Vật liệu sản phẩm '),
    DemLot: yup.string().required(' vui lòng chọn đệm lót sản phẩm '),
    Size: yup.string().required('Bạn cần chọn ít nhất một kích thước sản phẩm'),
    SoLuongSize: yup.string().required('bạn cần nhập số lượng size').min(1, 'Số lượng phải lớn hơn hoặc bằng 1').nullable(),
    TrongLuong: yup.string().required('vui lòng chọn trọng lượng sản phẩm'),
    ImgMauSac: yup.string().required('vui lòng chọn ảnh màu sắc sản phẩm'),
    TrangThai: yup.string().required('vui lòng chọn trạng thái của sản phẩm'),
    MoTa: yup.string().required('Vui lòng điền mô tả sản phẩm').min(10, 'Mô tả sản phẩm phải có ít nhất 10 ký tự'),
    imagesProduct: yup.string().required('Vui lòng chọn ảnh cho sản phẩm'),
});

const { handleSubmit, resetForm } = useForm({
    validationSchema: schema,
});

const newProducts = reactive({
    TenSanPham: '',
    SoLuongTon: 0,
    GiaNhap: null,
    GiaBan: null,
    QuaiDeo: '',
    DemLot: '',
    Size: [],
    SoLuongSize: [],
    MauSac: [],
    ImgMauSac: [],
    Loai: null,
    ThuongHieu: null,
    VatLieu: '',
    TrongLuong: '',
    TrangThai: '',
    MoTa: '',
    KhuyenMai: '',
    ImagesProduct: [],
});

const { value: name, errorMessage: nameError } = useField('TenSanPham');
const { value: soluong, errorMessage: soLuongError } = useField('SoLuongTon');
const { value: GiaBan, errorMessage: giaBanError } = useField('GiaBan');
const { value: GiaNhap, errorMessage: giaNhapError } = useField('GiaNhap');
const { value: QuaiDeo, errorMessage: quaiDeoError } = useField('QuaiDeo');
const { value: Loai, errorMessage: loaiError } = useField('Loai');
const { value: ThuongHieu, errorMessage: thuongHieuError } = useField('ThuongHieu');
const { value: VatLieu, errorMessage: vatLieuError } = useField('VatLieu');
const { value: MauSac, errorMessage: mauSacError } = useField('MauSac');
const { value: DemLot, errorMessage: demLotError } = useField('DemLot');
const { value: Size, errorMessage: SizeError } = useField('Size');
const { value: SoLuongSize, errorMessage: soLuongSizeError } = useField('SoLuongSize');
const { value: KhuyenMai, errorMessage: khuyenMaiError } = useField('KhuyenMai');
const { value: TrongLuong, errorMessage: trongLuongError } = useField('TrongLuong');
const { value: ImgMauSac, errorMessage: ImgMauSacError } = useField('ImgMauSac');
const { value: TrangThai, errorMessage: TrangThaiSacError } = useField('TrangThai');
const { value: MoTa, errorMessage: MoTaSacError } = useField('MoTa');
const { value: imagesProduct, errorMessage: imagesProductError } = useField('imagesProduct');
const onSubmit = handleSubmit(async (values) => {
    try {
        console.log('Dữ liệu đã gửi:', values);

        // Sau khi xử lý, đặt lại biểu mẫu

        reset();
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

const cities = ref([
    { name: 'New York', id: 1, isChecked: false },
    { name: 'Rome', id: 2, isChecked: false },
    { name: 'London', id: 3, isChecked: false },
    { name: 'Istanbul', id: 4, isChecked: false },
    { name: 'Paris', id: 5, isChecked: false }
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
const selectedVatLieu = ref(null);
const selectedTrongLuong = ref(null);
const selectedKhuyenMai = ref(null);
const selectedSizes = ref(null);

const array = ref([]);


const reset = () => {
    resetForm();
    array.value = null;
    selectedSizes.value = null;
    selectedMauSac.value = null;
    selectedLoai.value = null;
    selectedCity.value = null;
    selectedVatLieu.value = null;
    imagesProduct.value = null;
};

const handleInputChange = (sizeId) => {
    if (array.value.length > 0) {

        SoLuongSize.value = array.value.join(',').replace(/^,/, '');
        console.log(SoLuongSize.value)

    } else {
        SoLuongSize.value = null;
    }
};

const onCityChange = () => {
    if (selectedCity.value) {
        ThuongHieu.value = selectedCity.value.id;
    } else {
        ThuongHieu.value = null;
    }
};

const onKhuyenMaiChange = () => {
    if (selectedKhuyenMai.value) {
        KhuyenMai.value = selectedCity.value.id;
    } else {
        KhuyenMai.value = null;
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
        Loai.value = selectedLoai.value.id;
    } else {
        Loai.value = null;
    }
};

const onMauSacChange = () => {
    if (selectedMauSac.value.length > 0) {
        const selectedIds = selectedMauSac.value.map(item => item.id).join(',');
        MauSac.value = selectedIds;
    } else {
        MauSac.value = null;
    }
};

const onSizeChange = () => {
    if (selectedSizes.value.length > 0) {
        const selectedIds = selectedSizes.value.map(item => item.id).join(',');
        Size.value = selectedIds;
    } else {
        Size.value = null;
    }
};

const onVatLieuChange = () => {
    if (selectedVatLieu.value) {
        VatLieu.value = selectedVatLieu.value.id;
    } else {
        VatLieu.value = null;
    }
};

// const selectedItems = computed(() => {
//     return sizes.value.filter(item => item.isChecked);

// });
sizes.value.forEach(item => {
    item.showInput = false; // Initialize the showInput property for each item
});

const imagesMauSac = ref([]);
function onFileInputImageMauSac(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const objectURL = URL.createObjectURL(file);
        imagesMauSac.value.push(objectURL);

        ImgMauSac.value = imagesMauSac.value.join(",").replace(/^,/, '');
    }
}

const ImagesProduct = ref([]);
function onFileInputImageProduct(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const objectURL = URL.createObjectURL(file);
        ImagesProduct.value.push(objectURL);
        imagesProduct.value = ImagesProduct.value.join(",").replace(/^,/, '');
    }

}

</script>

<template>
    <div>
        <div class="col-12">
            <div class="card" style=" align-items: center;justify-content: center; height: 90px;">
                <h1 style="margin-bottom: 30px; font-size: 50px ; margin-top: 20px;">Sản phẩm</h1>
            </div>
            <div class="card">
                <form @submit="onSubmit">
                    <div class="p-fluid formgrid grid">
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <span class="p-float-label">
                                <InputText id="name" name="TenSanPham" type="text" v-model="name"
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
                                        value="Cheese" :class="{ 'p-invalid': quaiDeoError }" />
                                    <label for="ingredient1" class="ml-2">Cheese</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient2" name="QuaiDeo"
                                        value="Mushroom" :class="{ 'p-invalid': quaiDeoError }" />
                                    <label for="ingredient2" class="ml-2">Mushroom</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient3" name="QuaiDeo"
                                        value="Pepper" :class="{ 'p-invalid': quaiDeoError }" />
                                    <label for="ingredient3" class="ml-2"
                                        :class="{ 'p-invalid': equaiDeoError }">Pepper</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient4" name="QuaiDeo"
                                        value="Onion" :class="{ 'p-invalid': quaiDeoError }" />
                                    <label for="ingredient4" class="ml-2"
                                        :class="{ 'p-invalid': quaiDeoError }">Onion</label>
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
                                    <Dropdown id="dropdown" :options="cities" v-model="selectedCity" optionLabel="name"
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
                                    <RadioButton v-model="DemLot" inputId="ingredient1" name="pizza" value="Cheese"
                                        :class="{ 'p-invalid': demLotError }" />
                                    <label for="ingredient1" class="ml-2">Cheese</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="DemLot" inputId="ingredient2" name="pizza" value="Mushroom"
                                        :class="{ 'p-invalid': demLotError }" />
                                    <label for="ingredient2" class="ml-2">Mushroom</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="DemLot" inputId="ingredient3" name="pizza" value="Pepper"
                                        :class="{ 'p-invalid': demLotError }" />
                                    <label for="ingredient3" class="ml-2">Pepper</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="DemLot" inputId="ingredient4" name="pizza" value="Onion"
                                        :class="{ 'p-invalid': demLotError }" />
                                    <label for="ingredient4" class="ml-2">Onion</label>
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
                                    <Dropdown id="dropdown" :options="cities" v-model="selectedVatLieu"
                                        :class="{ 'p-invalid': vatLieuError }" optionLabel="name" @change="onVatLieuChange">
                                    </Dropdown>
                                    <label for="dropdown">Vật liệu</label>
                                </span>
                                <TableVatLieu :tableId="'TableVatLieu'" :rightGhId="'right_ghVatLieu'"
                                    :tableClass="'TableVatLieu'" :rightGhClass="'right_ghVatLieu'" />
                            </div>
                            <small class="p-error">{{ vatLieuError }}</small>
                        </div>
                        <div class="field col-12 md:col-6" style="margin-bottom: 30px">
                            <label for="address">Trạng thái</label>
                            <div class="flex flex-wrap gap-3">
                                <div class="flex align-items-center">
                                    <RadioButton v-model="TrangThai" inputId="ingredient1" name="pizza" value="Cheese"
                                        :class="{ 'p-invalid': TrangThaiSacError }" />
                                    <label for="ingredient1" class="ml-2">chuẩn bị ra mắt</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="TrangThai" inputId="ingredient2" name="pizza" value="Mushroom"
                                        :class="{ 'p-invalid': TrangThaiSacError }" />
                                    <label for="ingredient2" class="ml-2">còn hàng</label>
                                </div>

                            </div>
                            <small class="p-error">{{ TrangThaiSacError }}</small>
                        </div>
                        <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="cities" v-model="selectedKhuyenMai" optionLabel="name"
                                        @change="onKhuyenMaiChange"></Dropdown>
                                    <label for="dropdown">Khuyến mại</label>
                                </span>
                                <TableKhuyenMai :tableId="'TableKhuyenMai'" :rightGhId="'right_ghKhuyenMai'"
                                    :tableClass="'TableKhuyenMai'" :rightGhClass="'right_ghKhuyenMai'" />
                            </div>
                            <small class="p-error">{{ khuyenMaiError }}</small>
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
                                    <MultiSelect v-model="selectedSizes" :options="sizes" optionLabel="label"
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
                        <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                            <div style="display: flex; flex-wrap: wrap;">
                                <div v-for="(size, index) in selectedSizes" :key="index" style="margin-top: 10px;">
                                    <label :for="`input-${size.id}`" style="margin-right: 10px; margin-left: 10px;  ">{{
                                        size.label }}</label>
                                    <input type="number" :id="`input-${size.id}`" v-model="array[size.id]"
                                        @change="handleInputChange(size.id)" :class="{ 'p-invalid': soLuongSizeError }"
                                        style="height: 20px; width: 60px; " />
                                </div>
                            </div>
                            <small class="p-error">{{ soLuongSizeError }}</small>
                        </div>
                        <div class="field col-12 md:col-6">
                            <div v-for="(color, index) in selectedMauSac" :key="index" class="mausac-container"
                                style="display: inline-block;margin-left: 30px; margin-bottom: 15px;">
                                Màu :
                                <span class="product-name">{{ color.label }}</span>
                                <FileUpload mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000"
                                    @input="onFileInputImageMauSac" />
                            </div>
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
            </div>

        </div>
    </div>
</template>