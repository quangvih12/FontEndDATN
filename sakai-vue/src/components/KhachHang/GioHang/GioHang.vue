<script setup>
import { ref } from 'vue';
const checked = ref(false);
const tongTien = 3000000;
const tongSLSP = 2;
const dataSP = [
    { ten: 'Royce XH01 Đen Nhám', mauSac: 'xanh', soLuong: 3, gia: 10000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
    { ten: 'SP2', mauSac: 'xanh', soLuong: 3, gia: 10000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
    { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
    { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
    { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
    { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
    { ten: 'SP3', mauSac: 'xanh', soLuong: 3, gia: 100000000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' },
    { ten: 'SP4', mauSac: 'xanh', soLuong: 3, gia: 10000, imageUrl: 'https://nontrum.vn/wp-content/uploads/2019/10/non-balder-vang-1-e1583121638578.jpg' }
];

const quantity = ref(1);

const increment = () => {
    quantity.value += 1;
};

const decrement = () => {
    if (quantity.value > 1) {
        quantity.value -= 1;
    }
};
</script>
<template>
    <div class="grid">
        <div class="flex">
            <!-- Cột trái -->
            <div class="p-col-6">
                <div class="trai">
                    <!-- <table class="tong-sl-sp table">
                        <tr>
                            <td><Checkbox v-model="checked" :binary="true" style="width: 50px; margin-bottom: 10px" /></td>
                            <td class="tieu-de-trai">Sản phẩm</td>
                            <td class="tieu-de-trai">Giá</td>
                            <td class="tieu-de-trai">Số tượng</td>
                            <td class="tieu-de-trai">Tổng</td>
                            <td></td>
                        </tr>
                        <tr v-for="(items, index) in dataSP" :key="index">
                            <td><Checkbox v-model="checked" :binary="true" style="width: 50px; margin-bottom: 10px" /></td>
                            <td class="content-trai">
                                <div class="product-container">
                                    <div class="thumbnail">
                                        <img :src="items.imageUrl" alt="Thumbnail" class="anh" />
                                    </div>
                                    <div class="details">
                                        <p class="ten-sp">{{ items.ten }}</p>
                                        <p>{{ items.mauSac }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="content-trai">{{ items.gia }}đ</td>
                            <td class="content-trai">
                                <InputText type="number" v-model="items.soLuong" style="width: 70px" />
                                <InputNumber v-model="items.soLuong" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :step="1" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" currency="EUR" />
                            </td>
                            <td class="content-trai">{{ items.gia * items.soLuong }}đ</td>
                            <td><Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" style="width: 35px; height: 35px; margin-bottom: 10px; margin-left: 5px" /></td>
                        </tr>
                    </table> -->
                    <!-- <DataTable
                        ref="dt"
                        :value="dataSP"
                        v-model:selection="selectedProducts"
                        dataKey="id"
                        :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="code" header="Sản phẩm" headerStyle="width:20%; min-width:15rem;">
                            <template #body="slotProps">
                                <div class="product-container">
                                    <div class="thumbnail">
                                        <img :src="slotProps.data.imageUrl" :alt="slotProps.data.image" class="shadow-2" width="50" />
                                    </div>
                                    <div class="details">
                                        <p style="margin-bottom: 0">{{ slotProps.data.ten }}</p>
                                        <p>{{ slotProps.data.mauSac }}</p>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <Column header="Giá" headerStyle="width:14%; min-width:6rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Code</span>
                                {{ slotProps.data.gia }}đ
                            </template>
                        </Column>
                        <Column header="Số lượng" headerStyle="width:10%; min-width:7rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Code</span>
                                <InputNumber
                                    v-model="slotProps.data.soLuong"
                                    showButtons
                                    buttonLayout="vertical"
                                    style="width: 50px"
                                    decrementButtonClassName="p-button-secondary"
                                    incrementButtonClassName="p-button-secondary"
                                    incrementButtonIcon="pi pi-plus"
                                    decrementButtonIcon="pi pi-minus"
                                />
                            </template>
                        </Column>
                        <Column header="Tổng" headerStyle="min-width:6rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Code</span>
                                {{ slotProps.data.soLuong * slotProps.data.gia }}đ
                            </template>
                        </Column>
                        <Column headerStyle="min-width:2rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable> -->
                    <DataTable ref="dt" :value="dataSP" v-model:selection="selectedProducts" dataKey="id" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown">
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="code" header="Sản phẩm" headerStyle="width:20%; min-width:16rem;">
                            <template #body="slotProps">
                                <div class="product-container">
                                    <div class="thumbnail">
                                        <img :src="slotProps.data.imageUrl" :alt="slotProps.data.image" class="shadow-2" width="50" />
                                    </div>
                                    <div class="details">
                                        <p style="margin-bottom: 0; font-size: 17px">{{ slotProps.data.ten }}</p>
                                        <p style="font-size: 17px">{{ slotProps.data.mauSac }}</p>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <Column header="Giá" headerStyle="width:14%; min-width:7rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Code</span>
                                <p style="font-size: 17px">{{ slotProps.data.gia }}đ</p>
                            </template>
                        </Column>
                        <Column header="Số lượng" headerStyle="width:10%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Code</span>
                                <!-- <InputNumber
                                    v-model="slotProps.data.soLuong"
                                    showButtons
                                    buttonLayout="vertical"
                                    style="width: 50px"
                                    decrementButtonClassName="p-button-secondary"
                                    incrementButtonClassName="p-button-secondary"
                                    incrementButtonIcon="pi pi-plus"
                                    decrementButtonIcon="pi pi-minus"
                                /> -->
                                <!-- <div class="quantity buttons_added form-flat">
                                    <input type="button" value="" class="minus button is-form" />
                                    <input type="number" class="input-text qty text" step="1" min="1" max="" name="quantity" value="1" title="SL" size="4" placeholder="" inputmode="numeric" />
                                    <input type="button" value="+" class="plus button is-form" />
                                </div> -->
                                <div class="quantity">
                                    <button @click="decrement" class="minus p-button-secondary p-button-outlined">
                                        <i class="pi pi-minus"></i>
                                    </button>
                                    <input v-model="quantity" class="input-soluong" style="width: 35px" />
                                    <button @click="increment" class="plus-phai p-button-secondary p-button-outlined">
                                        <i class="pi pi-plus"></i>
                                    </button>
                                </div>
                            </template>
                        </Column>
                        <Column header="Tổng" headerStyle="min-width:6rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Code</span>
                                <p style="font-size: 17px">{{ slotProps.data.soLuong * slotProps.data.gia }}đ</p>
                            </template>
                        </Column>
                        <Column headerStyle="min-width:2rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
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
