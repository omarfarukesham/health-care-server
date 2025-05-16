import {  Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
import {  userSearchAbleFields } from "./user.constant";
import * as bycript from "bcrypt";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationsHelper";
import { IFile } from "../../interfaces/file";
import { IAuthUser } from "../../interfaces/common";
import { fileUploader } from "../../../helpers/imageUploader";

const prisma = new PrismaClient();

const createAdmin = async (req: any) => {

  const file = req.file;
  if (file) {
    let uploadeToCloudinary = await fileUploader.uploadToCloudinary(file.path);
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
    let uploadeToCloudinary = await fileUploader.uploadToCloudinary(file.path);
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
      const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
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

const getAllUserFromDB = async (params: any, options: IPaginationOptions) => {
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

const getMyProfile = async (user:any) => {
const userData = await prisma.user.findUniqueOrThrow({
  where: {  
    email: user.email
  }, 
  select:{
    id: true, 
    email: true, 
    needPasswordChange: true,
    role: true,
    status: true

  }
})
  
if(userData.role === UserRole.ADMIN) {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      email: userData.email
    }
  });
  return { ...userData, admin };
}

if(userData.role === UserRole.SUPER_ADMIN) {
  const superAdmin = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData.email
    }
  });
  return { ...userData, superAdmin };
}

if(userData.role === UserRole.PATIENT) {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      email: userData.email
    }
  });
  return { ...userData, patient };
}

if(userData.role === UserRole.DOCTOR) {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: userData.email
    }
  });
  return { ...userData, doctor };
}
}

const updateMyProfile =  async (user: IAuthUser, req: any) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });

    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }

    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }

    return { ...profileInfo };
}

export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB,
    getMyProfile,
    changeProfileStatus,
    updateMyProfile
}