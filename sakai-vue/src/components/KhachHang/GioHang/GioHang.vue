<script setup>
import { ref, onMounted } from 'vue';
import { gioHangStore } from '@/service/KhachHang/Giohang/GiohangCTService.js';
import { useDetailProductStore } from '@/service/KhachHang/DetailService.js';
import { da } from 'date-fns/locale';
import { useToast } from 'primevue/usetoast';
const productStore = useDetailProductStore();

const gioHangService = gioHangStore();
const toast = useToast();
const selectedMauSac = ref('');
const selectedSize = ref('');
const mauSac = ref({});
const sizeCT = ref(null);
const checked = ref(false);
const msctImage = ref(null);
const tongTien = 3000000;
const tongSLSP = 2;
// const dataSP = [
//     { ten: 'Royce XH01 Đen Nhám', mauSac: 'xanh', soLuong: 3, gia: 10000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
//     { ten: 'SP2', mauSac: 'xanh', soLuong: 3, gia: 10000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
//     { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
//     { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
//     { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
//     { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
//     { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
//     { ten: 'SP4', mauSac: 'xanh', soLuong: 3, gia: 10000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' }
// ];

const dataGHCT = ref([]);
const listMSCT = ref([]);
const listSizeCT = ref([]);
const listTenMS = ref([]);
const data = ref({});

onMounted(async () => {
    loadDataGioHang();
    loadMSCT();
    loadSizeCT();
    loadTenMS();
});

const loadDataGioHang = async () => {
    await gioHangService.getAllGHCT();
    dataGHCT.value = gioHangService.data;
};

const loadMSCT = async () => {
    await gioHangService.getAllMSCT();
    listMSCT.value = gioHangService.data;
};

const loadTenMS = async () => {
    await gioHangService.getTenMS();
    listTenMS.value = gioHangService.data;
};

const loadSizeCT = async () => {
    await gioHangService.getAllSizeCT();
    listSizeCT.value = gioHangService.data;
};

const updateSoLuong = (product, event) => {
    const newValue = parseInt(event.target.value, 10); // Đảm bảo giá trị nhập vào là số
    if (!isNaN(newValue)) {
        product.soLuong = newValue;
    }
};

const increment = async (idGHCT) => {
    await gioHangService.congSL(idGHCT);
    dataGHCT.value = gioHangService.data; // Tăng giá trị soLuong lên 1 đơn vị
    loadDataGioHang();
};

const decrement = async (idGHCT) => {
    await gioHangService.getGHCT(idGHCT);
    data.value = gioHangService.data;

    if (data.value.soLuong <= 1) {
        toast.add({ severity: 'warn', summary: '', detail: 'Số lượng phải lớn hơn không', life: 3000 });
        return;
    }

    await gioHangService.truSL(idGHCT);
    dataGHCT.value = gioHangService.data; // Tăng giá trị soLuong lên 1 đơn vị
    loadDataGioHang();
};

const selectedGHCT = ref(null);

const dataMauSac = ref([]);

const loadDataMauSac = async (productID) => {
    await productStore.fetchAllMauSac(productID);
    dataMauSac.value = productStore.mauSacs;
};

const selectedSizeMauSac = ref(false);
const dataSize = ref([]);
const ghct = ref({});
const editProduct = async (data) => {
    ghct.value = { ...data };

    console.log(ghct, 'ghct test');
    await productStore.fetchAllMauSac(data.idCTSP);
    dataMauSac.value = productStore.mauSacs;

    await productStore.fetchAllSize(data.idCTSP);
    dataSize.value = productStore.sizes;
    selectedSizeMauSac.value = true;
};

const deleteGioHang = async (idghct) => {
    await gioHangService.xoaGHCT(idghct);
    dataGHCT.value = gioHangService.data;
    toast.add({ severity: 'warn', summary: '', detail: 'Xoá thành công', life: 3000 });
    loadDataGioHang();
};

const updateMauSacSize = async (idghct) => {
    await gioHangService.updateMauSacSize(idghct, selectedMauSac.value.idMS, selectedSize.value.id);
    dataGHCT.value = gioHangService.data;
    loadDataGioHang();
    toast.add({ severity: 'success', summary: '', detail: 'Cập nhật thành công', life: 3000 });

    selectedSizeMauSac.value = false;
};

