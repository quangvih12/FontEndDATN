import { defineStore } from 'pinia';
import axios from 'axios';

const apiHDCT = 'http://localhost:8080/api/admin/hoa-don-chi-tiet';

export const DoiTraStore = defineStore('doiTra', {
    state: () => ({
        dataHoanTraHoanTien: [], //7
        dataDaHoanTra: [] //8
        //nếu đang ở load tất cả thì là 0
    }),
    actions: {
        //load data yeu cau tra hang
        // async fetchData(trangThai) {
        //     try {
        //         const response = await axios.get(apiHDCT + '/find-by-trang-thai/' + trangThai);
        //         if (trangThai == 7) this.dataHoanTraHoanTien = response.data;
        //         if (trangThai == 8) this.dataDaHoanTra = response.data;
        //     } catch (error) {
        //         console.error('Error fetching users:', error);
        //     }
        // }
        //load data hd theo trạng thái
        // async fetchDataByStatus(status) {
        //     this.check = 1;
        //     try {
        //         const response = await axios.get(apiHD + '/hoaDonTrangThai/' + status);
        //         if (status == 2) this.dataChoXacNhan = response.data;
        //         if (status == 8) this.dataDaHoanTra = response.data;
        //         if (status == 0) this.dataDaHuy = response.data;
        //         if (status == 4) this.dataDangChuanBi = response.data;
        //         if (status == 5) this.dataDangGiao = response.data;
        //         if (status == 3) this.dataHoanThanh = response.data;
        //         if (status == 7) this.dataHoanTraHoanTien = response.data;
        //     } catch (error) {
        //         console.error('Error fetching users:', error);
        //     }
        // },
        //search date
        // async searchDate(startDate, endDate, cbbValue) {
        //     console.log(cbbValue);
        //     try {
        //         const response = await axios.get(apiHD + '/search-date?startDate=' + startDate + '&endDate=' + endDate + '&comboBoxValue=' + cbbValue);
        //         this.dataAll = response.data;
        //         return this.dataAll;
        //     } catch (error) {
        //         console.error('Error fetching users:', error);
        //     }
        // },
        //search date theo trạng thái
        // async searchDateByTrangThai(startDate, endDate, cbbValue, trangThai) {
        //     try {
        //         const response = await axios.get(apiHD + '/search-date-by-trang-thai?startDate=' + startDate + '&endDate=' + endDate + '&comboBoxValue=' + cbbValue + '&trangThai=' + trangThai);
        //         if (trangThai == 2) {
        //             this.dataChoXacNhan = response.data;
        //             return this.dataChoXacNhan;
        //         }
        //         if (trangThai == 8) {
        //             this.dataDaHoanTra = response.data;
        //             return this.dataDaHoanTra;
        //         }
        //         if (trangThai == 0) {
        //             this.dataDaHuy = response.data;
        //             return this.dataDaHuy;
        //         }
        //         if (trangThai == 4) {
        //             this.dataDangChuanBi = response.data;
        //             return this.dataDangChuanBi;
        //         }
        //         if (trangThai == 5) {
        //             this.dataDangGiao = response.data;
        //             return this.dataDangGiao;
        //         }
        //         if (trangThai == 3) {
        //             this.dataHoanThanh = response.data;
        //             return this.dataHoanThanh;
        //         }
        //         if (trangThai == 7) {
        //             this.dataHoanTraHoanTien = response.data;
        //             return this.dataHoanTraHoanTien;
        //         }
        //     } catch (error) {
        //         console.error('Error fetching users:', error);
        //     }
        // }
    }
});
