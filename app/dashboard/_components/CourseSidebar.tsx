"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { CourseSidebarContent } from "./CourseSidebarContent";

interface iAppProps {
    course: CourseSidebarDataType['course'];
}

export function CourseSidebar({ course }: iAppProps) {
    return (
        <div className=" sticky top-10">
            <CourseSidebarContent course={course} />
        </div>
    );
}