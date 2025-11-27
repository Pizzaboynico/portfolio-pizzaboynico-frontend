"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProjectModal from "./ProjectModal";
import { useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";

const builder = imageUrlBuilder(client);
function urlFor(src: any) {
    return builder.image(src).url();
}

interface Project {
    _id: string;
    title: string;
    year?: string;
    assetName?: string;
    mainImage: any;
    projectNumber?: number;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function ListView({ projects }: { projects: Project[] }) {
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

    return (
        <>
            <motion.div
                className="list-wrapper"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Header Row */}
                <div className="list-header">
                    <span className="col-id">#</span>
                    <span className="col-title">Project Name</span>
                    <span className="col-asset">Asset Name</span>
                    <span className="col-year">Year</span>
                </div>

                {projects.map((project, i) => (
                    <motion.div
                        key={project._id}
                        variants={itemVariants}
                        className="list-item"
                        onClick={() => openModal(i)}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    >
                        <span className="col-id">
                            {project.projectNumber
                                ? String(project.projectNumber).padStart(2, "0")
                                : String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="col-title">{project.title}</span>
                        <span className="col-asset">
                            {project.assetName || "—"}
                        </span>
                        <span className="col-year">{project.year || "—"}</span>
                    </motion.div>
                ))}
            </motion.div>

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
