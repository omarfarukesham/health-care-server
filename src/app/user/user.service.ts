import { Patient, Prisma, PrismaClient, UserRole } from "@prisma/client";
import { searchAbleFields, userSearchAbleFields } from "./user.constant";
import * as bycript from "bcrypt";
import { fileUloader } from "../../helpers/imageUploader";
import { IPaginationOptions } from "../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationsHelper";

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

const createPatient = async (req: any) => {
  const file = req.file
  
  if (file) {
      const uploadedProfileImage = await fileUloader.uploadToCloudinary(file);
      req.body.patient.profilePhoto = uploadedProfileImage?.secure_url
      console.log(uploadedProfileImage)
  }

  const hashedPassword: string = await bycript.hash(req.body.password, 10)

  const userData = {
      email: req.body.patient.email,
      password: hashedPassword,
      role: UserRole.PATIENT
  }


  const result = await prisma.$transaction(async (transactionClient) => {
      await transactionClient.user.create({
          data: userData
      });

      const createdPatientData = await transactionClient.patient.create({
          data: req.body.patient
      });

      return createdPatientData;
  });

  return result;
};

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

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
      andCondions.push({
          OR: userSearchAbleFields.map(field => ({
              [field]: {
                  contains: params.searchTerm,
                  mode: 'insensitive'
              }
          }))
      })
  };

  if (Object.keys(filterData).length > 0) {
      andCondions.push({
          AND: Object.keys(filterData).map(key => ({
              [key]: {
                  equals: (filterData as any)[key]
              }
          }))
      })
  };

  const whereConditons: Prisma.UserWhereInput = andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
      where: whereConditons,
      skip,
      take: limit,
      orderBy: options.sortBy && options.sortOrder ? {
          [options.sortBy]: options.sortOrder
      } : {
          createdAt: 'desc'
      },
      select: {
          id: true,
          email: true,
          role: true,
          needPasswordChange: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          admin: true,
          patient: true,
          doctor: true
      }
  });

  const total = await prisma.user.count({
      where: whereConditons
  });

  return {
      meta: {
          page,
          limit,
          total
      },
      data: result
  };
};

const changeProfileStatus= async (id: string, status: UserRole) => {
  const result = await prisma.user.findFirstOrThrow({
    where: {
      id
    }
   
  });
  const updateUser = await prisma.user.update({
    where: {  
      id: result.id
    },
    data: status
    
  });

  return updateUser;
};

const getMyProfile = async (id: string) => {
  console.log(id)
}


export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    getAllFromDB,
    getMyProfile,
    changeProfileStatus
}