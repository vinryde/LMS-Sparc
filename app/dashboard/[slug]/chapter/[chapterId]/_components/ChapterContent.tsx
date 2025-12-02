"use client";

import { ChapterContentType } from "@/app/data/course/get-chapter-content";
import { RenderDescriptionn } from "@/components/rich-text-editor/RenderDescription";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BookIcon, Play } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  data: ChapterContentType;
}

export function ChapterContent({ data }: Props) {
  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string | null | undefined;
    videoKey: string | null | undefined;
  }) {
    const videoUrl = useConstructUrl(videoKey || "");
    const thumbnailUrl = useConstructUrl(thumbnailKey || "");

    if (!videoKey) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <BookIcon className="size-16 text-primary mx-auto mb-4" />
          <p className="text-center text-sm text-muted-foreground">
            This module does not have a video yet
          </p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
        <video className="w-full h-full object-cover" controls poster={thumbnailUrl}>
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer thumbnailKey={data.thumbnailKey} videoKey={data.videoKey} />
      <div className="space-y-3 pt-4 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescriptionn json={JSON.parse(data.description)} />
        )}
      </div>

      {data.lesson && data.lesson.length > 0 && (
        <div className="mt-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Lessons in this module</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select a lesson to start learning
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.lesson.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/dashboard/${data.course.slug}/${lesson.id}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full p-2.5 h-auto justify-start",
                  })}
                >
                  <div className="flex items-center gap-2.5 w-full min-w-0">
                    <div className="shrink-0">
                      <div className="size-5 rounded-full border-2 bg-background flex items-center justify-center border-muted-foreground/60">
                        <Play className="size-2.5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-medium truncate text-foreground">
                        {lesson.position}. {lesson.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}