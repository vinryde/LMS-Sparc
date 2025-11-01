'use server'
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { userRoleSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";


export async function UpdateUserRole(userid: string, userrole:string ){
    
    await requireAdmin();
    const validRole = userRoleSchema.parse(userrole);
    await prisma.user.update({
        where:{
            id:userid,
        },
        data:{
            role: validRole,
        }
    })
    revalidatePath('/admin/users')

}