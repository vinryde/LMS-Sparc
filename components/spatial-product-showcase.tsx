'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import {
  Battery,
  Sliders,
  ChevronRight,
  Trophy,
  ClipboardList,
  Library,
  MessageSquare,
  LucideIcon,
} from 'lucide-react';

// =========================================
// 1. CONFIGURATION & DATA TYPES
// =========================================

export type ProductId = 'left' | 'right';

export interface FeatureMetric {
  label: string;
  value: number; // 0-100
  icon: LucideIcon;
}

export interface ProductData {
  id: ProductId;
  label: string; // Display name for the switcher
  title: string;
  description: string;
  image: string;
  colors: {
    dark: { gradient: string; glow: string; ring: string };
    light: { gradient: string; glow: string; ring: string };
  };
  stats: {
    connectionStatus: string;
    batteryLevel: number;
  };
  features: FeatureMetric[];
}

// Default Data (Easy to Modify Here)
const PRODUCT_DATA: Record<ProductId, ProductData> = {
  left: {
    id: 'left',
    label: 'Energy',
    title: 'Energy Education',
    description:
      'Interactive learning on energy systems, efficiency, and literacy aligned with course modules and classroom tasks.',
    image: 'https://create-lms.t3.storage.dev/energy%20literacy%20(1).png',
    colors: {
      dark: { gradient: 'from-blue-600 to-indigo-900', glow: 'bg-blue-500', ring: 'border-l-blue-500/50' },
      light:{ gradient: 'from-sky-400 to-blue-600', glow: 'bg-sky-500', ring: 'border-l-sky-500/40' },
    },
    stats: { connectionStatus: 'View Course', batteryLevel: 98 },
    features: [
      { label: 'Interactive Quizzes', value: 96, icon: Trophy },
      { label: 'Hands-on Activities', value: 97, icon: ClipboardList },
      { label: 'Curated Resources', value: 95, icon: Library },
      { label: 'Learner Feedback', value: 92, icon: MessageSquare },
    ],
  },
  right: {
    id: 'right',
    label: 'Climate',
    title: 'Climate Science',
    description:
      'Evidence-based climate concepts, mitigation and adaptation with classroom-ready activities and assessments.',
    image: 'https://create-lms.t3.storage.dev/Climate%20Science.png',
    colors: {
      dark: { gradient: 'from-emerald-600 to-teal-900', glow: 'bg-emerald-500', ring: 'border-r-emerald-500/50' },
      light:{ gradient: 'from-emerald-400 to-teal-600', glow: 'bg-emerald-500', ring: 'border-r-emerald-500/40' },
    },
    stats: { connectionStatus: 'View Course', batteryLevel: 96 },
    features: [
      { label: 'Interactive Quizzes', value: 95, icon: Trophy },
      { label: 'Field Activities', value: 98, icon: ClipboardList },
      { label: 'Research Resources', value: 94, icon: Library },
      { label: 'Reflective Feedback', value: 90, icon: MessageSquare },
    ],
  },
};

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

const ANIMATIONS: {
  container: Variants;
  item: Variants;
  image: (isLeft: boolean) => Variants;
} = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
    exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
  },
  image: (isLeft: boolean): Variants => ({
    initial: {
      opacity: 0,
      scale: 1.5,
      filter: 'blur(15px)',
      rotate: isLeft ? -30 : 30,
      x: isLeft ? -80 : 80,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      rotate: 0,
      x: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      filter: 'blur(20px)',
      transition: { duration: 0.25 },
    },
  }),
};

// =========================================
// 3. SUB-COMPONENTS
// =========================================

