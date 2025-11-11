import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Zap, SplinePointer, Earth,BookCheck } from 'lucide-react';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface featureProps {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;

}
const features: featureProps[] =[
  {
    title: "Interactive Energy Learning",
    description: "Bring energy concepts to life with hands-on activities, real-world examples, and engaging classroom discussions that inspire curiosity and critical thinking.",
    icon: Zap,
  },
  {
    title: "Complete Instructor Toolkit",
    description: "Access ready-to-use lesson plans, worksheets, tracking tools, and presentation slides designed to simplify teaching and maximize student engagement.",
    icon: SplinePointer,
  },
  {
    title: "Global & Local Relevance",
    description: "Developed with international expertise and tailored for local contexts, CREATE bridges global research with community-based action for sustainability.",
    icon: Earth,
  },
  {
    title: "Recognition & Growth for Educators",
    description: "Earn certifications, join professional learning networks, and gain recognition as a leader in advancing energy literacy and sustainable education.",
    icon: BookCheck,
  },
]

export default function Home() {
  

  return (
    <>
    <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8 justify-center">
            <Badge variant={"outline"}>
                Energy Education, Simplified!
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight ">
            <span className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-br from-blue-300 to-gray-400 bg-clip-text text-transparent">CREATE</span> <br />
             
            </h1>
            <p className="lg:max-w-3xl md:max-w-lg text-muted-foreground md:text-xl">
              Energy Literacy for a Sustainable Future. We offer engaging, science-based modules that make energy literacy simple, practical, and inspiring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link className= {buttonVariants({
                  size: "lg",

                }

                )} href="/courses"> Explore Courses </Link>

                <Link className= {buttonVariants({
                  size: "lg",
                  variant: "outline",

                }

                )}href="./login"> Sign In </Link>

              </div>
            
        </div>
        
    </section>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 sm:px-6 md:px-0 *:data-[slot=card]:from-primary/5 
                   *:data-[slot=card]:to-card 
                   dark:*:data-[slot=card]:bg-card 
                   *:data-[slot=card]:bg-gradient-to-t 
                   *:data-[slot=card]:shadow-xs">
     {features.map((feature,index)=>(
      <Card key={index} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="mb-4"> <feature.icon className="h-8 w-8 text-green-600" /> </div>
         <CardTitle>{feature.title}</CardTitle>
         <CardContent className="p-0">
          <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </CardHeader>

      </Card>

     ))}

    </section>
    </>
  );
}
