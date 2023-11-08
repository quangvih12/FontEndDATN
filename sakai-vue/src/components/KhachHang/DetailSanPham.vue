<script setup>
import Breadcrumb from 'primevue/breadcrumb';
import { ref, onMounted } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { useDetailProductStore } from '../../service/KhachHang/DetailService'; // Đường dẫn đến store của bạn
import { useRoute } from 'vue-router';

const productStore = useDetailProductStore();
const route = useRoute();
const idProduct = parseInt(route.params.id);

const dataSanPham = ref({});
const dataMauSac = ref([]);
const dataSize = ref([]);
const loadImage = ref([]);
const products = ref([]);
const dataListSPCT = ref([]);

onMounted(() => {
    loadData();
    // loadImg();
    // loadDataSize();
    // loadProducts();
    // loadDataMauSac();
    loaddataListSPCT();
});

const loaddataListSPCT = async () => {
    await productStore.fetchSPCTByIdSP(idProduct);
    dataListSPCT.value = productStore.products;
    console.log(dataListSPCT.value);
};

const loadData = async () => {
    await productStore.fetchProductById(idProduct);
    dataSanPham.value = productStore.product;
    loadImage.value = dataSanPham.value.images;
    console.log(dataSanPham.value);
};

const loadProducts = async () => {
    await productStore.fetchAll();
    products.value = productStore.products;
    // console.log(productStore.products);
};

const loadImg = async () => {
    await productStore.fetchAllImage(idProduct);
    loadImage.value = productStore.images;
    // console.log(loadImage.value);
};

const loadDataMauSac = async () => {
    await productStore.fetchAllMauSac(idProduct);
    dataMauSac.value = productStore.mauSacs;
    // console.log(productStore.mauSacs);
};

const loadDataSize = async () => {
    await productStore.fetchAllSize(idProduct);
    dataSize.value = productStore.sizes;
    // console.log(productStore.sizes);
};

const quantity = ref(1);

const increment = () => {
    quantity.value += 1;
};

const decrement = () => {
    if (quantity.value > 1) {
        quantity.value -= 1;
    }
};

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
    to: '/'
});
const items = ref([{ label: 'Sản phẩm', to: '/san-pham' }, { label: 'Sản phẩm chi tiết' }]);

const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const selectedColorIndex = ref(null);
function selectColor(index) {
    selectedColorIndex.value = index;
}
</script>

