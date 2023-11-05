<script setup>
import { useForm, useField, defineRule } from 'vee-validate';
import * as yup from 'yup';
import { reactive, ref, computed, onMounted } from 'vue';
import TableLoai from './DataTableLoai.vue';
import TableThuongHieu from './DataTableThuongHieu.vue';
import TableMauSac from './DataTableMauSac.vue';
import TablevatLieu from './DataTableVatLieu.vue';
import TableTrongLuong from './DataTableTrongLuong.vue';
import TableSize from './DataTableSize.vue';
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

const schema = yup.object().shape({
    ten: yup
        .string()
        .required('Tên sản phẩm không được để trống')
        .min(4, 'Tên sản phẩm phải có ít nhất 4 ký tự')
        .matches(/^[a-zA-Z0-9đĐáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬêÊếẾềỀểỂễỄệỆôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢùÙúÚụỤủỦũŨưỨỨửỬữỮựỰýÝỳỲỷỶỹỸỵỴ\s]*$/, 'Tên không được chứa kí tự đặc biệt!'),
    soLuongTon: yup.number().required('số lượng không được để trống').typeError('Số lượng tồn phải là một số').min(1, 'Số lượng phải lớn hơn hoặc bằng 1').max(1000, 'số lượng quá lớn').nullable(),
    giaBan: yup
        .number()
        .required('Giá bán không được để trống')
        .min(50000, 'giá phải lớn hơn hoặc bằng 50 nghìn')
        .max(10000000, 'Giá bán không lớn hơn 10 triệu')
        .when(['giaNhap'], (giaBan, schema) => {
            return schema.test({
                test: function (value) {
                    const giaNhap = this.resolve(yup.ref('giaNhap'));
                    if (value < giaNhap) {
                        toast.add({ severity: 'error', summary: 'Error ', detail: 'Giá Nhập không được nhỏ hơn giá bán', life: 3000 });
                    }
                    return true;
                },
                message: 'Giá bán phải nhỏ hơn giá nhập'
            });
        }),
    giaNhap: yup.number().required('Giá nhập không được để trống').min(50000, 'giá phải lớn hơn hoặc bằng 50 nghìn').max(10000000, 'Giá bán không lớn hơn 10 triệu'),
    quaiDeo: yup.string().required('Bạn cần chọn quai đeo cho sản phẩm'),
    loai: yup.number().required('loại sản phẩm không được để trống'),
    thuongHieu: yup.number().required('vui lòng chọn Thương hiệu sản phẩm '),
    // idMauSac: yup.array().required('vui lòng chọn màu sắc sản phẩm '),
    vatLieu: yup.number().required(' vui lòng chọn Vật liệu sản phẩm '),
    demLot: yup.string().required(' vui lòng chọn đệm lót sản phẩm '),
    // soLuongSize: yup.number().min(1, 'Số lượng phải lớn hơn hoặc bằng 1').nullable(),
    trongLuong: yup.string().required('vui lòng chọn trọng lượng sản phẩm'),
    //    imgMauSac: yup.array().required('vui lòng chọn ảnh màu sắc sản phẩm'),
    trangThai: yup.number().required('vui lòng chọn trạng thái của sản phẩm'),
    moTa: yup.string().required('Vui lòng điền mô tả sản phẩm').min(10, 'Mô tả sản phẩm phải có ít nhất 10 ký tự'),
    anh: yup.string().required('vui lòng chọn ảnh chính cho sản phẩm')
});

