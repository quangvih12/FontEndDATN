<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, reactive, watch } from 'vue';
import { ProductStore } from '../../../service/Admin/product/product.api';
import AddProduct from './addProduct.vue';
import { useToast } from 'primevue/usetoast';
import UpdateProduct from './updateProduct.vue';
import Detail from './DetailProduct.vue';
import ProgressSpinner from 'primevue/progressspinner';
import ExcelJS from 'exceljs';

const column = [
    'STT',
    'Sản phẩm',
    'Vật liệu',
    'Trọng lượng',
    'Giá bán',
    'Giá nhập',
    'Số lượng',
    'Id màu sắc',
    'Id size',
    'Tên màu sắc',
    'Số lượng size',
    'Ảnh màu sắc 01',
    'Ảnh màu sắc 02',
    'Ảnh màu sắc 03',
    'Ảnh chính',
    'Ảnh 01',
    'Ảnh 02',
    'Ảnh 03',
    'Quai đeo',
    'Đệm lót',
    'Mô tả sản phẩm',
    'Loại sản phẩm',
    'Thương hiệu'
];

const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Đặt hàng đầu tiên (header) với màu nền và chữ in đậm
    const headerRow = worksheet.addRow(column);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' } // Màu nền của header
        };
        cell.font = {
            bold: true // Chữ in đậm
        };
    });

    // Tạo và tải file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sanPham.xlsx'; // Tên file Excel khi tải về
        a.click();
        window.URL.revokeObjectURL(url);
    });
};

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
const showSpinner = ref(false);
const visibledatatable = ref(false);
const loadProducts = async () => {
    showSpinner.value = true;
    visibledatatable.value = false;
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
    for (let i = 0; i < 1; i++) {
        soLuongSP.value = products.value[i].soLuongSanPham;
    }
    showSpinner.value = false;
    visibledatatable.value = true;
};


const loadSize = ref([]);

const loadSizeo = async (idProduct) => {
    await productStore.fetchAllSize(idProduct); // Gọi hàm fetchAll từ Store
    loadSize.value = productStore.sizes;
    return loadSize.value;
};

const loadMau = ref([]);

const loadmau = async (idProduct) => {
    await productStore.fetchAllMauSac(idProduct); // Gọi hàm fetchAll từ Store
    loadMau.value = productStore.mauSacs;
    return loadMau.value;
};

const loadImage = ref([]);

const loadImg = async (idProduct) => {
    await productStore.fetchAllImage(idProduct); // Gọi hàm fetchAll từ Store
    loadImage.value = productStore.images;
    return loadImage.value;
};

const url = ref([]);
let soLuongSP = ref(null);
onMounted(() => {
    myDiv.value = document.getElementById('right_gh');
    div.value = document.getElementById('table');
    loadProducts();
});

const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

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
    { field: 'thuongHieu', header: 'Thương Hiệu' },
    { field: 'quaiDeo', header: 'Quai đeo' },
    { field: 'demLot', header: 'Đệm lót' },
    { field: 'soLuongTon', header: 'Số lượng' },
    { field: 'trongLuong', header: 'Trọng Lượng' },
    { field: 'vatLieu', header: 'Vật liệu' },
    { field: 'loai', header: 'Loại' },
    { field: 'moTa', header: 'Mô Tả' },
    { field: 'giaSauGiam', header: 'Giá giảm giá' },
    { field: 'tenKM', header: 'Tên Khuyến Mãi' },
    { field: 'thoiGianBatDau', header: 'Thời gian bắt đầu' },
    { field: 'thoiGianKetThuc', header: 'Thời gian kết thúc' },
    { field: 'giaTriGiam', header: 'Giá Trị (%)' },
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
            return { text: 'Trạng thái không xác định', severity: 'info' };
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
const position = ref('center');
const visible = ref(false);
const showProgressSpinner = ref(false);
const dis = ref(true);

const openPosition = (pos) => {
    position.value = pos;
    visible.value = true;

}

const closePosition = () => {
    visible.value = false;
    // loadProducts();
};

const setNameFile = ref('');
const handRemovefile = () => {
    setNameFile.value = '';
};


