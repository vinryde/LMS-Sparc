"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { CourseSidebarContent } from "./CourseSidebarContent";

interface iAppProps {
    course: CourseSidebarDataType['course'];
}

export function CourseSidebarMobile({ course }: iAppProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="fixed top-14 left-0.5 z-50 shadow-lg md:hidden"
                    >
                        {open ? <X className="size-5" /> : <Menu className="size-3" />}
                        <span className="sr-only">Toggle course menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 overflow-y-auto">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Course Navigation</SheetTitle>
                        <SheetDescription>
                            Navigate through course chapters and lessons
                        </SheetDescription>
                    </SheetHeader>
                    <div className="h-full">
                        <CourseSidebarContent course={course} onItemClick={() => setOpen(false)} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}