const BackgroundGradient = ({ isLeft }: { isLeft: boolean }) => (
  <div className=" fixed inset-0 pointer-events-none">
    <motion.div
      animate={{
        background: isLeft
          ? 'radial-gradient(circle at 0% 50%, rgba(59, 130, 246, 0.15), transparent 50%)'
          : 'radial-gradient(circle at 100% 50%, rgba(16, 185, 129, 0.15), transparent 50%)',
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 "
    />
  </div>
);

const ProductVisual = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const colors = isDarkTheme ? data.colors.dark : data.colors.light;
  
  return (
  <motion.div layout="position" className="relative group shrink-0">
    {/* Animated Rings */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className={`absolute inset-[-20%] rounded-full border border-dashed border-white/10 ${colors.ring}`}
    />
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} blur-2xl opacity-40`}
    />
    
    {/* Image Container */}
    <div className="relative h-80 w-80 md:h-[450px] md:w-[450px] rounded-full border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={data.id}
            src={data.image}
            alt={`${data.title}`}
            variants={ANIMATIONS.image(isLeft)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4"
            draggable={false}
          />
        </AnimatePresence>
      </motion.div>
    </div>

    {/* Status Label */}
    <motion.div
      layout="position"
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
    >
      <Link href="/courses" className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-300 bg-zinc-950/80 px-4 py-2 rounded-full border border-white/5 backdrop-blur hover:bg-zinc-900/80 hover:text-white transition-colors">
        <span className={`h-1.5 w-1.5 rounded-full ${colors.glow} animate-pulse`} />
        {data.stats.connectionStatus}
      </Link>
    </motion.div>
  </motion.div>
  );
};

const ProductDetails = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const colors = isDarkTheme ? data.colors.dark : data.colors.light;
  const alignClass = isLeft ? 'items-start text-left' : 'items-end text-right';
  const flexDirClass = isLeft ? 'flex-row' : 'flex-row-reverse';
  const barPosClass = isLeft ? 'left-0' : 'right-0';

  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${alignClass}`}
    >
      <motion.h2 variants={ANIMATIONS.item} className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
        {data.label} Education
      </motion.h2>
      <motion.h1 variants={ANIMATIONS.item} className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-b from-black to-zinc-500 dark:bg-gradient-to-b dark:from-white dark:to-zinc-500 ">
        {data.title}
      </motion.h1>
      <motion.p variants={ANIMATIONS.item} className={`text-zinc-400 mb-8 max-w-sm leading-relaxed text-md ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
        {data.description}
      </motion.p>

      {/* Feature Grid */}
      <motion.div variants={ANIMATIONS.item} className="w-full space-y-6 bg-zinc-900/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
        {data.features.map((feature, idx) => (
          <div key={feature.label} className="group">
            <div className={`flex items-center justify-between mb-3 text-md ${flexDirClass}`}>
              <div className={`flex items-center gap-2`}>
                <div className={`flex size-10 items-center justify-center rounded-full ${isLeft ? 'bg-blue-500/60' : 'bg-emerald-500/40'} shrink-0`}>
                  <feature.icon className={`size-5 ${isLeft ? 'text-blue-100' : 'text-emerald-100'}`} />
                </div>
                <span className={`${feature.value > 50 ? 'text-zinc-100' : 'text-zinc-100'} font-semibold text-md`}>{feature.label}</span>
              </div>
              <span className="font-mono text-xs font-semibold text-zinc-100">{feature.value}%</span>
            </div>
            <div className="relative h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feature.value}%` }}
                transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                className={`absolute top-0 bottom-0 ${barPosClass} ${colors.glow} opacity-80`}
              />
            </div>
          </div>
        ))}

        <div className={`pt-4 flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
          <Link href="/courses" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-200 hover:text-white transition-colors group">
            <Sliders size={14} /> View Courses
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Battery */}
      
    </motion.div>
  );
};

const Switcher = ({ 
  activeId, 
  onToggle 
}: { 
  activeId: ProductId; 
  onToggle: (id: ProductId) => void 
}) => {
  const options = Object.values(PRODUCT_DATA).map(p => ({ id: p.id, label: p.label }));

  return (
    <div className="sticky -bottom-10 inset-x-0 flex justify-center z-50 pointer-events-none">
      <motion.div layout className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            whileTap={{ scale: 0.96 }}
            className="relative w-24 h-12 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none"
          >
            {activeId === opt.id && (
              <motion.div
                layoutId="island-surface"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-white/5 shadow-inner"
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-300 ${activeId === opt.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {opt.label}
            </span>
            {activeId === opt.id && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

// =========================================
// 4. MAIN COMPONENT
// =========================================

export default function EarbudShowcase() {
  const [activeSide, setActiveSide] = useState<ProductId>('left');
  
  const currentData = PRODUCT_DATA[activeSide];
  const isLeft = activeSide === 'left';

  return (
    <div className="relative min-h-screen w-full  dark:text-zinc-100 overflow-hidden selection:bg-zinc-800 flex flex-col items-center justify-center">
      
      <BackgroundGradient isLeft={isLeft} />

      <main className="relative z-10 w-full px-6 py-8 flex flex-col justify-center max-w-7xl mx-auto">
        <motion.div
          layout
          transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
          className={`flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 lg:gap-48 w-full ${
            isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {/* Left Column: Visuals */}
          <ProductVisual data={currentData} isLeft={isLeft} />

          {/* Right Column: Content */}
          <motion.div layout="position" className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <ProductDetails 
                key={activeSide} // Key forces re-render for animation
                data={currentData} 
                isLeft={isLeft} 
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      <Switcher activeId={activeSide} onToggle={setActiveSide} />
    </div>
  );
}