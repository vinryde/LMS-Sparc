'use client';
import * as React from 'react';
import { EthicalHero } from '@/components/hero-5'; // Adjust path as needed

// --- Demo Data ---

const heroData = {
  title: (
    <>
      Educating Minds
<br />
for a Future Shaped by{' '} 
<br />
<span className="text-primary">Energy and Climate Responsibility</span>
    </>
  ),
  subtitle:
    'Explore our mission to empower learners through climate science and energy education, fostering informed decisions, resilience, and long-term sustainability worldwide',
  ctaLabel: 'Learn More',
  ctaHref: '#',
  features: [
    {
      id: 'deforestation',
      title: 'Energy Literacy',
      imageUrl:
        'https://cdn.pixabay.com/photo/2017/11/22/20/37/windrader-2971447_1280.jpg',
      href: '/courses/Energy-Education',
    },
    {
      id: 'ocean-health',
      title: 'Climate Literacy',
      imageUrl:
        'https://cdn.pixabay.com/photo/2013/03/12/19/13/winter-93001_1280.jpg',
      href: '/courses/Climate-science',
    },
    {
      id: 'animal-welfare',
      title: 'Sustainability',
      imageUrl:
        'https://cdn.pixabay.com/photo/2020/10/10/06/30/plant-5642151_1280.jpg',
      href: '#',
    },
  ],
};

// --- Demo Component ---

export default function EthicalHeroDemo() {
  return (
    <div className="w-full bg-background">
      <EthicalHero
        title={heroData.title}
        subtitle={heroData.subtitle}
        ctaLabel={heroData.ctaLabel}
        ctaHref={heroData.ctaHref}
        features={heroData.features}
      />
    </div>
  );
}