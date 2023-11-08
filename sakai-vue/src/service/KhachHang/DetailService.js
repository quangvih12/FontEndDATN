import { defineStore } from 'pinia';
import axios from 'axios';

const apiDetail = 'http://localhost:8080/api/khach-hang/detail';

export const useDetailProductStore = defineStore('detail', {
    id: 'product',
    state: () => ({
        product: {},
        products: [],
        images: [],
        sizes: [],
        mauSacs: []
    }),
    actions: {
        async fetchSPCTByIdSP(idProduct) {
            try {
                const response = await axios.get(apiDetail + `/find-spct-by-idSP/` + idProduct);
                this.products = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
                throw error;
            }
        },
        async fetchProductById(idProduct) {
            try {
                const response = await axios.get(apiDetail + `/find-by-id/` + idProduct);
                this.product = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
                throw error;
            }
        },
        async fetchAllImage(idProduct) {
            try {
                const response = await axios.get(apiDetail + `/findByImage/` + idProduct); // Thay đổi URL dựa trên API của bạn
                this.images = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        },

        async fetchAllSize(idProduct) {
            try {
                const response = await axios.get(apiDetail + `/findBySize/` + idProduct); // Thay đổi URL dựa trên API của bạn
                this.sizes = response.data;
                // console.log(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        },

        async fetchAllMauSac(idProduct) {
            try {
                const response = await axios.get(apiDetail + `/findByMauSac/` + idProduct); // Thay đổi URL dựa trên API của bạn
                this.mauSacs = response.data;
                //  console.log('mau: ',   this.mauSacs  );
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        },
        async fetchAll() {
            try {
                const response = await axios.get(apiDetail + '/getAll'); // Thay đổi URL dựa trên API của bạn
                this.products = response.data;
                //  console.table(this.products.size);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        }
    }
});
