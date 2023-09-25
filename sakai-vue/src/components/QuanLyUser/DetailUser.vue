<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';

const product = ref({});
const submitted = ref(false);
const productDialog = ref(false);
const valueChucVu = ref([
    { label: 'Nhân viên', value: 'Nhân viên' },
    { label: 'Quản lý', value: 'Quản lý' },
    { label: 'Khách hàng', value: 'Khách hàng' }
]);

// mở form
//truyền dữ liệu
// const editProduct = (editProduct) => {
//     product.value = { ...editProduct };
//     console.log(product);
//     productDialog.value = true;
// };
const editProduct = () => {
    product.value = { ...editProduct };
    console.log(product);
    productDialog.value = true;
};

//đóng form
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

//save
const saveProduct = () => {
    submitted.value = true;
    if (product.value.name && product.value.name.trim() && product.value.price) {
        if (product.value.id) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            products.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        productDialog.value = false;
        product.value = {};
    }
};
</script>
<template>
    <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="editProduct()" />

    <Dialog v-model:visible="productDialog" :style="{ width: '850px' }" header="Detail user" :modal="true" class="p-fluid">
        <div class="flex">
            <!-- Cột phải -->
            <div class="p-col-6">
                <div class="col-12">
                    <label>Mã: <span>Dụng</span></label>
                </div>
                <div class="col-12">
                    <label>Chức vụ: <span>Nhân viên</span></label>
                </div>
                <div class="col-12">
                    <label>Tên: <span>Dụng</span></label>
                </div>
                <div class="col-12">
                    <label>Mật khẩu: <span>Dụng</span></label>
                </div>
                <div class="col-12">
                    <label>Giới tính: <span>Nam</span></label>
                </div>
                <div class="col-12">
                    <label>Ngày sinh: <span>22/04/2003</span></label>
                </div>
                <div class="col-12">
                    <label>Sdt: <span>0339927992</span></label>
                </div>
                <div class="col-12">
                    <label>Email: <span>dungthoai321@gmail.com</span></label>
                </div>
                <div class="col-12">
                    <label>Địa chỉ: <span>Thôn Đông Mai, xã Trung Nghĩa, huyện Yên Phong, tỉnh Bắc Ninh.</span></label>
                </div>
                <div class="col-12">
                    <label>Trạng thái: <span>Đang làm</span></label>
                </div>
                <div class="col-12">
                    <label>Ngày tạo: <span>05/09/2023</span></label>
                </div>
                <div class="col-12">
                    <label>Ngày sửa: <span>05/09/2023</span></label>
                </div>
            </div>
            <!-- cột trái -->
            <div class="p-col-6">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlLDYj7R0ls8NKQQs-61U4--f5_VVutpWRZw&usqp=CAU" alt="User Image" />
            </div>
        </div>
    </Dialog>
    <!-- </div>
        </div>
    </div> -->
</template>
