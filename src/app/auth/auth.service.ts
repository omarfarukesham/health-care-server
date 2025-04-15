import jwt from 'jsonwebtoken';

import prisma from "../../shared/prisma";
import * as bycript from "bcrypt";
import { jwtHelper } from '../../helpers/jwtHelper';

const loginUser = async (payload:{
    email: string;
    password: string;
}): Promise<{
    accessToken: string;
    needPasswordChange: boolean;
    refreshToken: string;
}> => {
    const { email, password } = payload;
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: email,
        },
    })
   
  const isCorrectPassword:boolean =  await bycript.compare(password, userData.password);

  if(!isCorrectPassword) {
    throw new Error('Incorrect password');
  }

  const accessToken = jwtHelper.generateToken(
    {
        email: userData.email,
        role: userData.role,
    },
    process.env.JWT_SECRET as string,
    '1h'
  )

  const refreshToken = jwtHelper.generateToken(
    {
        email: userData.email,
        role: userData.role,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    '30d'
  )

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,

}
}

const refreshToken = async(token: string)=>{
    console.log(refreshToken, token)
}


export const AuthService = {
    loginUser,
    refreshToken
}