import { defineStore } from 'pinia';
import axios from 'axios';

const api = 'http://localhost:8080/api/khach-hang/dia-chi';
const baseUrl = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/';
const headers = {
    Token: 'fc6bed6e-7bd8-11ee-af43-6ead57e9219a'
};
export const useDiaChi = defineStore('diaChi',{
    id: 'diaChi',
    state: () => ({
        user: [],
        diaChi: [],
        data: [],
    }),
    actions: {
        async fetchAllDiaChi(idUser) {
            try {
                const response = await axios.get(api + `/${idUser}`); // Thay đổi URL dựa trên API của bạn
                this.diaChi = response.data;
                //  console.log('mau: ',   this.mauSacs  );
                // return this.diaChi;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách địa chỉ:', error);
            }
        },
        createDiaChi(form) {
            axios.post(api + '/add', form).then((response) => {
                    // console.log('Đã tạo thành công!', response.data);
                }).catch((error) => {
                    // console.error('Lỗi khi tạo:', error);
                });
        },
        deleteDiaChi(id) {
            axios.put(api + `/${id}/delete`)
                .then(response => {
                    // console.log("Đã xóa thành công");
                })
                .catch(error => {
                    // Xử lý lỗi nếu có
                    // console.error("Lỗi khi xóa địa chỉ: ", error);
                });
        },
        updateDiaChi(id, form) {
            axios.put(api + '/update/' + id, form).then((response) => {
                for (let i = 0; i < this.data.length; i++) {
                    if (id == this.data[i].id) {
                        this.data[i].idTinhThanh = form.idTinhThanh;
                        this.data[i].tinhThanh = form.tinhThanh;
                        this.data[i].idQuanHuyen = form.idQuanHuyen;
                        this.data[i].quanHuyen = form.quanHuyen;
                        this.data[i].idPhuongXa = form.idPhuongXa;
                        this.data[i].phuongXa = form.phuongXa;
                        this.data[i].diaChi = form.diaChi;
                        this.data[i].user = form.user;
                    }
                }
            });
        },
        async fetchTinhThanh() {
            try {
                const response = await axios.get(baseUrl + 'province', { headers });
                // console.log('API Response:', response.data);
                this.tinhThanhList = response.data.data;
                return this.tinhThanhList;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
            }
        },

        async fetchQuanHuyen(tinhThanhId) {
            try {
                const response = await axios.get(baseUrl + `district?province_id=${tinhThanhId}`, { headers });
                return response.data.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách quận/huyện:', error);
            }
        },

        async fetchPhuongXa(quanHuyenId) {
            try {
                const response = await axios.get(baseUrl + `ward?district_id=${quanHuyenId}`, { headers });
                return response.data.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách phường/xã:', error);
            }
        }
    }
});