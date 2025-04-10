import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import { searchAbleFields } from "./user.constant";

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
  const userData = {
    email: data.admin.email,
    password: data.password,
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

  const andContions:Prisma.AdminWhereInput[] = [];
  // const searchAbleFields = ['name', 'email'];

  console.log(filterData)
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

  const whereCoditions : Prisma.AdminWhereInput = {AND: andContions}
  const result = await prisma.admin.findMany({
    where: whereCoditions 
  });
  return result;
};


export const userService = {
    createAdmin,
    getAllUsers
}