const excel = ref({});
const handImportExcel = async (event) => {
    showProgressSpinner.value = true;
    dis.value = false;
    const selectedFile = event.target.files[0];
    setNameFile.value = event.target.files[0].name;
    const formData = new FormData();
    formData.append("file", selectedFile);
    await productStore.uploadFile(formData);
    excel.value = productStore.excels;
    for (const o of excel.value) {
        for (const data of o.responseList) {
            if (data.importMessageGiaBan !== null && data.importMessageGiaBan !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageGiaBan, life: 30000 });

            }
            else if (data.importMessageDemLot !== null && data.importMessageDemLot !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageDemLot, life: 30000 });

            }
            else if (data.importMessageGiaNhap !== null && data.importMessageGiaNhap !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageGiaNhap, life: 30000 });

            }
            else if (data.importMessageSanPham !== null && data.importMessageSanPham !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageSanPham, life: 30000 });

            }
            else if (data.importMessageTrongLuong !== null && data.importMessageTrongLuong !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageTrongLuong, life: 30000 });

            }
            else if (data.importMessageVatLieu !== null && data.importMessageVatLieu !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageVatLieu, life: 30000 });

            }
            else if (data.importMessageThuongHieu !== null && data.importMessageThuongHieu !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageThuongHieu, life: 30000 });

            }
            else if (data.importMessageSize !== null && data.importMessageSize !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageSize, life: 30000 });

            }
            else if (data.importMessageMauSac !== null && data.importMessageMauSac !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageMauSac, life: 30000 });

            }
            else if (data.importMessageLoai !== null && data.importMessageLoai !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageLoai, life: 30000 });

            }
            else if (data.importMessageSoLuong !== null && data.importMessageSoLuong !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageSoLuong, life: 30000 });

            }
            else if (data.importMessageQuaiDeo !== null && data.importMessageQuaiDeo !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageQuaiDeo, life: 30000 });

            }
            else if (data.importMessageSoLuongSize !== null && data.importMessageSoLuongSize !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageSoLuongSize, life: 30000 });

            }
            else if (data.importMessageSoLuongMau !== null && data.importMessageSoLuongMau !== "SUCCESS") {
                toast.add({ severity: 'error', summary: 'Error', detail: data.importMessageSoLuongMau, life: 30000 });
            }
            else {
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Import excel thành công', life: 3000 });
                break;
            }

        }
        break;
        //   }
    }
    showProgressSpinner.value = false;
    dis.value = true;
    loadProducts();
};
const trangThai = ref();
const dataTrangThai = ref([
    { label: 'Tất cả', value: 'tatCa' },
    { label: 'Còn Hàng', value: 'conHang' },
    { label: 'hết hàng', value: 'hetHang' },
    { label: 'Tồn kho', value: 'tonKho' },
    { label: 'Đang khuyến mãi', value: 'dangKhuyenMai' }
]);

const loadDataByTrangThai = async () => {
    showSpinner.value = true;
    visibledatatable.value = false;
    await productStore.fetchDataByStatus(trangThai.value.value);
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
    if (products.value.length === 0) {
        soLuongSP.value = 0;
    } else {
        for (let i = 0; i < 1; i++) {
            soLuongSP.value = products.value[i].soLuongSanPham;
        }
    }
    showSpinner.value = false;
    visibledatatable.value = true;
};

