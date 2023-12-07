import {verifyJwt} from "@/service/common/JwtUtils";

const token = localStorage.getItem('token');
const payloadData = token ? await verifyJwt(token) : null;

export const requireAuth = async (to, from, next) => {
    console.log(to);
    if (payloadData) await next();
    else await next({ name: 'login' });
}

export const requireAdmin = async (to, from, next) => {
   // console.log(to);
    if (payloadData) {
        if (payloadData.role === "ADMIN") await next();
        else await next({ name: 'unauthorized' });
    } else await next({ name: 'login-admin' });
}