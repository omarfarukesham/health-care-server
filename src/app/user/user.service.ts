import { Prisma, PrismaClient, UserRole } from "@prisma/client";

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
  const result = await prisma.admin.findMany({
    where: {
      OR:[
       {
        name: {
          contains: params.searchTerm,
          mode: 'insensitive',
        }
      },
      {
        email: {
          contains: params.searchTerm,
          mode: 'insensitive',
        }
      },
     
        
      ]
    
    },
  });
  return result;
};


export const userService = {
    createAdmin,
    getAllUsers
}