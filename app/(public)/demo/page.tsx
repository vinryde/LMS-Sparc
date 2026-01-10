import { Web3HeroSection } from "@/components/web3-hero-section";
import { PointerHighlight } from "@/components/pointer-highlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import EarbudShowcase from "@/components/spatial-product-showcase";
import { Testimonial } from "@/components/design-testimonial"
import FeaturesSectionMinimal from "@/components/bento-monochrome";
import FeaturesSectionMinimalClimate from "@/components/bento-climate";
import { MagicText } from "@/components/ui/magic-text";

export default function Demo(){
  const words= "CREATE transforms education into a tool for climate action and energy awareness. Through research-driven learning, teacher training, and international collaboration, we equip participants with the skills to integrate climate and energy concepts into classrooms, research projects, and community initiatives. Our vision is to create a world where sustainability education inspires innovation, responsibility, and collective action for ecological well-being."
    return (
         <div className="px-0 space-y-8">
            <Web3HeroSection />
            <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-9">
            <div className="px-4 mt-16 sm:max-w-4xl md:max-w-none space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter ">How does <span><PointerHighlight>CREATE</PointerHighlight> </span> make a difference?</h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400">
           
            <TextGenerateEffect duration={2} filter={false} words={words} className="text-muted-foreground font-normal text-sm" />

             </p>
          </div>
          <div className="px-4">
            <img src="/imageone.jpg" alt="CREATE" className="w-full h-auto rounded-lg shadow-lg" />
            
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

      
    </div>
    )
}