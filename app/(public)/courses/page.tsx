import { getAllCourses } from "@/app/data/course/get-all-courses";
import { PublicCourseCard } from "../_components/PublicCourseCard";

export default function PublicCoursesroute() {
  return (
    <div className="mt-5">
        <div className="flex flex-col space-y-2 mb-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Explore Courses</h1>
      <p className="text-muted-foreground md:text-lg">Discover a world of energy education with our curated selection of courses. Whether you're a student, educator, or simply curious about energy, we have something for everyone.</p>
      </div>
      <RenderCourses/>
    </div>
  );
}

async function RenderCourses(){
    const courses=await getAllCourses();
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {
                courses.map((course)=>(
                    <PublicCourseCard key={course.id} data={course}/>
                ))
            }

        </div>
    )
}