// Update: app/dashboard/page.tsx
import { EmptyState } from "@/components/general/EmptyState"
import { getAllCourses } from "../data/course/get-all-courses"
import { getEnrolledCourses, getExpiredCourses } from "../data/user/get-enrolled-courses"
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard"
import { EnrolledCourseCard } from "./_components/CourseProgressCard"
import { ExpiredCourseCard } from "./_components/ExpiredCourseCard"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"
import { PublicCourseCardSkeleton } from "../(public)/_components/PublicCourseCard"

export default async function DashboardPage(){
  // No data fetching at the top-level; stream sections with Suspense.
  return(
    <>
    {/* Active Enrolled Courses */}
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold">Enrolled Courses</h1>
      <p className="text-muted-foreground">Here you can view all the courses you have enrolled in.</p>
    </div>

    {/* Stream enrolled courses; skeleton grid shows instantly */}
    <Suspense fallback={<CardsSkeletonLayout />}>
      <RenderEnrolledCourses />
    </Suspense>

    {/* Expired Courses Section streamed; shows skeleton + headings first */}
    <Suspense fallback={<ExpiredSectionSkeleton />}>
      <RenderExpiredSection />
    </Suspense>

    {/* Available Courses */}
    <Separator className="my-10" />
    <section className="mt-10">
      <div className="flex flex-col gap-2 mb-5">
        <h2 className="text-3xl font-bold">Available Courses</h2>
        <p className="text-muted-foreground">Here you can view all the courses available for enrollment.</p>
      </div>

      {/* Stream available courses; skeleton grid shows instantly */}
      <Suspense fallback={<CardsSkeletonLayout />}>
        <RenderAvailableCourses />
      </Suspense>
    </section>
    </>
  )
}


// Async child: Enrolled courses
async function RenderEnrolledCourses() {
  const enrolledCourses = await getEnrolledCourses();

  if (enrolledCourses.length === 0) {
    return (
      <EmptyState 
        title="No Enrolled Courses"
        description="You have not enrolled in any courses yet. Start by enrolling in a course to get started."
        buttonText="Enroll in a Course"
        href="/courses"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
      {enrolledCourses.map((enrollment) => (
        <EnrolledCourseCard key={enrollment.course.id} data={enrollment} />
      ))}
    </div>
  );
}


// Async child: Expired section (returns null if none to match prior behavior)
async function RenderExpiredSection() {
  const expiredCourses = await getExpiredCourses();

  if (expiredCourses.length === 0) {
    return null;
  }

  return (
    <>
      <Separator className="my-10" />
      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h2 className="text-3xl font-bold">Expired Courses</h2>
          <p className="text-muted-foreground">
            These courses have expired. Contact support if you need access extended.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expiredCourses.map((enrollment) => (
            <ExpiredCourseCard key={enrollment.id} data={enrollment} />
          ))}
        </div>
      </section>
    </>
  );
}


// Async child: Available courses
async function RenderAvailableCourses() {
  const [courses, enrolledCourses, expiredCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
    getExpiredCourses(),
  ]);

  const available = courses.filter(
    (course) =>
      !enrolledCourses.some(({ course: enrolled }) => enrolled.id === course.id) &&
      !expiredCourses.some((expired) => expired.course.id === course.id)
  );

  if (available.length === 0) {
    return (
      <EmptyState 
        title="No courses available" 
        description="You have already enrolled in all available courses" 
        buttonText="Browse courses" 
        href="/courses"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {available.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}


// General skeleton layout used for enrolled, expired, available sections
function CardsSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton with headings for the expired section to match style
function ExpiredSectionSkeleton() {
  return (
    <>
      <Separator className="my-10" />
      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h2 className="text-3xl font-bold">Expired Courses</h2>
          <p className="text-muted-foreground">
            These courses have expired. Contact support if you need access extended.
          </p>
        </div>
        <CardsSkeletonLayout />
      </section>
    </>
  );
}