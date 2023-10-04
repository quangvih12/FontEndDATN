<script setup>
import Breadcrumb from 'primevue/breadcrumb';
import { ref, onMounted } from 'vue';
import { PhotoService } from '@/service/KhachHang/PhotoService';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Carousel from 'primevue/carousel';
import Editor from 'primevue/editor';
onMounted(() => {
    PhotoService.getImages().then((data) => (images.value = data));
});

const images = ref();
const responsiveOptions = ref([
    {
        breakpoint: '991px',
        numVisible: 4
    },
    {
        breakpoint: '767px',
        numVisible: 3
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
const home = ref({
    icon: 'pi pi-home',
    to: '/trang-chu'
});
const items = ref([{ label: 'Sản phẩm', to: '/san-pham' }, { label: 'MŨ BẢO HIỂM 3/4 ROYAL M20C' }]);
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
        text: 'Xanh mực mờ',
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
        text: 'Xanh Pastel Bóng',
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
        text: 'Xám Xi Măng',
        price: 20,
        inventoryStatus: 'Còn hàng',
        rating: 5
    }
    // Thêm các mục khác ở đây
];

const getSeverity = (status) => {
    switch (status) {
        case 'Còn hàng':
            return 'success';

        case 'Gần hết':
            return 'warning';

        case 'Đã hết':
            return 'danger';

        default:
            return null;
    }
};

const dataTrangThai = ref([
    { label: 'Tất cả bình luận', value: 'Tất cả' },
    { label: 'Mới nhất', value: '1' },
    { label: 'Cũ nhất', value: '0' }
]);
</script>

<template>
    <div class="card">
        <div class="grid">
            <div class="container">
                <Breadcrumb :home="home" :model="items" />
                <!-- Cột phải -->
                <div class="card md:flex md:justify-content-center" style="margin-top: 0px">
                    <div class="flex">
                        <div class="col-5">
                            <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 450px">
                                <template #item="slotProps">
                                    <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
                                </template>
                                <template #thumbnail="slotProps">
                                    <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
                                </template>
                            </Galleria>
                        </div>
                        <div class="col-7">
                            <h1 class="masp">MŨ BẢO HIỂM 3/4 ROYAL M20C</h1>
                            <label for="">Mã SP: <span>MŨ BẢO HIỂM 3/4 ROYAL M20C</span></label>
                            <label for="" style="margin-left: 20px">Loại: <span style="color: red">MŨ BẢO HIỂM 3/4 ROYAL M20C</span></label>
                            <h2 style="color: red">550,000₫</h2>
                            <br />
                            <label for="">- Vỏ bằng nhựa ABS nguyên sinh</label>
                            <br />
                            <label for="">- Trọng lượng: 850g ± 50g</label>
                            <br />
                            <label for="">- size L: 55 - 57cm - size XL: 57 - 59cm</label>
                            <br />
                            <label class="ms">Màu sắc</label>
                            <br />
                            <div class="rounded-content-list">
                                <div v-for="(color, index) in colors" :key="index" class="rounded-content" @click="handleContentClick(index)">
                                    <img :class="{ clicked: selected === index }" class="rounded-image" :src="color.imgSrc" alt="Hình ảnh" />
                                    <a class="rounded-text" href="">{{ color.text }}</a>
                                </div>
                            </div>
                            <label class="ms" style="margin-left: 5px">Kích cỡ</label>
                            <label style="margin-left: 25px">
                                <input type="radio" value="L" v-model="selectedSize" />
                                L
                            </label>
                            <label style="margin-left: 25px">
                                <input type="radio" value="XL" v-model="selectedSize" />
                                XL
                            </label>
                            <br />
                            <br />
                            <div class="sl">
                                <label for="quantity">Số lượng</label>
                                <br />
                                <div class="quantity buttons_added form-flat">
                                    <input type="button" value="" class="minus button is-form" />
                                    <input type="number" class="input-text qty text" step="1" min="1" max="" name="quantity" value="1" title="SL" size="4" placeholder="" inputmode="numeric" />
                                    <input type="button" value="+" class="plus button is-form" />
                                </div>
                                <Button label="Thêm vào giỏ hàng" icon="pi pi-shopping-cart" class="p-button-rounded p-button-warning mr-2 mb-2" style="background: #e8bd72" />
                            </div>
                        </div>
                    </div>
                    <div class="tab-view-container">
                        <TabView>
                            <TabPanel header="Mô tả sản phẩm">
                                <iframe
                                    style="margin-left: 330px"
                                    width="560"
                                    height="315"
                                    src="https://www.youtube.com/embed/LavsX-c8m74"
                                    title="Tự tin sống chất cùng Quỳnh Anh Shyn | Mũ bảo hiểm Royal Helmet"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowfullscreen
                                ></iframe>
                                <br />
                                <br />
                                <label for=""
                                    >Chắc chắn khi tìm mua một chiếc mũ bảo hiểm, bạn đã từng đặt câu hỏi nên chọn mũ bảo hiểm nửa đầu hay mũ bảo hiểm fullface? Mũ bảo hiểm nửa đầu gọn, nhẹ nhưng lại hạn chế về khả năng bảo vệ trong khi mũ bảo hiểm
                                    fullface cồng kềnh hơn nhưng lại có khả năng bảo vệ tuyệt vời? Liệu có loại mũ bảo hiểm nào vừa gọn, vừa an toàn lại vừa đẹp không? Mũ bảo hiểm ¾ Royal M20C chính là loại mũ mà bạn đang tìm kiếm!
                                </label>
                                <div class="text-center">
                                    <img src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/cWpxqTIMG_5015.jpg" alt="" style="width: 20%" />
                                </div>
                                <h3>CHI TIẾT SẢN PHẨM</h3>
                                <div class="ctn">
                                    <div class="item">
                                        <label>Size: </label>
                                        <span>L và XL</span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Trọng lượng: </label>
                                        <span>Khoảng 950g</span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Màu sắc: </label>
                                        <span>Đen, trắng, xanh, đỏ, hồng,..</span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Đạt chuẩn: </label>
                                        <a href="https://nontrum.vn/chuan-qcvn/">QCVN</a>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Vỏ: </label>
                                        <a href="https://nontrum.vn/nhua-abs-la-gi/"> ABS</a>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Xốp: </label>
                                        <a href="https://nontrum.vn/xop-eps-la-gi/"> EPS</a>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Lót: </label>
                                        <span>Vải lưới đen </span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Ốp tai: </label>
                                        <span>Có thể tháo rời. </span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Sản xuất tại: </label>
                                        <span>Việt Nam </span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Thương hiệu: </label>
                                        <span>Royce </span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Tình trạng: </label>
                                        <span>Mới 100% </span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Bảo hành: </label>
                                        <span>365 ngày </span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Đổi do lỗi: </label>
                                        <span>7 ngày </span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Phí giao thường: </label>
                                        <span> 30.000đ </span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Phí giao nhanh: </label>
                                        <span>Theo đơn vị vận chuyển </span>
                                    </div>
                                </div>
                                <Divider />
                                <div class="">
                                    <h2>Sản phẩm tương tự</h2>
                                    <Carousel :value="colors" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
                                        <template #item="slotProps">
                                            <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
                                                <a href="">
                                                    <img :src="slotProps.data.imgSrc" alt="Hình ảnh" style="width: 50%" />
                                                </a>
                                                <div>
                                                    <a href=""
                                                        ><h4 class="mb-1">{{ slotProps.data.text }}</h4></a
                                                    >
                                                    <h6 class="mt-0 mb-3">${{ slotProps.data.price }}</h6>
                                                    <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data.inventoryStatus)" />
                                                    <div class="mt-5">
                                                        <Button icon="pi pi-search" rounded class="mr-2" />
                                                        <Button icon="pi pi-star-fill" rounded severity="success" class="mr-2" />
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </Carousel>
                                </div>
                            </TabPanel>
                            <TabPanel header="Đánh giá">
                                <br />
                                <br />
                                <div class="flex">
                                    <h6 style="margin-right: 10px"><span>1 </span> bình luận</h6>
                                    <label style="margin-left: 800px" for="">Sắp xếp theo</label>
                                    <Dropdown :options="dataTrangThai" optionLabel="label" placeholder="Tất cả bình luận" class="w-full md:w-14rem" style="margin-left: 20px" />
                                </div>
                                <div class="">
                                    <Avatar icon="pi pi-user" class="" size="xlarge" />
                                    <Editor editorStyle="height: 100px">
                                        <template v-slot:toolbar>
                                            <span class="ql-formats">
                                                <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                                                <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
                                                <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
                                            </span>
                                        </template>
                                    </Editor>
                                    <div class="flex flex-wrap justify-content-between align-items-center gap-3 mt-3" style="margin-left: 1130px">
                                        <Button type="submit" label="Đăng" />
                                    </div>
                                </div>
                                <div class="flex">
                                    <div>
                                        <Avatar label="P" class="mr-2" size="xlarge" />
                                    </div>
                                    <div>
                                        <h6><a href="">Nguyễn Long Vũ</a></h6>
                                        <span>Sản phẩm xịn</span>
                                    </div>
                                </div>
                                <Divider />
                                <div class="">
                                    <h2>Sản phẩm tương tự</h2>
                                    <Carousel :value="colors" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
                                        <template #item="slotProps">
                                            <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
                                                <a href="">
                                                    <img :src="slotProps.data.imgSrc" alt="Hình ảnh" style="width: 50%" />
                                                </a>
                                                <div>
                                                    <a href=""><h4 class="mb-1">{{ slotProps.data.text }}</h4></a>
                                                    <h6 class="mt-0 mb-3">${{ slotProps.data.price }}</h6>
                                                    <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data.inventoryStatus)" />
                                                    <div class="mt-5">
                                                        <Button icon="pi pi-search" rounded class="mr-2" />
                                                        <Button icon="pi pi-star-fill" rounded severity="success" class="mr-2" />
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </Carousel>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- cột trái -->
</template>

