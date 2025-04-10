import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import { searchAbleFields } from "./admin.constant";

const prisma = new PrismaClient();

const getAllAdminUsers = async (params: any) => {
  const{searchTerm, ...filterData} = params;

  const andContions:Prisma.AdminWhereInput[] = [];
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

  const whereCoditions : Prisma.AdminWhereInput = {AND: andContions}
  const result = await prisma.admin.findMany({
    where: whereCoditions 
  });
  return result;
};


export const adminService = {
    getAllAdminUsers,
}