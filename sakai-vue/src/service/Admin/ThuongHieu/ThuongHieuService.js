import { defineStore } from 'pinia';
import axios from 'axios';

const apiThuongHieu = 'http://localhost:8080/api/thuong-hieu';

export const useCounterStore = defineStore('thuongHieu', {
    state: () => ({
        data: [],
        //nếu đang ở load tất cả thì là 0
        check: 0
    }),
    actions: {
        //load tất cả data
        async fetchData() {
            this.check = 0;
            try {
                const response = await axios.get(apiThuongHieu);
                this.data = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        //load data size theo trạng thái
        async fetchDataByStatus(status) {
            this.check = 1;
            try {
                const response = await axios.get(apiThuongHieu + '/trang-thai?trangThai=' + status);
                this.data = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        createSize(form) {
            axios.post(apiThuongHieu + '/add', form).then((response) => {
                if (this.check == 0) {
                    this.data.unshift(response.data.data);
                } else {
                    if (this.data[0].trangThai == response.data.data.trangThai) this.data.unshift(response.data.data);
                }
            });
        },
        updateSize(id, form) {
            axios.put(apiThuongHieu + '/update/' + id, form).then((response) => {
                for (let i = 0; i < this.data.length; i++) {
                    if (id == this.data[i].id) {
                        this.data[i].ten = form.ten;
                        this.data[i].moTa = form.moTa;
                    }
                }
            });
        },
        deleteSize(id) {
            axios.put(apiThuongHieu + '/delete/' + id).then((response) => {
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
