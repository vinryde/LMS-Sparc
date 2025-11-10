"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { CourseSidebarContent } from "./CourseSidebarContent";

interface iAppProps {
    course: CourseSidebarDataType['course'];
}

export function CourseSidebar({ course }: iAppProps) {
    return (
        <div className="h-full sticky top-0">
            <CourseSidebarContent course={course} />
        </div>
    );
}