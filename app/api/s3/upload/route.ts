import { PutObjectAclCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { error } from 'console';
import { NextResponse } from 'next/server';
import {z} from 'zod';
import {v4 as uuidv4} from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3 } from '@/lib/S3Client';

export const fileUploadSchema= z.object({
    fileName: z.string().min(1,{message: 'Filename is required'}),
    contentType: z.string().min(1,{message: 'Content type is required'}),
    size: z.number().min(1,{message: 'Size is required'}),
    isImage: z.boolean(),
});



export async function POST(request: Request){
    try{
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