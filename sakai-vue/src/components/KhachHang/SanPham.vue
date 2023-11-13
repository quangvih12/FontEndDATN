<script setup>
import Carousel from 'primevue/carousel';
import { computed, onMounted, ref } from 'vue';
import { SanPhamStore } from '../../service/KhachHang/SanPhamService';
import { useRouter } from 'vue-router';
const SanPhamService = SanPhamStore();
const home = ref({
    icon: 'pi pi-home',
    to: '/'
});

const router = useRouter();

const goToProductDetail = (productId) => {
    router.push({ name: 'ProductDetail', params: { id: productId } });
};

const dataSP = ref([]);
const loadData = async () => {
    await SanPhamService.fetchAll();
    dataSP.value = SanPhamService.dataSP;
    console.log(SanPhamService.dataSP);
};

const uniqueTenLoai = computed(() => {
    const tenLoaiSet = new Set(['Chọn loại sản phẩm', ...dataSP.value.map((item) => item.tenLoai)]);
    return Array.from(tenLoaiSet);
});

onMounted(() => {
    loadData();
});

const layout = ref('grid');

const items = ref([{ label: 'Tất cả sản phẩm', to: '/san-pham' }]);

const formatCurrency = (value) => {
    return parseInt(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const priceRanges = [
    { label: 'Lọc theo giá', min: 0, max: Infinity },
    { label: 'Dưới 500k', min: 0, max: 500000 },
    { label: '500k - 1 triệu', min: 500000, max: 1000000 },
    { label: 'Trên 1 triệu', min: 1000000, max: Infinity }
];
const selectedSortOption = ref(null);

const sapXep = ref([{ label: 'Sắp xếp' }, { label: 'Giá cao - > thấp' }, { label: 'Giá thấp - > cao' }, { label: 'Mới nhất' }]);

const searchTerm = ref('');
const selectedPriceRange = ref(null);

const sortProducts = (products, sortOption) => {
    switch (sortOption.label) {
        case 'Giá cao - > thấp':
            return products.sort((a, b) => b.giaBanMax - a.giaBanMax);
        case 'Giá thấp - > cao':
            return products.sort((a, b) => a.giaBanMin - b.giaBanMin);
        case 'Mới nhất':
            return products.sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));
        default:
            return products;
    }
};

const selectedTenLoai = ref(null);
const selectedTenThuongHieu = ref(null);

const uniqueTenThuongHieu = computed(() => {
    const tenThuongHieuSet = new Set(['Chọn thương hiệu', ...dataSP.value.map((item) => item.tenThuongHieu)]);
    return Array.from(tenThuongHieuSet);
});

const filteredAndSortedProducts = computed(() => {
    let filteredProducts = dataSP.value;

    // Filter by name
    if (searchTerm.value) {
        const searchTermValue = searchTerm.value.toLowerCase();
        filteredProducts = filteredProducts.filter((product) => {
            return product.tenSP.toLowerCase().includes(searchTermValue) || product.tenLoai.toLowerCase().includes(searchTermValue) || product.tenThuongHieu.toLowerCase().includes(searchTermValue);
        });
    }
    // Filter by price range
    if (selectedPriceRange.value) {
        const { min, max } = selectedPriceRange.value;
        filteredProducts = filteredProducts.filter((product) => {
            const productPrice = (product.giaBanMin + product.giaBanMax) / 2;
            return productPrice >= min && productPrice <= max;
        });
    }

    if (selectedTenLoai.value && selectedTenLoai.value !== 'Chọn loại sản phẩm') {
        filteredProducts = filteredProducts.filter((product) => {
            return product.tenLoai === selectedTenLoai.value;
        });
    }

    // Filter by 'tenThuongHieu'
    if (selectedTenThuongHieu.value && selectedTenThuongHieu.value !== 'Chọn thương hiệu') {
        filteredProducts = filteredProducts.filter((product) => {
            return product.tenThuongHieu === selectedTenThuongHieu.value;
        });
    }

    // Sort the filtered products
    if (selectedSortOption.value) {
        return sortProducts(filteredProducts, selectedSortOption.value);
    }

    return filteredProducts;
});
</script>

