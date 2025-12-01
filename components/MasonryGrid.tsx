"use client";

import { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";
import ProjectModal from "./ProjectModal";
import { motion, AnimatePresence, Variants } from "framer-motion";

const builder = imageUrlBuilder(client);
function urlFor(src: any) {
  return builder.image(src).url();
}

interface Project {
  _id: string;
  title: string;
  year?: string;
  mainImage: any;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

export default function MasonryGrid({ projects }: { projects: Project[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedProject =
    selectedIndex !== null ? projects[selectedIndex] : null;

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const goPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev! > 0 ? prev! - 1 : projects.length - 1
    );
  };

  const goNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev! < projects.length - 1 ? prev! + 1 : 0
    );
  };

  // Automatically light up (activate) images that are fully visible on small screens
  // so users don't need to tap (which blocks scroll). We use an IntersectionObserver
  // with threshold 1.0 to only mark fully visible items.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) return;

    const media = window.matchMedia('(max-width: 768px)');
    let io: IntersectionObserver | null = null;

    const getHeaderHeight = () => {
      try {
        const val = getComputedStyle(document.documentElement).getPropertyValue('--site-header-height');
        return parseInt(val) || 68;
      } catch {
        return 68;
      }
    };

    const init = () => {
      // only run the observer on small screens
      if (!media.matches) return;

      const items = document.querySelectorAll('.grid-wrapper .grid-item');
      console.log('MasonryGrid observer init, found items:', items.length);
      
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            // Activate when at least 70% of item is visible (centered in viewport)
            if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
              console.log('Activating item:', el, 'ratio:', entry.intersectionRatio);
              el.classList.add('in-view');
            } else {
              el.classList.remove('in-view');
            }
          });
        },
        { 
          threshold: [0, 0.3, 0.5, 0.7, 0.9, 1],
          rootMargin: '0px 0px -100px 0px' // Attiva quando item è più centrato
        }
      );

      items.forEach((it) => io?.observe(it));
    };

    // Delay observer initialization to wait for Framer Motion animations
    const timer = setTimeout(() => {
      init();
    }, 500);

    const onChange = () => {
      if (io) {
        io.disconnect();
        io = null;
      }
      setTimeout(init, 100);
    };

    // MediaQueryList supports both addEventListener or addListener depending on browser
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
    <>
      <motion.div
        className="grid-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {projects.map((project, i) => {
          const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
          return (
          <motion.div
            key={project._id}
            variants={itemVariants}
            className={`grid-item ${hoverIndex !== null && hoverIndex !== i ? "faded" : ""
              }`}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => openModal(i)}
            whileHover={{ scale: 1.02 }}
            {...(!isMobile && { whileTap: { scale: 0.98 } })}
          >
            <motion.img
              src={urlFor(project.mainImage)}
              alt={project.title}
              className="masonry-img"
              loading="lazy"
            />

            {/* labels removed from the grid — they'll be shown in the modal */}
          </motion.div>
        );})}
      </motion.div>

      {/* IntersectionObserver logic to auto-highlight images that are fully in view on touch/mobile */}
      {/* Implemented via useEffect so it's properly cleaned up in React */}
      <>
        {/* empty fragment placeholder; observer created in useEffect */}
      </>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={closeModal}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}