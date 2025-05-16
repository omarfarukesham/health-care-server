import {z} from 'zod';

const create = z.object({
    title: z.string({
        required_error: 'Title is required',
    }),
    icon: z.string().optional()

});
  
export const SpecialtyValidation = {
    create: create,
}