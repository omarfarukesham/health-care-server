import multer from "multer";
import path from "path";
import fs from 'fs'
import {v2 as cloudinary} from "cloudinary";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {    
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// const uploadToCloudinary = async (filePath: string) => {
//     try {
//         const result = await cloudinary.uploader.upload(filePath, {
//             folder: "uploads",
//             resource_type: "auto"
//         });
//         return result.secure_url;
//     } catch (error) {
//         throw new Error("Error uploading to Cloudinary: " + (error instanceof Error ? error.message : "Unknown error"));
//     }
// };
const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
};


export const fileUloader  = {
    upload,
    uploadToCloudinary
};