
import { defineStore } from 'pinia';
import axios from 'axios';

const apiGiohang = 'http://localhost:8080/api/khach-hang/giohang';

export const gioHangStore = defineStore('gioHang', {
    state: () => ({
        data: [],
        soLuong: ''
    }),
    // this.data.unshift(response.data.data);
    actions: {     
        async addToCart(form,token) {
            const response = await axios.post(`http://localhost:8080/api/khach-hang/giohang/addGiohang?token=${token}`,form)            
                return response.data
            
        },

        async getAllGHCT() {
            try {
                const response = await axios.get(apiGiohang + '/getListGioHang');
                this.data = response.data;
            } catch (error) {
            }
        },
        async getAllMSCT() {
            try {
                const response = await axios.get(apiGiohang + '/msct');
                this.data = response.data;
            } catch (error) {
            }
        },
        async getAllSizeCT() {
            try {
                const response = await axios.get(apiGiohang + '/sizect');
                this.data = response.data;
            } catch (error) {
            }
        },
        async getGHCT(idGHCT){
            try {
                const response = await axios.get(apiGiohang+'/'+ +idGHCT);
                this.data = response.data;
            } catch (error) {
            }
        },

        async congSL(idGHCT){
            try {
                const response = await axios.post(apiGiohang + '/congSL/'+idGHCT);
                this.data = response.data;
            } catch (error) {
            }
        },
      
        async truSL(idGHCT){
            try {
                const response = await axios.post(apiGiohang + '/truSL/'+idGHCT);
                this.data = response.data;
            } catch (error) {
            }
        },
        async xoaGHCT(idGHCT){
            try {
                const response = await axios.delete(apiGiohang + '/'+idGHCT);
                this.data = response.data;
            } catch (error) {
            }
        },

        async updateMauSacSize( idGHCT,tenMauSac, tenSize){
            try {
                const response = await axios.post(`http://localhost:8080/api/khach-hang/giohang/updateMauSacSize/${idGHCT}?tenMauSac=${tenMauSac}&tenSize=${tenSize}`);
                this.data = response.data;
            } catch (error) {
            }
        },
        async getMauSacByID( idmsct){
            try {
                const response = await axios.get(apiGiohang + '/msct/'+idmsct);
                this.data = response.data;
            } catch (error) {
            }
        },
        async getSizeByID( idsizect){
            try {
                const response = await axios.get(apiGiohang + '/sizect/'+idsizect);
                this.data = response.data;
            } catch (error) {
            }
        },

        async getTenMS() {
            try {
                const response = await axios.get(apiGiohang + '/ms');
                this.data = response.data;
            } catch (error) {
            }
        },

        async countGHCT(userId) {
            try {
                const response = await axios.get(`http://localhost:8080/api/khach-hang/giohang/countGHCT?userId=${userId}`);
                this.soLuong = response.data;
            } catch (error) {
            }
        },

    
    }
});
