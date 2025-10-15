import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function checkIfUserEnrolled(courseId:string):Promise<boolean>{
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if(!session?.user){
        return false;
    }
    const userId = session.user.id;
    const enrollment = await prisma.enrollment.findUnique({
        where:{
            userId_courseId:{
                userId,
                courseId,
            }
        },
        select:{
            status:true,
        }
    });
    return enrollment?.status==='Completed'?true:false;
}
