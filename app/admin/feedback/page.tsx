import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/general/EmptyState";
import Link from "next/link";
import { Eye, MoreVertical, School, TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function FeedbackPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Course Feedback</h1>
      </div>

      <Suspense fallback={<FeedbackCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const data = await adminGetCourses();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="Create a new course to get started."
          buttonText="Create Course"
          href="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
          {data.map((course) => (
            <FeedbackCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function FeedbackCourseCard({ data }: { data: any }) {
  const ThumbnailUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${data.fileKey}`;

  return (
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
              <Link
                href={`/admin/feedback/${data.id}`}
                className="flex flex-wrap items-center"
              >
                <Eye className="size-4 mr-2" />
                View Feedback
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={ThumbnailUrl}
        alt="Thumbnail Url"
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/admin/feedback/${data.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.level}</p>
          </div>
        </div>
        <Link
          className={buttonVariants({
            className: "w-full mt-4",
          })}
          href={`/admin/feedback/${data.id}`}
        >
          View Feedback <Eye className="size-4 ml-2" />
        </Link>
      </CardContent>
    </Card>
  );
}

function FeedbackCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="group relative py-0 gap-0">
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="size-8 rounded-md" />
          </div>
          <div className="w-full relative h-fit">
            <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2 rounded" />
            <Skeleton className="h-4 w-full mb-4 rounded" />
            <div className="mt-4 flex items-center gap-x-5">
              <div className="flex items-center gap-x-2">
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="h-4 w-10 rounded" />
              </div>
              <div className="flex items-center gap-x-2">
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="h-4 w-10 rounded" />
              </div>
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}