import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconBook,
  IconBolt,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Enrolled Students */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Enrolled Students</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            245
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Growing student participation <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Increase in enrollment
          </div>
        </CardFooter>
      </Card>

      {/* Completed Modules */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed Modules</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            780
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +15%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Higher completion rates <IconBook className="size-4" />
          </div>
          <div className="text-muted-foreground">
            More learners are finishing energy literacy courses
          </div>
        </CardFooter>
      </Card>

      {/* Energy Awareness Projects */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Energy Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            132
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +22%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active student-led initiatives <IconBolt className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Sustainability actions expanding in schools
          </div>
        </CardFooter>
      </Card>

      {/* Instructor Engagement */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Instructor Engagement</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            92%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Slight dip in activity <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Encourage teachers to lead more discussions
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
