import { defineStore } from 'pinia';
import axios from 'axios';

const apiHD = 'http://localhost:8080/api/admin/hoaDon';
const apiHDCT = 'http://localhost:8080/api/admin/hoa-don-chi-tiet';

export const HDStore = defineStore('hoaDon', {
    state: () => ({
        dataAll: [],
        dataChoXacNhan: [], //2
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
        //từ chờ xác nhận -> chuẩn bị
        choXacNhan(id) {
            axios.put(apiHD + '/XacNhan/' + id).then((response) => {
                if (this.check == 1) {
                    if (this.dataChoXacNhan[0].trangThai == '2') {
                        let index = -1;
                        for (let i = 0; i < this.dataChoXacNhan.length; i++) {
                            if (id == this.dataChoXacNhan[i].idHD) {
                                index = i;
                            }
                        }
                        this.dataDangChuanBi.unshift(this.dataChoXacNhan[index]);
                        this.dataChoXacNhan.splice(index, 1);
                    }
                }
            });
        },
        //từ chờ đang chuẩn bị -> đang giao
        dangChuanBi(id) {
            axios.put(apiHD + '/XacNhanGiaoHang/' + id).then((response) => {
                if (this.check == 1) {
                    if (this.dataDangChuanBi[0].trangThai == '4') {
                        let index = -1;
                        for (let i = 0; i < this.dataDangChuanBi.length; i++) {
                            if (id == this.dataDangChuanBi[i].idHD) {
                                index = i;
                            }
                        }
                        this.dataDangGiao.unshift(this.dataDangChuanBi[index]);
                        this.dataDangChuanBi.splice(index, 1);
                    }
                }
            });
            return this.dataDangGiao[0];
        },

        //từ đang giao -> hoàn thành
        hoanThanh(id) {
            axios.put(apiHD + '/hoan-thanh/' + id).then((response) => {
                if (this.check == 1) {
                    if (this.dataDangGiao[0].trangThai == '5') {
                        let index = -1;
                        for (let i = 0; i < this.dataDangGiao.length; i++) {
                            if (id == this.dataDangGiao[i].idHD) {
                                index = i;
                            }
                        }
                        this.dataHoanThanh.unshift(this.dataDangGiao[index]);
                        this.dataDangGiao.splice(index, 1);
                    }
                }
            });
        },

        //huỷ hoá đơn
        huyHoaDon(id, lyDo, man) {
            axios.put(apiHD + '/huyXacNhan/' + id + '?lyDo=' + lyDo).then((response) => {
                if (this.check == 1) {
                    if (this.dataChoXacNhan.length > 0 && man == 2) {
                        if (this.dataChoXacNhan[0].trangThai == '2') {
                            let index = -1;
                            for (let i = 0; i < this.dataChoXacNhan.length; i++) {
                                if (id == this.dataChoXacNhan[i].idHD) {
                                    index = i;
                                }
                            }
                            this.dataDaHuy.unshift(response.data);
                            this.dataChoXacNhan.splice(index, 1);
                        }
                    }
                    if (this.dataDangChuanBi.length > 0 && man == 4) {
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
                    if (this.dataDangGiao.length > 0 && man == 5) {
                        if (this.dataDangGiao[0].trangThai == '5') {
                            let index = -1;
                            for (let i = 0; i < this.dataDangGiao.length; i++) {
                                if (id == this.dataDangGiao[i].idHD) {
                                    index = i;
                                }
                            }
                            this.dataDaHuy.unshift(response.data);
                            this.dataDangGiao.splice(index, 1);
                        }
                    }
                }
            });
        },

        //gửi cho giao hàng nhanh
        async giaoHangNhanh(danhSachSP, hoaDon) {
            const danhSachItem = [];
            for (let i = 0; i < danhSachSP.length; i++) {
                const form2 = {
                    name: danhSachSP[i].tenSP,
                    code: danhSachSP[i].maSP,
                    quantity: danhSachSP[i].soLuong,
                    price: parseInt(danhSachSP[i].donGia),
                    length: 12,
                    width: 12,
                    height: 12,
                    weight: danhSachSP[i].trongLuong,
                    category: {
                        level1: 'Mũ'
                    }
                };
                console.log(form2);
                danhSachItem.push(form2);
            }

            const form2 = {
                payment_type_id: 2,
                note: 'Tintest 123',
                required_note: 'KHONGCHOXEMHANG',
                return_phone: '0332190458',
                return_address: '39 NTT',
                return_district_id: null,
                return_ward_code: '',
                client_order_code: '',
                to_name: 'TinTest124',
                to_phone: '0987654321',
                to_address: '72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam',
                to_ward_code: '20107',
                to_district_id: 1442,
                cod_amount: 200000,
                content: 'ABCDEF',
                weight: 400,
                length: 15,
                width: 15,
                height: 15,
                pick_station_id: 0,
                insurance_value: 500000,
                service_id: 0,
                service_type_id: 2,
                coupon: null,
                pick_shift: [2],
                items: [
                    {
                        name: 'Áo Polo',
                        code: 'Polo123',
                        quantity: 1,
                        price: 200000,
                        length: 12,
                        width: 12,
                        height: 12,
                        category: {
                            level1: 'Áo'
                        }
                    }
                ]
            };
            console.log(form2);
            try {
                const response = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/preview', form2, {
                    headers: {
                        // Thêm headers vào yêu cầu POST ở đây
                        token: '62a3cbdc-4e13-11ee-96dc-de6f804954c9',
                        ShopId: '4523827'
                    }
                });
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

        //load tất cả data
        async fetchData() {
            this.check = 0;
            try {
                const response = await axios.get(apiHD);
                this.dataAll = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        //load data hd theo trạng thái
        async fetchDataByStatus(status) {
            this.check = 1;
            try {
                const response = await axios.get(apiHD + '/hoaDonTrangThai/' + status);
                if (status == 2) this.dataChoXacNhan = response.data;
                if (status == 8) this.dataDaHoanTra = response.data;
                if (status == 0) this.dataDaHuy = response.data;
                if (status == 4) this.dataDangChuanBi = response.data;
                if (status == 5) this.dataDangGiao = response.data;
                if (status == 3) this.dataHoanThanh = response.data;
                if (status == 7) this.dataHoanTraHoanTien = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
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
