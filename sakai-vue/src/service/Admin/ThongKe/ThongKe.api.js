import { defineStore } from 'pinia';
import axios from '@/service/Authentication/http.js';

export const ThongKeStore = defineStore('thongKe', {
    state: () => ({
        data: [],
        tongDoanhThu: 0,
        tongLoiNhuan: 0,
        tongDonhangHoanThanh: 0,
        tongDonhangDangGiao: 0,
        tongDonhangHuy: 0,
        lstAdminThongKeLoaiResponses: [],
        lstAdminThongKeSanPhamCaoResponses: [],
        lstAdminThongKeSanPhamThapResponses: [],
        lstAdminThongKeThangResponses: [],
        lstAdminThongKeThuongHieuResponses: [],
        lstAdminThongKeThangNamResponses:[],
        lstAdminThongKeLoiNhuanSanPhamResponse:[],
        lstAdminThongKeLoiNhuanHoaDonResponse:[]
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
      
        async fetchAllByHinhThucGiaoHang(idPhuongThuc) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/by-phuong-thuc?idPhuongThuc=${idPhuongThuc}`);
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

        async fetchAllLoiNhuan(year,startDate, endDate) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/loi-nhuan?year=${year}&startDate=${startDate}&endDate=${endDate}`);
              //  this.data = response.data;
                this.tongLoiNhuan = response.data.tongLoiNhuan;
                this.tongDonhangHoanThanh = response.data.tongDonhangHoanThanh;
                this.tongDonhangDangGiao = response.data.tongDonhangDangGiao;
                this.tongDonhangHuy = response.data.tongDonhangHuy;
                this.lstAdminThongKeLoiNhuanSanPhamResponse = response.data.adminThongKeLoiNhuanSanPhamResponses;
                this.lstAdminThongKeLoiNhuanHoaDonResponse = response.data.adminThongKeLoiNhuanHoaDonResponses;
            } catch (error) {
                console.error('Lỗi khi get sản phẩm:', error);
            }
        },

        async fetchAllLoiNhuanbyHinhThucGiaohang(idHinhThuc) {
            try {
                const response = await axios.get(`/api/admin/Thong-ke/loi-nhuan-hinh-thuc-giao-hang?idHinhThuc=${idHinhThuc}`);
              //  this.data = response.data;
                this.tongLoiNhuan = response.data.tongLoiNhuan;
                this.tongDonhangHoanThanh = response.data.tongDonhangHoanThanh;
                this.tongDonhangDangGiao = response.data.tongDonhangDangGiao;
                this.tongDonhangHuy = response.data.tongDonhangHuy;
                this.lstAdminThongKeLoiNhuanSanPhamResponse = response.data.adminThongKeLoiNhuanSanPhamResponses;
                this.lstAdminThongKeLoiNhuanHoaDonResponse = response.data.adminThongKeLoiNhuanHoaDonResponses;
            } catch (error) {
                console.error('Lỗi khi get sản phẩm:', error);
            }
        },
    },

    
});