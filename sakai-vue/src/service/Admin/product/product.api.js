import { defineStore } from 'pinia';
import axios from '../../axios/axiosPort';

export const ProductStore = defineStore('product', {
  state: () => ({
    products: [],
    images:[],
    sizes:[],
    mauSacs:[],
  }),
  actions: {
    async fetchAll() {
      try {
        const response = await axios.get('/api/products/lisst'); // Thay đổi URL dựa trên API của bạn
        this.products = response.data;
        // console.table(this.products);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },

    async fetchAllImage(idProduct) {
      try {

        const response = await axios.get(`/api/products/${idProduct}/images`); // Thay đổi URL dựa trên API của bạn
        this.images = response.data;
        
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },


    async fetchAllSize(idProduct) {
      try {
        const response = await axios.get(`/api/products/${idProduct}/size`); // Thay đổi URL dựa trên API của bạn
        this.sizes = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },

    async fetchAllMauSac(idProduct) {
      try {
        const response = await axios.get(`/api/products/${idProduct}/mauSac`); // Thay đổi URL dựa trên API của bạn
        this.mauSacs = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },

    async checkDuplicateName(name) {
      try {
        // Gửi yêu cầu GET để kiểm tra tên sản phẩm
        const response = await axios.get(`/api/products/check/${name}`); // Thay đổi URL dựa trên API của bạn
        const isDuplicate = response.data; // API trả về một giá trị boolean cho trùng lặp
      return !isDuplicate; // Trả về true nếu không trùng lặp, ngược lại trả về false
    
      } catch (error) {
        console.error('Lỗi khi kiểm tra trùng lặp tên sản phẩm:', error);
        throw error; // Nếu có lỗi, ném ngoại lệ để xử lý ở một nơi khác
      }
    },
    
    async add(newProduct) {
      try {
        const response = await axios.post('/api/products', newProduct); // Thay đổi URL và dữ liệu newProduct tùy theo API của bạn
        this.products.push(response.data); // Thêm sản phẩm mới vào danh sách
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
      }
    },
    async edit(updatedProduct) {
      try {
        const response = await axios.put(`/api/products/${updatedProduct.id}`, updatedProduct); // Thay đổi URL và dữ liệu updatedProduct tùy theo API của bạn
        const index = this.products.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = response.data; // Cập nhật thông tin sản phẩm trong danh sách
        }
      } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
      }
    },
    async delete(productId) {
      try {
        await axios.delete(`/api/products/${productId}`); // Thay đổi URL tùy theo API của bạn
        this.products = this.products.filter(product => product.id !== productId); // Xóa sản phẩm khỏi danh sách
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    },
  },
});
