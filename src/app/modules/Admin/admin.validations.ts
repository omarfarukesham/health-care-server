import { z } from "zod";

const update = z.object({
   body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
    profileImage: z.string().optional(),
   })
  
})


export const AdminValidation = {
   update,
}