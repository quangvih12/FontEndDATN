<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { userStore } from '@/service/Admin/User/UserService.js';
import tokenService from '@/service/Authentication/TokenService.js'
import { ThongBaoStore } from '../service/Admin/thongBao/thongBao.api'

const thongBaoStore = ThongBaoStore();
const userService = userStore();
const { layoutConfig, onMenuToggle } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
    getAllTB();
    fetchData();
    getDem();
});

const data = ref([]);
const getAllTB = async () => {
    await thongBaoStore.fetchData();
    data.value = thongBaoStore.data;
}

const dem = ref([]);
const getDem = async () => {
   dem.value = await thongBaoStore.fetchdem();
}


const daXem = async (id) => {
    await thongBaoStore.daXem(id);
    getAllTB();
    getDem();
    router.push({ name: 'quan-ly-hoa-don' });
}

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const selectedKH = ref(null);
const khachHang = ref([]);

const fetchData = async () => {
    try {
        await userService.fetchDataByStatus();
        khachHang.value = userService.data;
    } catch (error) {
        // Xử lý lỗi ở đây nếu cần
    }
};


// dùng để lưu thông tin khách hàng khi được chọn CBB.
// nếu muốn dùng thông tin khách hàng khi đặt hàng thì dùng selectedCustomer.value
const selectedCustomer = ref(null);

// hàm gọi sự thay đổi thông tin của khách hàng khi click vào CBB
const displayKH = async () => {
    selectedCustomer.value = khachHang.value.find(kh => kh.ten === selectedKH.value.ten);
    const token = await tokenService.gentoken(selectedCustomer.value.username)
    localStorage.setItem('token', token);
};

const op = ref();
const toggle2 = (event) => {
    op.value.toggle(event);
};


</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>SAKAI</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" style=" display: inline-block; ">
            <div v-if="selectedCustomer === null">
                <Dropdown v-model="selectedKH" :options="khachHang" optionLabel="ten" placeholder="Chọn KH"
                    class="w-full md:w-8rem" style=" margin-top: 5px; max-height: 100px; overflow-y: auto;"
                    @change="displayKH" />
            </div>

            <div v-else class="layout-topbar-logo" style=" display: inline-block;">
                <div style="font-size: 10px">
                    <div>Tên: {{ selectedCustomer.ten }}</div>
                    <div>Role: {{ selectedCustomer.role }}</div>
                </div>
            </div>
        </div>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">

            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>
            <button @click="onSettingsClick()" class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>

            <div class=" flex justify-content-center gap-4">


                <button class="p-link " @click="toggle2" aria-haspopup="true" aria-controls="overlay_tmenu">
                    <i v-badge="dem" class="pi pi-bell p-overlay-badge" style="font-size: 2rem" />
                </button>

                <OverlayPanel ref="op">

                    <H6>Thông báo </H6>
                    <div v-for="(o, index) in data">
                        <button class="p-link " aria-haspopup="true" aria-controls="overlay_tmenu">
                            <div class="flex align-items-center"
                                style="height: 50px;margin-bottom: 10px; width: 240px;"
                                @click="daXem(o.id)">
                                <div style="display:  flex; ">
                                    <div style="margin-right: 10px; width: 180px;  margin-bottom: -30px;">
                                        <p style="margin-bottom: 30px; ">{{ o.content }}</p>
                                    </div>
                                    <div style=" ">
                                        <span style="font-size: 10px; margin-top: 0px; ">{{ o.trangThai == 0 ? 'đã xem' :
                                            'chưa xem' }}</span>
                                    </div>
                                </div>


                            </div>
                        </button>

                    </div>

                </OverlayPanel>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