<style scoped>
.grid {
    margin-top: 45px;
    display: flex;
    justify-content: center;
}
.ms {
    color: #5a6069;
    font-weight: bold; /* Làm đậm chữ */
}
.masp {
    color: #e8bd72;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5); /* Đổ bóng chữ */
    font-weight: bold; /* Làm đậm chữ */
}

.rounded-content-list {
    display: flex;
    flex-wrap: wrap;
}

.rounded-content {
    display: flex;
    align-items: center;
    padding: 1px;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    margin: 4px;
    flex-basis: calc(25% - 8px); /* Đặt kích thước ban đầu của mỗi ô, chừa khoảng cách 8px giữa các ô */
    max-width: calc(25% - 8px); /* Đặt giới hạn kích thước tối đa của mỗi ô */
    box-sizing: border-box;
}

.rounded-image {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 8px;
}

.rounded-text {
    font-size: 12px;
    color: #333;
}
.sl {
    display: flex; /* Sử dụng flexbox để căn chỉnh các phần tử theo chiều ngang */
    align-items: center; /* Căn phần tử theo chiều dọc để chúng đều nhau */
    gap: 10px; /* Khoảng cách giữa các phần tử */
}
/* CSS cho nút tăng giảm số lượng (phiên bản nhỏ hơn) */
.quantity {
    display: flex;
    align-items: center;
}

