import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Leaf,
  BatteryCharging,
  CloudSun,
  Users,
  Globe2,
  BookOpenCheck,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto w-full space-y-16">
        {/* Hero: Intro + Mission & Vision */}
        <section className="min-h-[80vh] flex flex-col justify-center">
          <div className="space-y-12 max-w-6xl mx-auto">
            <div className="space-y-6 text-center max-w-4xl mx-auto">
              <Badge variant="outline">About CREATE</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Climate & Energy Education for a Sustainable Future
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                CREATE is a learning initiative focused on climate science, energy
                literacy, and sustainability education. We help educators, students,
                and communities understand how energy systems and climate action are
                interconnected, so they can make informed decisions and lead change
                in their own contexts.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="size-5 text-emerald-600" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm md:text-base text-muted-foreground space-y-3">
                  <p>
                    Our mission is to make climate and energy education accessible,
                    research-informed, and action-oriented. We design learning
                    experiences that translate complex science into practical
                    understanding for classrooms, campuses, and communities.
                  </p>
                  <p>
                    Through structured courses, interactive activities, and
                    reflective learning, we support learners in developing the
                    skills, mindsets, and confidence needed to respond to the
                    climate crisis.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudSun className="size-5 text-sky-600" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm md:text-base text-muted-foreground space-y-3">
                  <p>
                    We envision a world where climate and energy concepts are part
                    of everyday learning, decision-making, and leadership. In this
                    world, learners understand how their choices connect to global
                    systems and feel empowered to act with responsibility and care.
                  </p>
                  <p>
                    CREATE aims to be a bridge between climate science, energy
                    research, and real-world practice in education.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What we focus on */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              What we focus on
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Our courses and resources are structured around three core
              strands that work together to build climate and energy literacy.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                    <BatteryCharging className="size-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base">Energy Literacy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Learners explore how energy is produced, distributed, and
                  used, and what it means to transition to cleaner, more
                  efficient systems.
                </p>
                <p>
                  Topics include energy efficiency, renewable technologies, and
                  everyday energy choices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-sky-500/10">
                    <CloudSun className="size-5 text-sky-600" />
                  </div>
                  <CardTitle className="text-base">Climate Science</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  We break down the science of climate change, from basic
                  concepts like the greenhouse effect to impacts, risks, and
                  adaptation.
                </p>
                <p>
                  The goal is to help learners connect global climate trends to
                  local realities and lived experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10">
                    <BookOpenCheck className="size-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-base">Teaching & Practice</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Our learning design emphasizes classroom-ready tools:
                  resources, activities, assessments, and reflective prompts for
                  both educators and learners.
                </p>
                <p>
                  We focus on what it takes to integrate climate and energy
                  topics into existing subjects and programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Who we work with */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Who we work with
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              CREATE is built for people who want to make climate and energy
              education part of their everyday work and learning.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5 text-violet-600" />
                  Educators & Institutions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Teachers, faculty, and program coordinators use CREATE to
                  design modules, units, and co-curricular activities focused on
                  sustainability, energy, and climate action.
                </p>
                <p>
                  We support both individual educators and institutional
                  initiatives that want to deepen climate and energy learning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe2 className="size-5 text-indigo-600" />
                  Learners & Communities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Students, youth groups, and community organizations use our
                  courses to build foundational knowledge and explore practical
                  actions they can take where they live, learn, and work.
                </p>
                <p>
                  Our aim is to help learners see themselves as active
                  participants in climate solutions, not just observers of the
                  problem.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How learning works */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              How learning works on CREATE
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Each course combines core content with activities, interactive
              assessments, and reflection to make learning concrete and
              meaningful.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Structured modules</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Lessons are organized into short, focused modules that you can
                complete at your own pace, with clear learning outcomes and
                supporting resources.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Interactive activities</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Activities, resources, and interactive elements help learners
                apply ideas to real-world scenarios and local contexts.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reflection & assessment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Quizzes, feedback prompts, and reflection questions support
                deeper understanding and help track learning over time.
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}