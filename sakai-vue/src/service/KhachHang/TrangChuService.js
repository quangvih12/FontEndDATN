import { defineStore } from 'pinia';
import axios from 'axios';

const apiTrangChu = 'http://localhost:8080/api/trang-chu';

export const TrangChuStore = defineStore('trangChu', {
    state: () => ({
        dataHangMoi: [],
        data3Phan4: [],
        dataTreEm: []
    }),
    actions: {
        //load tất cả data
        async fetchDataByTenLoai(tenLoai) {
            try {
                const response = await axios.get(apiTrangChu + '/loai?tenLoai=' + tenLoai);
                this.data3Phan4 = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        async fetchDataByTreEm(tenLoai) {
            try {
                const response = await axios.get(apiTrangChu + '/loai?tenLoai=' + tenLoai);
                this.dataTreEm = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        async fetchDataByNgayTao() {
            this.check = 0;
            try {
                const response = await axios.get(apiTrangChu + '/ngay-tao');
                this.dataHangMoi = response.data.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }
});