<template>
    <div class="card">
        <div class="container">
            <Breadcrumb :home="home" :model="items" />
            <h1>Sản phẩm</h1>
            <Carousel :value="dataSP" :numVisible="4" :numScroll="4" :responsiveOptions="responsiveOptions">
                <template #item="slotProps">
                    <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
                        <div class="" style="height: 60px">
                            <img :src="slotProps.data.anh" alt="Hình ảnh" style="width: 50%" />
                        </div>
                        <div>
                            <h5 class="mb-1" style="height: 50px; margin-top: 50px">{{ slotProps.data.tenSP }}</h5>
                            <p class="font-semibold" style="color: black; text-align: center" v-if="slotProps.data.giaBanMin == slotProps.data.giaBanMax">{{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                            <p class="font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax != null && slotProps.data.giaSauGiamMin != null && slotProps.data.giaSauGiamMax != slotProps.data.giaSauGiamMin">
                                {{ formatCurrency(slotProps.data.giaSauGiamMin) }} - {{ formatCurrency(slotProps.data.giaSauGiamMax) }}
                            </p>
                            <p class="font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == null && slotProps.data.giaSauGiamMin == null">
                                {{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}
                            </p>
                            <p class="font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == slotProps.data.giaSauGiamMin">{{ formatCurrency(slotProps.data.giaSauGiamMax) }}</p>
                            <p class="font-semibold" style="color: black; text-align: center" v-else>{{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                            <div class="mt-5">
                                <Button icon="pi pi-search" rounded class="mr-2" @click="goToProductDetail(slotProps.data.idSP)" />
                            </div>
                        </div>
                    </div>
                </template>
            </Carousel>
            <Divider />
            <div class="flex">
                <Dropdown v-model="selectedSortOption" :options="sapXep" optionLabel="label" placeholder="Sắp xếp" class="w-full md:w-14rem" />
                <Dropdown v-model="selectedPriceRange" :options="priceRanges" optionLabel="label" placeholder="Lọc theo giá" class="w-full md:w-14rem" style="margin-left: 20px" />
                <Dropdown v-model="selectedTenLoai" :options="uniqueTenLoai" placeholder="Chọn loại sản phẩm" class="w-full md:w-14rem" style="margin-left: 20px" />
                <Dropdown v-model="selectedTenThuongHieu" :options="uniqueTenThuongHieu" placeholder="Chọn thương hiệu" class="w-full md:w-14rem" style="margin-left: 20px" />
                <span class="block mt-2 md:mt-0 p-input-icon-left" style="margin-left: 150px">
                    <i class="pi pi-search" />
                    <InputText v-model="searchTerm" placeholder="Search..." />
                </span>
            </div>
            <br />
            <DataView
                :value="filteredAndSortedProducts"
                :layout="layout"
                dataKey="id"
                :paginator="true"
                :rows="9"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[9, 18, 27]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                responsiveLayout="scroll"
            >
                <template #header>
                    <div class="flex justify-content-end">
                        <DataViewLayoutOptions v-model="layout" />
                    </div>
                </template>

                <template #list="slotProps">
                    <div class="col-12">
                        <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                            <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" :src="`${slotProps.data.anh}`" :alt="slotProps.data.name" />
                            <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                    <div class="text-2xl font-bold text-900">{{ slotProps.data.tenSP }}</div>
                                </div>
                                <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                    <p class="text-2xl font-semibold" style="color: black; text-align: center" v-if="slotProps.data.giaBanMin == slotProps.data.giaBanMax">{{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                                    <p
                                        class="text-2xl font-semibold"
                                        style="color: black; text-align: center"
                                        v-else-if="slotProps.data.giaSauGiamMax != null && slotProps.data.giaSauGiamMin != null && slotProps.data.giaSauGiamMax != slotProps.data.giaSauGiamMin"
                                    >
                                        {{ formatCurrency(slotProps.data.giaSauGiamMin) }} - {{ formatCurrency(slotProps.data.giaSauGiamMax) }}
                                    </p>
                                    <p class="text-2xl font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == null && slotProps.data.giaSauGiamMin == null">
                                        {{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}
                                    </p>
                                    <p class="text-2xl font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == slotProps.data.giaSauGiamMin">{{ formatCurrency(slotProps.data.giaSauGiamMax) }}</p>
                                    <p class="text-2xl font-semibold" style="color: black; text-align: center" v-else>{{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                                    <Button icon="pi pi-search" rounded @click="goToProductDetail(slotProps.data.idSP)"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                        <div class="p-4 border-1 surface-border surface-card border-round">
                            <div class="flex flex-column align-items-center gap-3 py-5">
                                <img class="w-9 shadow-2 border-round" :src="`${slotProps.data.anh}`" :alt="slotProps.data.tenSP" />
                                <div class="text-2xl font-bold">{{ slotProps.data.tenSP }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-between">
                                <p class="text-2xl font-semibold" style="color: black; text-align: center" v-if="slotProps.data.giaBanMin == slotProps.data.giaBanMax">{{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                                <p
                                    class="text-2xl font-semibold"
                                    style="color: black; text-align: center"
                                    v-else-if="slotProps.data.giaSauGiamMax != null && slotProps.data.giaSauGiamMin != null && slotProps.data.giaSauGiamMax != slotProps.data.giaSauGiamMin"
                                >
                                    {{ formatCurrency(slotProps.data.giaSauGiamMin) }} - {{ formatCurrency(slotProps.data.giaSauGiamMax) }}
                                </p>
                                <p class="text-2xl font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == null && slotProps.data.giaSauGiamMin == null">
                                    {{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}
                                </p>
                                <p class="text-2xl font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == slotProps.data.giaSauGiamMin">{{ formatCurrency(slotProps.data.giaSauGiamMax) }}</p>
                                <p class="text-2xl font-semibold" style="color: black; text-align: center" v-else>{{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                                <Button icon="pi pi-search" rounded @click="goToProductDetail(slotProps.data.idSP)"></Button>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
</template>

<style scoped>
.card {
    margin-top: 45px;
    display: flex;
    justify-content: center;
}
.custom-dropdown {
    max-width: 200px; /* Đặt giá trị kích thước tối đa cho dropdown */
}
.flex-container {
    display: flex;
    justify-content: space-between; /* Chia đều khoảng trống giữa các cột */
}

.flex-item {
    flex: 1; /* Cung cấp độ rộng đều cho mỗi cột */
    border: 1px solid #ccc;
    padding: 20px;
    margin-right: 10px; /* Khoảng cách giữa các cột */
}

/* Loại bỏ margin cuối cùng của cột cuối cùng */
.flex-item:last-child {
    margin-right: 0;
}

.container {
    width: 1100px;
}

/* Định dạng cho mỗi phần tử trong danh sách */
</style>