<template>
    <div class="card">
        <div class="grid">
            <div class="container">
                <Breadcrumb :home="home" :model="items" />
                <!-- Cột phải -->
                <div class="card md:flex md:justify-content-center" style="margin-top: 0px">
                    <!-- <div v-for="image in loadImage" :key="image.id">
                        <img :src="image.anh" alt="Ảnh sản phẩm" />
                    </div> -->
                    <div class="flex">
                        <div class="col-5">
                            <Galleria :value="loadImage" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 450px">
                                <template #item="slotProps">
                                    <img :src="slotProps.item.anh" :alt="slotProps.item" style="width: 100%" />
                                </template>
                                <template #thumbnail="slotProps">
                                    <img :src="slotProps.item.anh" :alt="slotProps.item" style="width: 100%" />
                                </template>
                            </Galleria>
                        </div>
                        <div class="col-7">
                            <h1 class="masp">{{ dataSanPham.ten }}</h1>
                            <label for=""
                                >Mã SP: <span>{{ dataSanPham.ma }}</span></label
                            >
                            <label for="" style="margin-left: 20px"
                                >Loại: <span style="color: red">{{ dataSanPham.loai }}</span></label
                            >
                            <div class="gb">
                                <h2 style="color: red" :class="{ 'gach-di': dataSanPham.id }">{{ formatCurrency(dataSanPham.giaBan) }}</h2>
                                <h2 style="color: red">{{ formatCurrency(dataSanPham.giaSauGiam) }}</h2>
                                <Tag v-if="dataSanPham.id !== null && dataSanPham.id !== undefined" severity="danger" style="margin-left: 15px">Giảm {{ dataSanPham.giaTriGiam }}%</Tag>
                            </div>
                            <label for="">- Trọng lượng: {{ dataSanPham.trongLuong }}</label>
                            <br />
                            <label for="">- Số lượng tồn: {{ dataSanPham.soLuongTon }} </label>
                            <br />
                            <br />
                            <label class="ms">Màu sắc</label>
                            <br />
                            <div class="rounded-content-list">
                                <div v-for="(mauSacs, index) in dataMauSac" :key="index" :class="{ 'rounded-content': true, selected: index === selectedColorIndex }" @click="selectColor(index)">
                                    <img class="rounded-image" :src="mauSacs.anh" alt="Hình ảnh" />
                                    <a class="rounded-text">{{ mauSacs.mauSac.ten }}</a>
                                </div>
                            </div>
                            <br />
                            <div class="flex flex-wrap gap-3">
                                <label class="ms" style="margin-left: 5px">Kích cỡ</label>
                                <div class="flex align-items-center" v-for="(s, index) in dataSize" :key="index">
                                    <input type="radio" :id="'size' + s.id" :value="s.size.ten" v-model="selectedSize" :name="'sizeGroup'" />
                                    <label :for="'size' + s.id" class="ml-2">{{ s.size.ten }}</label>
                                </div>
                            </div>
                            <br />
                            <br />
                            <div class="sl">
                                <label for="quantity">Số lượng</label>
                                <br />
                                <div class="quantity">
                                    <button @click="decrement" class="minus p-button-secondary p-button-outlined">
                                        <i class="pi pi-minus"></i>
                                    </button>
                                    <input v-model="quantity" class="input-soluong" style="width: 35px" disabled />
                                    <button @click="increment" class="plus-phai p-button-secondary p-button-outlined">
                                        <i class="pi pi-plus"></i>
                                    </button>
                                </div>
                                <Button label="Thêm vào giỏ hàng" icon="pi pi-shopping-cart" class="p-button-rounded p-button-warning mr-2 mb-2" style="background: #e8bd72" />
                                <Button label="Mua ngay" class="p-button-rounded p-button-warning mr-2 mb-2" style="background: #e8bd72" />
                            </div>
                        </div>
                    </div>
                    <div class="tab-view-container">
                        <TabView>
                            <TabPanel header="Mô tả sản phẩm">
                                <iframe
                                    style="margin-left: 220px"
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
                                <label for=""> {{ dataSanPham.moTa }}</label>
                                <h3>CHI TIẾT SẢN PHẨM</h3>
                                <div class="ctn">
                                    <div class="item">
                                        <label>Size: </label>
                                        <span>L và XL</span>
                                    </div>
                                    <Divider />
                                    <div class="item">
                                        <label>Trọng lượng: </label>
                                        <span> {{ dataSanPham.trongLuong }} </span>
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
                                        <span> {{ dataSanPham.demLot }}</span>
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
                                        <span> {{ dataSanPham.thuongHieu }} </span>
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
                            </TabPanel>
                            <TabPanel header="Đánh giá">
                                <br />
                                <br />
                                <div class="flex">
                                    <h6 style="margin-right: 10px"><span>1 </span> bình luận</h6>
                                    <label style="margin-left: 675px" for=""></label>
                                    <Dropdown :options="dataTrangThai" optionLabel="label" placeholder="Tất cả bình luận" class="w-full md:w-14rem" style="margin-left: 20px" />
                                </div>
                                <div class="">
                                    <Avatar icon="pi pi-user" class="" size="xlarge" />
                                    <span class="p-float-label">
                                        <Textarea v-model="value" rows="5" cols="145" />
                                    </span>
                                    <Toast />
                                    <div class="flex flex-wrap justify-content-between align-items-center gap-3 mt-3" style="margin-left: 900px">
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
                            </TabPanel>
                        </TabView>
                    </div>
                    <Divider />
                    <div class="">
                        <h2>Sản phẩm tương tự</h2>
                        <Carousel :value="products" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
                            <template #item="slotProps">
                                <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
                                    <a href="">
                                        <img :src="slotProps.data.sanPham.anh" alt="Hình ảnh" style="width: 50%" />
                                    </a>
                                    <div>
                                        <a href=""
                                            ><h4 class="mb-1">{{ slotProps.data.sanPham.ten }}</h4></a
                                        >
                                        <h6 class="mt-0 mb-3">{{ slotProps.data.giaBan }} đ</h6>
                                        <div class="mt-5">
                                            <Button icon="pi pi-search" rounded class="mr-2" />
                                            <Button icon="pi pi-star-fill" rounded severity="success" class="mr-2" />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- cột trái -->
</template>

<style scoped>
.gb {
    display: flex;
    align-items: baseline;
}

.gach-di {
    text-decoration: line-through;
    font-size: 1em;
    margin-right: 15px;
}
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

.size-container {
    display: inline-block; /* hoặc sử dụng 'inline-flex' nếu bạn muốn chúng căng ra đều theo chiều ngang */
    margin-right: 10px; /* Khoảng cách giữa các phần tử */
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

.selected {
    border-color: #e8bd72; /* Màu border khi được chọn */
}
</style>
