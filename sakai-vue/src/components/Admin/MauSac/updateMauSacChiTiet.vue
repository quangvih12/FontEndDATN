<script setup>
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { ProductStore } from '../../../service/Admin/product/product.api';
import TableSize from '../Product/DataTableSize.vue';
import { useMauSacService } from '../../../service/Admin/MauSac/MauSacService';
import TableMauSac from '../Product/DataTableMauSac.vue';
import AddSizeChiTiet from '../QuanLySize/addSizeChiTiet.vue';

const productStore = ProductStore();
const mauSacStore = useMauSacService();
const toast = useToast();
const product = ref({});
const submitted = ref(false);
const productDialog = ref(false);
const props = defineProps({
    myProp: {},
    lst: {},
    idProduct: Number,
    soLuongTong: Number
});

// confirm thêm
const addProductDialog = ref(false);

//hiện confirm
const confirmAddProduct = () => {
    addProductDialog.value = true;
};

const schema = yup.object().shape({
    idMauSac: yup.number().required('bạn cần chọn màu sắc'),
    soLuong: yup.number().required('số lượng không được để trống').typeError('Số lượng tồn phải là một số').min(1, 'Số lượng phải lớn hơn hoặc bằng 1').max(1000, 'số lượng quá lớn').nullable(),
    anh: yup.string().required('bạn cần chọn ảnh cho màu sắc'),
});

const { handleSubmit, resetForm } = useForm({
    validationSchema: schema
});

const { value: idSizeChiTiet, errorMessage: sizeError } = useField('idSizeChiTiet');
const { value: idMauSac, errorMessage: MauSacError } = useField('idMauSac');
const { value: soLuong, errorMessage: soLuongError } = useField('soLuong');
const { value: anh, errorMessage: anhError } = useField('anh');
//add
const onSubmit = handleSubmit(async (values) => {
    submitted.value = true;

    const form = {
        idSanPhamChiTiet: props.idProduct,
        idMauSac: values.idMauSac,
        soLuong: values.soLuong,
        anh: values.anh,
        idSizeChiTiet: values.idSizeChiTiet
    };
    console.log(form)
    let sum = 0;
    for (const mauSac of props.lst) {
        sum += Math.floor(mauSac.soLuong);

    }
    let tong = Math.floor(sum) + Math.floor(values.soLuong);
    const isDuplicate = await productStore.checkMauSac(props.idProduct, values.idSizeChiTiet, values.idMauSac);
    if (isDuplicate) {
        // Hiển thị thông báo lỗi hoặc xử lý theo nhu cầu của bạn
        toast.add({ severity: 'error', summary: 'Error', detail: 'Size đã tồn tại', life: 3000 });
    } 
    else if (Math.floor(tong) > Math.floor(props.soLuongTong)) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Tổng số lượng màu sắc lớn hơn số lượng tổng ' + tong + ' > ' + props.soLuongTong, life: 3000 });
    } 
    else {
       await productStore.editMauSac(form,props.myProp.id);
        productDialog.value = false;
    }

});

const reset = () => {
    resetForm();
    selectedSize.value = null;
    selectedMauSac.value = null;
    anh1.value = 'https://cdn-icons-png.flaticon.com/512/2956/2956744.png';
}


const soLuongs = ref(0);
// mở form
const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;

    soLuong.value = props.myProp.soLuong;
    anh.value = props.myProp.anh;
    selectedMauSac.value = props.myProp;
    const selectedMauSacs = dataMauSac.value.find((item) => item.ten === props.myProp.ten);
    selectedMauSac.value = selectedMauSacs;
    if (selectedMauSac.value) {
        idMauSac.value = selectedMauSac.value.id;
    } else {
        idMauSac.value = null;
    }

    selectedSize.value = props.myProp;

    const selectedSizes = lstSize.value.find((item) => item.ten === props.myProp.tenSize);
    selectedSize.value = selectedSizes;
    if (selectedSize.value) {
        idSizeChiTiet.value = selectedSize.value.id;
    } else {
        idSizeChiTiet.value = null;
    }
};


const lstSize = ref([]);
const loadDataSize = async () => {
    await productStore.fetchAllSize(props.idProduct);
    lstSize.value = [{id: -1, ten: 'Không có'}, ...productStore.sizes];

}


onMounted(() => {
    loadDataSize();
    loadDataMauSac();
});
const selectedSize = ref(null);
const onSizeChange = () => {
    if (selectedSize.value) {
        idSizeChiTiet.value = selectedSize.value.id;
    } else {
        idSizeChiTiet.value = null;
    }
};

