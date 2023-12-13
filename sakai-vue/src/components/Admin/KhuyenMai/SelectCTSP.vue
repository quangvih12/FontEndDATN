<template>

    <Button icon="pi pi-search" class="p-button-rounded p-button-info ml-2" rounded  @click="showProduct()"/>
    <Dialog v-model:visible="selectedDialog" header="Flex Scroll" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }" class="p-fluid">
        <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0">Khuyến Mại</h5>
            </div>
        </template>
        <div class="card p-fluid">
            <DataTable
                :value="listSPCT"
                v-model:selection="selectedProduct"
                paginator
                :rows="5"
                :rowsPerPageOptions="[5, 10, 20, 50]"
                tableStyle="min-width: 50rem"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} listSPCT"
                responsiveLayout="scroll"
            >
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="tenSP" header="Sản Phẩm"></Column>
                <Column field="tenMauSac" header="Màu Sắc"></Column>
                <Column field="tenSize" header="Size"></Column>
                <Column field="giaBan" header="Giá Bán"></Column>
            </DataTable>
        </div>

        <template #footer>
            <Button label="Huỷ" icon="pi pi-times" class="p-button-text" @click="hide" />
            <Button label="Áp dụng" icon="pi pi-check" @click="applyKhuyenMai" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted} from 'vue';
// import { productStore } from '@/service/Admin/Product/ProductService.js';
import { ctspStore } from '@/service/Admin/SanPhamChiTiet/sanPhamCTService';
import { useToast } from 'primevue/usetoast';
import { khuyenMaiStore } from '@/service/Admin/KhuyenMai/KhuyenMaiService.js';

const khuyenmaiService = khuyenMaiStore();
const toast = useToast();
const listSPCT = ref(null);
const selectedProduct = ref([]);
// const productService = productStore();
const selectedDialog= ref(false);
const ctspService = ctspStore();
const props = defineProps({
    newProp: {}
});


const showProduct = () => {
    selectedDialog.value = true;
};


const hide = () => {
    selectedDialog.value = false;
};

const idsp =  props.newProp.id;
onMounted(() => {
    loadDataProduct(idsp);
});


const loadDataProduct = async (idsp) => {
    await ctspService.fetchData(idsp);
    listSPCT.value = ctspService.data;

};

const applyKhuyenMai = () => {
    // đây là số lượng SPCT được chọn để áp dụng khuyến mại
    const sl = selectedProduct.value.length;
    // đây là IdKM dùng để áp dụng được truyền từ component cha
    const idkm = localStorage.getItem("idkm")

    // duyệt qua mảng danh sách các CTSP được chọn 
    selectedProduct.value.forEach((product) => {
        const productId = product.id;
        // cập nhật lại giá tiền và id khuyến mại
        ctspService.updateCTSP(productId, idkm)             
    });

     localStorage.removeItem("idkm")
    selectedProduct.value = [];
     selectedDialog.value = false;
     loadDataProduct(idsp);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Áp dụng khuyến mại thành công', life: 3000 });
};
</script>