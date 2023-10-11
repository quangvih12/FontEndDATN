import { defineStore } from 'pinia';
import axios from '../../axios/axiosPort';

export const VatLieuStore = defineStore('vatLieu', {
    state: () => ({
        data: []
    }),
    actions: {
        async fetchAll() {
            try {
                const response = await axios.get('/api/admin/vat-lieu'); // Thay đổi URL dựa trên API của bạn
                this.data = response.data;
                // console.table(this.products);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách:', error);
            }
        },
        async fetchDataByStatus(status) {
            this.check = 1;
            try {
                const response = await axios.get('/api/admin/vat-lieu' + '/trang-thai?trangThai=' + status);
                this.data = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        createVatLieu(form) {
            axios.post('/api/admin/vat-lieu' + '/add', form).then((response) => {
                if (this.check == 0) {
                    this.data.unshift(response.data.data);
                } else {
                    if (this.data[0].trangThai == response.data.data.trangThai) this.data.unshift(response.data.data);
                }
            });
        },
        updateVatLieu(id, form) {
            axios.put('/api/admin/vat-lieu' + '/update/' + id, form).then((response) => {
                for (let i = 0; i < this.data.length; i++) {
                    if (id == this.data[i].id) {
                        this.data[i].ten = form.ten;
                        this.data[i].moTa = form.moTa;
                    }
                }
            });
        },
        deleteVatLieu(id) {
            axios.put('/api/admin/vat-lieu' + '/delete/' + id).then((response) => {
                if (this.check == 0) {
                    for (let i = 0; i < this.data.length; i++) {
                        if (id == this.data[i].id) {
                            this.data[i].trangThai = 0;
                        }
                    }
                } else {
                    if (this.data[0].trangThai != response.data.data.trangThai) {
                        let index = -1;
                        for (let i = 0; i < this.data.length; i++) {
                            if (id == this.data[i].id) {
                                index = i;
                            }
                        }
                        this.data.splice(index, 1);
                        console.log(this.data);
                    }
                }
            });
        }
    }
});
