import { defineStore } from 'pinia';
import axios from 'axios';

const apiComment = 'http://localhost:8080/api/khach-hang/comment';

export const commentStore = defineStore('comment',{
    state: () => ({     
        data: [],
    }),
    actions: {
        async addComment(form,token) {
            try {
                const response = await axios.post(apiComment+ `/add?token=${token}`,form);
                this.data.unshift(response.data);
            } catch (error) {
                console.error('Error fetching :', error);
            }
        },
        async getListComment(token,idsp) {
            try {
                const response = await axios.get(apiComment + `?token=${token}&idsp=${idsp}`);
                this.data = response.data;
            } catch (error) {
                console.error('Error fetching :', error);
            }
        },
        async xoaComment(id) {
            try {
                const response = await axios.delete(apiComment+'/'+id);              
                this.data = response.data;
            } catch (error) {
            }
        },
    }
})