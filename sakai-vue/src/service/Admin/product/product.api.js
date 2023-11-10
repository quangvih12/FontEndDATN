import { defineStore } from 'pinia';
import axios from '../../axios/axiosPort';

export const ProductStore = defineStore('product', {
  state: () => ({
    products: [],
    sanPhamCT: [],
    images: [],
    sizes: [],
    mauSacs: [],
    excels: [],
  }),
  actions: {
    async fetchAll() {
      try {
        const response = await axios.get('/api/admin/san-pham'); // Thay đổi URL dựa trên API của bạn
        this.products = response.data;
        //  console.table(this.products.size);

      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },

    async fetchAllSpCT(idSP) {
      try {
        const response = await axios.get(`/api/admin/san-pham/${idSP}`); // Thay đổi URL dựa trên API của bạn
        this.sanPhamCT = response.data;
        //  console.table(this.products.size);
        return this.sanPhamCT;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },

    async fetchDataByStatus(status) {
      try {
        const response = await axios.get('/api/admin/san-pham/loc?comboBoxValue=' + status); // Thay đổi URL dựa trên API của bạn
        this.products = response.data;
        //  console.table(this.products.size);

      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },

    async fetchAllImage(idProduct) {
      try {

        const response = await axios.get(`/api/admin/san-pham/${idProduct}/images`); // Thay đổi URL dựa trên API của bạn
        this.images = response.data;
        return this.images;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    },



    async checkDuplicateName(name) {
      try {
        // Gửi yêu cầu GET để kiểm tra tên sản phẩm
        const response = await axios.get(`/api/admin/san-pham/check/${name}`); // Thay đổi URL dựa trên API của bạn
        const isDuplicate = response.data; // API trả về một giá trị boolean cho trùng lặp
        return !isDuplicate; // Trả về true nếu không trùng lặp, ngược lại trả về false

      } catch (error) {
        console.error('Lỗi khi kiểm tra trùng lặp tên sản phẩm:', error);
        throw error; // Nếu có lỗi, ném ngoại lệ để xử lý ở một nơi khác
      }
    },


    async uploadFile(formData) {
      try {
        const response = await axios.post("/api/products/view-data", formData);
        const newProductData = response.data;
        //  console.log(response.data);
        this.excels.unshift(newProductData);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    },

    async add(newProduct) {
      try {
        const response = await axios.post('/api/admin/san-pham', newProduct); // Thay đổi URL và dữ liệu newProduct tùy theo API của bạn
        const newProductData = response.data;
        newProductData['img'] = null;
        newProductData['sanPhamChiTiet'] = null;
        const mau = await this.fetchAllSpCT(newProductData.id);
        newProductData['sanPhamChiTiet'] = mau;
        const img = await this.fetchAllImage(newProductData.id);
        newProductData['img'] = img;
         
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
          newProductData = response.data;
          newProductData['size'] = null;
          newProductData['img'] = null;
          newProductData['mauSac'] = null;
          const mau = await this.fetchAllMauSac(newProductData.id);
          newProductData['mauSac'] = mau;
          const img_d = await this.fetchAllSize(newProductData.id);
          newProductData['size'] = img_d;
          const img = await this.fetchAllImage(newProductData.id);
          newProductData['img'] = img;

          this.products[index] = newProductData;
          //      console.log('pro: ',updatedProduct);
          //  console.log('new: ',newProductData);
        }
      } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
      }
    },
    async delete(productId) {
      try {
      //  this.products = this.products.filter(product => product.id !== productId); // Xóa sản phẩm khỏi danh sách
      const response = await axios.put(`/api/admin/san-pham/delete/${productId}`);
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
          let newProductData = this.products[index];
          newProductData = response.data;
          newProductData['img'] = null;
          newProductData['sanPhamChiTiet'] = null;
          const mau = await this.fetchAllSpCT(newProductData.id);
          newProductData['sanPhamChiTiet'] = mau;
          const img = await this.fetchAllImage(newProductData.id);
          newProductData['img'] = img;

          this.products[index] = newProductData;
        }
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    },

    async khoiPhuc(productId) {
      try {
      //  this.products = this.products.filter(product => product.id !== productId); // Xóa sản phẩm khỏi danh sách
      const response =   await axios.put(`/api/admin/san-pham/khoi-phuc/${productId}`);
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
          let newProductData = this.products[index];
          newProductData = response.data;
          newProductData['img'] = null;
          newProductData['sanPhamChiTiet'] = null;
          const mau = await this.fetchAllSpCT(newProductData.id);
          newProductData['sanPhamChiTiet'] = mau;
          const img = await this.fetchAllImage(newProductData.id);
          newProductData['img'] = img;

          this.products[index] = newProductData;
        }
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

  
  },
});
