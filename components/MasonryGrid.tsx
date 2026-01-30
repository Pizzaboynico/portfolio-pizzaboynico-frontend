"use client";

import { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";

const builder = imageUrlBuilder(client);
function urlFor(src: any) {
  return builder.image(src).url();
}

interface Project {
  _id: string;
  title: string;
  year?: string;
  slug?: { current: string };
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) return;

    const media = window.matchMedia('(max-width: 768px)');
    let io: IntersectionObserver | null = null;

    const init = () => {
      if (!media.matches) return;

      const items = document.querySelectorAll('.grid-wrapper .grid-item');

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.85) {
              el.classList.add('in-view');
            } else {
              el.classList.remove('in-view');
            }
          });
        },
        {
          threshold: [0.85, 1]
        }
      );

      items.forEach((it) => io?.observe(it));
    };

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

    if ((media as any).addEventListener) media.addEventListener('change', onChange);
    else (media as any).addListener(onChange);

    return () => {
      clearTimeout(timer);
      if (io) io.disconnect();
      if ((media as any).removeEventListener) media.removeEventListener('change', onChange);
      else (media as any).removeListener(onChange);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  return (
    <>
      {isMobile ? (
        <div className="grid-wrapper">
          {projects.map((project, i) => (
            <Link
              href={project.slug ? '/project/' + project.slug.current : '#'}
              key={project._id}
              style={{ textDecoration: 'none' }}
            >
              <div className="grid-item">
                <img
                  src={urlFor(project.mainImage)}
                  alt={project.title}
                  className="masonry-img"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {projects.map((project, i) => (
            <Link
              href={project.slug ? '/project/' + project.slug.current : '#'}
              key={project._id}
              className="grid-link-desktop"
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                variants={itemVariants}
                className={`grid-item ${hoverIndex !== null && hoverIndex !== i ? "faded" : ""}`}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={urlFor(project.mainImage)}
                  alt={project.title}
                  className="masonry-img"
                  loading="lazy"
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </>
  );
}