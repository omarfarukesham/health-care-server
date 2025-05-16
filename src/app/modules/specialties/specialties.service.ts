import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/imageUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";


const insertIntoDB = async (req: Request & {file?: IFile}) => {
     const file = req.file as IFile;
      if (file) {
        let uploadeToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.icon = uploadeToCloudinary?.secure_url 

      }

    const result = await prisma.specialties.create({
        data: req.body
    });

    return result;

}

const getAllSpecialty = async () => {
    const result = await prisma.specialties.findMany();
    return result;
}  

const deleteSpecialty = async (id: string) => {
    const result = await prisma.specialties.delete({    
        where: {
            id
        }
    });
    return result;
}

export const SpecialtyService = {
  insertIntoDB, 
  getAllSpecialty,
  deleteSpecialty
}