import { defineStore } from 'pinia';
import axios from 'axios';

const api = 'http://localhost:8080/api/payment-vnpay';

export const vnpayStore = defineStore('vnpay', {
    state: () => ({
        vnpay : ""
    }),
    actions: {
         async thanhToanVnPay(form){
            const response = await axios.post(api, form)
            this.vnpay =  response.data;
        
         }
       
    }
})