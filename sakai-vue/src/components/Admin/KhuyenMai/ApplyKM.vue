<template>
    <!-- không thể chọn CTSP áp dụng khuyến mại nếu trạng thái khuyến mại là hết hạn ( = 1) -->
    <Button icon="pi pi-search" class="p-button-rounded p-button-info ml-2" @click="showProducts()" :disabled="props.myProp.trangThai === 1" />
    <Dialog v-model:visible="selectedProductDialog" header="Flex Scroll" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }" class="p-fluid">
        <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0">Khuyến Mại</h5>
            </div>
        </template>
        <div class="card p-fluid">
            <DataTable
                :value="products"
                v-model:selection="selectedProduct"
                paginator
                :rows="5"
                :rowsPerPageOptions="[5, 10, 20, 50]"
                tableStyle="min-width: 50rem"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                responsiveLayout="scroll"
            >
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="sanPham.ten" header="Sản Phẩm"></Column>
                <Column field="sanPham.loai.ten" header="Loại"></Column>
                <Column field="giaBan" header="Giá Bán"></Column>
                <Column field="sanPham.thuongHieu.ten" header="Thương Hiệu"></Column>
            </DataTable>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" @click="applyKhuyenMai" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
// import { productStore } from '@/service/Admin/Product/ProductService.js';
import { khuyenMaiStore } from '@/service/Admin/KhuyenMai/KhuyenMaiService.js';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const products = ref(null);
const selectedProduct = ref([]);
// const productService = productStore();
const selectedProductDialog = ref(false);
const khuyenmaiService = khuyenMaiStore();
const khuyenmais = ref([]);
const props = defineProps({
    myProp: {}
});
// đây là số lượng khuyến mại còn lại theo IdKM khi được chọn
const soLuong = props.myProp.soLuong;


const showProducts = () => {
    selectedProductDialog.value = true;
};
// dùng emit để cập nhật lại số lượng khuyến mại ở component cha
const emits = defineEmits(['update']);

const hideDialog = () => {
    selectedProductDialog.value = false;
};

onMounted(() => {
    loadDataProduct();
});

const loadDataProduct = async () => {
    await khuyenmaiService.getProduct();
    products.value = khuyenmaiService.data;
};

const loadDataKhuyenmai = async () => {
    await khuyenmaiService.getKhuyenMai();
    khuyenmais.value = khuyenmaiService.data;
};

const applyKhuyenMai = () => {
    // đây là số lượng SPCT được chọn để áp dụng khuyến mại
    const sl = selectedProduct.value.length;
    // đây là IdKM dùng để áp dụng được truyền từ component cha
    const idkm = props.myProp.id;

    // duyệt qua mảng danh sách các CTSP được chọn 
    selectedProduct.value.forEach((product) => {
        const productId = product.id;
        // cập nhật lại giá tiền và id khuyến mại
        khuyenmaiService.updateCTSP(productId, idkm);
        loadDataProduct();
        selectedProduct.value = [];
        selectedProductDialog.value = false;
    });
    loadDataProduct();
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Áp dụng khuyến mại thành công', life: 3000 });
};
</script>
