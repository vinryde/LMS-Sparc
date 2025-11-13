'use client';
import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

interface BlurTextEffectProps {
  children: string;
  className?: string;
}

export const BlurTextEffect: React.FC<BlurTextEffectProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll('span.word');

    gsap.set(words, { opacity: 0, y: 10, filter: 'blur(8px)' });

    gsap.to(words, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.3,
      ease: 'power2.out',
      stagger: 0.015,
      clearProps: 'filter',
    });
  }, [children]);

  return (
    <span className={`inline-block ${className}`} ref={containerRef}>
      {children.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} className="word inline-block" style={{ marginRight: '0.25em' }}>
          {word}
        </span>
      ))}
    </span>
  );
};