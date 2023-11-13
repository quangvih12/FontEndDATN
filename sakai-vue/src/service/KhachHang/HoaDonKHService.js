import { defineStore } from 'pinia';
import axios from 'axios';

const apiHD = 'http://localhost:8080/api/khach-hang/hoa-don';
const apiHDCT = 'http://localhost:8080/api/khach-hang/hoa-don-chi-tiet';

export const HDKHStore = defineStore('hoaDonKH', {
    state: () => ({
        dataAll: [],
        dataChoThanhToan: [], //1
        dataDaHoanTra: [], //8
        dataDaHuy: [], //0
        dataDangChuanBi: [], //4
        dataDangGiao: [], //5
        dataHoanThanh: [], //3
        dataHoanTraHoanTien: [], //7
        //nếu đang ở load tất cả thì là 0
        check: 0
        //theo doi xem đang ở màn nào
    }),
    actions: {
        //load tất cả data
        async fetchData(token) {
            this.check = 0;
            try {
                const response = await axios.get(apiHD + '/find-all?token=' + token);
                this.dataAll = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        //load data hd theo trạng thái
        async fetchDataByStatus(token, status) {
            this.check = 1;
            try {
                const response = await axios.get(apiHD + '/find-all-by-trang-thai?token=' + token + '&trangThai=' + status);
                if (status == 1) this.dataChoThanhToan = response.data;
                if (status == 4) this.dataDangChuanBi = response.data;
                if (status == 5) this.dataDangGiao = response.data;
                if (status == 3) this.dataHoanThanh = response.data;
                if (status == 0) this.dataDaHuy = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        //lấy sp theo id hoá đơn
        async findHdByIdHd(idHD) {
            try {
                const response = await axios.get(apiHD + '/find-by-id/' + idHD);
                return response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        //lấy sp theo id hoá đơn
        async findHdctByIdHd(idHD) {
            try {
                const response = await axios.get(apiHDCT + '/find-by-id-hd/' + idHD);
                return response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        //huỷ hoá đơn
        huyHoaDon(id, lyDo) {
            axios.put(apiHD + '/huy-hoa-don/' + id + '?lyDo=' + lyDo).then((response) => {
                if (this.check == 1) {
                    if (this.dataDangChuanBi.length > 0) {
                        if (this.dataDangChuanBi[0].trangThai == '4') {
                            let index = -1;
                            for (let i = 0; i < this.dataDangChuanBi.length; i++) {
                                if (id == this.dataDangChuanBi[i].idHD) {
                                    index = i;
                                }
                            }
                            this.dataDaHuy.unshift(response.data);
                            this.dataDangChuanBi.splice(index, 1);
                        }
                    }
                }
            });
        },
        //search date
        async searchDate(startDate, endDate, cbbValue) {
            console.log(cbbValue);
            try {
                const response = await axios.get(apiHD + '/search-date?startDate=' + startDate + '&endDate=' + endDate + '&comboBoxValue=' + cbbValue);
                this.dataAll = response.data;
                return this.dataAll;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        //search date theo trạng thái
        async searchDateByTrangThai(startDate, endDate, cbbValue, trangThai) {
            try {
                const response = await axios.get(apiHD + '/search-date-by-trang-thai?startDate=' + startDate + '&endDate=' + endDate + '&comboBoxValue=' + cbbValue + '&trangThai=' + trangThai);
                if (trangThai == 2) {
                    this.dataChoXacNhan = response.data;
                    return this.dataChoXacNhan;
                }
                if (trangThai == 8) {
                    this.dataDaHoanTra = response.data;
                    return this.dataDaHoanTra;
                }
                if (trangThai == 0) {
                    this.dataDaHuy = response.data;
                    return this.dataDaHuy;
                }
                if (trangThai == 4) {
                    this.dataDangChuanBi = response.data;
                    return this.dataDangChuanBi;
                }
                if (trangThai == 5) {
                    this.dataDangGiao = response.data;
                    return this.dataDangGiao;
                }
                if (trangThai == 3) {
                    this.dataHoanThanh = response.data;
                    return this.dataHoanThanh;
                }
                if (trangThai == 7) {
                    this.dataHoanTraHoanTien = response.data;
                    return this.dataHoanTraHoanTien;
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }
});
