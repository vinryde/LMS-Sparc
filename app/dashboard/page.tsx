import { EmptyState } from "@/components/general/EmptyState"
import { getAllCourses } from "../data/course/get-all-courses"
import { getEnrolledCourses } from "../data/user/get-enrolled-courses"
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard"
import Link from "next/link"

export default async function DashboardPage(){
  const [courses,enrolledCourses]= await Promise.all([getAllCourses(),getEnrolledCourses()])

  return(
    <>
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold">Enrolled Courses</h1>
      <p className="text-muted-foreground">Here you can view all the courses you have enrolled in.</p>
    </div>

    
    {enrolledCourses.length===0?(
        <EmptyState 
          title="No Enrolled Courses"
          description="You have not enrolled in any courses yet. Start by enrolling in a course to get started."
          buttonText="Enroll in a Course"
          href="/courses"
        />
      ):(<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrolledCourses.map(( {course})=>(
          <Link key={course.id} href={`/dashboard/${course.slug}`}>
           {course.title}
          </Link>
        ))}
      </div>)}
    <section className="mt-10">
      <div className="flex flex-col gap-2 mb-5">
        <h1 className="text-3xl font-bold">Available Courses</h1>
        <p className="text-muted-foreground">Here you can view all the courses available for enrollment.</p>

      </div>
      {courses.filter((course)=>!enrolledCourses.some(( {course: enrolled})=>
      enrolled.id === course.id
      )
      ).length===0 ? (
        <EmptyState title="No courses available" description="You have already enrolled in all available courses" buttonText="Browse courses" href="/courses"/>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {
          courses.filter((course)=>!enrolledCourses.some(( {course: enrolled})=>
      enrolled.id === course.id
      )
      ).map((course)=>(
        <PublicCourseCard key={course.id} data={course} />
      ))
         }
        
        </div>
      )
      
      }
       
    </section>
    </>
  )}
