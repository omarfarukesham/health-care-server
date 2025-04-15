import jwt, { SignOptions } from 'jsonwebtoken';

const generateToken = (payload: object, secret: string, expiresIn: string): string => {
    const token = jwt.sign(
        payload,
        secret,
        {
            algorithm: 'HS256',
            expiresIn
        } as SignOptions
    );
    return token;
}

export const jwtHelper = {
    generateToken
}