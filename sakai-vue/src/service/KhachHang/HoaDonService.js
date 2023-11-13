import { defineStore } from 'pinia';
import axios from 'axios';

const api = 'http://localhost:8080/api/khach-hang/checkout';

export const checkoutStore = defineStore('checkOut', {
    state: () => ({
        checkOut : []
    }),
    actions: {
         async checkout(form){
            const response = await axios.post(api, form)
            this.checkOut =  response.data;
         }
       
    }
})