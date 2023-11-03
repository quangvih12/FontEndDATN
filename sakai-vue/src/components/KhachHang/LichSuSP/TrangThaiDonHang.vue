<script setup>
import { ref } from 'vue';
import Timeline from 'primevue/timeline';

const events = ref([
    { status: 'Đơn hàng đã đặt', date: '15/10/2020', icon: 'pi pi-wallet', color: '#9C27B0' },
    { status: 'Đơn hàng đã thanh toán', date: '15/10/2020', icon: 'pi pi-money-bill', color: '#673AB7' },
    { status: 'Đã giao cho ĐVVC', date: '15/10/2020', icon: 'pi pi-car', color: '#FF9800' },
    { status: 'Đã nhận được hàng', date: '16/10/2020', icon: 'pi pi-box', color: '#607D8B' },
    { status: 'Đánh giá', date: '17/10/2020', icon: 'pi pi-star', color: '#F55C3B' }
]);
</script>
<template>
    <div class="container">
        <div class="card">
            <div>
                <div class="flex">
                    <div>
                        <h3>Trạng thái đơn hàng</h3>
                    </div>
                    <div style="margin-left: 600px">
                        <label for="">Mã đơn hàng: <span> 230909SXN2SJKS </span></label>
                    </div>
                    <div style="margin-left: 10px">
                        <span> | </span>
                        <label for="" style="color: red; margin-left: 10px">ĐÃ NHẬN ĐƯỢC HÀNG</label>
                    </div>
                </div>
                <div>
                    <Timeline :value="events" layout="horizontal" align="bottom" class="customized-timeline">
                        <template #marker="slotProps">
                            <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" :style="{ backgroundColor: slotProps.item.color }">
                                <i :class="slotProps.item.icon"></i>
                            </span>
                        </template>
                        <template #opposite="slotProps">
                            <small class="p-text-secondary">{{ slotProps.item.date }}</small>
                        </template>
                        <template #content="slotProps">
                            {{ slotProps.item.status }}
                        </template>
                    </Timeline>
                </div>
                <Divider />
                <div class="flex">
                    <div>
                        <p>Cảm ơn bạn đã mua sắm tại VNK!</p>
                    </div>
                    <div style="margin-left: 600px">
                        <Button type="button" label="Liên hệ" icon="pi pi-users" badgeClass="p-badge-danger" style="width: 200px; margin-left: 20px" outlined />
                    </div>
                </div>
                <Divider />
                <div class="flex">
                    <div>
                        <Image src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/NOQJHlDEN.jpg" alt="Image" width="150" preview />
                    </div>
                    <div class="product-details">
                        <h5 class="flex details">MŨ BẢO HIỂM 3/4 XH 01</h5>
                        <div class="flex details">
                            <div>
                                <p>Size: <span>L</span></p>
                                <p>Màu sắc: <span>Vàng, xanh</span></p>
                                <p>Số lượng: x<span>5</span></p>
                            </div>
                            <div class="price">
                                <h6 style="color: red">419.000 vnđ</h6>
                                <Button type="button" label="Mua lại" style="width: 200px" />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div class="flex">
                    <div>
                        <Image src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/NOQJHlDEN.jpg" alt="Image" width="150" preview />
                    </div>
                    <div class="product-details">
                        <h5 class="flex details">MŨ BẢO HIỂM 3/4 XH 01</h5>
                        <div class="flex details">
                            <div>
                                <p>Size: <span>L</span></p>
                                <p>Màu sắc: <span>Vàng, xanh</span></p>
                                <p>Số lượng: x<span>5</span></p>
                            </div>
                            <div class="price">
                                <h6 style="color: red">419.000 vnđ</h6>
                                <Button type="button" label="Mua lại" style="width: 200px" />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div class="flex">
                    <div>
                        <Image src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/NOQJHlDEN.jpg" alt="Image" width="150" preview />
                    </div>
                    <div class="product-details">
                        <h5 class="flex details">MŨ BẢO HIỂM 3/4 XH 01</h5>
                        <div class="flex details">
                            <div>
                                <p>Size: <span>L</span></p>
                                <p>Màu sắc: <span>Vàng, xanh</span></p>
                                <p>Số lượng: x<span>5</span></p>
                            </div>
                            <div class="price">
                                <h6 style="color: red">419.000 vnđ</h6>
                                <Button type="button" label="Mua lại" style="width: 200px" />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div class="flex">
                    <div>
                        <Image src="https://royalhelmet.com.vn/ckfinder/userfiles/images/products/NOQJHlDEN.jpg" alt="Image" width="150" preview />
                    </div>
                    <div class="product-details">
                        <h5 class="flex details">MŨ BẢO HIỂM 3/4 XH 01</h5>
                        <div class="flex details">
                            <div>
                                <p>Size: <span>L</span></p>
                                <p>Màu sắc: <span>Vàng, xanh</span></p>
                                <p>Số lượng: x<span>5</span></p>
                            </div>
                            <div class="price">
                                <h6 style="color: red">419.000 vnđ</h6>
                                <Button type="button" label="Mua lại" style="width: 200px" />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div class="flex">
                    <div>
                        <h4>Địa chỉ nhận hàng</h4>
                        <p>Nguyễn Long Vũ</p>
                        <p>(+84) 375978188</p>
                        <p>40 Ngách 38, Ngõ 342 Hồ Tùng Mậu, Phường Phú Diễn, Quận Bắc Từ Liêm, Hà Nội</p>
                    </div>
                    <div class="c2">
                        <p>Tổng tiền hàng</p>
                        <p>Phí vận chuyển</p>
                        <p>Khuyến mại</p>
                        <p>Vourcher</p>
                        <p>Thành tiền</p>
                    </div>
                    <div class="c2">
                        <p>₫419.000</p>
                        <p>₫12.800</p>
                        <p><span>-</span>₫12.800</p>
                        <p><span>-</span>₫62.850</p>
                        <p style="font-weight: bold; color: red">₫356.150</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container {
    margin-top: 80px;
}

.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.product-details {
    flex: 1; /* Để cho phần tử này mở rộng và lấp đầy khoảng trống trong flex container */
}

.details {
    margin-left: 20px; /* Khoảng cách giữa thông tin sản phẩm và giá tiền */
}

.price {
    text-align: right; /* Đặt giá tiền ở bên phải */
}

</style>