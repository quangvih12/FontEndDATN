import { defineStore } from 'pinia';
import axios from 'axios';

const apiVatLieu = 'http://localhost:8080/api/vat-lieu';

export const useVatLieuService = defineStore('vat-lieu', {
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
                const response = await axios.get(apiVatLieu);
                this.data = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        //load data size theo trạng thái
        async fetchDataByStatus(status) {
            this.check = 1;
            try {
                const response = await axios.get(apiVatLieu + '/trang-thai?trangThai=' + status);
                this.data = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        createVatLieu(form) {
            axios.post(apiVatLieu + '/add', form).then((response) => {
                if (this.check == 0) {
                    this.data.unshift(response.data.data);
                } else {
                    if (this.data[0].trangThai == response.data.data.trangThai) this.data.unshift(response.data.data);
                }
            });
        },
        updateVatLieu(id, form) {
            axios.put(apiVatLieu + '/update/' + id, form).then((response) => {
                for (let i = 0; i < this.data.length; i++) {
                    if (id == this.data[i].id) {
                        this.data[i].ten = form.ten;
                        this.data[i].moTa = form.moTa;
                    }
                }
            });
        },
        deleteVatLieu(id) {
            axios.put(apiVatLieu + '/delete/' + id).then((response) => {
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

// export const useUserStore = defineStore({
//     id: 'user',
//     state: () => ({
//         data: []
//     }),
//     actions: {
//         async fetchData() {
//             try {
//                 const response = await axios.get(apiSize);
//                 this.data = response.data;
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         }
//         // Thêm các hàm khác để thực hiện các thao tác CRUD
//     }
// });

// export default class SizeService {
//     useUserStore = defineStore('counter',{
//         id: 'user',
//         state: () => ({
//             data: [],
//             mess: 'hiiiiiiiii'
//         }),
//         actions: {
//             async fetchData() {
//                 try {
//                     const response = await axios.get(apiSize);
//                     this.data = response.data;
//                 } catch (error) {
//                     console.error('Error fetching users:', error);
//                 }
//             }
//             // Thêm các hàm khác để thực hiện các thao tác CRUD
//         }
//     });
// }

// //load data size tất cả
// const fetchData = async () => {
//     const response = await axios.get(apiSize);
//     return response.data.data;
// };

// //load data size theo trạng thái
// const fetchDataByStatus = async (status) => {
//     const response = await axios.get(apiSize + '/trang-thai?trangThai=' + status);
//     return response.data.data;
// };

// //add
// const createSize = (form) => {
//     const response = axios.post('http://localhost:8080/api/size/add', form);
//     fetchData();
// };

// export default {
//     fetchData,
//     fetchDataByStatus,
//     createSize
// };