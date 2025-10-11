import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndividualCourse(slug:string){
  const course = await prisma.course.findUnique({
    where:{
        slug: slug,
    },
    select:{
        id:true,
        title:true,
        smallDescription:true,
        duration: true,
        level: true,
        category: true,
        price: true,
        fileKey: true,
        description: true,
        chapter:{
            select:{
                id:true,
                title:true,
                lesson:{
                    select:{
                        id:true,
                        title:true,
                    },
                    orderBy:{
                        position:"asc",
                    },
                },
              
            },
            orderBy:{
                position:"asc",
            },
        },
    },
  });

  if(!course){
    return notFound();
  }
  return course;
}