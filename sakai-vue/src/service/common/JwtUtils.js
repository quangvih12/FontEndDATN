import * as jose from "jose";

const jwtSecretKey = await import.meta.env.VITE_JWT_SECRET_KEY;
export const verifyJwt = async (token) => {
    try {
        const key = await jose.importJWK({
            alg: 'SHA-384',
            kty: 'oct',
            k: jwtSecretKey,
        });
        const {payload} = await jose.jwtVerify(token, key);
        return payload;
    } catch (err) {
        console.log(err);
    }
}