const dataMauSac = ref([]);
const loadDataMauSac = async () => {
    await mauSacStore.fetchDataByStatus(1);
    dataMauSac.value = mauSacStore.dataByStatus1;
};

const selectedMauSac = ref([]);
const onMauSacChange = () => {
    if (selectedMauSac.value) {
        //  const selectedIds = selectedMauSac.value.map((item) =>  item.id);
        idMauSac.value = selectedMauSac.value.id;
        //  console.log(idMauSac.value);
    } else {
        idMauSac.value = null;
    }
};


const anh1 = ref('https://cdn-icons-png.flaticon.com/512/2956/2956744.png');

function onFileInputImage(event) {
    const files = event.target.files;
    // Lặp qua từng tệp trong mảng files
    for (const file of files) {
        const objectURL = URL.createObjectURL(file);
        // Gán giá trị cho phần tử có id là 'imagesChinh' (thay đổi id nếu cần)
        const basePath = "D:\\imgDATN\\"; // Đường dẫn cố định
        const fileName = basePath + file.name;
        anh.value = fileName;
        anh1.value = objectURL;
        // console.log('anh chinh: ', imagesChinh.value)
    }
}
</script>
<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="openNew" />

    <Dialog v-model:visible="productDialog" :style="{ width: '600px' }" header="Thêm size" :modal="true" class="p-fluid">
        <div class="card">
            <form @submit="onSubmit">
                <div class="p-fluid formgrid grid">
                    <div class="Field col-12 md:col-6" style="margin-top: 20px">
                        <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                            <span class="p-float-label">
                                <InputNumber id="soluong" v-model="soLuong" :class="{ 'p-invalid': soLuongError }"
                                    style="width: 140px;">
                                </InputNumber>
                                <label for="SoLuongTon">Số lượng tồn</label>
                            </span>
                            <small class="p-error">{{ soLuongError }}</small>
                        </div>
                        <div class="Field col-12 md:col-3" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 239px">
                                    <Dropdown v-model="selectedMauSac" :options="dataMauSac" optionLabel="ten"
                                        :class="{ 'p-invalid': MauSacError }" @change="onMauSacChange"
                                        style="width: 140px;"> </Dropdown>
                                    <label for="multiselect">Màu sắc</label>
                                </span>

                                <TableMauSac :tableId="'TableMauSac'" :rightGhId="'right_ghMauSac'"
                                        :tableClass="'TableMauSac'" :rightGhClass="'right_ghMauSac'" />
                            </div>
                            <small class="p-error">{{ MauSacError }}</small>
                        </div>
                        <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                            <div style="display: flex">
                                <span class="p-float-label" style="width: 350px">
                                    <Dropdown id="dropdown" :options="lstSize" v-model="selectedSize" optionLabel="ten"
                                        :class="{ 'p-invalid': sizeError }" @change="onSizeChange" style="width: 140px;">
                                    </Dropdown>
                                    <label for="dropdown">Size</label>
                                </span>
                                <div>
                                </div>
                               
                            </div> 
                            <small class="p-error" style="width: 550px;">{{ sizeError }}</small>
                        </div>
                    </div>

                    <div class="Field col-12 md:col-6" style="margin-bottom: 30px">
                        <div
                            style="margin-bottom: 30px; height: 300px; margin-top: 10px; display: inline-flex; justify-content: center; align-items: center">
                            <div style="display: block">
                                <div class="t"
                                    style="border: 1px solid black; border-radius: 10px; width: 200px; height: 180px; margin-top: -60px">
                                    <img :src="anh" alt=""
                                        style="width: 180px; height: 170px; top: 50%; left: 50%; transform: translate(4%, 2%)" />
                                </div>
                                <div class="buton" style="margin-top: 10px">
                                    <FileUpload mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000"
                                        @input="onFileInputImage" style="display: flex" />
                                </div>
                                <small class="p-error">{{ anhError }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="Field col-12 md:col-12" style="margin-bottom: 30px">
                        <div style="width: 1000px; text-align: center;display: flex; margin-left: 120px;">
                            <Button class="p-button-outlined" outlined severity="secondary"
                                style="width: 100px; height: auto; margin: 10px" @click="reset()" label="clear"></Button>
                            <Button type="submit" class="p-button-outlined" style="width: 100px; height: auto; margin: 10px"
                                label="Lưu"></Button>
                        </div>
                    </div>

                </div>

            </form>
        </div>

    </Dialog>
    <!-- </div>
        </div>
    </div> -->
</template>
