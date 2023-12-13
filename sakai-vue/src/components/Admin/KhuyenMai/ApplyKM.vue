<template>
    <!-- không thể chọn CTSP áp dụng khuyến mại nếu trạng thái khuyến mại là hết hạn ( = 1) -->
    <Button icon="pi pi-search" class="p-button-rounded p-button-info ml-2" @click="showProducts()" :disabled="props.myProp.trangThai === 1" />
    <Dialog v-model:visible="selectedProductDialog" header="Flex Scroll" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }" class="p-fluid">
        <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0 ">Khuyến Mại</h5>              
            </div>

            <Dropdown id="dropdown" :options="dataLoai" v-model="selectedLoai" optionLabel="ten"  placeholder="Tất cả" :class="{ 'p-invalid': loaiError }" style="height: 40px"> </Dropdown>
                <!-- <label for="dropdown" style="margin-left: 10px;">Loại</label> -->
            <!-- <Dropdown v-model="thuongHieu" :options="dataThuongHieu" optionLabel="label" placeholder="Tất cả" class="w-full md:w-14rem" style="margin-left: 20px" /> -->
            <Dropdown id="dropdown" :options="dataThuongHieu" v-model="selectedThuongHieu" optionLabel="ten"  placeholder="Tất cả" :class="{ 'p-invalid': loaiError }" style="height: 40px"> </Dropdown>

        </template>
        <div class="card p-fluid">
            <DataTable
                :value="products"
                paginator
                :rows="5"
                :rowsPerPageOptions="[5, 10, 20, 50]"
                tableStyle="min-width: 50rem"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                responsiveLayout="scroll"
            >
                <Column field="code" header="STT" :sortable="true" style="width: 1px; padding: 5px">
                    <template #body="slotProps">
                        <span class="p-column-title">STT</span>
                        {{ products.indexOf(slotProps.data) + 1 }}
                    </template>
                </Column>
                <Column field="ma" header="Mã" :sortable="true" headerStyle="width:8%; min-width:3rem;">
                    <template #body="slotProps">
                        <span class="p-column-title">ma</span>
                        {{ slotProps.data.ma }}
                    </template>
                </Column>
                <Column header="Image" headerStyle="width:8%; min-width:5rem;">
                    <template #body="slotProps">
                        <span class="p-column-title">Image</span>

                        <img :src="slotProps.data.anh" :alt="i" class="shadow-2" width="100" />
                    </template>
                </Column>
                <Column field="ten" header="Tên" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                    <template #body="slotProps">
                        <span class="p-column-title">Tên</span>
                        {{ slotProps.data.ten }}
                    </template>
                </Column>
                <Column field="loai" header="Loại" :sortable="true" headerStyle="width:8%; min-width:5rem;">
                    <template #body="slotProps">
                        <span class="p-column-title">Tên</span>
                        {{ slotProps.data.loai }}
                    </template>
                </Column>
                <Column field="thuongHieu" header="Thương Hiệu" :sortable="true" headerStyle="width:14%; min-width:5rem;">
                    <template #body="slotProps">
                        <span class="p-column-title">Tên</span>
                        {{ slotProps.data.thuongHieu }}
                    </template>
                </Column>
                <Column field="vatLieu" header="Vật Liệu" :sortable="true" headerStyle="width:14%; min-width:5rem;">
                    <template #body="slotProps">
                        <span class="p-column-title">Tên</span>
                        {{ slotProps.data.vatLieu }}
                    </template>
                </Column>

                <Column field="trangThai" header="Trạng Thái" sortable headerStyle="width: 14%; min-width: 8rem;">
                    <template #body="slotProps">
                        <Tag :value="getStatusLabel(slotProps.data.soLuongTon, slotProps.data.trangThai).text" :severity="getStatusLabel(slotProps.data.soLuongTon, slotProps.data.trangThai).severity" />
                    </template>
                </Column>

                <Column header="Action" headerStyle="min-width:10rem;">
                    <template #body="slotProps">                    
                        <SelectCTSP :new-prop="slotProps.data"></SelectCTSP>               
                    </template>
                </Column>
            </DataTable>
        </div>

        <template #footer>
            <Button label="Huỷ" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <!-- <Button label="Save" icon="pi pi-check" @click="applyKhuyenMai" /> -->
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useLoaiService } from '@/service/Admin/Loai/LoaiService';
import { useCounterStore } from '@/service/Admin/ThuongHieu/ThuongHieuService.js';
import { ProductStore } from '@/service/Admin/product/product.api';
import SelectCTSP from './SelectCTSP.vue';

const productStore = ProductStore();
const thuonghieuService =  useCounterStore();
const loaiStore = useLoaiService();
const products = ref([]);
const showSpinner = ref(false);
// const productService = productStore();
const selectedProductDialog = ref(false);
const dataLoai = ref([]);
const dataThuongHieu = ref([]);

const props = defineProps({
    myProp: {}
});


onMounted(() => {
    loadProducts();
    loadDataLoai();
    loadDataThuongHieu()
});


const showProducts = () => {
    localStorage.setItem("idkm",props.myProp.id )
    selectedProductDialog.value = true;
};


const hideDialog = () => {
    selectedProductDialog.value = false;
};



const loadProducts = async () => {
    showSpinner.value = true;
    await productStore.fetchAll(); // Gọi hàm fetchAll từ Store
    products.value = productStore.products;
};

const selectedLoai = ref(null);
const loadDataLoai = async () => {
    await loaiStore.fetchDataByStatus(1);
    dataLoai.value = loaiStore.dataByStatus1;
   
};
watch(selectedLoai, (newVal, oldVal) => {
  // Kiểm tra nếu giá trị mới khác giá trị cũ
  if (newVal !== oldVal) {
    // Gọi hàm để cập nhật dataTable dựa trên giá trị mới của selectedLoai
    updateDataTableLoai();
  }
});


const selectedThuongHieu = ref(null);
const loadDataThuongHieu= async () => {
    await thuonghieuService.fetchData();
    dataThuongHieu.value = thuonghieuService.data;
   
};

watch(selectedThuongHieu, (newVal, oldVal) => {
  // Kiểm tra nếu giá trị mới khác giá trị cũ
  if (newVal !== oldVal) {
    // Gọi hàm để cập nhật dataTable dựa trên giá trị mới của selectedLoai
    updateDataTableThuongHieu();
  }
});


const updateDataTableLoai = async () => {
    await productStore. fetchDataByLoai(selectedLoai.value.id); 
    products.value = productStore.products;
};


const updateDataTableThuongHieu = async () => {
    await productStore.fetchDataByThuongHieu(selectedThuongHieu.value.id); 
    products.value = productStore.products;
};


const getStatusLabel = (soLuong, trangThai) => {
    if (soLuong > 0 && trangThai == 1) {
        return { text: 'Còn Hàng', severity: 'success' };
    } else if (soLuong <= 0 || trangThai == 0) {
        return { text: 'Hết Hàng', severity: 'danger' };
    } else {
        return { text: 'Tồn Kho', severity: 'info' };
    }
};
</script>
