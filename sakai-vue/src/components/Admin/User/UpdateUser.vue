<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import ViewChucVu from '../ChucVu/ViewChucVu.vue';
import ViewDiaChi from '../DiaChi/ViewDiaChi.vue';

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
    <!-- truyền dữ liệu -->
    <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" /> -->
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct()" />
    <!-- <div class="grid">
        <div class="col-12">
            <div class="card"> -->
    <Dialog v-model:visible="productDialog" :style="{ width: '600px' }" header="Update user" :modal="true" class="p-fluid">
        <div class="flex">
            <!-- Cột phải -->
            <div class="p-col-6">
                <div class="field">
                    <label for="inventoryStatus" class="mb-3">Chức vụ</label>
                    <div class="flex">
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="valueChucVu" optionLabel="label" placeholder="Select a Status" style="width: 90%; margin-right: 20px">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                        <ViewChucVu></ViewChucVu>
                    </div>
                </div>
                <div class="field">
                    <label for="name">Tên người dùng</label>
                    <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                    <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="name">Mật khẩu</label>
                    <Password v-model="product.pass" toggleMask />
                    <small class="p-invalid" v-if="submitted && !product.pass">Pass is required.</small>
                </div>
                <div class="field">
                    <label class="mb-3">Giới tính</label>
                    <div class="formgrid grid">
                        <div class="field-radiobutton col-6">
                            <RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
                            <label for="category1">Nam</label>
                        </div>
                        <div class="field-radiobutton col-6">
                            <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                            <label for="category2">Nữ</label>
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label for="name">Ngày sinh</label>
                    <div><InputText type="date" class="input" v-model.trim="product.ngaySinh" /></div>
                    <small class="p-invalid" v-if="submitted && !product.ngaySinh">Pass is required.</small>
                    <!-- <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small> -->
                </div>
                <div class="field">
                    <label for="name">Sdt</label>
                    <InputText id="name" v-model.trim="product.sdt" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                    <small class="p-invalid" v-if="submitted && !product.sdt">Email is required.</small>
                </div>
                <div class="field">
                    <label for="name">Email</label>
                    <InputText id="name" v-model.trim="product.email" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                    <small class="p-invalid" v-if="submitted && !product.email">Email is required.</small>
                </div>
                <div class="field">
                    <label for="inventoryStatus" class="mb-3">Địa chỉ </label>
                    <div class="flex">
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="valueChucVu" optionLabel="label" placeholder="Select a Status" style="width: 90%; margin-right: 20px">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                        <ViewDiaChi></ViewDiaChi>
                    </div>
                </div>
            </div>
            <!-- cột trái -->
            <div class="p-col-6" style="margin-left: 30px">
                <FileUpload mode="basic" name="demo[]" url="./upload.php" accept="image/*" :maxFileSize="1000000" @upload="onUpload" style="margin-left: 30%; margin-bottom: 10px" />
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlLDYj7R0ls8NKQQs-61U4--f5_VVutpWRZw&usqp=CAU" alt="User Image" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
        </template>
    </Dialog>
    <!-- </div>
        </div>
    </div> -->
</template>
