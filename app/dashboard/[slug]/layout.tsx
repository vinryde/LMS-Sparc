import { ReactNode } from "react"
import { CourseSidebar } from "../_components/CourseSidebar"
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseSidebarMobile } from "../_components/CourseSidebarMobile";

interface iAppProps{
    params:Promise<{slug:string}>;
    children:ReactNode;
}

export default async function CourseSlugLayout({params,children}:iAppProps){
    const {slug}= await params;
    const course= await getCourseSidebarData(slug);
    return(
        <div className="flex flex-1 relative">
            {/* Desktop Sidebar - Hidden on Mobile */}
            <div className="hidden md:block w-80 border-r border-border shrink-0">
                <CourseSidebar course={course.course} />
            </div>

            {/* Mobile Sidebar - Only visible on Mobile */}
            <CourseSidebarMobile course={course.course} />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden w-full">
                {children}
            </div>
        </div>
    )
}