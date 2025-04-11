import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import { searchAbleFields } from "./admin.constant";
import calculatePagination from "../../helpers/paginationsHelper";

const prisma = new PrismaClient();


//get all admin users data from postgresSQL db following the search, filter, pagination ... 
const getAllAdminUsers = async (params: any, options: any) => {
  const{searchTerm, ...filterData} = params;
  const { page, limit, skip} =  calculatePagination(options);
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
    where: whereCoditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOder ? {
      [options.sortBy]: options.sortOrder
    } : {
      createdAt: 'desc'
    }
  });
  return {
    meta: {
      page,
      limit,
      total: await prisma.admin.count({
        where: whereCoditions
      }),
    },
    data: result
  }
};


//get signgle admin user data from postgresSQL db
const getSingleAdminUser = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id
    }
  });
  return result;
}


export const adminService = {
    getAllAdminUsers,
    getSingleAdminUser
}