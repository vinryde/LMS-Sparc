import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PublicCourseType } from "@/app/data/course/get-all-courses";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Link from "next/link";

interface iAppProps{
    data:PublicCourseType;
}

export function PublicCourseCard({data}:iAppProps){
    const thumbnailUrl=useConstructUrl(data.fileKey)
    return(
        <Card className="group relative py-0 gap-0">
            <Badge variant="outline" className="absolute top-2 right-2 z-10">
            {data.level}
            </Badge>

            <Image src={thumbnailUrl} alt={data.title} width={600} height={400} className="w-full rounded-t-xl aspect-video h-full object-cover"/>
            <CardContent className="p-4">
                <Link className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors" href={`/courses/${data.slug}`}>{data.title}</Link>

            </CardContent>

        </Card>
    )
}