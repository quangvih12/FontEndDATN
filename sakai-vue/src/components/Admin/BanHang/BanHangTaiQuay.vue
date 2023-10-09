<script setup>
import { ref } from 'vue';

const products = ref([
    { code: 'SP001', name: 'Sản phẩm 1', category: 'Đồ điện tử', quantity: 5 },
    { code: 'SP001', name: 'Sản phẩm 1', category: 'Đồ điện tử', quantity: 5 },
    { code: 'SP002', name: 'Sản phẩm 2', category: 'Thời trang', quantity: 10 }
    // Thêm các sản phẩm khác tùy theo nhu cầu của bạn
]);

const product = ref([
    {
        code: 'SP001',
        image: 'link_to_image_1',
        name: 'Sản phẩm 1',
        money: 100,
        color: 'Đỏ',
        size: 'M',
        type: 'Áo thun',
        brand: 'Thương hiệu A',
        quantity: 50
    },
    {
        code: 'SP002',
        image: 'link_to_image_2',
        name: 'Sản phẩm 2',
        money: 150,
        color: 'Xanh',
        size: 'L',
        type: 'Quần jean',
        brand: 'Thương hiệu B',
        quantity: 30
    },
    {
        code: 'SP003',
        image: 'link_to_image_3',
        name: 'Sản phẩm 3',
        money: 120,
        color: 'Đen',
        size: 'S',
        type: 'Áo khoác',
        brand: 'Thương hiệu C',
        quantity: 20
    },
    {
        code: 'SP004',
        image: 'link_to_image_4',
        name: 'Sản phẩm 4',
        money: 90,
        color: 'Vàng',
        size: 'XL',
        type: 'Áo sơ mi',
        brand: 'Thương hiệu D',
        quantity: 15
    },
    {
        code: 'SP005',
        image: 'link_to_image_5',
        name: 'Sản phẩm 5',
        money: 80,
        color: 'Trắng',
        size: 'L',
        type: 'Quần short',
        brand: 'Thương hiệu E',
        quantity: 10
    }
]);

const theoGia = ref([{ label: 'Lọc theo giá' }, { label: 'Dưới 50k' }, { label: '50k - 100k' }, { label: '100k - 200k' }, { label: '200k - 500k' }, { label: '500k - 1k' }]);
const sapXep = ref([{ label: 'Sắp xếp' }, { label: 'Giá cao - > thấp' }, { label: 'Giá thấp - > cao' }, { label: 'Mới nhất' }]);
const mauSac = ref([{ label: 'Màu sắc' }, { label: 'xanh' }, { label: 'Đỏ' }, { label: 'Vàng' }]);
const size = ref([{ label: 'Size' }, { label: 'L' }, { label: 'Xl' }]);
const brand = ref([{ label: 'Brand' }, { label: 'Durex' }, { label: 'Flex' }]);
</script>

