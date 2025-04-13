import { Response } from "express";

const sendResponse = <T>(res:Response, jsonData:{
    statusCode:number,
    message:string,
    success:boolean
    meta?:{
       page: number,
       limit: number,
       total: number
    },
    data?: T | null | undefined,
    error?:string
 })=>{
    res.status(jsonData.statusCode).json({
       status: jsonData.success,
       message: jsonData.message,
       error: jsonData.error,
       meta: jsonData.meta || null || undefined,
       data: jsonData.data || null || undefined,
      
    });
 }

 export default sendResponse;