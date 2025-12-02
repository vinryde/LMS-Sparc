import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";

interface iAppProps{
    params:Promise<{slug:string}>;
}

export default async function CourseSlugRoute({params}:iAppProps){
    const {slug}= await params;
    const course= await getCourseSidebarData(slug);
    // Redirect to first chapter details if available
    if (course.course.chapter.length > 0) {
        const firstChapter = course.course.chapter[0];
        if (firstChapter) {
            return redirect(`/dashboard/${slug}/chapter/${firstChapter.id}`);
        }
    }
    return(
        <div className="flex  flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold mb-2">
                No modules available in this course
            </h2>
            <p className="text-muted-foreground">
                This course does not have any modules yet!
            </p>
        </div>
    )
}