import * as React from "react";
import { TestimonialSlider } from "@/components/testimonial-slider-1";

// 1. Define the review data
const reviews = [
  {
    id: 1,
    name: "Energy Education",
    affiliation: "Course One",
    quote:
      "This course introduces energy systems, sustainability concepts, and practical energy literacy skills to support informed decision-making and climate responsibility. Click learn more to view the course.",
    // Image from the provided screenshot
    imageSrc:
      "https://create-lms.t3.storage.dev/Course%201%20eneregy%20(592%20x%20672%20px)%20(2).png",
    thumbnailSrc:
      "https://create-lms.t3.storage.dev/Course%201%20eneregy%20(592%20x%20672%20px)%20(2).png",
    link: "/courses/Energy-Education",
  },
  {
    id: 2,
    name: "Climate Education",
    affiliation: "Course Two",
    quote:
      "This course covers climate change fundamentals, renewable energy technologies, and the role of individuals and communities in mitigating climate impacts. Click learn more to view the course.",
    // Image from the provided screenshot
    imageSrc:
      "https://create-lms.t3.storage.dev/Course%202%20climate%20(592%20x%20672%20px).png",
    thumbnailSrc:
      "https://create-lms.t3.storage.dev/Course%202%20climate%20(592%20x%20672%20px).png",
    link: "/courses/Climate-science",
  },
 
];

// 2. Render the component with the data
export default function TestimonialSliderDemo() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 space-y-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-balance md:text-4xl lg:text-5xl xl:font-bold">
            Discover our climate and energy courses
          </h2>
          <p className="text-muted-foreground mt-4 text-sm text-center mx-auto md:text-base max-w-3xl">
            Explore structured learning paths in energy literacy and climate science designed to help learners build practical, future-ready skills.
          </p>
        </div>
        <div className="w-full">
          <TestimonialSlider reviews={reviews} />
        </div>
      </div>
    </section>
  );
}