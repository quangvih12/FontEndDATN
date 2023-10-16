<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { userStore } from '@/service/Admin/User/UserService.js';

const userService = userStore();
const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
    fetchData();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `https://nontrum.vn/wp-content/uploads/2021/12/NonTrum-logo-2022png.png`;
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
     await  userService.getAllUser();
    khachHang.value = userService.data;
  } catch (error) {
    // Xử lý lỗi ở đây nếu cần
  }
};

// dùng để lưu thông tin khách hàng khi được chọn CBB.
// nếu muốn dùng thông tin khách hàng khi đặt hàng thì dùng selectedCustomer.value
const selectedCustomer = ref(null);

// hàm gọi sự thay đổi thông tin của khách hàng khi click vào CBB
const displayKH = () => {
  selectedCustomer.value = khachHang.value.find(kh => kh.ten === selectedKH.value.ten);
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
        </router-link>

        <!-- <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button> -->

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu">
            <router-link to="/" class="layout-topbar-logo" style="width: 13%; margin-left: 10px">
                <p style="font-size: 19px">Home</p>
            </router-link>
            <router-link to="/" class="layout-topbar-logo" style="width: 22%; margin-left: 10px">
                <p style="font-size: 19px">Sản phẩm</p>
            </router-link>
            <router-link to="/" class="layout-topbar-logo" style="width: 28%; margin-left: 10px">
                <p style="font-size: 19px">Về chúng tôi</p>
            </router-link>
            <router-link to="/pages/size" class="layout-topbar-logo" style="width: 16%; margin-left: 10px">
                <p style="font-size: 19px">Liên hệ</p>
            </router-link>

        
            <div class="layout-topbar-logo"  style="width: 16%; margin-left: 10px">          
                <div  v-if="selectedCustomer === null">
                    <Dropdown v-model="selectedKH" :options="khachHang" optionLabel="ten"
                placeholder="Chọn KH" class="w-full md:w-8rem" style=" margin-top: 5px; max-height: 100px; overflow-y: auto;"  @change="displayKH" />
                </div>
            
                <div v-else  style=" display: inline-block;">
                    <div style="font-size: 10px">
                        <div>Tên: {{ selectedCustomer.ten }}</div>
                        <div>Role: {{ selectedCustomer.role }}</div>
                    </div>
                </div>          
            </div>

            <InputText type="text" v-model="value" style="height: 35px;width: 18%; margin-left: 5px;margin-top: 5px ;" />
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-search"></i>
                <span>Calendar</span>
            </button>
            <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-shopping-cart"></i>
                <span>Profile</span>
            </button> -->
            <router-link to="/gio-hang" class="layout-topbar-logo" style="width: 16%; margin-left: 10px">
                <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                    <i class="pi pi-shopping-cart"></i>
                    <span>Profile</span>
                </button>
            </router-link>

            <!-- <button @click="onSettingsClick()" class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button> -->
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
