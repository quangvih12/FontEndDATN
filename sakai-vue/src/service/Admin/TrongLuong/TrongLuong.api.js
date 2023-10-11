import { defineStore } from 'pinia';
import axios from '../../axios/axiosPort';

export const TrongLuongStore = defineStore('trongLuong', {
    state: () => ({
        data: []
    }),
    actions: {
        async fetchAll() {
            try {
                const response = await axios.get('/api/trong-luong'); // Thay đổi URL dựa trên API của bạn
                this.data = response.data.data;
                // console.table(this.products);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        },
        async fetchDataByStatus(status) {
            this.check = 1;
            try {
                const response = await axios.get('/api/trong-luong' + '/trang-thai?trangThai=' + status);
                this.data = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        createTrongLuong(form) {
            axios.post('/api/trong-luong' + '/add', form).then((response) => {
                if (this.check == 0) {
                    this.data.unshift(response.data.data);
                } else {
                    if (this.data[0].trangThai == response.data.data.trangThai) this.data.unshift(response.data.data);
                }
            });
        },
        updateTrongLuong(id, form) {
            axios.put('/api/trong-luong' + '/update/' + id, form).then((response) => {
                for (let i = 0; i < this.data.length; i++) {
                    if (id == this.data[i].id) {
                        this.data[i].donVi = form.donVi;
                        this.data[i].moTa = form.moTa;
                    }
                }
            });
        },
        deleteTrongLuong(id) {
            axios.put('/api/trong-luong' + '/delete/' + id).then((response) => {
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
