import { PutObjectAclCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { error } from 'console';
import { NextResponse } from 'next/server';
import {z} from 'zod';
import {v4 as uuidv4} from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3 } from '@/lib/S3Client';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { requireAdmin } from '@/app/data/admin/require-admin';

export const fileUploadSchema= z.object({
    fileName: z.string().min(1,{message: 'Filename is required'}),
    contentType: z.string().min(1,{message: 'Content type is required'}),
    size: z.number().min(1,{message: 'Size is required'}),
    isImage: z.boolean(),
});

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow:[],
  })
).withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);



export async function POST(request: Request){
   const session = await requireAdmin();
    try{
      const decision = await aj.protect(request,{
        fingerprint: session?.user.id as string,
      });
      if(decision.isDenied()){
        return NextResponse.json({error:"Too many requests"},{status:429});
      }


      const body= await request.json();
      const validation = fileUploadSchema.safeParse(body);
      if(!validation.success){
        return NextResponse.json({error:"Invalid Request Body"},{status:400});
      }
       const{fileName,contentType,size}= validation.data;
       const uniqueKey = `${uuidv4()}-${fileName}`

       const command = new PutObjectCommand({
        Bucket:  process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES as string,
        Key: uniqueKey,
        ContentType: contentType,
        ContentLength: size,
       })
         const presignedUrl= await getSignedUrl(S3,command,{
            expiresIn: 360,
         });

         const response ={
           presignedUrl,
           key: uniqueKey,

         };
         return NextResponse.json(response,{status:200});
    }

  
   

    catch{
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}