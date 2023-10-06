<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, reactive } from 'vue';
import { ProductStore } from '../../../service/Admin/product/product.api';
import AddProduct from './addProduct.vue';
import { useToast } from 'primevue/usetoast';
import UpdateProduct from './updateProduct.vue';
import Detail from './DetailProduct.vue';

const productStore = ProductStore();
const toast = useToast();


const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
// const selectedColors = ref([]);
const selectedIndices = ref([]);



const myDiv = ref(null);
const div = ref(null);



onBeforeMount(() => {
    initFilters();
});

const products = ref([]);

const loadProducts = async () => {
    await productStore.fetchAll(); // Gọi hàm fetchAll từ Store
    products.value = productStore.products;
    const productList = productStore.products; // Lấy dữ liệu từ Store và gán vào biến products

    for (const [key, product] of productList.entries()) {
        // productList[key]['img'] = null;
        productList[key]['size'] = null;
        productList[key]['mauSac'] = null;
        productList[key]['img'] = null;
        const mau = await loadmau(product.id);
        productList[key]['mauSac'] = mau;
        const img_d = await loadSizeo(product.id);
        productList[key]['size'] = img_d;
        const img = await loadImg(product.id);
        productList[key]['img'] = img;
    }

    products.value = productList;
    //    console.log('sss: ', products.value);
};


const loadSize = ref([]);

const loadSizeo = async (idProduct) => {
    await productStore.fetchAllSize(idProduct); // Gọi hàm fetchAll từ Store
    loadSize.value = productStore.sizes;
    // console.log('size: ', loadSize.value);
    return loadSize.value;
};

const loadMau = ref([]);

const loadmau = async (idProduct) => {
    await productStore.fetchAllMauSac(idProduct); // Gọi hàm fetchAll từ Store
    loadMau.value = productStore.mauSacs;
    // console.log('mau: ',  loadMau.value );
    return loadMau.value;
};

const loadImage = ref([]);

const loadImg = async (idProduct) => {
    await productStore.fetchAllImage(idProduct); // Gọi hàm fetchAll từ Store
    loadImage.value = productStore.images;
    return loadImage.value;
};

const url = ref([]);

onMounted(() => {
    myDiv.value = document.getElementById('right_gh');
    div.value = document.getElementById('table');
    loadProducts();
});

// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const selectedCheckboxes = ref([]);


const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const chuyenPhanTu = (id) => {
    myDiv.value.style.display = 'block';
    div.value.style.display = 'none';
    var element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
};

const vePhanTu = (id) => {
    myDiv.value.style.display = 'none';
    div.value.style.display = 'block';
    var element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
};


const isSelectedIndex = (index) => {
    return selectedIndices.value.includes(index);
};

const columns = ref([
    { field: 'ma', header: 'Mã' },
    { field: 'giaBan', header: 'Giá bán' },
    { field: 'giaNhap', header: 'Giá Nhập' },
    { field: 'thuongHieu', header: 'Thương Hiệu' },
    { field: 'quaiDeo', header: 'Quai đeo' },
    { field: 'demLot', header: 'Đệm lót' },
    { field: 'soLuongTon', header: 'Số lượng' },
    { field: 'trongLuong', header: 'Trọng Lượng' },
    { field: 'vatLieu', header: 'Vật liệu' },
    { field: 'loai', header: 'Loại' },
    { field: 'moTa', header: 'Mô Tả' },

]);

// hàm để tắt/mở cột
const selectedColumns = ref(columns.value.soLuongTon);

const onToggle = (val) => {
    selectedColumns.value = columns.value.filter(col => val.includes(col));
};

const statuses = ref([
    { label: 'Còn hạn', value: 0 },
    { label: 'Hết hạn', value: 1 },

]);

const getStatusLabel = (trangThai) => {
    switch (trangThai) {
        case 1:
            return { text: 'Còn Hàng', severity: 'success' };

        case 2:
            return { text: 'hết Hàng', severity: 'danger' };

        case 3:
            return { text: 'tồn kho', severity: 'danger' };;

        default:
            return null;
    }
};

const idDelete = ref();
const confirmDeleteProduct = (id) => {
    idDelete.value = id;
    deleteProductDialog.value = true;
};

