"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeedbackStructureProps {
  data: {
    id: string;
    title: string;
    chapter: Array<{
      id: string;
      title: string;
      position: number;
      lesson: Array<{
        id: string;
        title: string;
        position: number;
      }>;
    }>;
  };
}

export function FeedbackStructure({ data }: FeedbackStructureProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    data.chapter.forEach((chapter) => {
      initial[chapter.id] = true;
    });
    return initial;
  });

  function toggleSection(chapterId: string) {
    setOpenSections((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  }

  return (
    <div className="space-y-4">
      {data.chapter.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">
            No chapters found in this course.
          </p>
        </div>
      ) : (
        data.chapter.map((chapter) => (
          <Card key={chapter.id}>
            <Collapsible
              open={openSections[chapter.id]}
              onOpenChange={() => toggleSection(chapter.id)}
            >
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex items-center gap-2 flex-1">
                  <CollapsibleTrigger asChild>
                    <Button size="icon" variant="ghost">
                      {openSections[chapter.id] ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <div className="flex-1">
                    <p className="font-medium">{chapter.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {chapter.lesson.length} lesson
                      {chapter.lesson.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <CollapsibleContent>
                <div className="p-4 space-y-2">
                  {chapter.lesson.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/admin/feedback/${data.id}/${lesson.id}`}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      )}
                    >
                      <FileText className="size-4" />
                      <span className="flex-1 font-medium text-sm">
                        {lesson.position}. {lesson.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))
      )}
    </div>
  );
}