const { handleSubmit, resetForm } = useForm({
    validationSchema: schema
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
// const { value: idMauSac, errorMessage: mauSacError } = useField('idMauSac');
const { value: DemLot, errorMessage: demLotError } = useField('demLot');
// const { value: Size, errorMessage: SizeError } = useField('idSize');
// const { value: SoLuongSize, errorMessage: soLuongSizeError } = useField('soLuongSize');
const { value: TrongLuong, errorMessage: trongLuongError } = useField('trongLuong');
// const { value: imgMauSac, errorMessage: ImgMauSacError } = useField('imgMauSac');
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
    ten.value = props.myProp.ten;
    productDialog.value = false;
    // submitted.value = false;
};

const onSubmit = handleSubmit(async (values) => {
    try {

        await productStore.edit(values);
        toast.add({ severity: 'success', summary: 'Success Message', detail: 'update thành công', life: 3000 });
        productDialog.value = false;
        reset();
        //   }
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
    { value: 'LL', label: 'LL', id: 4 }
    // Thêm các Size khác tùy ý
]);

const colors = ref([
    { value: 'M', label: 'M', id: 1 },
    { value: 'L', label: 'L', id: 2 },
    { value: 'XL', label: 'XL', id: 3 }
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
    imagesProduct.value = [];
    array.value = [];
    arrayMauSac.value = [];
    selectedSizes.value = null;
    selectedMauSac.value = null;
    selectedLoai.value = null;
    selectedCity.value = null;
    selectedTrongLuong.value = null;
    selectedvatLieu.value = null;
    ImagesProduct.value = [];
    arrayImgMauSac.value = [];
    imageUrls.value = [];
};

const handleInputChange = () => {
    if (array.value.length > 0) {
        SoLuongSize.value = array.value.join(',').replace(/^,/, '').split(',').map(Number);
    } else {
        SoLuongSize.value = null;
    }
};

const arrayMauSac = ref([]);
const handleInputChangeMau = (sizeId) => {
    if (arrayMauSac.value.length > 0) {
        soLuongMauSac.value = arrayMauSac.value.join(',').replace(/^,/, '').split(',').map(Number);
    } else {
        soLuongMauSac.value = null;
    }
};

const onCityChange = () => {
    if (selectedCity.value) {
        ThuongHieu.value = selectedCity.value.id;
    } else {
        ThuongHieu.value = null;
    }
};

const onTrongLuongChange = () => {
    if (selectedTrongLuong.value) {
        TrongLuong.value = selectedTrongLuong.value.id;
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
        const selectedIds = selectedMauSac.value.map((item) => item.id);
        idMauSac.value = selectedIds.join(',').split(',').map(Number);
    } else {
        idMauSac.value = null;
    }
};

const onSizeChange = () => {
    if (selectedSizes.value.length > 0) {
        const selectedIds = selectedSizes.value.map((item) => item.id);
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
sizes.value.forEach((item) => {
    item.showInput = false; // Initialize the showInput property for each item
});

const arrayImgMauSac = ref([]);
function onFileInputImageMauSac(id) {
    const index = selectedMauSac.value.findIndex((s) => s.id === id);
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const basePath = "D:\\imgDATN\\"; // Đường dẫn cố định
        const fileName = basePath + file.name;

        // Kiểm tra nếu index hợp lệ, sau đó cập nhật giá trị tại index đó
        if (index >= 0 && index < arrayImgMauSac.value.length) {
            arrayImgMauSac.value[index] = fileName;
        } else {
            // Nếu index không hợp lệ, hãy thêm objectURL vào cuối mảng
            arrayImgMauSac.value.push(fileName);
        }
    }

    // Cập nhật giá trị imgMauSac.value sau khi đã duyệt qua tất cả các tệp
    imgMauSac.value = arrayImgMauSac.value.join(',').replace(/^,/, '').split(',');
}

const anh = ref(null);
const ImagesProduct = ref([]);
const imageUrls = ref([]);
function onFileInputImageProduct(event) {
    const files = event.target.files;


    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const basePath = "D:\\imgDATN\\"; // Đường dẫn cố định
        const fileName = basePath + file.name;
        imageUrls.value.push(fileName);

    }
    ImagesProduct.value = imageUrls.value;
    imagesProduct.value = ImagesProduct.value.join(',').replace(/^,/, '').split(',');
}

const dataThuongHieu = ref([]);
//load data thương hiệu tất cả
const loadDataThuongHieu = async () => {
    await thuongHieuService.fetchData();
    dataThuongHieu.value = thuongHieuService.dataByStatus1;
    // ThuongHieu.value =  dataThuongHieu.value.ten;
};

const dataSize = ref([]);

//load data size tất cả
const loadDataSize = async () => {
    await sizeStore.fetchData();
    dataSize.value = sizeStore.dataByStatus1;
};

const dataMauSac = ref([]);
const loadDataMauSac = async () => {
    await mauSacStore.fetchData();
    dataMauSac.value = mauSacStore.dataByStatus1;
};

const dataLoai = ref([]);
const loadDataLoai = async () => {
    await loaiStore.fetchData();
    dataLoai.value = loaiStore.dataByStatus1;
};

const dataTrongLuong = ref([]);
const loadDataTrongLuong = async () => {
    await trongLuongStore.fetchAll();
    dataTrongLuong.value = trongLuongStore.dataByStatus1;
};

const dataVatLieu = ref([]);
const loadDataVatLieu = async () => {
    await vatLieuStore.fetchAll();
    dataVatLieu.value = vatLieuStore.dataByStatus1;
};

onMounted(() => {
    loadDataThuongHieu();
    loadDataSize();
    loadDataMauSac();
    loadDataLoai();
    loadDataTrongLuong();
    loadDataVatLieu();
});

const arrayImageMauSac = ref([]);
const arrayImage = ref([]);

const lstMauSac = ref([]);
const listMauSac = async () => {
    await productStore.fetchAllMauSac(id.value);
    lstMauSac.value = productStore.mauSacs;
}

const lstSize = ref([]);
const listSize = async () => {
    await productStore.fetchAllSize(id.value);
    lstSize.value = productStore.sizes;
}
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

    const selectedThuongHieu = dataThuongHieu.value.find((item) => item.ten === props.myProp.thuongHieu);
    selectedCity.value = selectedThuongHieu;
    if (selectedCity.value) {
        ThuongHieu.value = selectedCity.value.id;
    } else {
        ThuongHieu.value = null;
    }

    const selectedLoais = dataLoai.value.find((item) => item.ten === props.myProp.loai);
    selectedLoai.value = selectedLoais;
    if (selectedLoai.value) {
        Loai.value = selectedLoai.value.id;
    } else {
        Loai.value = null;
    }

    const selectedVatLieus = dataVatLieu.value.find((item) => item.ten === props.myProp.vatLieu);
    selectedvatLieu.value = selectedVatLieus;
    if (selectedvatLieu.value) {
        vatLieu.value = selectedvatLieu.value.id;
    } else {
        vatLieu.value = null;
    }
    const selectedTrongLuongs = dataTrongLuong.value.find((item) => item.value === parseInt(props.myProp.trongLuong, 10));
    selectedTrongLuong.value = selectedTrongLuongs;
    if (selectedTrongLuong.value) {
        TrongLuong.value = selectedTrongLuong.value.id;
    } else {
        TrongLuong.value = null;
    }

    const tenSize = props.myProp.size.map((size) => size.size.ten);
    const soLuongSize = props.myProp.size.map((size) => size.soLuong);

    //màu sắc và ảnh màu sắc
    const tenMauSac = props.myProp.mauSac.map((s) => s.mauSac.ten);
    const anhMauSac = props.myProp.mauSac.map((s) => s.anh);
    const SizeMauSac = props.myProp.mauSac.map((s) => s.sizeChiTiet?.size?.ten);
    const IdMauSacChiTiet = props.myProp.mauSac.map((s) => s.id);
    const soLuongMauSacs = props.myProp.mauSac.map(s => s.soLuong);
    const selectedMauSacTen = [];
    for (const ten of tenMauSac) {
        const selected = dataMauSac.value.find((i) => i.ten === ten);
        if (selected) {
            selectedMauSacTen.push(selected);
        }
    }
    selectedMauSac.value = selectedMauSacTen;

    if (selectedMauSac.value.length > 0) {
        const selectedIds = selectedMauSac.value.map((item) => item.id);
        //    idMauSac.value = selectedIds.join(',').split(',').map(Number);
    } else {
        //    idMauSac.value = null;
    }

    const selectedMauSacCopy = selectedMauSac.value.map(item => ({ ...item }));


    for (let i = 0; i < selectedMauSacCopy.length; i++) {
        const mauSac = selectedMauSacCopy[i].ten;
        const anh = anhMauSac[i];
        arrayImageMauSac.value[i] = anh;
        selectedMauSacCopy[i].anh = anh;
        const soLuong = soLuongMauSacs[i];
        array.value[i] = soLuong;
        const tenSize = SizeMauSac[i];
        selectedMauSacCopy[i].tenSize = tenSize;
        const idMauSacChiTiet = IdMauSacChiTiet[i];
        selectedMauSacCopy[i].idMauSacChiTiet = idMauSacChiTiet;
    }
    selectedMauSacCopy.sort((a, b) => {
        if (a.sizeChiTiet && a.sizeChiTiet.id && b.sizeChiTiet && b.sizeChiTiet.id) {
            return a.sizeChiTiet.id - b.sizeChiTiet.id;
        }
        return 0;
    });

    selectedMauSac.value = selectedMauSacCopy;

    if (array.value.length > 0) {
        //  SoLuongSize.value = array.value.join(',').replace(/^,/, '').split(',').map(Number);
    } else {
        //   SoLuongSize.value = null;
    }

    for (const img of selectedMauSac.value) {
        arrayImgMauSac.value.push(img.anh);
        //    imgMauSac.value = arrayImgMauSac.value.join(',').replace(/^,/, '').split(',');
    }


    // ảnh của sản phẩm
    arrayImage.value = props.myProp.img;
    for (const img of arrayImage.value) {
        ImagesProduct.value.push(img.anh);
        imagesProduct.value = ImagesProduct.value.join(',').replace(/^,/, '').split(',');
    }

    product.value = { ...editProduct };

    listMauSac();
    listSize();
    productDialog.value = true;
};

function onFileInputImage(event) {
    const files = event.target.files;
    // Lặp qua từng tệp trong mảng files
    for (const file of files) {
        const objectURL = URL.createObjectURL(file);
        anh.value = objectURL;
        // Gán giá trị cho phần tử có id là 'imagesChinh' (thay đổi id nếu cần)
        const basePath = "D:\\imgDATN\\"; // Đường dẫn cố định
        const fileName = basePath + file.name;
        imagesChinh.value = fileName;
    }
}

const deleteSize = async (idSize) => {
    for (let i = 0; i < Size.value.length; i++) {
        if (Size.value[i] === idSize) {
            // Xóa phần tử trùng lặp tại vị trí i
            Size.value.splice(i, 1);
            i--; // Để tránh bỏ lỡ phần tử sau khi xóa
        }
    }

    //   Tìm chỉ mục của size có idSize trong selectedSizes.value
    const indexToDelete = selectedSizes.value.findIndex((size) => size.id === idSize);

    if (indexToDelete !== -1) {
        // Xóa size khỏi selectedSizes.value
        selectedSizes.value.splice(indexToDelete, 1);

        // Đặt soLuong của size tương ứng trong array.value thành 0
        array.value[indexToDelete] = null;
    }

    // Tiếp tục với việc xóa size khỏi props.myProp.size và productStore.deleteSize(props.myProp.id, idSize)
    await productStore.deleteSize(props.myProp.id, idSize);
    props.myProp.size = props.myProp.size.filter((s) => s.size.id !== idSize);
};

const deleteMauSac = async (idMauSacs) => {
    try {
        for (let i = 0; i < idMauSac.value.length; i++) {
            if (idMauSac.value[i] === idMauSacs) {
                // Xóa phần tử trùng lặp tại vị trí i
                idMauSac.value.splice(i, 1);
                i--; // Để tránh bỏ lỡ phần tử sau khi xóa
            }
        }

        const mauSacToDelete = selectedMauSac.value.findIndex((m) => m.idMauSacChiTiet === idMauSacs);

        // Đặt ảnh của màu sắc đó thành null (nếu màu sắc tồn tại)
        if (mauSacToDelete !== -1) {
            //  mauSacToDelete.anh = "";
            selectedMauSac.value.splice(mauSacToDelete, 1);
            imgMauSac.value.splice(mauSacToDelete, 1);
            arrayImgMauSac.value.splice(mauSacToDelete, 1);
        }

        // Tạo một bản sao mới của selectedMauSac.value và lọc bỏ phần tử cần xóa
        const updatedSelectedMauSac = selectedMauSac.value.filter((m) => m.idMauSacChiTiet !== idMauSacs);

        // Gán bản sao mới này cho selectedMauSac.value
        selectedMauSac.value = updatedSelectedMauSac;

        // Lọc bỏ màu sắc khỏi sản phẩm props.myProp
        props.myProp.mauSac = props.myProp.mauSac.filter((s) => s.id !== idMauSacs);
        // // Gọi hàm xóa từ store nếu cần
        //  await productStore.deleteMauSac( idMauSacs);
    } catch (error) {
        console.error('Lỗi xóa màu sắc:', error);
    }
};

const deleteImg = async (img) => {
    for (let i = 0; i < ImagesProduct.value.length; i++) {
        if (ImagesProduct.value[i] === img) {
            // Xóa phần tử trùng lặp tại vị trí i
            ImagesProduct.value.splice(i, 1);
            i--; // Để tránh bỏ lỡ phần tử sau khi xóa
        }
    }

    for (let i = 0; i < imagesProduct.value.length; i++) {
        if (imagesProduct.value[i] === img) {
            // Xóa phần tử trùng lặp tại vị trí i
            imagesProduct.value.splice(i, 1);
            i--; // Để tránh bỏ lỡ phần tử sau khi xóa
        }
    }

    arrayImage.value = arrayImage.value.filter((s) => s.anh !== img);

    // Lọc bỏ màu sắc khỏi sản phẩm props.myProp
    props.myProp.img = props.myProp.img.filter((s) => s.anh !== img);
    await productStore.deleteImg(props.myProp.id, img);
};

const selectedProducts = ref(null);
const filters = ref({});

const getStatusLabel = (soLuong) => {
    if (soLuong <= 0) {
        return { text: 'hết Hàng', severity: 'danger' };
    } else {
        return { text: 'Còn hàng', severity: 'success' };
    }

};
</script>

<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct()" />
    <Dialog v-model:visible="productDialog" :style="{ width: '1050px' }" header="Product Details" :modal="true"
        class="p-fluid">
        <form @submit="onSubmit" style="margin-top: 30px">
            <div class="p-fluid formgrid grid">
                <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <span class="p-float-label">
                            <InputText id="name" name="name" type="text" v-model="name" :class="{ 'p-invalid': nameError }">
                            </InputText>
                            <label for="username">Tên sản phẩm</label>
                        </span>
                        <small class="p-error">{{ nameError }}</small>
                    </div>

                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <span class="p-float-label">
                            <InputNumber id="soluong" v-model="soluong" :class="{ 'p-invalid': soLuongError }">
                            </InputNumber>
                            <label for="SoLuongTon">Số lượng tồn</label>
                        </span>
                        <small class="p-error">{{ soLuongError }}</small>
                    </div>

                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <span class="p-float-label">
                            <InputNumber id="Field" v-model="GiaNhap" :class="{ 'p-invalid': giaNhapError }"> </InputNumber>
                            <label for="Field">Giá Nhập</label>
                        </span>
                        <small class="p-error">{{ giaNhapError }}</small>
                    </div>
                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <span class="p-float-label">
                            <InputNumber id="number-input" name="GiaBan" v-model="GiaBan"
                                :class="{ 'p-invalid': giaBanError }"></InputNumber>
                            <label for="Field">Giá bán</label>
                        </span>
                        <small class="p-error">{{ giaBanError }}</small>
                    </div>
                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
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
                                <label for="ingredient3" class="ml-2" :class="{ 'p-invalid': equaiDeoError }">Quai đeo đặc
                                    biệt</label>
                            </div>
                        </div>
                        <small class="p-error">{{ quaiDeoError }}</small>
                    </div>
                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
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
                    <div class="field col-12 md:col-12" style="margin-bottom: 30px">
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
                    <div class="p-fluid formgrid grid">
                        <div class="Field col-6 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="dataLoai" v-model="selectedLoai" optionLabel="ten"
                                        :class="{ 'p-invalid': loaiError }" @change="onloaiChange"> </Dropdown>
                                    <label for="dropdown">Loại</label>
                                </span>
                                <TableLoai :tableId="'tableLoai'" :rightGhId="'right_ghLoai'" :tableClass="'tableLoai'"
                                    :rightGhClass="'right_ghLoai'" />
                            </div>

                            <small class="p-error">{{ loaiError }}</small>
                        </div>
                        <!-- <div class="Field col-6 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <MultiSelect v-model="selectedMauSac" :options="dataMauSac" optionLabel="ten"
                                        :filter="false" :maxSelectedLabels="3" :class="{ 'p-invalid': mauSacError }"
                                        @change="onMauSacChange"> </MultiSelect>
                                    <label for="multiselect">Màu sắc</label>
                                </span>

                                <TableMauSac :tableId="'TableMauSac'" :rightGhId="'right_ghMauSac'"
                                    :tableClass="'TableMauSac'" :rightGhClass="'right_ghMauSac'" />
                            </div>
                            <small class="p-error">{{ mauSacError }}</small>
                        </div> -->

                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="dataVatLieu" v-model="selectedvatLieu"
                                        :class="{ 'p-invalid': vatLieuError }" optionLabel="ten" @change="onvatLieuChange">
                                    </Dropdown>
                                    <label for="dropdown">Vật liệu</label>
                                </span>
                                <TablevatLieu :tableId="'TablevatLieu'" :rightGhId="'right_ghvatLieu'"
                                    :tableClass="'TablevatLieu'" :rightGhClass="'right_ghvatLieu'" />
                            </div>
                            <small class="p-error">{{ vatLieuError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="dataTrongLuong" v-model="selectedTrongLuong"
                                        optionLabel="value" :class="{ 'p-invalid': trongLuongError }"
                                        @change="onTrongLuongChange"> </Dropdown>
                                    <label for="dropdown">Trọng Lượng</label>
                                </span>
                                <TableTrongLuong :tableId="'TableTrongLuong'" :rightGhId="'right_ghTrongLuong'"
                                    :tableClass="'TableTrongLuong'" :rightGhClass="'right_ghTrongLuong'" />
                            </div>
                            <small class="p-error">{{ trongLuongError }}</small>
                        </div>
                        <!-- <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 150px">
                                    <MultiSelect v-model="selectedSizes" :options="dataSize" optionLabel="ten"
                                        :filter="false" :maxSelectedLabels="3" :class="{ 'p-invalid': SizeError }"
                                        @change="onSizeChange"> </MultiSelect>
                                    <label for="multiselect">Size</label>
                                </span>
                                <TableSize :tableId="'TableMauSac'" :rightGhId="'right_ghMauSac'"
                                    :tableClass="'TableMauSac'" :rightGhClass="'right_ghMauSac'" />
                            </div>
                            <small class="p-error">{{ SizeError }}</small>
                        </div> -->

                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown id="dropdown" :options="dataThuongHieu" v-model="selectedCity"
                                        optionLabel="ten" @change="onCityChange" :class="{ 'p-invalid': thuongHieuError }">
                                    </Dropdown>
                                    <label for="dropdown">Thương Hiệu</label>
                                </span>
                                <TableThuongHieu :tableId="'TableThuongHieu'" :rightGhId="'right_ghThuongHieu'"
                                    :tableClass="'TableThuongHieu'" :rightGhClass="'right_ghThuongHieu'" />
                            </div>

                            <small class="p-error">{{ thuongHieuError }}</small>
                        </div>
                       
                        <div class="field col-12 md:col-12" style="margin-bottom: 30px">
                            <label for="address">Mô tả</label>
                            <Textarea id="address" rows="4" v-model="MoTa"
                                :class="{ 'p-invalid': MoTaSacError }"></Textarea>
                            <small class="p-error">{{ MoTaSacError }}</small>
                        </div>
                    </div>
                </div>
                <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                    <div class="p-fluid formgrid grid">
                        <div class="Field col-12 md:col-6"
                            style="margin-bottom: 30px; height: 300px; margin-top: 10px; display: inline-flex; justify-content: center; align-items: center">
                            <div style="display: block; margin-left: 200px">
                                <div class="t"
                                    style="border: 1px solid black; border-radius: 10px; width: 300px; height: 240px; margin-top: -60px">
                                    <img :src="anh == null ? imagesChinh : anh" alt=""
                                        style="width: 275px; height: 230px; top: 50%; left: 50%; transform: translate(4%, 2%)" />
                                </div>
                                <div class="buton" style="margin-top: 10px">
                                    <FileUpload mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000"
                                        @input="onFileInputImage" style="display: flex" />
                                </div>
                                <small class="p-error">{{ imagestError }}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-12">
                            <div v-for="(img, index) in arrayImage" :key="index" class="mausac-container"
                                style="display: inline-block; margin-left: 30px; margin-bottom: 15px; height: 90x; width: 100px">
                                <div class="img-product">
                                    <img :src="img.anh" alt=""
                                        style="width: 100px; height: 90px; top: 50%; left: 50%; transform: translate(4%, 2%); margin: 10px 0px 15px 0px" />
                                    <Button icon="pi pi-trash" class="p-button-warning mr-2"
                                        style="position: absolute; width: 25px; height: 25px; margin: 10px 0 0 10px; margin-left: 5px"
                                        @click="deleteImg(img.anh)" />
                                </div>
                            </div>
                        </div>
                    
                    </div>
                    <div class="field col-12 md:col-12">
                        <file-upload :upload-url="uploadUrl" :multiple="true" :maxFileSize="2000000"
                            @input="onFileInputImageProduct" :class="{ 'p-invalid': imagesProductError }"></file-upload>
                        <small class="p-error">{{ imagesProductError }}</small>
                    </div>
                    <DataTable ref="dt" :value="lstSize" v-model:selection="selectedProducts" dataKey="id" :paginator="true"
                        :rows="5" :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]" currentPageReportTemplate=" {first} to {last} of {totalRecords}"
                        responsiveLayout="scroll" showGridlines>
                        <template #header>

                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <div style="display: flex;">
                                    <h5 class="m-0" style="margin-right: 20px;"> Quản lý Size </h5>
                                </div>

                            </div>
                        </template>

                        <Column field="code" header="STT" :sortable="true" style="width: 1px; padding: 5px;">
                            <template #body="slotProps">
                                <span class="p-column-title">STT</span>
                                {{ lstSize.indexOf(slotProps.data) + 1 }}
                            </template>
                        </Column>


                        <Column field="code" header="Tên Size" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Tên Màu Sắc</span>
                                {{ slotProps.data === null ? "sản phẩm chưa có size" : slotProps.data.size.ten }}
                            </template>
                        </Column>

                        <Column header="Action" headerStyle="min-width:10rem;">
                            <template #body="slotProps">

                            </template>
                        </Column>

                    </DataTable>
                </div>
                <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                    <DataTable ref="dt" :value="lstMauSac" v-model:selection="selectedProducts" dataKey="id"
                        :paginator="true" :rows="5" :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        responsiveLayout="scroll" showGridlines>
                        <template #header>

                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <div style="display: flex;">
                                    <h5 class="m-0" style="margin-right: 20px;"> Quản lý Màu sắc</h5>
                                </div>

                            </div>
                        </template>


                        <Column field="code" header="STT" :sortable="true" style="width: 1px; padding: 5px;">
                            <template #body="slotProps">
                                <span class="p-column-title">STT</span>
                                {{ lstMauSac.indexOf(slotProps.data) + 1 }}
                            </template>
                        </Column>
                        <Column field="code" header="Ảnh" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Ảnh</span>
                                <img :src="slotProps.data.anh" :alt="i" class="shadow-2" width="50" />
                            </template>
                        </Column>
                        <Column field="code" header="Tên Màu Sắc" :sortable="true"
                            headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Tên Màu Sắc</span>
                                {{ slotProps.data.mauSac.ten }}
                            </template>
                        </Column>
                        <Column field="code" header="Tên Size" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Size</span>
                                {{ slotProps.data.sizeChiTiet === null ? "chưa có" : slotProps.data.sizeChiTiet.size.ten }}
                            </template>
                        </Column>
                        <Column field="code" header="Số Lượng" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Số Lượng</span>
                                {{ slotProps.data.soLuong }}
                            </template>
                        </Column>
                        <Column field="trangThai" header="Trạng Thái" sortable headerStyle="width: 4%; min-width: 5rem;">
                            <template #body="slotProps">
                                <!-- {{ slotProps.data.soLuong <= 0 ? "Hết":"còn hàng" }} -->
                                <Tag :value="getStatusLabel(slotProps.data.soLuong).text"
                                    :severity="getStatusLabel(slotProps.data.soLuong).severity" />
                            </template>
                        </Column>
                        <Column header="Action" headerStyle="min-width:10rem;">
                            <template #body="slotProps">

                            </template>
                        </Column>

                    </DataTable>
                </div>
                <div style="width: 1000px; text-align: center">
                    <Button type="submit" class="p-button-outlined" style="width: 200px; height: auto; margin: 10px"
                        label="Lưu"></Button>
                    <Button class="p-button-outlined" outlined severity="secondary"
                        style="width: 200px; height: auto; margin: 10px" @click="reset()" label="clear"></Button>
                </div>
            </div>
        </form>
    </Dialog>
</template>

<style scoped lang="scss">
.img-product {
    /* width: 100px;
  height: 90px; */
    position: relative;
    /* Thiết lập vị trí tương đối để dễ dàng định vị nút */
}

/* Định dạng cho nút */
// .p-button-warning {
//     position: absolute;
//     /* Thiết lập vị trí tuyệt đối để đặt nút trên hình ảnh */
//     top: 0;
//     /* Đặt nút ở trên cùng của hình ảnh */
//     left: 10;
//     /* Đặt nút ở bên trái của hình ảnh */
//     width: 25px;
//     height: 25px;
//     margin: 10px 0 0 10px;
// }
</style>
