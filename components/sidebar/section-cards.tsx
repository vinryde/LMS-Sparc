import {
  IconBook,
} from "@tabler/icons-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookCopy, GraduationCap, Vote } from "lucide-react"
import { getDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats";

export async function SectionCards() {
  const{totalUsers,totalCourses,totalEnrollments,totalLessons}= await getDashboardStats();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Students</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalUsers}
          </CardTitle>
          </div>
          <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-primary"/>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Registered Students on Create</p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Enrolled Students</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalEnrollments}
            </CardTitle>
          </div>
          <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center">
          <Vote className="w-8 h-8 text-primary"/>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Enrolled Students on Create</p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCourses}
            </CardTitle>
          </div>
          <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center">
          <BookCopy className="w-8 h-8 text-primary"/>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Available Courses on Create</p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Lessons and Activities</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalLessons}
            </CardTitle>
          </div>
          <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center">
          <IconBook className="w-8 h-8 text-primary"/>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Available Lessons and Activities on Create</p>
        </CardFooter>
      </Card>

    
    </div>
  )
}
