
import { defineStore } from 'pinia';
import axios from 'axios';

const apiVoucher = 'http://localhost:8080/api/voucher';

export const voucherStore = defineStore('voucher', {
    state: () => ({
        data: []
    }),
    actions: {
        async getVoucher() {
            this.check = 0;
            try {
                const response = await axios.get(apiVoucher + '/getAllVoucher');
                this.data = response.data;
            } catch (error) {
               
            }
        },
        createVoucher(form) {
            axios.post(apiVoucher + '/add', form).then((response) => {
                this.data.unshift(response.data.data);
            });
        },
        updateVoucher(form, id) {
            axios.put(apiVoucher + '/update/' + id, form).then((response) => {
                for (let i = 0; i < this.data.length; i++) {
                    if (id == this.data[i].id) {
                        this.data[i].ten = form.ten;
                        this.data[i].thoiGianBatDau = form.thoiGianBatDau;
                        this.data[i].thoiGianKetThuc = form.thoiGianKetThuc;
                        this.data[i].soLuong = form.soLuong;
                        this.data[i].moTa = form.moTa;
                        this.data[i].giamToiDa = form.giamToiDa;
                    }
                }
            });
        },
        deleteVoucher(form, id) {
            axios.put(apiVoucher + '/delete/' + id, form).then((response) => {
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
        }
    }
});
