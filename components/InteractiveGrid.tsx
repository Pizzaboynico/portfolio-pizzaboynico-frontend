"use client"; 

import { useState, useEffect } from 'react';
import SanityImageComponent from './SanityImage';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/lib/sanity.client';
import { motion, Variants } from 'framer-motion';
import { X } from 'lucide-react'; 

// Interfaccia Project (copiata da page.tsx)
interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
}

interface InteractiveGridProps {
  projects: Project[];
}

// Animation variants for first-load fade / upward motion
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, when: 'beforeChildren' } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] } },
};

// -------------------------------------------------------------
// Componente Modale per lo Zoom e il Dettaglio
// -------------------------------------------------------------
const ProjectModal = ({ project, onClose }: { project: Project | null, onClose: () => void }) => {
  if (!project) return null;

  return (
    // Sfondo Modale: Fisso, copre tutto e sfoca il background
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/70 overflow-y-auto"
      onClick={onClose} // Cliccando fuori si chiude 
    >
      {/* Contenitore Immagine ingrandita e Dettagli */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Impedisce la chiusura cliccando sull'immagine
      >
        
        {/* Left: description */}
        <div className="modal-desc text-white p-4 sm:p-6">
          {(() => {
            const p = project as any;
            const raw = p?.descrizioneBreve || p?.description;
            if (raw) return <div dangerouslySetInnerHTML={{ __html: raw }} />;

            if (Array.isArray(p?._rawDescrizioneBreve)) {
              const text = p._rawDescrizioneBreve.map((b: any) => (b.children || []).map((c: any) => c.text).join('')).join('\n');
              return <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>;
            }

            return <p className="text-gray-400">No description provided</p>;
          })()}
        </div>

        {/* Center: image */}
        <div className="modal-image-wrap">
          {/* Build URLs for assets when needed */}
          {(() => {
            const builder = imageUrlBuilder(client);
            const urlFor = (src: any) => builder.image(src).url();

            if ((project as any)?.mainVideo) {
              return (
                <video className="modal-img" controls src={urlFor((project as any).mainVideo)} />
              );
            }

            const imgUrl = project?.mainImage ? urlFor(project.mainImage) : null;
            const isGif = imgUrl && imgUrl.toLowerCase().includes('.gif');

            if (isGif && imgUrl) {
              // use native <img> to preserve gif animation
              return (
                <img
                  src={imgUrl}
                  alt={project.title}
                  className="modal-img"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth <= 768) onClose();
                  }}
                />
              );
            }

            return (
              <div onClick={() => { if (typeof window !== 'undefined' && window.innerWidth <= 768) onClose(); }}>
                <SanityImageComponent
                  image={project.mainImage}
                  alt={project.title}
                  sizes="80vw"
                  className="object-contain"
                />
              </div>
            );
          })()}
        </div>

        {/* Right: label */}
        <div className="modal-label text-white">
          <div>
            <div className="text-xs opacity-80">{project?.slug?.current || ''}</div>
            <div className="text-sm tracking-widest uppercase">{project.title}</div>
          </div>
        </div>
        
        {/* Close X removed — use outside click or ESC to close */}
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// Componente Griglia Interattiva Principale
// -------------------------------------------------------------
export default function InteractiveGrid({ projects }: InteractiveGridProps) {
  // Stato per tracciare l'ID del progetto su cui è il mouse (per l'effetto bianco/nero)
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  
  // Stato per la modale: tiene traccia del progetto selezionato
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); 

  const handleMouseEnter = (projectId: string) => {
    setHoveredProjectId(projectId);
  };

  const handleMouseLeave = () => {
    setHoveredProjectId(null);
  };

  const handleProjectClick = (project: Project) => {
    // Quando clicchi: apri la modale
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    // Chiudi la modale
    setSelectedProject(null);
  }

  // Auto highlight via IntersectionObserver on small devices
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

    // Delay observer initialization to wait for animations
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
    <>
      {/* GRIGLIA Responsive */}
      <motion.div
        className="grid gap-8 sm:gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {projects.map((project, index) => {
          
          // Logica Bianco & Nero/Opacità (tutti gli altri diventano opachi/bianco e nero)
          const isDimmed = hoveredProjectId !== null && hoveredProjectId !== project._id;
          
          // Logica Zoom In (solo quando si è sopra)
          const isZoomed = hoveredProjectId === project._id;

          return (
              <motion.div
              key={project._id} 
                variants={itemVariants}
                  className={`grid-item group cursor-pointer transition-all duration-300 ease-in-out ${isDimmed ? 'faded' : ''}`}
                  data-project-id={project._id}
                
              onMouseEnter={() => handleMouseEnter(project._id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleProjectClick(project)}
            >
              {/* Contenitore Immagine (relative è fondamentale per il componente Image) */}
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
                      /* keep the grayscale logic, but force images to fully cover the container */
                      className={`${isDimmed ? 'grayscale' : 'grayscale-0'} object-cover w-full h-full`} 
                    />
                  </div>
                ) : (
                  <span className="text-gray-400 text-lg">IMMAGINE MANCANTE</span>
                )}

              </div>
              
              {/* labels removed from inline grid view — shown only in modal */}
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Inseriamo la Modale. Verrà mostrata solo se selectedProject NON è null */}
      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </>
  );
}

  