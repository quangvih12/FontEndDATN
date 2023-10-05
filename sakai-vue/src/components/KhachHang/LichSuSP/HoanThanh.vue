<script setup>
const anh = '';
const listSP = [
    {
        ten: 'sp1',
        mauSac: 'Xanh',
        loai: 'Nón 3/4',
        soLuong: 2,
        gia: 100000,
        anh: 'https://scontent.xx.fbcdn.net/v/t1.15752-9/384493871_706347594225121_6598834362586102924_n.jpg?stp=dst-jpg_p206x206&_nc_cat=107&ccb=1-7&_nc_sid=aee45a&_nc_ohc=ajZoo7UQfa8AX93g7H2&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdSOI1KiOFTvfEiZSrwsQ3dI_7QsQFhCgBA-f_D9wdXwJQ&oe=6541D15A',
        trangThai: 1
    },
    {
        ten: 'sp1',
        mauSac: 'Xanh',
        loai: 'Nón 3/4',
        soLuong: 2,
        gia: 100000,
        anh: 'https://scontent.xx.fbcdn.net/v/t1.15752-9/384493871_706347594225121_6598834362586102924_n.jpg?stp=dst-jpg_p206x206&_nc_cat=107&ccb=1-7&_nc_sid=aee45a&_nc_ohc=ajZoo7UQfa8AX93g7H2&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdSOI1KiOFTvfEiZSrwsQ3dI_7QsQFhCgBA-f_D9wdXwJQ&oe=6541D15A',
        trangThai: 1
    },
    {
        ten: 'sp1',
        mauSac: 'Xanh',
        loai: 'Nón 3/4',
        soLuong: 2,
        gia: 100000,
        anh: 'https://scontent.xx.fbcdn.net/v/t1.15752-9/384493871_706347594225121_6598834362586102924_n.jpg?stp=dst-jpg_p206x206&_nc_cat=107&ccb=1-7&_nc_sid=aee45a&_nc_ohc=ajZoo7UQfa8AX93g7H2&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdSOI1KiOFTvfEiZSrwsQ3dI_7QsQFhCgBA-f_D9wdXwJQ&oe=6541D15A',
        trangThai: 1
    }
];
</script>

<template>
    <div class="sreach">
        <span class="p-input-icon-left" style="width: 100%">
            <i class="pi pi-search" />
            <InputText v-model="value1" placeholder="Search" style="width: 100%" />
        </span>
    </div>
    <div v-for="(items, index) in listSP" :key="index">
        <div class="rong"></div>
        <div class="san-pham">
            <p>
                <span class="hoan-thanh">{{ items.trangThai == 1 ? 'Giao thành công' : 'Giao thất bại' }} <i class="pi pi-check" style="font-size: 1rem"></i></span> <span class="gach"> | </span>
                <span class="giao-thanh-cong"> {{ items.trangThai == 1 ? 'Đơn hàng đã được giao thành công' : 'Đơn hàng đã được giao thất bại' }} <i class="pi pi-truck" style="font-size: 1.5rem"></i></span>
            </p>
        </div>
        <div class="thong-tin-sp">
            <div class="product-container">
                <div class="thumbnail">
                    <img :src="items.anh" alt="Thumbnail" />
                </div>
                <div class="details">
                    <p style="font-size: 18px; font-weight: bold; margin-bottom: 0">Sản phẩm: {{ items.ten }}</p>
                    <p style="font-size: 17px; margin-bottom: 0">Màu sắc: {{ items.mauSac }}</p>
                    <p style="font-size: 17px">Số lượng: {{ items.soLuong }}</p>
                </div>
            </div>
            <div style="text-align: right">
                <p style="font-size: 17px; margin-bottom: 0">
                    Giá: <span style="font-weight: bold">{{ items.gia }}đ</span>
                </p>
                <p style="font-size: 17px; margin-bottom: 0">
                    Thành tiền: <span style="font-weight: bold">{{ items.gia * items.soLuong }}đ</span>
                </p>
                <Button class="my-button" label="Mua lại" severity="danger" />
            </div>
        </div>
        <!-- <div class="rong"></div> -->
    </div>
</template>

<style scoped>
.sreach {
    margin-bottom: 10px;
}
.rong {
    position: absolute;
    /* top: 100px; */
    left: 0;
    right: 0;
    margin: auto;
    width: 1100px;
    width: 100%;
    height: 20px;
    background: rgb(239, 243, 248);
}
.san-pham {
    margin-top: 20px;
    padding-top: 20px;
    display: flex;
    justify-content: flex-start;
    position: relative;
    align-items: center;
}
.san-pham i.pi-truck {
    font-size: 1.5rem;
    vertical-align: middle; /* Điều chỉnh vị trí của icon theo chiều dọc */
}

.san-pham::after {
    content: '';
    width: 100%;
    height: 1px; /* Độ dày của dấu gạch ngang */
    background-color: black; /* Màu sắc của dấu gạch ngang */
    position: absolute;
    bottom: 0;
}
.hoan-thanh {
    color: red; /* Đặt màu cam cho chữ HOÀN THÀNH */
}

.giao-thanh-cong {
    color: gray; /* Đặt màu ghi cho chữ Đơn hàng đã được giao thành công */
}
.gach {
    font-size: 20px;
}

.thong-tin-sp {
    /* padding-bottom: 10px; */
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.product-container {
    display: flex;
    align-items: flex-start;
}

.thumbnail {
    margin-right: 20px;
}

.thumbnail img {
    width: 150px; /* Điều chỉnh kích thước của ảnh */
    height: auto;
}

.details {
    text-align: left;
    /* flex: 1; */
}

.my-button {
    margin-top: 10px;
}
</style>
