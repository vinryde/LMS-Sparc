import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Play, 
  Target, 
  Crown, 
  Leaf,
  Zap,
} from "lucide-react";

// --- MOCK BRANDS ---
const CLIENTS = [
  { name: "ku", logo: "/ku.png" },
  { name: "Sparc", logo: "/sparc.png" },
  { name: "Command+Z", logo: "/southampton.png" },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
  </div>
);

// --- MAIN COMPONENT ---
export default function HeroSectionNew() {
  return (
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden font-sans">
      {/* 
        SCOPED ANIMATIONS 
      */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite; /* Slower for readability */
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Background Image with Gradient Mask */}
      <div 
        className="absolute inset-0 z-0 bg-[url(/newhero.jpg)] bg-cover bg-center opacity-70"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 80%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 pt-8">
            
            {/* Badge */}
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
                <span className="text-[11px] sm:text-xs capitalize tracking-wider text-zinc-300 flex items-center gap-2">
                  Education For Sustainable Futures
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 
              className="animate-fade-in delay-200 text-4xl sm:text-4xl lg:text-6xl xl:text-6xl font-medium tracking-tighter leading-[1.1]"
              style={{
                maskImage: "linear-gradient(180deg, black 0%, black 100%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 100%, transparent 100%)"
              }}
            >
              Climate Science Research,<br />
              
               Energy Education and Training for Ecological Sustainability
            </h1>

            {/* Description */}
            <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-200 leading-relaxed">
             CREATE empowers learners through energy education and climate science, building knowledge, responsibility, and action for a resilient, sustainable planet.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
              <Link href="/courses">
              <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]">
                View Courses
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              </Link>
              
              <Link href="/login">
              <button className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20">
                <Play className="w-4 h-4 fill-current" />
                Login
              </button>
              </Link>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-5 space-y-6 lg:mt-12">
            
            {/* Stats Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-white">250+</div>
                    <div className="text-sm text-zinc-400">Activities</div>
                  </div>
                </div>

               {/* Progress Bar Section */}
               {/* 
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Client Satisfaction</span>
                    <span className="text-white font-medium">98%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-white to-zinc-400" />
                  </div>
                </div>
                */}
                

                <div className="h-px w-full bg-white/10 mb-6" />

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatItem value="10+" label="Modules" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="300+" label="Resources" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="2" label="Courses" />
                </div>

                {/* Tag Pills */}
                <div className="mt-8 flex flex-wrap justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    Energy Literacy 
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <Leaf className="w-3 h-3 text-green-500" />
                    Climate Science
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">In Collaboration With</h3>
              
              <div 
                className="relative flex overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                }}
              >
                <div className="animate-marquee flex gap-16 whitespace-nowrap px-4">
                  {/* Triple list for seamless loop */}
                  {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-center w-24 h-12 opacity-50 transition-all hover:opacity-100 hover:scale-110 cursor-default grayscale hover:grayscale-0"
                    >
                      {/* Brand Logo Image */}
                      <img 
                        src={client.logo} 
                        alt={client.name} 
                        className="max-w-full max-h-full object-contain brightness-0 invert" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}