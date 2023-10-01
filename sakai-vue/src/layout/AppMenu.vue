<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'UI Components',
        items: [
            {
                label: 'prodct',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/product'
            },
            {
                label: 'Khuyến Mãi',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/khuyenmai'
            }
            ,
            {
                label: 'Voucher',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/voucher'
            },
            {
                label: 'Hóa Đơn',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/quan-ly-hoa-don'
            },
            {
                label: 'User',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/user'
            },
            {
                label: 'Thương Hiệu',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/thuong-hieu'
            },
        ]
    }

    
    
    
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
               
            </a>
        </li>
    </ul>
</template>

<style lang="scss" scoped></style>