const getAnhMauSac = (idMauSacChiTiet, idSanPham, idSizeCT) => {
    const mauSacChiTiet = listMSCT.value.find((mau) => mau.mauSac.id === idMauSacChiTiet && mau.sanPhamChiTiet.id === idSanPham && mau.sizeChiTiet.id === idSizeCT);
    if (mauSacChiTiet) {
        return mauSacChiTiet.anh; // Điều này phụ thuộc vào cấu trúc dữ liệu từ gioHangService
    } else {
        return 'Màu không xác định'; // Hoặc trả về một giá trị mặc định khác nếu không tìm thấy
    }
};

const getTenMauSac = (idMauSac) => {
    const mauSac = listTenMS.value.find((mau) => mau.id === idMauSac);
    if (mauSac) {
        console.log(mauSac.ten, 'ngu ko ta');
        return mauSac.ten; // Điều này phụ thuộc vào cấu trúc dữ liệu từ gioHangService
    } else {
        return 'Màu không xác định'; // Hoặc trả về một giá trị mặc định khác nếu không tìm thấy
    }
};

const getTenSize = (idSizeChiTiet) => {
    const sizechitiet = listSizeCT.value.find((size) => size.id === idSizeChiTiet);
    if (sizechitiet) {
        return sizechitiet.size.ten + ' - ' + sizechitiet.size.moTa; // Điều này phụ thuộc vào cấu trúc dữ liệu từ gioHangService
    } else {
        return 'size không xác định'; // Hoặc trả về một giá trị mặc định khác nếu không tìm thấy
    }
};
// const getMsctById = async(idmsct) => {

//     await gioHangService.getMauSacByID(idmsct);
//     msctImage.value = gioHangService.data;
//     return mausacCT.value.anh;

// }

const hideDialog = () => {
    selectedSizeMauSac.value = false;
};

const selectMauSac = (mauSacs) => {
    if (mauSac.moTa === getTenMauSac()) {
        selectedMauSac.value.selected = true;
    }
    // Loại bỏ viền đỏ của màu sắc đã chọn trước đó (nếu có)
    if (selectedMauSac.value) {
        selectedMauSac.value.selected = false;
    }

    // Nếu màu sắc đã được chọn thì hủy chọn
    if (mauSacs === selectedMauSac.value) {
        selectedMauSac.value = null;
    } else {
        // Nếu màu sắc chưa được chọn, thêm viền đỏ và đánh dấu đã chọn
        selectedMauSac.value = mauSacs;
        selectedMauSac.value.selected = true;
    }
};

const isMauSacSelected = (mauSacs) => {
    return mauSacs === selectedMauSac.value;
};

const selectSize = (size) => {
    if (selectedSize.value) {
        selectedSize.value.selected = false;
    }

    // Nếu size đã được chọn thì hủy chọn
    if (size === selectedSize.value) {
        selectedSize.value = null;
    } else {
        // Nếu size chưa được chọn, thêm viền đỏ và đánh dấu đã chọn
        selectedSize.value = size;
        selectedSize.value.selected = true;
    }
};

