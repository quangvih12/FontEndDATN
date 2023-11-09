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


        async fetchAllByLoai(id,year) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/loai/${id}?year=${year}`);
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

        async fetchAllByThuongHieu(id,year) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/thuong-hieu/${id}?year=${year}`);
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

        async fetchAllBySanPham(id,year) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/san-pham/${id}?year=${year}`);
                this.data = response.data;
                // console.log(year)
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

        async fetchAllByYear(year) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/year/${year}`);
                this.data = response.data;
                // console.log(year)
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

        async fetchAllByMonth(startDate, endDate) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/month?startDate=${startDate}&endDate=${endDate}`);
                this.data = response.data;
                // console.log(year)
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