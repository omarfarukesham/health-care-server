import prisma from "../../../shared/prisma"

const getAllDoctors = async () => {
  const result = await prisma.doctor.findMany({
    where: {
        isDeleted: false
        },
})
    return result;
}

const updateDoctor = async (id: string, data: any) => {
console.log(id, data)
}



export const doctorService   = {
    getAllDoctors,
    updateDoctor
}