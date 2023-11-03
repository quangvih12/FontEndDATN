import { defineStore } from 'pinia';
import axios from '../../axios/axiosPort';

export const ThongKeStore = defineStore('thongKe', {
    state: () => ({
        data: [],
        tongDoanhThu: 0,
        lstAdminThongKeLoaiResponses: [],
        lstAdminThongKeSanPhamCaoResponses: [],
        lstAdminThongKeSanPhamThapResponses: [],
        lstAdminThongKeThangResponses: [],
        lstAdminThongKeThuongHieuResponses: [],
        lstAdminThongKeThangNamResponses:[],
    }),
    actions: {

        async fetchAll() {
            try {
                const response = await axios.get(`/api/admin/Thong-ke`);
                this.data = response.data;
                this.tongDoanhThu = response.data.tongDoanhThu;
                this.lstAdminThongKeLoaiResponses = response.data.lstAdminThongKeLoaiResponses;
                this.lstAdminThongKeSanPhamCaoResponses = response.data.lstAdminThongKeSanPhamCaoResponses;
                this.lstAdminThongKeSanPhamThapResponses =  response.data.lstAdminThongKeSanPhamThapResponses;
                this.lstAdminThongKeThangResponses =  response.data.lstAdminThongKeThangResponses;
                this.lstAdminThongKeThuongHieuResponses =  response.data.lstAdminThongKeThuongHieuResponses;
                this.lstAdminThongKeThangNamResponses = response.data.lstAdminThongKeThangNamResponses;
            } catch (error) {
                console.error('Lỗi khi get sản phẩm:', error);
            }
        },


        async fetchAllByLoai(id) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/loai/${id}`);
                this.data = response.data;
                this.tongDoanhThu = response.data.tongDoanhThu;
                this.lstAdminThongKeLoaiResponses = response.data.lstAdminThongKeLoaiResponses;
                this.lstAdminThongKeSanPhamCaoResponses = response.data.lstAdminThongKeSanPhamCaoResponses;
                this.lstAdminThongKeSanPhamThapResponses =  response.data.lstAdminThongKeSanPhamThapResponses;
                this.lstAdminThongKeThangResponses =  response.data.lstAdminThongKeThangResponses;
                this.lstAdminThongKeThuongHieuResponses =  response.data.lstAdminThongKeThuongHieuResponses;
                this.lstAdminThongKeThangNamResponses = response.data.lstAdminThongKeThangNamResponses;
            } catch (error) {
                console.error('Lỗi khi get sản phẩm:', error);
            }
        },

        async fetchAllByThuongHieu(id) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/thuong-hieu/${id}`);
                this.data = response.data;
                this.tongDoanhThu = response.data.tongDoanhThu;
                this.lstAdminThongKeLoaiResponses = response.data.lstAdminThongKeLoaiResponses;
                this.lstAdminThongKeSanPhamCaoResponses = response.data.lstAdminThongKeSanPhamCaoResponses;
                this.lstAdminThongKeSanPhamThapResponses =  response.data.lstAdminThongKeSanPhamThapResponses;
                this.lstAdminThongKeThangResponses =  response.data.lstAdminThongKeThangResponses;
                this.lstAdminThongKeThuongHieuResponses =  response.data.lstAdminThongKeThuongHieuResponses;
                this.lstAdminThongKeThangNamResponses = response.data.lstAdminThongKeThangNamResponses;
            } catch (error) {
                console.error('Lỗi khi get sản phẩm:', error);
            }
        },

        async fetchAllBySanPham(id) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/san-pham/${id}`);
                this.data = response.data;
                this.tongDoanhThu = response.data.tongDoanhThu;
                this.lstAdminThongKeLoaiResponses = response.data.lstAdminThongKeLoaiResponses;
                this.lstAdminThongKeSanPhamCaoResponses = response.data.lstAdminThongKeSanPhamCaoResponses;
                this.lstAdminThongKeSanPhamThapResponses =  response.data.lstAdminThongKeSanPhamThapResponses;
                this.lstAdminThongKeThangResponses =  response.data.lstAdminThongKeThangResponses;
                this.lstAdminThongKeThuongHieuResponses =  response.data.lstAdminThongKeThuongHieuResponses;
                this.lstAdminThongKeThangNamResponses = response.data.lstAdminThongKeThangNamResponses;
            } catch (error) {
                console.error('Lỗi khi get sản phẩm:', error);
            }
        },
    },

    
});