const isSizeSelected = (size) => {
    return size === selectedSize.value;
};
</script>
<template>
    <div class="grid">
        <div class="flex">
            <!-- Cột trái -->
            <div class="p-col-6">
                <div class="trai">
                    <DataTable :value="dataGHCT" v-model:selection="selectedGHCT" dataKey="id" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown">
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                        <Column field="code" header="Sản phẩm" headerStyle="width:20%; min-width:16rem;">
                            <template #body="slotProps">
                                <div class="product-container">
                                    <div class="thumbnail">
                                        <img :src="getAnhMauSac(slotProps.data.tenMauSac, slotProps.data.idCTSP, slotProps.data.tenSize)" alt="Ảnh sản phẩm" class="shadow-2" width="50" />
                                    </div>
                                    <div class="details">
                                        <p style="margin-bottom: 0; font-size: 17px">{{ slotProps.data.tenSP }}</p>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <Column field="code" header="Phân loại hàng" headerStyle="width:10%; min-width:8rem;">
                            <template #body="slotProps">
                                <div @click="editProduct(slotProps.data)">
                                    <p style="font-size: 17px">{{ getTenMauSac(slotProps.data.tenMauSac) }}</p>
                                    <p style="font-size: 17px">{{ getTenSize(slotProps.data.tenSize) }}</p>
                                </div>
                            </template>
                        </Column>

                        <Column header="Giá" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Code</span>
                                <p style="font-size: 12px" :class="{ strikethrough: true }">{{ slotProps.data.giaBan }}đ</p>
                                <span v-if="slotProps.data.giaSPSauGiam === null">{{ slotProps.data.giaBan }}đ</span>
                                <span v-else>{{ slotProps.data.giaSPSauGiam }}đ</span>
                            </template>
                        </Column>
                        <Column header="Số lượng" headerStyle="width:10%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Code</span>

                                <div class="quantity">
                                    <button @click="decrement(slotProps.data.idGHCT)" class="minus p-button-secondary p-button-outlined">
                                        <i class="pi pi-minus"></i>
                                    </button>
                                    <input :value="slotProps.data.soLuong" @input="updateSoLuong(slotProps.data, $event)" class="input-soluong" style="width: 35px" />
                                    <button @click="increment(slotProps.data.idGHCT)" class="plus-phai p-button-secondary p-button-outlined">
                                        <i class="pi pi-plus"></i>
                                    </button>
                                </div>
                            </template>
                        </Column>
                        <Column header="Tổng" headerStyle="min-width:6rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Code</span>
                                <p style="font-size: 15px">{{ slotProps.data.soLuong * slotProps.data.giaBan }}đ</p>
                            </template>
                        </Column>
                        <Column headerStyle="min-width:2rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="deleteGioHang(slotProps.data.idGHCT)" />
                            </template>
                        </Column>
                    </DataTable>

                    <Dialog v-model:visible="selectedSizeMauSac" :style="{ width: '450px' }" header="Cập nhật phân loại hàng" :modal="true">
                        <label class="ms">Màu sắc</label>
                        <br />

                        <div class="rounded-content-list">
                            <div v-for="(mauSacs, index) in dataMauSac" :key="index" class="rounded-content" @click="selectMauSac(mauSacs)" :class="{ selected: isMauSacSelected(mauSacs) }">
                                <img class="rounded-image" :src="mauSacs.anh" alt="Hình ảnh" />
                                <a class="rounded-text">{{ mauSacs.ten }}</a>
                            </div>
                        </div>
                        <!-- <div class="rounded-content-list">
                                <div v-for="(mauSacs, index) in dataMauSac" :key="index" class="rounded-content"  @click="selectedMauSac = mauSacs.mauSac.ten"  :class="{ 'border-red': mauSacs.mauSac.ten === selectedMauSac,'selected': mauSacs.mauSac.ten === selectedMauSac }" >
                                     <img class="rounded-image" :src="mauSacs.anh" alt="Hình ảnh" /> 
                                    <a class="rounded-text"  >{{ mauSacs.mauSac.ten }}</a>
                                   
                                </div>
                        </div> -->

                        <br />
                        <label class="ms">Size</label>
                        <br />
                        <div class="rounded-content-list">
                            <div v-for="(size, index) in dataSize" :key="index" class="rounded-content-size" @click="selectSize(size)" :class="{ selected: isSizeSelected(size) }">
                                <a class="rounded-text">{{ size.ten }} ({{ size.moTa }})</a>
                            </div>
                        </div>

                        <template #footer>
                            <Button label="Trở lại" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                            <Button type="Xác nhận" label="Save" icon="pi pi-check" class="p-button-text" @click="updateMauSacSize(ghct.idGHCT)" />
                        </template>
                    </Dialog>
                </div>
            </div>
            <!-- cột phải -->
            <div class="p-col-6">
                <div class="phai">
                    <p class="TieuDePhai">CỘNG GIỎ HÀNG</p>
                    <hr class="gach-ngang" />
                    <p class="content">Tổng số lượng sản phẩm: {{ tongSLSP }}</p>
                    <p class="content">
                        Tổng tiền: <span style="text-align: right" class="gia">{{ tongTien }}đ</span>
                    </p>
                    <Button label="Tiến hành thanh toán" severity="danger" class="btn-thanh-toan" />
                    <div class="phieu-uu-dai">
                        <p class="tieu-de-phieu-uu-dai">Phiếu ưu đãi</p>
                        <hr class="gach-ngang" />
                        <InputText type="text" v-model="value" placeholder="Mã phiếu ưu đãi" class="input-phieu-uu-dai" />
                        <Button label="Áp dụng" severity="success" class="btn-ap-dung" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