const deleteProduct = (id) => {
    productStore.delete(idDelete.value);
    products.value = productStore.products;
    toast.add({ severity: 'success', summary: 'Thông báo', detail: 'Xoá thành công', life: 3000 });
    deleteProductDialog.value = false;
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <section class="talbe" id="table">
                    <Toolbar class="mb-4">
                        <template v-slot:start>
                            <div class="my-2">
                                <AddProduct />
                                <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                                    @click="confirmDeleteSelected"
                                    :disabled="!selectedProducts || !selectedProducts.length" /> -->
                            </div>
                        </template>

                        <template v-slot:end>
                            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import"
                                chooseLabel="Import" class="mr-2 inline-block" />
                            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                        </template>
                    </Toolbar>

                    <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id"
                        :paginator="true" :rows="5" :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        responsiveLayout="scroll">
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <MultiSelect icon="pi pi-plus" :modelValue="selectedColumns" :options="columns"
                                    optionLabel="header" @update:modelValue="onToggle" display="chip"
                                    placeholder="Select Columns" />


                            </div>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0"> Products</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>


                        <Column field="code" header="STT" :sortable="true" style="width: 1px; padding: 5px;">
                            <template #body="slotProps">
                                <span class="p-column-title">STT</span>
                                {{ slotProps.data.stt }}
                            </template>
                        </Column>
                        <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Image</span>
                                <!-- <div v-for="(i, index) in img"  > -->
                                <img :src="slotProps.data.anh" :alt="i" class="shadow-2" width="100" />
                            </template>
                        </Column>
                        <Column field="ten" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Tên</span>
                                {{ slotProps.data.ten }}
                            </template>
                        </Column>
                        <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
                            :key="col.field + '_' + index" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        </Column>
                        <Column header="size - số lượng " headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">size</span>
                                <div v-for="i in slotProps.data.size ">
                                    <div class="col-6" style="width: 100px; display: flex;">
                                        <p style="margin: auto;"> {{ i.size.ten }} </p>
                                        <p style="margin: auto;">-</p>
                                        <p style="margin: auto;"> {{ i.soLuong }}</p>
                                    </div>
                                </div>
                            </template>
                        </Column>
                        <Column header="Màu Sắc " headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">size</span>
                                <div v-for="i in slotProps.data.mauSac">
                                    <div class="col-6"
                                        style="width: 110px;background-color: aliceblue; height: 60px; display: flex;margin-bottom: 5px; border: 1px solid aliceblue; border-radius: 10px;">
                                        <p style="margin: auto;">{{ i.mauSac.ten }}</p>
                                        <img :src="i.anh" class="shadow-2" width="100"
                                            style="margin-bottom: 30px; height: 40px; width: 40px; margin-left: 10px;" />
                                    </div>
                                </div>

                            </template>
                        </Column>
                        <Column header="Image" headerStyle="width: 14%; min-width: 10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">size</span>
                                <div class="image-container">
                                    <div v-for="i in slotProps.data.img" class="image-item">
                                        <img :src="i.anh" class="shadow-2" width="50" height="50" />
                                    </div>
                                </div>
                            </template>
                        </Column>
                        <Column field="trangThai" header="Trạng Thái" sortable style="min-width:9rem">
                            <template #body="slotProps">
                                <Tag :value="getStatusLabel(slotProps.data.trangThai).text"
                                    :severity="getStatusLabel(slotProps.data.trangThai).severity" />
                            </template>
                        </Column>


                        <Column header="Action" headerStyle="min-width:10rem;">
                            <template #body="slotProps">
                                <Detail :my-prop="slotProps.data"></Detail>
                                <UpdateProduct :my-prop="slotProps.data"></UpdateProduct>
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                    @click="confirmDeleteProduct(slotProps.data.id)" />
                            </template>
                        </Column>
                    </DataTable>
                    <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Xóa Sản phẩm"
                        :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="product">Bạn có chắc chắn muốn xoá size <b>{{ product.ten }}</b> không ?</span>
                        </div>
                        <template #footer>
                            <Button label="Không" icon="pi pi-times" class="p-button-text"
                                @click="deleteProductDialog = false" />
                            <Button label="Có" icon="pi pi-check" class="p-button-text"
                                @click="deleteProduct(product.id)" />
                        </template>
                    </Dialog>
                </section>
                <section class="right_gh" id="right_gh" style="display: none">


                    <!-- <Test/> -->
                </section>




            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

.product-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
}

.product-item {
    margin-top: 0px;
}

.product-name {
    margin-right: 20px;
    margin-left: 5px;
    margin-bottom: 1px;
}

.image-container {
    display: flex;
    flex-wrap: wrap;
}

.image-item {
    margin-bottom: 30px;
    margin-left: 10px;
    display: flex;
}
</style>


