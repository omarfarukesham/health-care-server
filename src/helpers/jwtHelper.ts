import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

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

const verfiyToken = (token: string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
}


export const jwtHelper = {
    generateToken, 
    verfiyToken
}