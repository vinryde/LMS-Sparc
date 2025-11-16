'use client';
import { Leaf, Sparkles, UserSearch, Globe2, BatteryCharging, CloudSun } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FeatureCard } from '@/components/grid-feature-cards';

const features = [
  {
    title: 'Sustainability',
    icon: Leaf,
    description: 'Promotes sustainable thinking by integrating climate science and energy literacy into education across multiple disciplines.',
  },
  {
    title: 'Energy Literacy',
    icon: BatteryCharging,
    description: 'Enhances understanding of renewable energy, conservation strategies, and sustainable technologies for future-ready learners and educators.',
  },
  {
  title: 'Climate Education',
  icon: CloudSun,
  description: 'Provides learners with essential climate knowledge, scientific understanding, and practical skills to address environmental challenges responsibly.',
},
  {
    title: 'Research-Driven',
    icon: UserSearch,
    description: 'Builds strong research capacity through climate science studies, interdisciplinary collaboration, and evidence-based educational practices.',
  },
  {
    title: 'Global Collaboration',
    icon: Globe2,
    description: 'Connects international experts and institutions to strengthen climate education, research skills, and innovation worldwide.',
  },
  {
    title: 'Innovation',
    icon: Sparkles,
    description: 'Encourages creative solutions and new pedagogies for addressing climate challenges and advancing sustainable development goals.',
  },
];


export function HomeFeatures() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto w-full max-w-7xl space-y-8 px-4">
				<AnimatedContainer className="mx-auto max-w-5xl text-center">
					<h2 className="text-3xl font-bold  text-balance md:text-4xl lg:text-5xl xl:font-bold">
						Educating for Sustainable Futures
					</h2>
					<p className="text-muted-foreground mt-4 text-sm  text-balance md:text-base ">
					Empowering learners with energy education and climate action skills to build resilient, sustainable, and environmentally conscious communities.
					</p>
				</AnimatedContainer>

				<AnimatedContainer
					delay={0.4}
					className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
				>
					{features.map((feature, i) => (
						<FeatureCard key={i} feature={feature} />
					))}
				</AnimatedContainer>
			</div>
		</section>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
