import { defineStore } from 'pinia';
import axios from '../../axios/axiosPort';

export const TrongLuongStore = defineStore('trongLuong', {
  state: () => ({
    data: []
  }),
  actions: {
    async fetchAll() {
      try {
        const response = await axios.get('/api/trong-luong'); // Thay đổi URL dựa trên API của bạn
        this.data = response.data;
        // console.table(this.products);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },

  },
});
