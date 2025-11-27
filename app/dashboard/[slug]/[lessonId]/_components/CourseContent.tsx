"use client";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescriptionn } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle, FileText, Link as LinkIcon, ExternalLink, Image as ImageIcon, FileDown } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { markLessonComplete } from "../actions";
import { useConfetti } from '@/hooks/use-confetti';
import { QuizComponent } from "./QuizComponent";
import { FeedbackComponent } from "./FeedbackComponent";
import Image from "next/image";

interface iAppProps{
    data: LessonContentType
}

export function CourseContent({data}:iAppProps){
    const[pending,startTransition]= useTransition();
    const {triggerConfetti} = useConfetti();


function VideoPlayer({thumbnailKey,documentKey,videoKey}:{
    thumbnailKey: string,
    documentKey: string,
    videoKey: string,
}){
const videoUrl=useConstructUrl(videoKey)
const thumbnailUrl=useConstructUrl(thumbnailKey)
const documentUrl=useConstructUrl(documentKey)
if(!videoKey){
    return(
    <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
        <BookIcon className="size-16 text-primary mx-auto mb-4"/>
        <p className="text-center text-sm text-muted-foreground">This capsule does not have a video yet</p>
    </div>
    )
}


return(
    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
        <video className="w-full h-full object-cover"
         controls
         poster={thumbnailUrl}
        >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
        </video>
    </div>
)
}
function onSubmit() {
    startTransition(async()=>{
      const{data:result,error}= await tryCatch(markLessonComplete(data.id,data.chapter.course.slug));
      if(error){
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }
      if(result.status=== 'success'){
        toast.success(result.message);
        triggerConfetti();
      }
      else if(result.status === 'error'){
        toast.error(result.message);
      }
    })
  }
const document=useConstructUrl(data.documentKey? data.documentKey:"")

return(
    <div className="flex flex-col h-full bg-background pl-6 ">
      <VideoPlayer thumbnailKey={data.thumbnailKey ?? ""} documentKey={data.documentKey ?? ""} videoKey={data.videoKey ?? ""} /> 
        <div className="py-4 border-b">
            {data.lessonProgress.length>0?(<Button variant="outline" className="bg-green-500/10 text-green-500">
                <CheckCircle className="size-4 mr-2 text-green-500 "/>
                Completed
            </Button>):(<Button variant="outline" onClick={onSubmit} disabled={pending}>
                <CheckCircle className="size-4 mr-2 text-green-500"/>
                Mark as Complete
            </Button>)}
            
        </div>

        <div className="space-y-3 pt-3">
           <h1 className="text-3xl font-bold tracking-tight text-foreground">{data.title}</h1> 
           {data.description && (
            <RenderDescriptionn json={JSON.parse(data.description)} />
            
           )}
           {data.documentKey && (
           <Link href={document}  className="text-primary font-medium">
                View Resource
            </Link>
        )}

         {/* Resources Section */}
         {data.resources && data.resources.length > 0 && (
           <div className="mt-8">
             <Card className="border-2">
               <CardHeader>
                 <CardTitle className="text-xl">Resources</CardTitle>
                 <p className="text-sm text-muted-foreground">
                   Additional materials to help you learn
                 </p>
               </CardHeader>
               <CardContent className="space-y-4">
                 {data.resources.map((resource) => (
                   <ResourceItem key={resource.id} resource={resource} />
                 ))}
               </CardContent>
             </Card>
           </div>
         )}

         {data.quiz && (
              <div className="mt-8">
                <QuizComponent 
                  quiz={data.quiz} 
                  slug={data.chapter.course.slug}
                />
              </div>
            )}
            {data.feedback && (
  <div className="mt-8">
    <FeedbackComponent 
      feedback={data.feedback} 
      slug={data.chapter.course.slug}
    />
  </div>
)}
        </div>
        
    </div>
)
}

function ResourceItem({ resource }: { resource: any }) {
  const imageUrl = useConstructUrl(resource.imageKey || "");
  const documentUrl = useConstructUrl(resource.documentKey || "");

  if (resource.type === "TEXT") {
    return (
      <div className="p-4 border rounded-lg space-y-2 hover:bg-accent/50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 shrink-0">
            <FileText className="size-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">{resource.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
              {resource.textContent}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (resource.type === "LINK") {
    return (
      <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10 shrink-0">
            <LinkIcon className="size-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-2">{resource.title}</h3>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              <a
                href={resource.linkUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="size-4" />
                Open Link
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (resource.type === "IMAGE") {
    return (
      <div className="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10 shrink-0">
            <ImageIcon className="size-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-base flex-1">{resource.title}</h3>
        </div>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={resource.title}
            fill
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  if (resource.type === "DOCUMENT") {
    return (
      <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10 shrink-0">
            <FileDown className="size-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-2">{resource.title}</h3>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FileDown className="size-4" />
                View Document
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}