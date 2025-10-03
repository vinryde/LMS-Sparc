"use client";
import {FileRejection, useDropzone} from 'react-dropzone';
import {useCallback, useEffect, useState} from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from './RenderState';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { blob } from 'stream/consumers';



interface UploaderState {
   id: string | null,
   file: File | null;
   uploading: boolean;
   progress: number;
   key?: string;
   isDeleting: boolean;
   error: boolean;
   objectUrl?:string;
   fileType: "image" | "video";
}

interface iAppProps{
    value?: string;
    onChange?: (value: string) => void;
}

export function Uploader({value, onChange}: iAppProps) {
    const [fileState, setFileState]= useState<UploaderState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        objectUrl: undefined,
        fileType: "image",
        key: value,
    })

   async function uploadFile(file: File){
        setFileState((prev)=>({
              ...prev,
              uploading: true,
              progress:0,
        }));
          try{

        const presignedResponse= await fetch("/api/s3/upload",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fileName: file.name,
                contentType: file.type,
                size: file.size,
                isImage: true,

                
            }),
        
        });

        if(!presignedResponse.ok){
            toast.error('Failed to get presigned url');
            setFileState((prev)=>({
              ...prev,
              uploading: false,
              progress:0,
              error:true, 
        }));
        return;
        }
       const {presignedUrl,key}= await presignedResponse.json();
       console.log('Key from backend:', key);
       console.log('Presigned URL:', presignedUrl);

       await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress= (event) =>{
            if(event.lengthComputable){
                const percentageCompleted=(event.loaded /event.total)*100;
                 setFileState((prev)=>({
              ...prev,
              progress: Math.round(percentageCompleted),
             
        }));
            }

        };
        xhr.onload = () => {
            if(xhr.status === 200 || xhr.status === 204) {
                setFileState((prev)=> ({
                    ...prev,
                    progress: 100,
                    uploading: false,
                    key: key,
                }));
                onChange?.(key);
                toast.success('File uploaded successfully')
                resolve();
            } else {
                reject(new Error("Upload failed..."));
            }
           
        };  
            xhr.onerror = () => {
                reject(new Error("Upload failed"));
            };
            xhr.open("PUT",presignedUrl);
            xhr.setRequestHeader("Content-Type",file.type);
            xhr.send(file);
    });
    
    } catch{
        toast.error('Failed to upload file');

        setFileState((prev)=> ({
                    ...prev,
                    progress: 0,
                    error: true,
                    uploading: false,
                }));

    }

    }

  

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if(acceptedFiles.length>0){
            const file = acceptedFiles[0];

            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }
             setFileState({
             file: file,
             uploading: false,
             progress: 0,
             error: false,
             objectUrl: URL.createObjectURL(file),
             id: uuidv4(),
             isDeleting: false,
             fileType: "image",

            });
            uploadFile(file);
        }
    
  }, [fileState.objectUrl]
);
 async function handleRemoveFile () {
    if(fileState.isDeleting || !fileState.objectUrl) return;
    try {
        setFileState((prev)=>({
              ...prev,
              isDeleting: true,
        }));
        const response = await fetch("/api/s3/delete",{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                key: fileState.key,
            }),
        });
        if(!response.ok){
            toast.error('Failed to delete file');
            setFileState((prev)=>({
                ...prev,
                isDeleting: true,
                error: true,
            }));
            return;
        }
         if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(fileState.objectUrl);
        }
         onChange?.("");

        
        setFileState((prev)=>({
            file: null,
            uploading: false,
            progress: 0,
            error: false,
            key: undefined,
            objectUrl: undefined,
            fileType: 'image',
            id: null,
            isDeleting: false,
        }));
        toast.success('File deleted successfully');
    } catch {
        toast.error('Failed to delete file');
        setFileState((prev)=>({
            ...prev,
            isDeleting: false,
            error: true,
        }));
    }
 }



  function rejectedFiles(fileRejection: FileRejection[]){
    if(fileRejection.length){
        const tooManyFiles = fileRejection.find((rejection)=> rejection.errors[0].code === 'too-many-files')
        const fileSizeExceeded = fileRejection.find((rejection)=> rejection.errors[0].code === 'file-too-large')
        if(tooManyFiles){
            toast.error('Too Many Files Selected. Please Select A Single File')
        }
        if(fileSizeExceeded){
            toast.error('File Size Exceeded. Please Select A File Less Than 5mb')
        }
    }

  }

  function renderContent(){
    if(fileState.uploading){
        return (
            <RenderUploadingState file={fileState.file as File} progress={fileState.progress} />
        )
    }
    if(fileState.error){
        return <RenderErrorState />;
    }
    if(fileState.objectUrl){
        return(
            <RenderUploadedState handleRemoveFile={handleRemoveFile} isDeleting={fileState.isDeleting} previewUrl={fileState.objectUrl} />
        );
    }
    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect (() => {
    return () => {
        if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(fileState.objectUrl);
        }
    };
  }, [fileState.objectUrl]);


    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,
        accept:{'image/*':[]},
        maxFiles: 1,
        multiple: false,
        maxSize: 1024 * 1024 * 5, //5mb
        onDropRejected: rejectedFiles,
        disabled: fileState.uploading || !!fileState.objectUrl,
    });
    return(
    <Card {...getRootProps()} className={cn("relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 ", isDragActive ? "border-primary bg-primary/10 border-solid": "border-border hover:border-primary")}>
      
      <CardContent className='flex items-center justify-center h-full w-full p-4 '>
        <input {...getInputProps()} />
        {renderContent()}
    </CardContent>
    </Card>
    ); 
}