import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'Thống kê',
                    component: () => import('@/components/Admin/ThongKe/index.vue')
                },
                {
                    path: '/pages/quan-ly-hoa-don',
                    name: 'quan-ly-hoa-don',
                    component: () => import('@/components/Admin/HoaDon/index.vue')
                },
               
                {
                    path: '/pages/khuyenmai',
                    name: 'khuyenmai',
                    component: () => import('@/components/Admin/KhuyenMai/KhuyenMai.vue')
                } ,
                {
                    path: '/pages/voucher',
                    name: 'voucher',
                    component: () => import('@/components/Admin/Voucher/Voucher.vue')
                },
                {
                    path: '/pages/product',
                    name: 'product',
                    component: () => import('@/components/Admin/Product/ChiTietSanPham.vue')
                },
                {
                    path: '/pages/user',
                    name: 'user',
                    component: () => import('@/components/Admin/QuanLyUser/ViewUser.vue')
                },
                {
                    path: '/pages/size',
                    name: 'size',
                    component: () => import('@/components/Admin/QuanLySize/ViewSize.vue')
                },
                {
                    path: '/pages/thuong-hieu',
                    name: 'thuong-hieu',
                    component: () => import('@/components/Admin/QuanLyThuongHieu/ViewThuongHieu.vue')
                },
                // {
                //     path: '/uikit/menu',
                //     component: () => import('@/views/uikit/Menu.vue'),
                //     children: [
                //         {
                //             path: '/uikit/menu',
                //             component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                //         },
                //         {
                //             path: '/uikit/menu/seat',
                //             component: () => import('@/views/uikit/menu/SeatDemo.vue')
                //         },
                //         {
                //             path: '/uikit/menu/payment',
                //             component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                //         },
                //         {
                //             path: '/uikit/menu/confirmation',
                //             component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                //         }
                //     ]
                // },
                
               
            ]
        }
        // {
        //     path: '/landing',
        //     name: 'landing',
        //     component: () => import('@/views/pages/Landing.vue')
        // },
        // {
        //     path: '/pages/notfound',
        //     name: 'notfound',
        //     component: () => import('@/views/pages/NotFound.vue')
        // },

        // {
        //     path: '/auth/login',
        //     name: 'login',
        //     component: () => import('@/views/pages/auth/Login.vue')
        // },
        // {
        //     path: '/auth/access',
        //     name: 'accessDenied',
        //     component: () => import('@/views/pages/auth/Access.vue')
        // },
        // {
        //     path: '/auth/error',
        //     name: 'error',
        //     component: () => import('@/views/pages/auth/Error.vue')
        // }
    ]
});

export default router;
