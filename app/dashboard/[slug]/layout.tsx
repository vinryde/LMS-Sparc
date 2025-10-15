import { ReactNode } from "react"
import { CourseSidebar } from "../_components/CourseSidebar"
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps{
    params:Promise<{slug:string}>;
    children:ReactNode;
}

export default async function CourseSlugLayout({params,children}:iAppProps){
    const {slug}= await params;
    const course= await getCourseSidebarData(slug);
    return(
        <div className="flex flex-1">
            {/*sidebar-30*/}
            <div className="w-80 border-r border-border shrink-0">
                <CourseSidebar course={course.course} />

            </div>
            {/*main*/}
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    )
}