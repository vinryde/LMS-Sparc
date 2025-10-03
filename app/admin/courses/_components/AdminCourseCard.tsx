import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Link from "next/link";
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";



interface iAppProps {
    data: AdminCourseType;
}

export function AdminCourseCard({data}: iAppProps) {
    const ThumbnailUrl = useConstructUrl(data.fileKey);
      const imageData= `https://create-lms.t3.storage.dev/${data.fileKey}`;
    return(
      
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon">
                        <MoreVertical className="size-4" />
                    </Button>

                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-48">
                   <DropdownMenuItem asChild>
                    <Link href = {`/admin/courses/${data.id}/edit`} className="flex flex-wrap items-center">
                    <Pencil className="size-4 mr-2"/>
                    Edit Course
                    </Link>
                   </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                    <Link href = {`/courses/${data.slug}`} className="flex flex-wrap items-center">
                    <Eye className="size-4 mr-2"/>
                    Preview
                    </Link>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                    <Link href = {`admin/courses/${data.id}/delete`} className="flex flex-wrap items-center">
                    <Trash2 className="size-4 mr-2 text-destructive"/>
                    Delete Course
                    </Link>
                   </DropdownMenuItem>
                   
                   </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <Image src={ThumbnailUrl} alt="Thumbnail Url" width={600} height={400} className="w-full rounded-t-lg aspect-video h-full object-cover"/>
            <CardContent className="p-4">
            <Link href = {`/admin/courses/${data.id}/edit`} className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors">
            {data.title}
            </Link>
            <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">{data.smallDescription}</p>
            <div className="mt-4 flex items-center gap-x-5">
                <div className="flex items-center gap-x-2">
                    <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10"/>
                    <p className="text-sm text-muted-foreground">{data.duration}h</p>
                </div>
                <div className="flex items-center gap-x-2">
                    <School className="size-6 p-1 rounded-md text-primary bg-primary/10"/>
                    <p className="text-sm text-muted-foreground">{data.level}</p>
                </div>

            </div>
            <Link className={buttonVariants({
                className:"w-full mt-4",
            })} href = {`/admin/courses/${data.id}/edit`}>
            Edit Course <ArrowRight className="size-4"/>
            </Link>
            </CardContent>
        </Card>
    );
}
