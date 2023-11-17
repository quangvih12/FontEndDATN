import { defineStore } from 'pinia';
import axios from '@/service/Authentication/http.js';

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
        //this.products = response.data;
        const productList =response.data; // Lấy dữ liệu từ Store và gán vào biến products

        for (const [key, product] of productList.entries()) {
            productList[key]['img'] = null;
            productList[key]['sanPhamChiTiet'] = null;
            const mau = await this.fetchAllSpCT(product.id);
            mau.sort((a, b) => b.id - a.id);
            productList[key]['sanPhamChiTiet'] = mau;
            const img = await this.fetchAllImage(product.id);
            img.sort((a, b) => b.id - a.id);
            productList[key]['img'] = img;
        }
    
        this.products = productList;

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



    async checkDuplicateName(data) {
      try {
        // Gửi yêu cầu GET để kiểm tra tên sản phẩm
        const response = await axios.put(`/api/admin/san-pham/check`, data); // Thay đổi URL dựa trên API của bạn
        const isDuplicate = response.data; // API trả về một giá trị boolean cho trùng lặp
        return !isDuplicate; // Trả về true nếu không trùng lặp, ngược lại trả về false

      } catch (error) {
        console.error('Lỗi khi kiểm tra trùng lặp tên sản phẩm:', error);
        throw error; // Nếu có lỗi, ném ngoại lệ để xử lý ở một nơi khác
      }
    },

    async checkDuplicateSPCT(idSize,idMau,idSP) {
      try {
        // Gửi yêu cầu GET để kiểm tra tên sản phẩm
        const response = await axios.put(`/api/admin/san-pham/check-spct/${idSize}?idMau=${idMau}&idSP=${idSP}`); // Thay đổi URL dựa trên API của bạn
        const isDuplicate = response.data; // API trả về một giá trị boolean cho trùng lặp
        return !isDuplicate; // Trả về true nếu không trùng lặp, ngược lại trả về false

      } catch (error) {
        console.error('Lỗi khi kiểm tra trùng lặp tên sản phẩm:', error);
        throw error; // Nếu có lỗi, ném ngoại lệ để xử lý ở một nơi khác
      }
    },
    


    async uploadFile(formData) {
        const response = await axios.post("/api/admin/san-pham/view-data", formData);
        const newProductData = response.data;
        this.excels.unshift(newProductData); 
    },

    async add(newProduct) {
      try {
        const response = await axios.post('/api/admin/san-pham', newProduct); // Thay đổi URL và dữ liệu newProduct tùy theo API của bạn
        const newProductData = response.data;
        newProductData['img'] = null;
        newProductData['sanPhamChiTiet'] = null;
        const mau = await this.fetchAllSpCT(newProductData.id);
        mau.sort((a, b) => b.id - a.id);
        newProductData['sanPhamChiTiet'] = mau;
        const img = await this.fetchAllImage(newProductData.id);
        img.sort((a, b) => b.id - a.id);
        newProductData['img'] = img;

        this.products.unshift(newProductData); // Thêm sản phẩm mới vào danh sách
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
      }
    },
    async edit(updatedProduct) {
      try {
        const response = await axios.put(`/api/admin/san-pham/update-san-pham/${updatedProduct.id}`, updatedProduct); // Thay đổi URL và dữ liệu updatedProduct tùy theo API của bạn
        const index = this.products.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
          let newProductData = this.products[index];
          newProductData = response.data;
          newProductData['img'] = null;
          newProductData['sanPhamChiTiet'] = null;
          const mau = await this.fetchAllSpCT(newProductData.id);
          mau.sort((a, b) => b.id - a.id);
          newProductData['sanPhamChiTiet'] = mau;
          const img = await this.fetchAllImage(newProductData.id);
          img.sort((a, b) => b.id - a.id);
          newProductData['img'] = img;

          this.products[index] = newProductData;
         /// console.log(this.products[index]);
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
          mau.sort((a, b) => b.id - a.id);
          newProductData['sanPhamChiTiet'] = mau;
          const img = await this.fetchAllImage(newProductData.id);
          img.sort((a, b) => b.id - a.id);
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
        const response = await axios.put(`/api/admin/san-pham/khoi-phuc/${productId}`);
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
          let newProductData = this.products[index];
          newProductData = response.data;
          newProductData['img'] = null;
          newProductData['sanPhamChiTiet'] = null;
          const mau = await this.fetchAllSpCT(newProductData.id);
          mau.sort((a, b) => b.id - a.id);
          newProductData['sanPhamChiTiet'] = mau;
          const img = await this.fetchAllImage(newProductData.id);
          img.sort((a, b) => b.id - a.id);
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

    async addSPCT(newProduct) {
      try {
        const response = await axios.post('/api/admin/san-pham/add-spct', newProduct); // Thay đổi URL và dữ liệu newProduct tùy theo API của bạn
        await this.fetchAll();
        return response.data;
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
      }
    },

    async editSPCT(updatedProduct,id) {
      try {
        const response = await axios.put(`/api/admin/san-pham/update-san-pham-CT/${id}`, updatedProduct); // Thay đổi URL và dữ liệu updatedProduct tùy theo API của bạn
        await this.fetchAll();
        return response.data;
      } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
      }
    },

    async deleteSPCT(id) {
      try {
        const response = await axios.put(`/api/admin/san-pham/delete-spct/${id}`); // Thay đổi URL và dữ liệu updatedProduct tùy theo API của bạn
        await this.fetchAll();
        return response.data;
      } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
      }
    },

    async khoiPhucSPCT(id) {
      try {
        const response = await axios.put(`/api/admin/san-pham/khoi-phuc-spct/${id}`); // Thay đổi URL và dữ liệu updatedProduct tùy theo API của bạn
        await this.fetchAll();
        return response.data;
      } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
      }
    },

    async addImg(newImg, id) {
      try {
        const response = await axios.post(`/api/admin/san-pham/add-img/${id}`, newImg); // Thay đổi URL và dữ liệu newProduct tùy theo API của bạn
        await this.fetchAll();
        return response.data;
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
      }
    },

    async editImg(updateImg,id) {
      try {
        const response = await axios.put(`/api/admin/san-pham/update-img/${id}`, updateImg); // Thay đổi URL và dữ liệu updatedProduct tùy theo API của bạn
        await this.fetchAll();
        return response.data;
      } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
      }
    },

    async deleteImg(id) {
      try {
        const response = await axios.delete(`/api/admin/san-pham/delete-img/${id}`); // Thay đổi URL và dữ liệu updatedProduct tùy theo API của bạn
        await this.fetchAll();
        return response.data;
      } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
      }
    },
  },
});
