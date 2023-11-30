<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import ViewChucVu from '../ChucVu/ViewChucVu.vue';

const product = ref({});
const submitted = ref(false);
const productDialog = ref(false);

const valueChucVu = ref([
    { label: 'Nhân viên', value: 'Nhân viên' },
    { label: 'Quản lý', value: 'Quản lý' },
    { label: 'Khách hàng', value: 'Khách hàng' }
]);
// mở form
const openNew = () => {
    product.value = {};
    submitted.value = false;
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
    <Button label="Thêm mới" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
    <!-- <div class="grid">
        <div class="col-12">
            <div class="card"> -->
    <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Thêm địa chỉ" :modal="true" class="p-fluid">
        <div class="field">
            <label for="inventoryStatus" class="mb-3">Thành phố/Tỉnh</label>
            <div class="flex">
                <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="valueChucVu" optionLabel="label" placeholder="Select a Status" style="width: 100%">
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
            </div>
        </div>
        <div class="field">
            <label for="inventoryStatus" class="mb-3">Quận/Huyện</label>
            <div class="flex">
                <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="valueChucVu" optionLabel="label" placeholder="Select a Status" style="width: 100%">
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
            </div>
        </div>
        <div class="field">
            <label for="inventoryStatus" class="mb-3">Phường/Xã</label>
            <div class="flex">
                <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="valueChucVu" optionLabel="label" placeholder="Select a Status" style="width: 100%">
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
            </div>
        </div>
        <div class="field">
            <label for="name">Số nhà</label>
            <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
            <small class="p-invalid" v-if="submitted && !product.name">Số nhà không được trống.</small>
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
