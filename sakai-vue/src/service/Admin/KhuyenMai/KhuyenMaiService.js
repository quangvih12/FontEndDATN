
import { defineStore } from 'pinia';
import axios from '@/service/Authentication/http.js';

const apiKhuyenMai = 'http://localhost:8080/api/admin/khuyenMai';

export const khuyenMaiStore = defineStore('khuyenmai', {
    state: () => ({
        data: []
    }),
    actions: {
        async getKhuyenMai() {
            try {
                const response = await axios.get(apiKhuyenMai + '/getAll');
                this.data = response.data;
            } catch (error) {
            }
        },
        createKhuyenMai(form) {
            axios.post(apiKhuyenMai + '/add', form).then((response) => {
                this.data.unshift(response.data.data);
            });
        },
        updateKhuyenMai(form, id) {
            axios.put(apiKhuyenMai + '/update/' + id, form).then((response) => {
                for (let i = 0; i < this.data.length; i++) {
                    if (id == this.data[i].id) {
                        this.data[i].ten = form.ten;
                        this.data[i].thoiGianBatDau = form.thoiGianBatDau;
                        this.data[i].thoiGianKetThuc = form.thoiGianKetThuc;
                        this.data[i].moTa = form.moTa;
                        this.data[i].giaTriGiam = form.giaTriGiam;
                    }
                }
            });
        },
        deleteKhuyenMai(form, id) {
            axios.put(apiKhuyenMai + '/delete/' + id, form).then((response) => {
                if (this.data[0].trangThai != response.data.data.trangThai) {
                    let index = -1;
                    for (let i = 0; i < this.data.length; i++) {
                        if (id == this.data[i].id) {
                            index = i;
                        }
                    }
                    this.data.splice(index, 1);
                }
            });
        },
       
        async getProduct() {
            try {
                const response = await axios.get(apiKhuyenMai + '/getAllCTSPByKhuyenMai');
                this.data = response.data;
            } catch (error) {
           
            }
        },

        updateCTSP(idctsp, idkm) {
            axios.put(`http://localhost:8080/api/admin/khuyenMai/applyKM/${idctsp}?idkm=${idkm}`).then((response) => {
                let index = -1;
                for (let i = 0; i < this.data.length; i++) {
                    if (idctsp == this.data[i].id) {
                        index = i;
                    }
                }
                this.data.splice(index, 1);
            });
        }
    }
});

