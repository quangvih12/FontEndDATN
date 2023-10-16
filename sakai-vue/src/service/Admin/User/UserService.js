
import { defineStore } from 'pinia';
import axios from 'axios';

const apiUser = 'http://localhost:8080/api/user';

export const userStore = defineStore('user', {
    state: () => ({
        data: []
    }),
    actions: {
        async getAllUser() {
            this.check = 0;
            try {
                const response = await axios.get(apiUser + '/getAllUser');
                this.data = response.data;
            } catch (error) {
               
            }
        },
         //load data User theo Role
         async fetchDataByStatus() {
            this.check = 1;
            try {
                const response = await axios.get(apiUser + '/getAllUserByRole?role=ADMIN' );
                this.data = response.data;
                
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

    
    }
});
