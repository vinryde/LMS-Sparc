import { Web3HeroSection } from "@/components/web3-hero-section";
import { PointerHighlight } from "@/components/pointer-highlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import EarbudShowcase from "@/components/spatial-product-showcase";
import { Testimonial } from "@/components/design-testimonial"
import FeaturesSectionMinimal from "@/components/bento-monochrome";
import FeaturesSectionMinimalClimate from "@/components/bento-climate";
import { MagicText } from "@/components/ui/magic-text";
import TestimonialSliderDemo from "@/components/DemoFile";
import HeroSectionNew from "@/components/glassmorphism-trust-hero";

export default function Demo(){
  const words= "CREATE (Climate Science Research, Energy Education and Training for Ecological Sustainability) is an innovative online learning platform designed as a comprehensive resource hub for educators teaching energy and climate change. Built as an integrated ecosystem of climate science, energy education, and ecological sustainability, CREATE uniquely structures its content around Energy Literacy and Climate Change Literacy principles. Its modules are aligned with internationally recognized literacy frameworks, ensuring scientific accuracy, conceptual clarity, critical thinking, and action-oriented learning. The platform offers classroom-ready activities, structured lesson plans, and curated teaching resources, integrating environmental data, renewable energy transitions, policy awareness, and community engagement to support meaningful, real-world education and foster climate-informed, responsible citizens."
    return (
         <div className="px-0 space-y-8">
          <HeroSectionNew/>
            <Web3HeroSection />
            <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-9">
            <div className="px-4 mt-16 sm:max-w-4xl md:max-w-none space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter ">How does <span><PointerHighlight>CREATE</PointerHighlight> </span> make a difference?</h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400">
           
            <TextGenerateEffect duration={2} filter={false} words={words} className="text-muted-foreground font-normal text-sm" />

             </p>
          </div>
          <div className="px-4">
            <div 
              className="w-full h-full min-h-[550px] rounded-lg bg-[url(/create_logo.png)] bg-cover bg-center"
              aria-label="CREATE"
            />
          </div>
          </div>
          <div>
          <EarbudShowcase/>
          </div>
          <div>
            <Testimonial />
          </div>
          <FeaturesSectionMinimal/>
          <div className="mx-2 font-semibold md:mx-10">
            <MagicText
          text={
          "CREATE(Climate Science Research, Energy Education and Training for Ecological Sustainability) is an educational initiative committed to building a climate-literate and energy-conscious society. Our core aim is to empower learners, educators, and communities with knowledge, skills, and awareness to address global climate and energy challenges responsibly. Through focused courses in Energy Education and Climate Science, CREATE promotes informed decision-making, innovation, and sustainable action. Guided by the belief that education drives change, CREATE embraces its mottos: Save energy, save the future. Small changes create big impact. Be energy smart, embrace efficiency, choose renewables, and turn off unnecessary lights to protect the future and build responsible, sustainable communities."
        }
        />
          
      </div>
          <FeaturesSectionMinimalClimate/>
          <TestimonialSliderDemo/>

      
    </div>
    )
}