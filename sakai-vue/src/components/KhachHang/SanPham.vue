<script setup>
import Carousel from 'primevue/carousel';
import { ref } from 'vue';
const home = ref({
    icon: 'pi pi-home',
    to: '/trang-chu'
});
const items = ref([{ label: 'Tất cả sản phẩm', to: '/san-pham' }]);
const colors = [
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/hwT0YOIMG_5015.jpg',
        text: 'Đen Mờ',
        price: 20,
        inventoryStatus: 'Gần hết',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/dmzrOUIMG_5076.jpg',
        text: 'Đen Bóng',
        price: 20,
        inventoryStatus: 'Còn hàng',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/GjL83QIMG_5067.jpg',
        text: 'Vàng Mờ',
        price: 20,
        inventoryStatus: 'Còn hàng',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/qF37bUIMG_5058.jpg',
        text: 'Hồng Mờ',
        price: 20,
        inventoryStatus: 'Còn hàng',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/asFeNUIMG_5050.jpg',
        text: 'Xanh Mực Mờ',
        price: 20,
        inventoryStatus: 'Hết hàng',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/Hv1g8FIMG_5029.jpg',
        text: 'Chột Mờ',
        price: 20,
        inventoryStatus: 'Còn hàng',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/qrIh2lIMG_4989.jpg',
        text: 'Chuột Bóng',
        price: 20,
        inventoryStatus: 'Gần hết',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/1jgFG3IMG_4779.jpg',
        text: 'Xanh Bóng',
        price: 20,
        inventoryStatus: 'Còn hàng',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/t0NPKnIMG_4999.jpg',
        text: 'Trắng Bóng',
        price: 20,
        inventoryStatus: 'Còn hàng',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/sGyDewIMG_5038.jpg',
        text: 'Xanh Lính Mờ',
        price: 20,
        inventoryStatus: 'Gần hết',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/4N5OaDIMG_2331.jpg',
        text: 'Vàng Mờ',
        price: 20,
        inventoryStatus: 'Hết hàng',
        rating: 5
    },
    {
        imgSrc: 'https://royalhelmet.com.vn/ckfinder/userfiles/images/products/j5aoFDIMG_4472.jpg',
        text: 'Xám Mờ',
        price: 20,
        inventoryStatus: 'Còn hàng',
        rating: 5
    }
    // Thêm các mục khác ở đây
];

const theoGia = ref([{ label: 'Lọc theo giá' }, { label: 'Dưới 50k' }, { label: '50k - 100k' }, { label: '100k - 200k' }, { label: '200k - 500k' }, { label: '500k - 1k' }]);
const sapXep = ref([{ label: 'Sắp xếp' }, { label: 'Giá cao - > thấp' }, { label: 'Giá thấp - > cao' }, { label: 'Mới nhất' }]);
const mauSac = ref([{ label: 'Màu sắc' }, { label: 'xanh' }, { label: 'Đỏ' }, { label: 'Vàng' }]);
const size = ref([{ label: 'Size' }, { label: 'L' }, { label: 'Xl' }]);
const brand = ref([{ label: 'Brand' }, { label: 'Durex' }, { label: 'Flex' }]);
</script>

<template>
    <div class="card">
        <div class="container">
            <Breadcrumb :home="home" :model="items" />
            <h1>Loại sản phẩm</h1>
            <Carousel :value="colors" :numVisible="6" :numScroll="6" :responsiveOptions="responsiveOptions">
                <template #item="slotProps">
                    <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
                        <div class="" style="height: 60px">
                            <img :src="slotProps.data.imgSrc" alt="Hình ảnh" style="width: 50%" />
                        </div>
                        <div>
                            <h4 class="mb-1" style="height: 50px">{{ slotProps.data.text }}</h4>
                            <h6 class="mt-0 mb-3">${{ slotProps.data.price }}</h6>
                            <div class="mt-5">
                                <Button icon="pi pi-search" rounded class="mr-2" />
                                <Button icon="pi pi-star-fill" rounded severity="success" class="mr-2" />
                            </div>
                        </div>
                    </div>
                </template>
            </Carousel>
            <Divider />
            <div class="flex">
                <Dropdown :options="sapXep" optionLabel="label" placeholder="Sắp xếp" class="w-full md:w-14rem" />
                <Dropdown :options="theoGia" optionLabel="label" placeholder="Lọc theo giá" class="w-full md:w-14rem" style="margin-left: 20px" />
                <Dropdown class="custom-dropdown" :options="mauSac" optionLabel="label" placeholder="Màu sắc" style="margin-left: 20px" />
                <Dropdown class="custom-dropdown" :options="size" optionLabel="label" placeholder="Size" style="margin-left: 20px" />
                <Dropdown class="custom-dropdown" :options="brand" optionLabel="label" placeholder="Brand" style="margin-left: 20px" />
                <span class="block mt-2 md:mt-0 p-input-icon-left" style="margin-left: 100px">
                    <i class="pi pi-search" />
                    <InputText placeholder="Search..." />
                </span>
            </div>
            <br />
            <div class="flex-container">
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/ofP4lpIMG_6388.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM 3/4 ROYAL M01</h5>
                        <h6 class="mt-0 mb-3" style="color: red">480,000₫</h6>
                    </a>
                </div>
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/R1E2rsIMG_6469.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM FULLFACE ROYAL M02 TRƠN</h5>
                        <h6 class="mt-0 mb-3" style="color: red">560,000₫</h6>
                    </a>
                </div>
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/CpiQae_MG_6968-vang.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM FULLFACE ROYAL M02-DESIGN</h5>
                        <h6 class="mt-0 mb-3" style="color: red">600,000₫</h6>
                    </a>
                </div>
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/hwT0YOIMG_5015.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM 3/4 ROYAL M20C</h5>
                        <h6 class="mt-0 mb-3" style="color: red">550,000₫</h6>
                    </a>
                </div>
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/YwBUXaIMG_5021.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM 3/4 ROYAL M20C DESIGN</h5>
                        <h6 class="mt-0 mb-3" style="color: red">630,000đ</h6>
                    </a>
                </div>
            </div>
            <br />
            <div class="flex-container">
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/klIZba_MG_3349.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM 3/4 ROYAL M20D</h5>
                        <h6 class="mt-0 mb-3" style="color: red">780,000₫</h6>
                    </a>
                </div>
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/BUnyRS_MG_9655.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM 3/4 ROYAL M134C</h5>
                        <h6 class="mt-0 mb-3" style="color: red">540,000₫</h6>
                    </a>
                </div>
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/dko9vc_MG_5437.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM 3/4 ROYAL M134D</h5>
                        <h6 class="mt-0 mb-3" style="color: red">450,000₫</h6>
                    </a>
                </div>
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/xl1BU4ROYAL-M136-DEN.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM FULLFACE ROYAL M136</h5>
                        <h6 class="mt-0 mb-3" style="color: red">590,000₫</h6>
                    </a>
                </div>
                <div class="flex-item">
                    <a class="text-center" href="http://localhost:5173/#/detail">
                        <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/k3sMA6IMG_6191b.jpg" style="width: 100%" />
                    </a>
                    <a href="http://localhost:5173/#/detail">
                        <h5 class="mb-1" style="height: 80px">MŨ BẢO HIỂM FULLFACE ROYAL M136 DESIGN</h5>
                        <h6 class="mt-0 mb-3" style="color: red">620,000₫</h6>
                    </a>
                </div>
            </div>
            <br />
            <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
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
</style>