div.selected {
    border: 2px solid red;
}
div.border-red {
    border-color: red; /* Đặt màu viền thành đỏ */
    border-width: 2px; /* Hoặc thiết lập kiểu viền khác tùy ý */
}
.rounded-content-list {
    display: flex;
    flex-wrap: wrap;
}

.rounded-content-size {
    display: flex;
    align-items: center;
    padding: 3px;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    margin: 4px;
    width: 80px;
    height: 40px;
    /* flex-basis: calc(25% - 8px); 
    max-width: calc(25% - 8px);  */
    box-sizing: border-box;
}

.rounded-content {
    display: flex;
    align-items: center;
    padding: 1px;
    border: 1px solid #ccc;
    border-radius: 10px;
    cursor: pointer;
    margin: 4px;
    flex-basis: calc(25% - 8px); /* Đặt kích thước ban đầu của mỗi ô, chừa khoảng cách 8px giữa các ô */
    max-width: calc(25% - 8px); /* Đặt giới hạn kích thước tối đa của mỗi ô */
    box-sizing: border-box;
}
.rounded-image {
    width: 50px;
    height: 40px;
    border-radius: 50%;
    margin-right: 8px;
}

.rounded-text {
    font-size: 15px;
    color: #333;
}

.strikethrough {
    text-decoration: line-through;
    color: red; /* Màu chữ cho giá bán gạch ngang (tuỳ chọn) */
}

.grid {
    /* margin-top: 70px; */
    /* position: absolute;
    top: 0;
    left: 0;
    right: 0; */
    margin: auto;
    margin-top: 90px;
    margin-bottom: 30px;
    width: 1100px;
    /* background: white; */
    display: flex;
    justify-content: center;
    /* align-items: center; */
}
.trai {
    padding: 20px 20px 30px 20px;
    width: 780px;
    /* height: 300px; */
    background: white;
    margin-right: 20px;
    border-radius: 10px;
}
.tieu-de-trai {
    font-size: 18px;
    font-weight: bold;
}
.content-trai {
    font-size: 16px;
    max-width: 100px; /* Đặt giới hạn độ rộng của ô chứa tên sản phẩm */
    white-space: normal;
}
.tong-sl-sp {
    width: 100%;
}
.ten-sp {
    margin-bottom: 0;
}
.product-container {
    display: flex;
    align-items: flex-start;
}

.thumbnail {
    margin-right: 10px;
}

.thumbnail img {
    width: 60px;
    height: auto;
}

.details {
    /* margin-top: 10px; */
    text-align: left;
    /* flex: 1; */
}
.phai {
    padding: 20px 20px 30px 20px;
    width: 300px;
    background: white;
    /* height: 400px; */
    border-radius: 10px;
}
.gach-ngang {
    border: none;
    border-top: 3px solid rosybrown;
    margin-top: -10px;
}
.TieuDePhai {
    font-size: 18px;
    font-weight: bold;
}
.content {
    font-size: 16px;
}
.gia {
    text-align: right;
    font-size: 18px;
    font-weight: bold;
}
.quantity {
    display: flex;
    align-items: center;
}

.minus,
.plus {
    cursor: pointer;
    font-size: 15px;
    background-color: #ffffff;
    color: black;
    padding: 10px 12px;
    margin: 0;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    transition: background-color 0.3s ease;
    border: 1px solid #ccc;
}
.input-soluong {
    font-size: 17px;
    height: 44px;
    border: 1px solid #ccc; /* Đặt viền màu ghi và kích thước to */
    color: #333; /* Đặt màu chữ */
    /* padding: 0 12px;  */
    text-align: center;
    width: 30px;
    box-sizing: border-box;
}
.plus-phai {
    cursor: pointer;
    font-size: 15px;
    background-color: #ffffff;
    color: black;
    padding: 10px 12px;
    margin: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    transition: background-color 0.3s ease;
    border: 1px solid #ccc;
}

.btn-thanh-toan {
    width: 100%;
    font-size: 18px;
    background: red;
}

.phieu-uu-dai {
    margin-top: 20px;
}
.tieu-de-phieu-uu-dai {
    font-weight: bold;
    font-size: 18px;
}
.input-phieu-uu-dai {
    width: 100%;
}
.btn-ap-dung {
    margin-top: 20px;
    width: 100%;
}
</style>
