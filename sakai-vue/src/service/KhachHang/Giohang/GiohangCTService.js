
import { defineStore } from 'pinia';
import axios from 'axios';

const apiGiohang = 'http://localhost:8080/api/khach-hang/giohang';

export const gioHangStore = defineStore('gioHang', {
    state: () => ({
        data: [],
        dataSessions: [],
        voucher: [],
        soLuong: '',
        fakedata: 'check'
    }),
    // this.data.unshift(response.data.data);
    actions: {
        async addToCart(form, token) {
            const response = await axios.post(`http://localhost:8080/api/khach-hang/giohang/addGiohang?token=${token}`, form)
            return response.data;
        },

        async addToCartSesion(form, token) {
            const response = await axios.post(`http://localhost:8080/api/khach-hang/giohang/addGiohang-session?token=${token}`, form)
            this.dataSessions = response.data;
        },

        async getAllGHCT(token) {
            try {
                const response = await axios.get(apiGiohang + `/getListGioHang?token=${token}`);
                this.data = response.data;
            } catch (error) {
            }
        },
        async getListVoucher(token) {
            try {
                const response = await axios.get(apiGiohang + `/get-voucher?token=${token}`);
                this.voucher = response.data;
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
        async getGHCT(idGHCT, token) {
            try {
                const response = await axios.get(apiGiohang + '/' + idGHCT + `?token=${token}`);
                this.data = response.data;
            } catch (error) {
            }
        },

        async congSL(idGHCT, token) {
            try {
                const response = await axios.put(apiGiohang + '/congSL/' + idGHCT + `?token=${token}`);
                const index = this.data.findIndex(hoadon => hoadon.idGHCT === idGHCT);
                if (response.data === '') {
                    this.fakedata = response.data;
                } else {
                    if (index !== -1) {
                        this.data[index] = response.data;
                    }
                }


            } catch (error) {
            }
        },

        async truSL(idGHCT, token) {
            try {

                const response = await axios.put(apiGiohang + '/truSL/' + idGHCT + `?token=${token}`);
                const index = this.data.findIndex(hoadon => hoadon.idGHCT === idGHCT);

                if (response.data === null) {

                    if (index !== -1) {
                        console.log(response.value);
                        this.data[index] = response.data;
                        this.fakedata = 'check';
                    }
                } else {
                    await this.getAllGHCT(token);
                }

            } catch (error) {
            }
        },
        async xoaGHCT(idGHCT, token) {
            try {
                const response = await axios.delete(apiGiohang + '/' + idGHCT + `?token=${token}`);
                this.data = response.data;
            } catch (error) {
            }
        },

        async updateMauSacSize(idGHCT, idSPCT, token) {
            try {
                const response = await axios.post(`http://localhost:8080/api/khach-hang/giohang/updateMauSacSize/${idGHCT}?idSPCT=${idSPCT}&token=${token}`);
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
