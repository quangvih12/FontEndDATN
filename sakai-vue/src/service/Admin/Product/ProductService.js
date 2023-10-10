import { defineStore } from 'pinia';
import axios from 'axios';

const apiProduct = 'http://localhost:8080/api/products';

export const productStore = defineStore('product', {
    state: () => ({
        data: []
    }),
    actions: {
        async getProduct() {
            try {
                const response = await axios.get(apiProduct + '/getAllCTSPByKhuyenMai');
                this.data = response.data;
            } catch (error) {
           
            }
        },

        updateCTSP(idctsp, idkm) {
            axios.put(`http://localhost:8080/api/products/applyKM/${idctsp}?idkm=${idkm}`).then((response) => {
                let index = -1;
                for (let i = 0; i < this.data.length; i++) {
                    if (idctsp == this.data[i].id) {
                        index = i;
                    }
                }
                this.data.splice(index, 1);
            });
        }
    }
});
