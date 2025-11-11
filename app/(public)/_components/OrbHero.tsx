"use client";

import Orb from "@/components/Orb";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function OrbHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20">
      {/* ORB BACKGROUND */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-visible">
        <div className="aspect-square w-[180vw]  sm:w-[180vw] md:w-[100vw] lg:w-[80vw] h-[120vh]">
          <Orb hue={0} hoverIntensity={0.5} rotateOnHover forceHoverState={false} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 md:px-4 xs:p-20">
        <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1">
          Energy Education, Simplified!
        </Badge>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          <span className="text-5xl sm:text-7xl md:text-8xl font-bold text-gray-700 dark:text-gray-400">
            CREATE
          </span>
        </h1>

        <p className="max-w-xs sm:max-w-md md:max-w-xl text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Energy Literacy for a Sustainable Future. We offer engaging, science-based modules that make energy literacy simple, practical, and inspiring.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Link
            className={buttonVariants({ size: "sm" }) + " sm:size-md md:size-lg"}
            href="/courses"
          >
            Explore Courses
          </Link>

          <Link
            className={buttonVariants({ size: "sm", variant: "outline" }) + " sm:size-md md:size-lg"}
            href="/login"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