watch(trangThai, (newVal) => {
    if (trangThai.value.value != 'tatCa') {
        loadDataByTrangThai();
    } else {
        loadProducts();
    }
});
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
                            </div>
                        </template>

                        <template v-slot:end>

                            <Button label="Import excel" icon="pi pi-download" @click="openPosition('top')"
                                style="min-width: 10rem" severity="secondary" rounded />
                        </template>

                    </Toolbar>
                    <div style="margin-left: 500px;">
                        <ProgressSpinner v-if="showSpinner" />
                    </div>
                    <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id"
                        v-if="visibledatatable" :paginator="true" :rows="5" :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        responsiveLayout="scroll" showGridlines>
                        <template #header>

                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">

                                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                    <MultiSelect icon="pi pi-plus" :modelValue="selectedColumns" :options="columns"
                                        optionLabel="header" @update:modelValue="onToggle" display="chip"
                                        placeholder="Select Columns" />
                                </div>
                                <div style="display: flex;">
                                    <h5 class="m-0" style="margin-right: 20px;"> Products </h5>
                                    <div
                                        style="margin-bottom:10px ;margin-left: 10px;border-radius: 50%; width: 30px ;height: 30px; background: rgb(76, 71, 83); color: white; text-align: center;font-size: 20px;">
                                        {{ soLuongSP }}</div>
                                </div>

                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    <Dropdown v-model="trangThai" :options="dataTrangThai" optionLabel="label"
                                        placeholder="Tất cả" class="w-full md:w-14rem" style="margin-left: 20px" />
                                </span>
                            </div>
                        </template>


                        <Column field="code" header="STT" :sortable="true" style="width: 1px; padding: 5px;">
                            <template #body="slotProps">
                                <span class="p-column-title">STT</span>
                                {{ slotProps.data.stt }}
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
                        <Column field="giaBan" header="Giá Bán" :sortable="true" headerStyle="width:8%; min-width:5rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Tên</span>
                                {{ formatCurrency(slotProps.data.giaBan) }}
                            </template>
                        </Column>
                        <Column field="giaNhap" header="Giá nhập" :sortable="true" headerStyle="width:8%; min-width:5rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Tên</span>
                                {{ formatCurrency(slotProps.data.giaNhap) }}
                            </template>
                        </Column>
                        <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
                            :key="col.field + '_' + index" :sortable="true" headerStyle="width:8%; min-width:5rem;">
                        </Column>
                        <Column header="Màu Sắc " headerStyle="width:8%; min-width:5rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">size</span>
                                <div v-for="(i, index) in slotProps.data.mauSac">
                                    <div v-if="index < 2 || slotProps.data.showMore" class="col-6"
                                        style="width: 170px;background-color: aliceblue; height: 90px; display: flex;margin-bottom: 5px; border: 1px solid aliceblue; border-radius: 10px;">
                                        <div>
                                            <p style="margin: auto;">{{ i.ten }}</p>
                                            <p style="margin: auto;" v-if="i.tenSize !== null">size: {{
                                                i.tenSize }}</p>
                                            <p style="margin: auto;">số lượng: {{ i.soLuong }}</p>
                                        </div>
                                        <img :src="i.anh" class="shadow-2" width="100"
                                            style="margin-bottom: 30px; height: 50px; width: 50px; margin-left: 10px;" />
                                    </div>
                                </div>
                                <div v-if="!slotProps.data.showMore && slotProps.data.mauSac.length > 3"
                                    @click="slotProps.data.showMore = !slotProps.data.showMore">
                                    Xem thêm...
                                </div>
                                <div v-if="slotProps.data.showMore"
                                    @click="slotProps.data.showMore = !slotProps.data.showMore">
                                    Ẩn
                                </div>
                            </template>
                        </Column>

                        <Column field="trangThai" header="Trạng Thái" sortable headerStyle="width: 5%; min-width: 8rem;">
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

                    <Dialog v-model:visible="visible" header="Import excel" :style="{ width: '400px' }" :position="position"
                        :modal="true" :draggable="false">
                        <div class="flex align-items-center justify-content-center">
                            <div v-if="dis">
                                <div class="custom-file-upload">
                                    <label class="upload-button">{{ setNameFile == "" ? "Tải lên tệp Excel" : setNameFile
                                    }}<input type="file" name="excelFile" accept=".xls, .xlsx"
                                            @change="handImportExcel($event)"></label>

                                </div>
                                <Button icon="pi pi-trash" class="p-button-warning mr-2" @click="handRemovefile()"
                                    style="width: 35px; height: 35px; margin: 0px 10px 10px 10px" />
                            </div>


                            <ProgressSpinner v-if="showProgressSpinner" />
                        </div>

                        <template #footer>
                            <Button label="Export" icon="pi pi-upload" class="p-button" @click="generateExcel($event)"
                                rounded style="height: 40px; margin-right: 150px;" severity="secondary" />
                            <Button label="Đóng" icon="pi pi-check" class="p-button" @click="closePosition()"
                                severity="secondary" rounded style="height: 40px;" />
                        </template>
                    </Dialog>
                </section>
                <section class="right_gh" id="right_gh" style="display: none">
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

/* Tạo kiểu cho vùng chọn tệp và nút tải lên */
.custom-file-upload {
    position: relative;
    overflow: hidden;
    display: inline-block;
    border: 2px solid rgb(57, 68, 224);
    border-radius: 10px;
    width: 150px;
    height: 50px;
    text-align: center;
}

/* Tạo kiểu cho nút tải lên */
.upload-button {
    background-color: white;
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    color: black;
    font-weight: 600;
    margin-top: 5px;
}

/* Tạo kiểu cho thẻ input */
.upload-button input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    opacity: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
}
</style>


