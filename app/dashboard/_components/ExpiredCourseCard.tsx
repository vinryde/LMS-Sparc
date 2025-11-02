"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ExpiredCourseType } from "@/app/data/user/get-enrolled-courses";
import { CalendarX } from "lucide-react";

interface iAppProps{
    data: ExpiredCourseType;
}

export function ExpiredCourseCard({data}:iAppProps){
    const thumbnailUrl = useConstructUrl(data.course.fileKey);
    
    const formatDate = (date: Date | null) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
    return(
        <Card className="group relative py-0 gap-0 opacity-75 hover:opacity-100 transition-opacity">
            <div className="absolute top-2 right-2 z-10 flex gap-2">
                <Badge variant="destructive" className="flex items-center gap-1">
                    <CalendarX className="size-3" />
                    Expired
                </Badge>
                <Badge variant="outline">
                    {data.course.level}
                </Badge>
            </div>

            <Image 
                src={thumbnailUrl} 
                alt={data.course.title} 
                width={600} 
                height={400} 
                className="w-full rounded-t-xl aspect-video h-full object-cover grayscale"
            />
            
            <CardContent className="p-4">
                <h3 className="font-medium text-lg line-clamp-2 text-foreground">
                    {data.course.title}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
                    {data.course.smallDescription}
                </p>
                
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Enrolled:</span>
                        <span className="font-medium">{formatDate(data.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Expired:</span>
                        <span className="font-medium text-destructive">
                            {formatDate(data.expiresAt)}
                        </span>
                    </div>
                </div>
                
                <Link 
                    href={`/course-expired?courseId=${data.course.id}`} 
                    className={buttonVariants({variant:"outline", className:"w-full mt-4"})}
                >
                    View Details
                </Link>
            </CardContent>
        </Card>
    )
}