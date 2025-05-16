import prisma from "../../../shared/prisma";
import * as bycript from "bcrypt";
import { jwtHelper } from '../../../helpers/jwtHelper';
import { UserStatus } from '@prisma/client';
import emailSender from "./sendEmail";
import ApiError from "../../apiError/ApiError";
import httpStatus from "http-status";


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

const changePassword = async(user:any, payload: any)=> {
  const existingUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE
    },
    
  })
  const isCorrectPassword:boolean =  await bycript.compare(payload.oldPassword, existingUser.password);
  console.log(isCorrectPassword, "passwordChecking")


  if(!isCorrectPassword) {
    throw new Error('Incorrect password');
  }

  const hashedPassword = await bycript.hash(payload.newPassword, 10)

   await prisma.user.update({
    where: {
      email: user.email
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false
    }
  })
  
  return {
    message: 'Password changed successfully'
  }
}

const forgetPassword = async (payload: {email: string}) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        },
    })
    const token = jwtHelper.generateToken(
        {
            email: userData.email,
            role: userData.role,
        },
        process.env.JWT_SECRET as string,
        '5m'
    )

    const resetLink = `https://localhost:5000/auth/v1/reset-passowrd?userId=${userData.id}&token=${token}`
 

    await emailSender(userData.email, 
        `
      <div style="text-align: center; padding: 20px;">
            <h1>Reset Password</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Reset Password</a>
        </div>
        `
    )
 
    return resetLink
} 

const resetPassword = async (token: string, payload:{id: string, password: string }) => {
    const userData =  await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
       });
  
        if (!userData) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found")
        }

      
      const isValidToken = jwtHelper.verfiyToken(token)
      console.log(isValidToken, "isValidToken ...............")

      if (!isValidToken) {
          throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
      }

    // hash password
    const password = await bycript.hash(payload.password, 10);
    console.log(password, "hashedPassword")

    // update into database
      await prisma.user.update({
          where: {
              id: payload.id
          },
          data: {
              password
          }
      })
  
    return {
      message: 'Password changed successfully'
    }
}


export const AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
}