<template>
    <div class="card">
        <div class="row">
            <div class="col-8" style="margin-top: 20px">
                <!-- Nội dung cho col-8 -->
                <div class="card">
                    <h5>Hóa đơn chờ</h5>
                    <DataTable :value="products" showGridlines tableStyle="min-width: 50rem">
                        <Column field="code" header="Mã HĐ"></Column>
                        <Column field="name" header="Thời gian tạo"></Column>
                        <Column field="category" header="Nhân viên"></Column>
                        <Column field="quantity" header="Khách hàng"></Column>
                    </DataTable>
                    <Paginator :rows="5" :totalRecords="120" :rowsPerPageOptions="[5, 10, 15]"></Paginator>
                </div>
                <div class="card">
                    <h5>Giỏ hàng chờ</h5>
                    <DataTable :value="products" showGridlines tableStyle="min-width: 50rem">
                        <Column field="code" header="Mã SP"></Column>
                        <Column field="name" header="Tên sản phẩm"></Column>
                        <Column field="category" header="Đơn giá"></Column>
                        <Column field="quantity" header="Số lượng"></Column>
                    </DataTable>
                    <Paginator :rows="5" :totalRecords="120" :rowsPerPageOptions="[5, 10, 15]"></Paginator>
                </div>
                <div class="card">
                    <h5>Danh sách sản phẩm</h5>
                    <div class="flex">
                        <Dropdown :options="sapXep" optionLabel="label" placeholder="Sắp xếp" class="w-full md:w-14rem" />
                        <Dropdown :options="theoGia" optionLabel="label" placeholder="Lọc theo giá" class="w-full md:w-14rem" style="margin-left: 20px" />
                        <Dropdown class="custom-dropdown" :options="mauSac" optionLabel="label" placeholder="Màu sắc" style="margin-left: 20px" />
                        <Dropdown class="custom-dropdown" :options="size" optionLabel="label" placeholder="Size" style="margin-left: 20px" />
                        <Dropdown class="custom-dropdown" :options="brand" optionLabel="label" placeholder="Brand" style="margin-left: 20px" />
                        <span class="block mt-2 md:mt-0 p-input-icon-left" style="margin-left: 50px">
                            <i class="pi pi-search" />
                            <InputText placeholder="Tìm kiếm sản phẩm..." />
                        </span>
                    </div>
                    <br />
                    <DataTable :value="product" showGridlines tableStyle="min-width: 50rem">
                        <Column field="code" header="Mã SP"></Column>
                        <Column field="image" header="Hình ảnh"></Column>
                        <Column field="name" header="Tên sản phẩm"></Column>
                        <Column field="money" header="Đơn giá"></Column>
                        <Column field="color" header="Màu sắc"></Column>
                        <Column field="size" header="Size"></Column>
                        <Column field="type" header="Loại"></Column>
                        <Column field="brand" header="Thương hiệu"></Column>
                        <Column field="quantity" header="SL còn"></Column>
                    </DataTable>
                    <Paginator :rows="5" :totalRecords="120" :rowsPerPageOptions="[5, 10, 15]"></Paginator>
                </div>
            </div>
            <div class="col-4">
                <!-- Nội dung cho col-4 -->
                <div class="card">
                    <h5>Quét mã sản phẩm</h5>
                    <Image src="https://cdn-icons-png.flaticon.com/512/2956/2956744.png" alt="Image" width="220" style="text-align: center" preview />
                </div>
                <div class="card" style="margin-top: 15px">
                    <h5>Đơn hàng</h5>
                    <div class="card">
                        <div class="flex">
                            <span class="p-label">
                                <label for="username">Mã khách hàng</label>
                                <InputText id="username" v-model="value" />
                            </span>
                            <span class="p-label" style="margin-left: 50px">
                                <label for="username">Tên khách hàng</label>
                                <InputText id="username" v-model="value" />
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <!-- Nội dung cho cột 1 trong hàng 1 -->
                            <h6 for="">Mã hóa đơn:</h6>
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 3 trong hàng 1 -->
                            <input type="text" v-model="value" style="width: 120px" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <!-- Nội dung cho cột 1 trong hàng 2 -->
                            <h6 for="">Tổng tiền:</h6>
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 2 trong hàng 2 -->
                            <label for="">0</label>
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 3 trong hàng 2 -->
                            <label for="">VNĐ</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <!-- Nội dung cho cột 1 trong hàng 2 -->
                            <h6 for="">Thanh toán:</h6>
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 2 trong hàng 2 -->
                            <label for="">0</label>
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 3 trong hàng 2 -->
                            <label for="">VNĐ</label>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-4">
                            <!-- Nội dung cho cột 1 trong hàng 2 -->
                            <h6 for="">Tiền khách đưa:</h6>
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 2 trong hàng 2 -->
                            <input type="text" v-model="value" style="width: 120px" />
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 3 trong hàng 2 -->
                            <label for="">VNĐ</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <!-- Nội dung cho cột 1 trong hàng 2 -->
                            <h6 for="">Tiền thừa trả khách:</h6>
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 2 trong hàng 2 -->
                            <label for="">0</label>
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 3 trong hàng 2 -->
                            <label for="">VNĐ</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <!-- Nội dung cho cột 1 trong hàng 2 -->
                            <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Phương thức thanh toán" class="w-full md:w-14rem" />
                        </div>
                        <div class="col-4">
                            <!-- Nội dung cho cột 2 trong hàng 2 -->
                            <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Hình thức giao hàng" class="w-full md:w-14rem" style="margin-left: 85px" />
                        </div>
                    </div>
                    <h6 for="">Ghi chú</h6>
                    <Textarea v-model="value" rows="4" cols="30" />
                    <div class="row">
                        <div class="col-6">
                            <!-- Nội dung cho cột 1 trong hàng 2 -->
                            <Button label="In hóa đơn" severity="success" raised />
                        </div>
                        <div class="col-6">
                            <!-- Nội dung cho cột 2 trong hàng 2 -->
                            <Button label="Thanh toán" severity="warning" raised />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    margin-top: 20px;
    padding: 1rem;
}

.col-4,
.card {
    margin-top: 20px;
}
</style>