import {createRouter, createWebHistory} from 'vue-router';
import {requireAdmin, requireAuth} from "../middleware";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '',
            component: () => import('@/layout/KhachHang/AppLayoutKH.vue'),
            children: [
                {
                    path: '',
                    name: 'trang-chu',
                    component: () => import('@/components/KhachHang/TrangChu.vue')
                },
                {
                    path: 'gioi-thieu',
                    name: 'gioi-thieu',
                    component: () => import('@/components/KhachHang/GioiThieu.vue'),
                },
                {
                    path: 'san-pham-da-xem',
                    name: 'san-pham-da-xem',
                    component: () => import('@/components/KhachHang/SanPhamDaXem.vue'),
                },
                {
                    path: 'lich-su-san-pham',
                    name: 'lich-su-san-pham',
                    beforeEnter: requireAuth,
                    component: () => import('@/components/KhachHang/LichSuSP/LichSuSP.vue'),
                },
                {
                    path: 'ho-so',
                    name: 'ho-so',
                    beforeEnter: requireAuth,
                    component: () => import('@/components/KhachHang/ThongTinKhachHang.vue'),
                },
                {
                    path: 'san-pham',
                    name: 'san-pham',
                    component: () => import('@/components/KhachHang/SanPham.vue'),
                },
                {
                    path: 'san-pham/:id',
                    name: 'chi-tiet-san-pham',
                    component: () => import('@/components/KhachHang/DetailSanPham.vue'),
                    props: true
                },
                {
                    path: 'gio-hang',
                    name: 'gio-hang',
                    component: () => import('@/components/KhachHang/GioHang/GioHang.vue')
                },
                {
                    path: 'gio-hang/thanh-toan',
                    name: 'thanh-toan',
                    component: () => import('@/components/KhachHang/ThanhToan.vue'),
                    beforeEnter: requireAuth
                },
                {
                    path: 'gio-hang/thanh-toan/thanh-cong',
                    name: 'thanh-cong',
                    component: () => import('@/components/KhachHang/Success.vue'),
                    beforeEnter: requireAuth
                },
                {
                    path: 'gio-hang/thanh-toan/that-bai',
                    name: 'that-bai',
                    component: () => import('@/components/KhachHang/PaymentFailled.vue'),
                    beforeEnter: requireAuth
                },
                {
                    path: 'trang-thai-don-hang/:id',
                    name: 'trang-thai-don-hang',
                    beforeEnter: requireAuth,
                    component: () => import('@/components/KhachHang/LichSuSP/TrangThaiDonHang.vue'),
                },
                {
                    path: 'dia-chi',
                    name: 'dia-chi',
                    beforeEnter: requireAuth,
                    component: () => import('@/components/KhachHang/DiaChiKhachHang/Index.vue')
                }
            ]
        },
        {
            path: '/dang-ky',
            name: 'dang-ky',
            component: () => import('@/components/KhachHang/Register.vue'),
        },
        {
            path: '/dang-ky/xac-thuc',
            name: 'xac-thuc',
            component: () => import('@/components/KhachHang/OTP.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/admin/login',
            name: 'login-admin',
            component: () => import('@/views/pages/auth/LoginAdmin.vue')
        },
        {
            path: '/admin',
            component: () => import('@/layout/AppLayout.vue'),
            beforeEnter: requireAdmin,
            children: [
                {
                    path: '',
                    name: 'admin',
                    component: () => import('@/components/Admin/Product/ViewPlaceholder.vue')
                },
                {
                    path: 'san-pham',
                    component: () => import('@/layout/LayoutSP.vue'),
                    children: [
                        {
                            path: '',
                            name: 'quan-ly-san-pham',
                            component: () => import('@/components/Admin/Product/ChiTietSanPham.vue')
                        },
                        {
                            path: 'mau-sac',
                            name: 'mau-sac',
                            component: () => import('@/components/Admin/MauSac/index.vue')
                        },
                        {
                            path: 'loai',
                            name: 'loai',
                            component: () => import('@/components/Admin/Loai/index.vue')
                        },
                        {
                            path: 'trong-luong',
                            name: 'trong-luong',
                            component: () => import('@/components/Admin/TrongLuong/Index.vue')
                        },
                        {
                            path: 'vat-lieu',
                            name: 'vat-lieu',
                            component: () => import('@/components/Admin/VatLieu/Index.vue')
                        },
                        {
                            path: 'size',
                            name: 'size',
                            component: () => import('@/components/Admin/QuanLySize/ViewSize.vue')
                        },
                        {
                            path: 'thuong-hieu',
                            name: 'thuong-hieu',
                            component: () => import('@/components/Admin/QuanLyThuongHieu/ViewThuongHieu.vue')
                        }
                    ]
                },
                {
                    path: 'khuyen-mai',
                    name: 'khuyen-mai',
                    component: () => import('@/components/Admin/khuyenMai/KhuyenMai.vue')
                },
                {
                    path: 'hoa-don',
                    name: 'hoa-don',
                    component: () => import('@/components/Admin/HoaDon/index.vue')
                },
                {
                    path: 'ho-so',
                    name: 'ho-so-admin',
                    component: () => import('@/components/Admin/ThongTinCaNhan/thongTinCaNhan.vue')
                },
                {
                    path: 'thong-ke',
                    name: 'thong-ke',
                    component: () => import('@/components/Admin/ThongKe/index.vue')
                },
                {
                    path: 'ban-hang',
                    name: 'ban-hang',
                    component: () => import('@/components/Admin/BanHang/BanHangTaiQuay.vue')
                },
                {
                    path: 'user',
                    name: 'user',
                    component: () => import('@/components/Admin/User/index.vue')
                },
                {
                    path: 'voucher',
                    name: 'voucher',
                    component: () => import('@/components/Admin/Voucher/Voucher.vue')
                },
                {
                    path: 'chat',
                    name: 'chat-admin',
                    component: () => import('@/components/Admin/Chat/ChatAdmin.vue')
                }
            ]
        },
        {
            path: '/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/unauthorized',
            name: 'unauthorized',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

export default router;