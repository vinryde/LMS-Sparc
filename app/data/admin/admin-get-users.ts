import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function AdminGetUsers(){
    await requireAdmin();
    const data = await prisma.user.findMany({
        orderBy:{
            createdAt:"desc",
        },
        select:{
            id:true,
            name:true,
            email:true,
            role:true,
            enrollment:true,
            courses:true,
        }
    });
    return data;

}
export type AdminUserType= Awaited<ReturnType<typeof AdminGetUsers>>[0];