import { defineStore } from 'pinia';
import axios from '../../axios/axiosPort';

export const VatLieuStore = defineStore('vatLieu', {
    state: () => ({
        data: []
    }),
    actions: {
        async fetchAll() {
            try {
                const response = await axios.get('/api/admin/vat-lieu'); // Thay đổi URL dựa trên API của bạn
                this.data = response.data;
                // console.table(this.products);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách:', error);
            }
        }
    }
});
