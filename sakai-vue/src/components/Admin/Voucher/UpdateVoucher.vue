<template>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="openUpdateDialog()" />
    <Dialog v-model:visible="updatevoucherDialog" :style="{ width: '450px' }" header="Update Voucher" :modal="true" class="p-fluid">
        <div class="field">
            <label for="ten">Tên</label>
            <InputText id="ten" v-model="ten" :class="{ 'p-invalid': tenError }" required="true" />
            <small class="p-error">{{ tenError }}</small>
        </div>
        <div class="field">
            <label for="thoiGianBatDau">Ngày Bắt Đầu</label>
            <Calendar id="thoiGianBatDau" v-model="thoiGianBatDau" :class="{ 'p-invalid': thoiGianBatDauError }" dateFormat="yy/mm/dd" showIcon />
            <small class="p-error">{{ thoiGianBatDauError }}</small>
        </div>
        <div class="field">
            <label for="thoiGianKetThuc">Ngày Kết Thúc</label>
            <Calendar id="thoiGianKetThuc" v-model="thoiGianKetThuc" :class="{ 'p-invalid': thoiGianKetThucError }" dateFormat="yy/mm/dd" showIcon />
            <small class="p-error">{{ thoiGianKetThucError }}</small>
        </div>
        <div class="field">
            <label for="moTa">Mô Tả</label>
            <InputText id="moTa" v-model.trim="moTa" :class="{ 'p-invalid': moTaError }" />
            <small class="p-error">{{ moTaError }}</small>
        </div>

        <div class="field">
            <label for="soLuong">Số Lượng</label>
            <InputText id="soLuong" v-model="soLuong" :class="{ 'p-invalid': soLuongError }" />
            <small class="p-error">{{ soLuongError }}</small>
        </div>

        <div class="field">
            <label for="price">Giảm Tối Đa</label>
            <InputNumber id="price" v-model="giamToiDa" :class="{ 'p-invalid': giamToiDaError }" />
            <small class="p-error">{{ giamToiDaError }}</small>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialogVoucher" />
            <Button type="submit" label="Save" icon="pi pi-check" class="p-button-text" @click="update" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, defineProps} from 'vue';
import { voucherStore } from '@/service/Admin/Voucher/VoucherService.js';
import { useToast } from 'primevue/usetoast';
import * as Yup from 'yup';
import { useField, useForm } from 'vee-validate';
const toast = useToast();
const VoucherService = voucherStore();
const props = defineProps({
    myProp: {}
});
const updatevoucherDialog = ref(false);
const schema = Yup.object().shape({
    ten: Yup.string()
        .required('Tên sản phẩm không được để trống')
        .min(4, 'Tên sản phẩm phải có ít nhất 4 ký tự')
        .matches(/^[a-zA-Z0-9đĐáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬêÊếẾềỀểỂễỄệỆôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢùÙúÚụỤủỦũŨưỨỨửỬữỮựỰýÝỳỲỷỶỹỸỵỴ\s]*$/, 'Tên không được chứa kí tự đặc biệt!'),
    moTa: Yup.string().required('Vui lòng điền mô tả voucher').min(10, 'Mô tả voucher phải có ít nhất 10 ký tự'),
    soLuong: Yup.number().required('Bạn cần nhập số lượng voucher').typeError('Số lượng voucher phải là một số').min(1, 'Số lượng phải lớn hơn hoặc bằng 1').nullable(),
    thoiGianBatDau: Yup.date().nullable().required('Thời gian bắt đầu là bắt buộc').typeError('Vui lòng chọn ngày hợp lệ'),
    thoiGianKetThuc: Yup.date().nullable().min(Yup.ref('thoiGianBatDau'), 'Ngày kết thúc phải sau ngày bắt đầu').required('Thời gian kết thúc là bắt buộc').typeError('Vui lòng chọn ngày hợp lệ'),
    giamToiDa: Yup.number().required('Bạn cần nhập giá trị giảm').typeError('Giá trị giảm phải là một số').min(1, 'Giá trị giảm phải lớn hơn hoặc bằng 1').nullable()
});

const { handleSubmit, resetForm } = useForm({
    validationSchema: schema
});

const { value: ten, errorMessage: tenError } = useField('ten');
const { value: moTa, errorMessage: moTaError } = useField('moTa');
const { value: soLuong, errorMessage: soLuongError } = useField('soLuong');
const { value: thoiGianBatDau, errorMessage: thoiGianBatDauError } = useField('thoiGianBatDau');
const { value: thoiGianKetThuc, errorMessage: thoiGianKetThucError } = useField('thoiGianKetThuc');
const { value: giamToiDa, errorMessage: giamToiDaError } = useField('giamToiDa');

const openUpdateDialog = () => {
    ten.value = props.myProp.ten;
    thoiGianBatDau.value = props.myProp.thoiGianBatDau;
    thoiGianKetThuc.value = props.myProp.thoiGianKetThuc;
    moTa.value = props.myProp.moTa;
    soLuong.value = props.myProp.soLuong;
    giamToiDa.value = props.myProp.giamToiDa;
    updatevoucherDialog.value = true;
};

const hideDialogVoucher = () => {
    updatevoucherDialog.value = false;
    resetForm()
};

const update = handleSubmit(async () => {
    const form = {
        ten: ten.value,
        thoiGianBatDau: thoiGianBatDau.value,
        thoiGianKetThuc: thoiGianKetThuc.value,
        moTa: moTa.value,
        soLuong: soLuong.value,
        giamToiDa: giamToiDa.value
    };

    VoucherService.updateVoucher(form, props.myProp.id);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Cập nhật thành công', life: 3000 });
    updatevoucherDialog.value = false;
});
</script>
