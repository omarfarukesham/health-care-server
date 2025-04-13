import { Admin, Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
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
  };

  andContions.push({
    isDeleted: false,
  })

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
const getSingleAdminUser = async (id: string): Promise<Admin | null>  => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false
    }
  });
  if(!result){
    throw new Error("Admin not found");
  }
  return result;
}

//update admin user data in postgresSQL db
const updateAdminUser = async (id: string, data: Prisma.AdminUpdateInput): Promise<Admin | null> => {
  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false
    },
    data
  });
  if(!result){
    throw new Error("Admin not found");
  }
  return result;
}

//delete admin user data from postgresSQL db
const deleteAdminUser = async (id: string) => {

//if admin id is not available then throw a new readable msg .. 
 await prisma.admin.findFirstOrThrow({
  where:{
    id
  }
 })

 const result = await prisma.$transaction(async(transactionClient)=>{
    const deletedAdmin =  await transactionClient.admin.delete({
      where:{
        id
      }
    })
     await transactionClient.user.delete({
      where:{
        email: deletedAdmin.email
      }
    })
    return deletedAdmin;
 })
 return result;
}

//soft delete admin user data from postgresSQL db
const softDeleteAdminUser = async (id: string) => {

  //if admin id is not available then throw a new readable msg .. 
   await prisma.admin.findFirstOrThrow({
    where:{
      id,
      isDeleted: false
    }
   })
  
   const result = await prisma.$transaction(async(transactionClient)=>{
      const deletedAdmin =  await transactionClient.admin.update({
        where:{
          id
        },
        data:{
          isDeleted: true
        }
      })
       await transactionClient.user.update({
        where:{
          email: deletedAdmin.email
        },
        data:{
          status: UserStatus.DELETED
        }
      })
      return deletedAdmin;
   })
   return result;
}
  
export const adminService = {
    getAllAdminUsers,
    getSingleAdminUser,
    updateAdminUser,
    deleteAdminUser,
    softDeleteAdminUser
}