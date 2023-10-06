import { defineStore } from 'pinia';
import axios from '../../axios/axiosPort';

export const ProductStore = defineStore('product', {
  state: () => ({
    products: [],
    images: [],
    sizes: [],
    mauSacs: [],
  }),
  actions: {
    async fetchAll() {
      try {
        const response = await axios.get('/api/products/lisst'); // Thay đổi URL dựa trên API của bạn
        this.products = response.data;
        //  console.table(this.products.size);

      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },

    async fetchAllImage(idProduct) {
      try {

        const response = await axios.get(`/api/products/${idProduct}/images`); // Thay đổi URL dựa trên API của bạn
        this.images = response.data;
        return this.images;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },


    async fetchAllSize(idProduct) {
      try {
        const response = await axios.get(`/api/products/${idProduct}/size`); // Thay đổi URL dựa trên API của bạn
        this.sizes = response.data;
        //  console.log('size: ', this.sizes);
        return this.sizes;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },

    async fetchAllMauSac(idProduct) {
      try {
        const response = await axios.get(`/api/products/${idProduct}/mauSac`); // Thay đổi URL dựa trên API của bạn
        this.mauSacs = response.data;
        //  console.log('mau: ',   this.mauSacs  );
        return this.mauSacs;
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
        const newProductData = response.data;

        newProductData['size'] = null;
        newProductData['img'] = null;
        newProductData['mauSac'] = null;
        const mau = await this.fetchAllMauSac(newProductData.id);
        newProductData['mauSac'] = mau;
        const img_d = await this.fetchAllSize(newProductData.id);
        newProductData['size'] = img_d;
        const img = await this.fetchAllImage(newProductData.id);
        newProductData['img'] = img;
        //    console.log(newProductData);
        this.products.unshift(newProductData); // Thêm sản phẩm mới vào danh sách
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
      }
    },
    async edit(updatedProduct) {
      try {
        const response = await axios.put(`/api/products/${updatedProduct.id}`, updatedProduct); // Thay đổi URL và dữ liệu updatedProduct tùy theo API của bạn
        const index = this.products.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
          let newProductData = this.products[index];

          newProductData['size'] = null;
          newProductData['img'] = null;
          newProductData['mauSac'] = null;
          const mau = await this.fetchAllMauSac(newProductData.id);
          newProductData['mauSac'] = mau;
          const img_d = await this.fetchAllSize(newProductData.id);
          newProductData['size'] = img_d;
          const img = await this.fetchAllImage(newProductData.id);
          newProductData['img'] = img;

          newProductData = response.data; // Cập nhật thông tin sản phẩm trong danh sách
        }
      } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
      }
    },
    async delete(productId) {
      try {
        await axios.put(`/api/products/${productId}/delete`); // Thay đổi URL tùy theo API của bạn
        this.products = this.products.filter(product => product.id !== productId); // Xóa sản phẩm khỏi danh sách
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    },

    async deleteSize(productId, SizeId) {
      try {
        await axios.delete(`/api/products/deleteSize?idSP=${productId}&idSize=${SizeId}`); // Thay đổi URL tùy theo API của bạn
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    },

    async deleteImg(productId, img) {
      try {
        await axios.delete(`/api/products/deleteImg?idSP=${productId}&img=${img}`); // Thay đổi URL tùy theo API của bạn
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    },

    async deleteMauSac(productId, MauId) {
      try {
        await axios.delete(`/api/products/deleteMauSac?idSP=${productId}&idMau=${MauId}`); // Thay đổi URL tùy theo API của bạn
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    },
  },
});