.minus,
.plus {
    cursor: pointer;
    font-size: 15px; /* Kích thước chữ nhỏ hơn */
    background-color: #ffffff;
    color: black;
    padding: 10px 16px; /* Kích thước padding nhỏ hơn */
    margin: 0;
    border-top-left-radius: 20px; /* Bo tròn góc trên trái của nút giảm số lượng */
    border-bottom-left-radius: 20px; /* Bo tròn góc dưới trái của nút giảm số lượng */
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    transition: background-color 0.3s ease;
    border: 1px solid #ccc;
}

.plus {
    border-top-right-radius: 20px; /* Bo tròn góc trên phải của nút tăng số lượng */
    border-bottom-right-radius: 20px; /* Bo tròn góc dưới phải của nút tăng số lượng */
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

/* CSS cho ô nhập số lượng */
.qty {
    font-size: 15px; /* Kích thước chữ nhỏ hơn */
    text-align: center;
    padding: 10px 12px; /* Kích thước padding nhỏ hơn */
    border: 1px solid #ccc;
    border-radius: 0;
    width: 50px; /* Kích thước width nhỏ hơn */
    margin: 0;
}

.ctn {
    display: flex;
    flex-direction: column; /* Xếp theo cột */
    align-items: flex-start; /* Căn các phần tử theo trục dọc (cột) */
}

.item {
    display: flex;
    align-items: center; /* Căn các phần tử label và span theo trục ngang */
    margin-bottom: 0px; /* Khoảng cách giữa các item */
}

.item label {
    width: 150px; /* Độ rộng cố định của label để tạo ra một cột cố định */
    text-align: left; /* Căn phải nếu bạn muốn label nằm ở bên phải */
    margin-right: 30px;
}

.container {
    width: 1100px;
}
</style>
