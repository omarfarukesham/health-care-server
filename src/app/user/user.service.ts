import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import { searchAbleFields } from "./user.constant";
import * as bycript from "bcrypt";
import { fileUloader } from "../../helpers/imageUploader";

const prisma = new PrismaClient();

const createAdmin = async (req: any) => {

  const file = req.file;
  if (file) {
    let uploadeToCloudinary = await fileUloader.uploadToCloudinary(file.path);
    req.body.admin.profilePhoto = uploadeToCloudinary;
  }
 
  const hashedPassword = await bycript.hash(req.body.password, 10);
  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
    };
   
    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
        data: userData,
      });

      const createAdmin = await transctionClient.admin.create({
        data: req.body.admin,
      });

      return createAdmin
    });


  return result;
}


const createDoctor = async (req: any) => {

  const file = req.file;
  if (file) {
    let uploadeToCloudinary = await fileUloader.uploadToCloudinary(file.path);
    req.body.doctor.profilePhoto = uploadeToCloudinary;
  }
 
  const hashedPassword = await bycript.hash(req.body.password, 10);
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
    };
   
    const result = await prisma.$transaction(async (transctionClient) => {
        await transctionClient.user.create({
        data: userData,
      });

      const creatDoctor = await transctionClient.doctor.create({
        data: req.body.doctor,
      });

      return creatDoctor
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
    createDoctor,
    getAllUsers
}