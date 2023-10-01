<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, reactive } from 'vue';
import { ProductStore } from '../../../service/Admin/product/product.api';
import AddProduct from './addProduct.vue';
import { useToast } from 'primevue/usetoast';
import UpdateProduct from './updateProduct.vue';
// import { BIconVolumeUp } from 'bootstrap-vue';

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
    await productStore.fetchAll(); // Gọi hàm fetchAll từ Stor
    products.value  = productStore.products;
    console.log(products.value);
    // const productList = productStore.products; // Lấy dữ liệu từ Store và gán vào biến products
    // productList.forEach(async (product, key) =>  {
    //     productList[key]['img'] = null
    //    const img_d = await loadImage(product.id);
    //    productList[key]['img'] = img_d;
    // });
    // products.value = productList


};

const img = ref([]);

const loadImage = async (idProduct) => {
   // console.log('id: ',idProduct);
    await productStore.fetchAllImage(idProduct); // Gọi hàm fetchAll từ Store
    img.value = productStore.images;
 //   const t = img.value;
   return img.value;

};



const url = ref([]);

onMounted(() => {
    myDiv.value = document.getElementById('right_gh');
    div.value = document.getElementById('table');
    loadProducts();
   console.log('hhh: ',products);
   // fetchData();


   
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
    { field: 'moTa', header: 'Mô Tả' },
    { field: 'thuongHieu', header: 'Thương Hiệu' },
    { field: 'quaiDeo', header: 'Quai đeo' },
    { field: 'demLot', header: 'Đệm lót' },
    { field: 'soLuongTon', header: 'Số lượng' },
    { field: 'trongLuong', header: 'Trọng Lượng' },
    { field: 'vatLieu', header: 'Vật liệu' },
    { field: 'Loại', header: 'Loại' },
]);

// hàm để tắt/mở cột
const selectedColumns = ref(columns.value);

const onToggle = (val) => {
    selectedColumns.value = columns.value.filter(col => val.includes(col));
};

const statuses = ref([
    { label: 'Còn hạn', value: 0 },
    { label: 'Hết hạn', value: 1 },
    { label: 'Hết khuyến mại', value: 2 }
]);

const getStatusLabel = (trangThai) => {
    switch (trangThai) {
        case 1:
            return { text: 'Còn Hàng', severity: 'success' };

        case 2:
            return { text: 'InActive', severity: 'danger' };

        case 3:
            return 'danger';

        default:
            return null;
    }
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
                                <Button label="New" icon="pi pi-plus" class="p-button-success mr-2"
                                    @click="chuyenPhanTu('right_gh')" />
                                <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                                    @click="confirmDeleteSelected"
                                    :disabled="!selectedProducts || !selectedProducts.length" />
                            </div>
                        </template>

                        <template v-slot:end>
                            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import"
                                chooseLabel="Import" class="mr-2 inline-block" />
                            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                        </template>
                    </Toolbar>

                    <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id"
                        :paginator="true" :rows="10" :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        responsiveLayout="scroll">
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <MultiSelect icon="pi pi-plus" :modelValue="selectedColumns" :options="columns"
                                    optionLabel="header" @update:modelValue="onToggle" display="tag"
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

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="code" header="STT" :sortable="true" headerStyle="width:14%; min-width:10rem;">
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
                                    <!-- </div> -->
                               
                                
                            </template>
                        </Column>
                        <Column field="ma" header="Mã" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Mã</span>
                                {{ slotProps.data.ma }}
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
                        <Column field="trangThai" header="Trạng Thái" sortable style="min-width:12rem">
                            <template #body="slotProps">
                                <Tag :value="getStatusLabel(slotProps.data.trangThai).text"
                                    :severity="getStatusLabel(slotProps.data.trangThai).severity" />
                            </template>
                        </Column>


                        <Column headerStyle="min-width:10rem;">
                            <template #body="slotProps">
                                <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" /> -->
                                <UpdateProduct :my-prop="slotProps.data"></UpdateProduct>
                            </template>
                        </Column>
                    </DataTable>
                </section>
                <section class="right_gh" id="right_gh" style="display: none">
                    <Button icon="pi pi-angle-double-left" class="p-button-success mr-2" @click="vePhanTu(table)" />
                    <AddProduct />
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
</style>
