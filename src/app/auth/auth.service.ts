
import prisma from "../../shared/prisma";
import * as bycript from "bcrypt";
import { jwtHelper } from '../../helpers/jwtHelper';
import { UserStatus } from '@prisma/client';

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
            status: UserStatus.ACTIVE
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
    let decodedData

    try {
       decodedData = jwtHelper.verfiyToken(token)
    }
    catch (error) {
        throw new Error('You are not authorized');
    }
   const isUserExist = await prisma.user.findUniqueOrThrow({
      where:{
        email: decodedData?.email,
        status: UserStatus.ACTIVE
      }
   })

   return isUserExist
}

const changePassword = async()=> {
  console.log('change password')
}


export const AuthService = {
    loginUser,
    refreshToken,
    changePassword
}