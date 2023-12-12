import {defineStore} from "pinia";
import axios from '@/service/Authentication/http.js';

const API_ENDPOINT = `${import.meta.env.VITE_BASE_API_ENDPOINT}/khach-hang/reset-password`;
export const usePasswordStore = defineStore('passwordStore', () => {
    const handleForgotPassword = async (email) => {
        try {
            await axios.get(`${API_ENDPOINT}`, {
                params: {
                    email
                }
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    const resetPassword = async (email, token, password) => {
        try {
            await axios.post(`${API_ENDPOINT}`, null, {
                headers: {
                    password
                },
                params: {
                    email, token
                }
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    return {
        handleForgotPassword,
        resetPassword
    }
})