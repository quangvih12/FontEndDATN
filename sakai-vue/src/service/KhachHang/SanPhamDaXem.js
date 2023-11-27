import { defineStore } from 'pinia';
import axios from 'axios';

const apiSPDaXem = 'http://localhost:8080/api/khach-hang/san-pham-da-xem';

export const SPDaXemStore = defineStore('spDaXem', {
    state: () => ({}),
    actions: {
        async themSPDaXem(idSP) {
            try {
                const response = await axios.get(apiSPDaXem + `/find-by-id/` + idSP);
                return response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        async findByToken(token) {
            try {
                const response = await axios.get('http://localhost:8080/api/khach-hang/user/find-by-token?token=' + token);
                return response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }
});
