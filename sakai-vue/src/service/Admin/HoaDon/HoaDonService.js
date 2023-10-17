import { defineStore } from 'pinia';
import axios from 'axios';
import { da } from 'date-fns/locale';

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

        //gửi cho giao hàng nhanh
        async giaoHangNhanh(danhSachSP, hoaDon) {
            const danhSachItem = [];
            for (let i = 0; i < danhSachSP.length; i++) {
                const form2 = {
                    name: danhSachSP[i].sanPhamChiTiet.sanPham.ten,
                    code: danhSachSP[i].sanPhamChiTiet.sanPham.ma,
                    quantity: danhSachSP[i].soLuong,
                    price: danhSachSP[i].donGia,
                    length: 12,
                    width: 12,
                    height: 12,
                    weight: danhSachSP[i].sanPhamChiTiet.trongLuong.value,
                    category: {
                        level1: 'Mũ'
                    }
                };
                danhSachItem.push(form2);
            }
            const form = {
                payment_type_id: 2,
                note: 'Giao lúc 5h chiều hằng ngày', //note của khách hàng cho bên giao hàng
                required_note: 'KHONGCHOXEMHANG', //note của người gửi cho giao hàng
                return_phone: '0339927992',
                return_address: 'Số 29 ngõ 143', //địa chỉ cụ thể nơi gửi
                return_district_id: 3440, //huyệN cụ thể nơi gửi
                return_ward_code: '13010', //phường/xã cụ thể nơi gửi
                client_order_code: '',
                to_name: hoaDon.tenNguoiNhan, //tên người nhận
                to_phone: '0375978188', //sdt người nhận
                to_address: 'Nhà Ứng Lay', //địa chỉ cụ thể
                to_ward_code: '190211', //xã
                to_district_id: 1768, //huyện
                cod_amount: 300000, //tổng tiền
                content: 'Áo gì gì đấy', //nội dung hoá đơn
                weight: 200,
                length: 1,
                width: 19,
                height: 10,
                service_id: 100039,
                service_type_id: 5,
                pick_shift: [2],
                items: danhSachItem
            };
            // console.log(hoaDon);
            try {
                const response = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/preview', form, {
                    headers: {
                        // Thêm headers vào yêu cầu POST ở đây
                        token: '62a3cbdc-4e13-11ee-96dc-de6f804954c9',
                        ShopId: '4523827'
                    }
                });
                // console.log(response);
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
        }
    }
});
