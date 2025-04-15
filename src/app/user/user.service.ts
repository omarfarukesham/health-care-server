import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import { searchAbleFields } from "./user.constant";
import * as bycript from "bcrypt";

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
  const hashedPassword = await bycript.hash(data.password, 10);
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
    };
   
    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
        data: userData,
      });

      const createAdmin = await transctionClient.admin.create({
        data: data.admin,
      });

      return createAdmin
    });


  return result;
}

const getAllUsers = async (params: any) => {
  const{searchTerm, ...filterData} = params;

  const andContions:Prisma.UserWhereInput[] = [];
  // const searchAbleFields = ['name', 'email'];

  if(params.searchTerm){
    andContions.push( {
      OR:searchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        }
      }))
    },)
  }

  if(Object.keys(filterData).length){
    andContions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key]
          
        }
      }))
    })
  }

  const whereCoditions : Prisma.UserWhereInput = {AND: andContions}
  const result = await prisma.user.findMany({
    where: whereCoditions 
  });
  return result;
};


export const userService = {
    createAdmin,
    getAllUsers
}