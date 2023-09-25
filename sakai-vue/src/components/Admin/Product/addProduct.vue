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
    GiaBan: yup.number().required('Giá bán không được để trống'),
    GiaNhap: yup.number().required('Giá nhập không được để trống'),
    QuaiDeo: yup.string().required('Bạn cần chọn quai đeo cho sản phẩm'),
    Loai: yup.number().required('loại sản phẩm không được để trống'),
    ThuongHieu: yup.number().required('vui lòng chọn Thương hiệu sản phẩm '),
    MauSac: yup.string().required('vui lòng chọn màu sắc sản phẩm '),
    VatLieu: yup.number().required(' vui lòng chọn Vật liệu sản phẩm '),
    DemLot: yup.string().required(' vui lòng chọn đệm lót sản phẩm '),
    Size: yup.string().required('Bạn cần chọn ít nhất một kích thước sản phẩm'),
    SoLuongSize: yup.number().required('bạn cần nhập số lượng size').typeError('Số lượng size phải là một số').min(1, 'Số lượng phải lớn hơn hoặc bằng 1').nullable(),
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

const onSubmit = handleSubmit(async (values) => {
    try {
        // Nếu biểu mẫu hợp lệ, xử lý dữ liệu ở đây
        // newProducts.ImagesProduct = imagesProduct.value;
        // newProducts.ImgMauSac = imagesMauSac.value;
        values.Size = selectedItems.value.map(selected => selected.value).join(', ');
        // newProducts.SoLuongSize = selectedItems.value.map(selected => selected.inputValue).join(', ');
        newProducts.Size = selectedSizes.value;
        console.log('Dữ liệu đã gửi:', values);

        // Sau khi xử lý, đặt lại biểu mẫu
        resetForm();
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
const selectedSizes = ref(null);

const onCityChange = () => {
    if (selectedCity.value) {
        ThuongHieu.value = selectedCity.value.id;
    } else {
        ThuongHieu.value = null;
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
        console.log(selectedIds)
        MauSac.value = selectedIds;
    } else {
        MauSac.value = null;
    }
};

const onSizeChange = () => {
    if (selectedSizes.value.length > 0) {
        const selectedIds = selectedSizes.value.map(item => item.id).join(',');
        console.log(selectedIds)
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


</script>

<template>
    <div>
        <div class="col-12">
            <div class="card">
                <h3 style="margin-bottom: 30px">Sản phẩm</h3>
            </div>
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
                            <InputNumber id="Field" v-model="GiaNhap" :class="{ 'p-invalid': giaNhapError }"></InputNumber>
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
                                <label for="ingredient3" class="ml-2" :class="{ 'p-invalid': equaiDeoError }">Pepper</label>
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton v-model="QuaiDeo" type="radio" inputId="ingredient4" name="QuaiDeo"
                                    value="Onion" :class="{ 'p-invalid': quaiDeoError }" />
                                <label for="ingredient4" class="ml-2" :class="{ 'p-invalid': quaiDeoError }">Onion</label>
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
                                <MultiSelect v-model="selectedMauSac" :options="colors" optionLabel="label" :filter="false"
                                    :maxSelectedLabels="3" :class="{ 'p-invalid': mauSacError }" @change="onMauSacChange">
                                </MultiSelect>
                                <label for="multiselect">Màu sắc</label>
                            </span>

                            <TableMauSac :tableId="'TableMauSac'" :rightGhId="'right_ghMauSac'" :tableClass="'TableMauSac'"
                                :rightGhClass="'right_ghMauSac'" />
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
                    <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                        <div style="display: flex">
                            <span class="p-float-label" style="width: 350px">
                                <MultiSelect v-model="selectedSizes" :options="sizes" optionLabel="label" :filter="false"
                                    :maxSelectedLabels="3" :class="{ 'p-invalid': SizeError }" @change="onSizeChange">
                                </MultiSelect>
                                <label for="multiselect">Size</label>
                            </span>
                            <TableMauSac :tableId="'TableMauSac'" :rightGhId="'right_ghMauSac'" :tableClass="'TableMauSac'"
                                :rightGhClass="'right_ghMauSac'" />
                        </div>
                        <small class="p-error">{{ SizeError }}</small>
                    </div>
                    <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                        <div>Nhập số lượng size</div>
                        <div v-for="size in selectedSizes" :key="size.id">
                            <span class="p-float-label" style="margin-bottom: 30px" >
                                <input :id="`input-${size.id}`" v-model="SoLuongSize"
                                    :class="{ 'p-invalid': soLuongSizeError }" style="height: 20px; width: 50px;" />
                                <label :for="`input-${size.id}`">{{ size.label }}</label>
                            </span>
                        </div>
                        <small class="p-error">{{ soLuongSizeError }}</small>
                    </div>
                    <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                        <div style="display: flex">
                            <span class="p-float-label" style="width: 239px">
                                <Dropdown id="dropdown" :options="cities" v-model="newProducts.KhuyenMai"
                                    optionLabel="name"></Dropdown>
                                <label for="dropdown">Khuyến mại</label>
                            </span>
                            <TableKhuyenMai :tableId="'TableKhuyenMai'" :rightGhId="'right_ghKhuyenMai'"
                                :tableClass="'TableKhuyenMai'" :rightGhClass="'right_ghKhuyenMai'" />
                        </div>
                    </div>
                    <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                        <div style="display: flex">
                            <span class="p-float-label" style="width: 239px">
                                <Dropdown id="dropdown" :options="cities" v-model="newProducts.TrongLuong"
                                    optionLabel="name"></Dropdown>
                                <label for="dropdown">Trọng Lượng</label>
                            </span>
                            <TableTrongLuong :tableId="'TableTrongLuong'" :rightGhId="'right_ghTrongLuong'"
                                :tableClass="'TableTrongLuong'" :rightGhClass="'right_ghTrongLuong'" />
                        </div>
                    </div>


                    <div>
                        <button type="submit" class="btn btn-secondary mt-3">Gửi</button>
                    </div>
                </div>
            </form>

        </div>
    </div>
</template>