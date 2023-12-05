import {verifyJwt} from "@/service/common/JwtUtils";

const token = localStorage.getItem('token');
const payloadData = token ? await verifyJwt(token) : null;

export const authMiddleware = {
    requireAuth: (to, from, next) => {
        console.log("undf");
        if (payloadData) next();
        else next({ name: 'login' });
    },
    requireAdmin: (to, from, next) => {
        if (payloadData) {
            if (payloadData.role === "ADMIN") next();
            else next({ name: 'unauthorized' });
        } else next({ name: 'login-admin' });
    }
}