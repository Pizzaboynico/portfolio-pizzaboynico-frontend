"use client";

import { useState, useEffect } from 'react';
import SanityImageComponent from './SanityImage';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/sanity.client';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

// Interfaccia Project
interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
}

interface InteractiveGridProps {
  projects: Project[];
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, when: 'beforeChildren' } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] } },
};

export default function InteractiveGrid({ projects }: InteractiveGridProps) {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) return;

    const media = window.matchMedia('(max-width: 768px)');
    let io: IntersectionObserver | null = null;

    const init = () => {
      if (!media.matches) return;
      const items = document.querySelectorAll('.grid .grid-item');

      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.85) {
            el.classList.add('in-view');
          } else {
            el.classList.remove('in-view');
          }
        });
      }, {
        threshold: [0.85, 1]
      });

      items.forEach(it => io?.observe(it));
    };

    const timer = setTimeout(() => {
      init();
    }, 500);

    const onChange = () => {
      if (io) { io.disconnect(); io = null; }
      setTimeout(init, 100);
    };

    if ((media as any).addEventListener) media.addEventListener('change', onChange);
    else (media as any).addListener(onChange);

    return () => {
      clearTimeout(timer);
      if (io) io.disconnect();
      if ((media as any).removeEventListener) media.removeEventListener('change', onChange);
      else (media as any).removeListener(onChange);
    };
  }, []);

  return (
    <motion.div
      className="grid gap-8 sm:gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {projects.map((project) => {
        const isDimmed = hoveredProjectId !== null && hoveredProjectId !== project._id;
        const isZoomed = hoveredProjectId === project._id;

        return (
          <Link
            key={project._id}
            href={`/project/${project.slug.current}`}
            style={{ textDecoration: 'none' }}
          >
            <motion.div
              variants={itemVariants}
              className={`grid-item group cursor-pointer transition-all duration-300 ease-in-out ${isDimmed ? 'faded' : ''}`}
              onMouseEnter={() => setHoveredProjectId(project._id)}
              onMouseLeave={() => setHoveredProjectId(null)}
            >
              <div className="w-full aspect-[4/5] bg-gray-800 flex items-center justify-center overflow-hidden rounded-md relative">
                {project.mainImage ? (
                  <div
                    className={`
                      w-full h-full relative transition-transform duration-300 ease-out 
                      ${isZoomed ? 'scale-[1.03]' : 'scale-100'}
                    `}
                  >
                    <SanityImageComponent
                      image={project.mainImage}
                      alt={project.title}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className={`${isDimmed ? 'grayscale' : 'grayscale-0'} object-cover w-full h-full`}
                    />
                  </div>
                ) : (
                  <span className="text-gray-400 text-lg">IMMAGINE MANCANTE</span>
                )}
              </div>
            </motion.div>
          </Link>
        );
      })}
    </motion.div>
  );
}