import { defineStore } from 'pinia';
import axios from 'axios';

const apiHD = 'http://localhost:8080/api/admin/hoaDon';

export const HDStore = defineStore('hoaDon', {
    state: () => ({
        dataAll: [],
        dataByStatus: [],
        //nếu đang ở load tất cả thì là 0
        check: 0
    }),
    actions: {
        //load tất cả data
        async fetchData() {
            this.check = 0;
            try {
                const response = await axios.get(apiHD);
                this.dataAll = response.data;
                // console.log(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        //load data hd theo trạng thái
        async fetchDataByStatus(status) {
            this.check = 1;
            try {
                const response = await axios.get(apiHD + '/hoaDonTrangThai/' + status);
                this.dataAll = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }
});
