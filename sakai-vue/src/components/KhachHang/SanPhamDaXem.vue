<script setup>
import Carousel from 'primevue/carousel';
import { computed, onMounted, ref } from 'vue';
import { SanPhamStore } from '../../service/KhachHang/SanPhamService';
import { useRouter } from 'vue-router';
import { array } from 'yup';
import { SPDaXemStore } from '../../service/KhachHang/SanPhamDaXem.js';
const spDaXemService = SPDaXemStore();
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
    const token = localStorage.getItem('token');
    const arraySPDaXem = JSON.parse(localStorage.getItem('spDaXem'));
    if (Array.isArray(arraySPDaXem)) {
        for (let i = 0; i < arraySPDaXem.length; i++) {
            if (token == null || token.length <= 0) {
                if (arraySPDaXem[i].idUser == -1) {
                    dataSP.value.unshift(arraySPDaXem[i]);
                }
            } else {
                const responeKH = await spDaXemService.findByToken(token);
                if (arraySPDaXem[i].idUser == responeKH.id) {
                    dataSP.value.unshift(arraySPDaXem[i]);
                }
            }
        }
    }
    console.log(dataSP.value);
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
    { label: 'Dưới 500.000', min: 0, max: 500000 },
    { label: '500.000 - 1 triệu', min: 500000, max: 1000000 },
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
            const productPrice = (parseInt(product.giaBanMin) + parseInt(product.giaBanMax)) / 2;
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
            <h1 style="margin-top: 20px">Sản phẩm đã xem</h1>

            <!-- <Divider />
            <div class="flex">
                <Dropdown v-model="selectedSortOption" :options="sapXep" optionLabel="label" placeholder="Sắp xếp" class="w-full md:w-14rem" />
                <Dropdown v-model="selectedPriceRange" :options="priceRanges" optionLabel="label" placeholder="Lọc theo giá" class="w-full md:w-14rem" style="margin-left: 20px" />
                <Dropdown v-model="selectedTenLoai" :options="uniqueTenLoai" placeholder="Chọn loại sản phẩm" class="w-full md:w-14rem" style="margin-left: 20px" />
                <Dropdown v-model="selectedTenThuongHieu" :options="uniqueTenThuongHieu" placeholder="Chọn thương hiệu" class="w-full md:w-14rem" style="margin-left: 20px" />
                <span class="block mt-2 md:mt-0 p-input-icon-left" style="margin-left: 150px">
                    <i class="pi pi-search" />
                    <InputText v-model="searchTerm" placeholder="Search..." />
                </span>
            </div> -->
            <br />
            <div class="flex-container" style="margin: 0; padding: 0">
                <div class="col-12 sm:col-6 lg:col-12 xl:col-3 p-2" style="margin-right: 0" v-for="(sp, index) in dataSP" :key="index">
                    <div class="p-4 border-1 surface-border surface-card border-round" style="height: 380px; width: 260px; margin-right: 10px">
                        <div class="flex flex-column align-items-center gap-3 py-4">
                            <img class="w-9 shadow-2 border-round" :src="`${sp.anh}`" :alt="sp.tenSP" />
                            <div style="font-size: 20px; font-weight: 700">{{ sp.tenSP }}</div>
                        </div>
                        <div class="flex sm:flex-column align-items-center gap-3 sm:gap-2">
                            <p class="text-xl font-semibold" style="color: black; text-align: center" v-if="sp.giaBanMin == sp.giaBanMax">{{ formatCurrency(sp.giaBanMax) }}</p>
                            <p class="text-xl font-semibold" style="color: black; text-align: center" v-else-if="sp.giaSauGiamMax != null && sp.giaSauGiamMin != null && sp.giaSauGiamMax != sp.giaSauGiamMin">
                                {{ formatCurrency(sp.giaSauGiamMin) }} - {{ formatCurrency(sp.giaSauGiamMax) }}
                            </p>
                            <p class="text-xl font-semibold" style="color: black; text-align: center" v-else-if="sp.giaSauGiamMax == null && sp.giaSauGiamMin == null">{{ formatCurrency(sp.giaBanMin) }} - {{ formatCurrency(sp.giaBanMax) }}</p>
                            <p class="text-xl font-semibold" style="color: black; text-align: center" v-else-if="sp.giaSauGiamMax == sp.giaSauGiamMin">{{ formatCurrency(sp.giaSauGiamMax) }}</p>
                            <p class="text-xl font-semibold" style="color: black; text-align: center" v-else>{{ formatCurrency(sp.giaBanMin) }} - {{ formatCurrency(sp.giaBanMax) }}</p>
                            <Button icon="pi pi-shopping-cart" rounded @click="goToProductDetail(sp.idSP)"></Button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="flex-container">
                <div class="flex-item" v-for="(spct, index) in dataHangMoi" :key="index">
                    <div class="product-top">
                        <a href="" class="product-thumb">
                            <img :src="spct.anh" alt="Thumbnail" class="product-image" />
                        </a>
                        <a class="xct" @click="goToProductDetail(spct.idSP)">Xem chi tiết</a>
                    </div>
                    <p class="ten-sp">{{ spct.tenSP }}</p>
                    <br />
                    <p class="gia-sp" style="color: black; text-align: center" v-if="spct.giaBanMin == spct.giaBanMax">{{ formatCurrency(spct.giaBanMax) }}</p>
                    <p class="gia-sp" style="color: black; text-align: center" v-else-if="spct.giaSauGiamMax != null && spct.giaSauGiamMin != null && spct.giaSauGiamMax != spct.giaSauGiamMin">
                        {{ formatCurrency(spct.giaSauGiamMin) }} - {{ formatCurrency(spct.giaSauGiamMax) }}
                    </p>
                    <p class="gia-sp" style="color: black; text-align: center" v-else-if="spct.giaSauGiamMax == null && spct.giaSauGiamMin == null">{{ formatCurrency(spct.giaBanMin) }} - {{ formatCurrency(spct.giaBanMax) }}</p>
                    <p class="gia-sp" style="color: black; text-align: center" v-else-if="spct.giaSauGiamMax == spct.giaSauGiamMin">{{ formatCurrency(spct.giaSauGiamMax) }}</p>
                    <p class="gia-sp" style="color: black; text-align: center" v-else>{{ formatCurrency(spct.giaBanMin) }} - {{ formatCurrency(spct.giaBanMax) }}</p>
                </div>
            </div> -->
            <!-- <DataView
                :value="dataSP"
                :layout="layout"
                dataKey="id"
                :paginator="true"
                :rows="12"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[12, 18, 27]"
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
                                    <p class="text-xl font-semibold" style="color: black; text-align: center" v-if="slotProps.data.giaBanMin == slotProps.data.giaBanMax">{{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                                    <p
                                        class="text-xl font-semibold"
                                        style="color: black; text-align: center"
                                        v-else-if="slotProps.data.giaSauGiamMax != null && slotProps.data.giaSauGiamMin != null && slotProps.data.giaSauGiamMax != slotProps.data.giaSauGiamMin"
                                    >
                                        {{ formatCurrency(slotProps.data.giaSauGiamMin) }} - {{ formatCurrency(slotProps.data.giaSauGiamMax) }}
                                    </p>
                                    <p class="text-xl font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == null && slotProps.data.giaSauGiamMin == null">
                                        {{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}
                                    </p>
                                    <p class="text-xl font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == slotProps.data.giaSauGiamMin">{{ formatCurrency(slotProps.data.giaSauGiamMax) }}</p>
                                    <p class="text-xl font-semibold" style="color: black; text-align: center" v-else>{{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                                    <Button icon="pi  pi-shopping-cart" rounded @click="goToProductDetail(slotProps.data.idSP)"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="col-12 sm:col-6 lg:col-12 xl:col-3 p-2" style="margin-right: 0px">
                        <div class="p-4 border-1 surface-border surface-card border-round" style="height: 380px; width: 260px; margin-right: 10px">
                            <div class="flex flex-column align-items-center gap-3 py-4">
                                <img class="w-9 shadow-2 border-round" :src="`${slotProps.data.anh}`" :alt="slotProps.data.tenSP" />
                                <div style="font-size: 20px; font-weight: 700">{{ slotProps.data.tenSP }}</div>
                            </div>
                            <div class="flex sm:flex-column align-items-center gap-3 sm:gap-2">
                                <p class="text-xl font-semibold" style="color: black; text-align: center" v-if="slotProps.data.giaBanMin == slotProps.data.giaBanMax">{{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                                <p
                                    class="text-xl font-semibold"
                                    style="color: black; text-align: center"
                                    v-else-if="slotProps.data.giaSauGiamMax != null && slotProps.data.giaSauGiamMin != null && slotProps.data.giaSauGiamMax != slotProps.data.giaSauGiamMin"
                                >
                                    {{ formatCurrency(slotProps.data.giaSauGiamMin) }} - {{ formatCurrency(slotProps.data.giaSauGiamMax) }}
                                </p>
                                <p class="text-xl font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == null && slotProps.data.giaSauGiamMin == null">
                                    {{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}
                                </p>
                                <p class="text-xl font-semibold" style="color: black; text-align: center" v-else-if="slotProps.data.giaSauGiamMax == slotProps.data.giaSauGiamMin">{{ formatCurrency(slotProps.data.giaSauGiamMax) }}</p>
                                <p class="text-xl font-semibold" style="color: black; text-align: center" v-else>{{ formatCurrency(slotProps.data.giaBanMin) }} - {{ formatCurrency(slotProps.data.giaBanMax) }}</p>
                                <Button icon="pi pi-shopping-cart" rounded @click="goToProductDetail(slotProps.data.idSP)"></Button>
                            </div>
                        </div>
                    </div>
                </template>

               
            </DataView> -->
            <!-- <Divider />
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
            </Carousel> -->
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
.flex-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 1100px;
}

.flex-item {
    flex: 0 0 calc(20% - 10px);
    /* 20% độ rộng cho mỗi cột và 10px là khoảng cách giữa các cột */
    border: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;
    /* Đảm bảo rằng padding và border không làm tăng kích thước của các cột */
    margin-bottom: 20px;
    /* Khoảng cách giữa các dòng */
    margin-right: 12px;
}

/* Đảm bảo chỉ 5 cột trên mỗi dòng */
.flex-item:nth-child(5n) {
    margin-right: 0;
}

.flex-item img {
    max-width: 100%;
    /* Đảm bảo ảnh không vượt quá kích thước của .flex-item */
    height: auto;
    /* Đảm bảo tỷ lệ hình ảnh được giữ nguyên khi giảm kích thước theo chiều rộng */
    display: block;
    /* Loại bỏ khoảng trắng dư thừa dưới ảnh */
}

.xct {
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    display: block;
    background-color: #446084;
    color: #fff;
    padding: 10px 0px;
    position: absolute;
    width: 100%;
    bottom: -45px;
}

.product-top {
    position: relative;
    overflow: hidden;
}

.product-top .product-thumb {
    display: block;
}

.product-top .product-thumb .product-image {
    display: block;
}

.flex-item:hover .xct {
    bottom: 0px;
}

/* Định dạng cho mỗi phần tử trong danh sách */
</style>
