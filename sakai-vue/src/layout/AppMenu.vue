<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Thống Kê',
        items: [{ label: 'Thống Kê', icon: 'pi pi-fw pi-home', to: '/thong-ke' }]
    },
    {
        label: 'Sản Phẩm',
        items: [

            {
                label: 'Quản Lý Sản Phẩm',
                icon: '',
                items: [
                    {
                        label: 'Sản Phẩm',
                        icon: 'pi pi-fw pi-circle-off',
                        to: '/pages/product'
                    }, {
                        label: 'Thương Hiệu',
                        icon: 'pi pi-fw pi-circle-off',
                        to: '/pages/thuong-hieu'
                    },
                    {
                        label: 'Màu sắc',
                        icon: 'pi pi-fw pi-circle-off',
                        to: '/pages/mau-sac'
                    },
                    {
                        label: 'Size',
                        icon: 'pi pi-fw pi-circle-off',
                        to: '/pages/size'
                    },
                    {
                        label: 'Loại',
                        icon: 'pi pi-fw pi-circle-off',
                        to: '/pages/loai'

                    },
                    {
                        label: 'Vật liệu',
                        icon: 'pi pi-fw pi-circle-off',
                        to: '/pages/vat-lieu'
                    },
                    {
                        label: 'Trọng lượng',
                        icon: 'pi pi-fw pi-circle-off',
                        to: '/pages/trong-luong'
                    },
                ]
            },
        ]
    },
    {
        label: 'Vocher - Khuyễn Mãi',
        items: [{
            label: 'Quản lý Khuyến Mãi',
            icon: 'pi pi-fw pi-circle-off',
            to: '/pages/khuyenmai'
        },
        {
            label: 'Quản lý Voucher',
            icon: 'pi pi-fw pi-circle-off',
            to: '/pages/voucher'
        },]
    },
    {
        label: 'User',
        items: [{
            label: 'Quản lý User',
            icon: 'pi pi-fw pi-circle-off',
            to: '/pages/user'
        },]
    },
    {
        label: 'Quản lý Hóa Đơn',
        items: [{
            label: 'Hóa Đơn',
            icon: 'pi pi-fw pi-circle-off',
            to: '/pages/quan-ly-hoa-don'
        },]
    },


]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank"> </a>
        </li>
    </ul>
</template>

<style lang="scss" scoped></style>
