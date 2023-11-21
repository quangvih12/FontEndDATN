import { defineStore } from 'pinia';
import axios from 'axios';


const api = 'http://localhost:8080/api/khach-hang/register';

export const userRegisterStore = defineStore('register',{
    id: 'register',
    state: () => ({
        data: [],
    }),
    actions: {
        async register(form) {
            try {
                const response = await axios.post(api, form);
                this.data = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }
})