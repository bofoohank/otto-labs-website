"use client";

import { motion } from "framer-motion";

import { projects } from "@/data/landing";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
};

export function ProjectsSection() {
  return (
    <SectionContainer>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading eyebrow="Ứng dụng" title="Otto Labs có thể in gì?" />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
            }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 to-black p-7"
          >
            <span className="text-sm font-black text-orange-500">
              0{index + 1}
            </span>

            <h3 className="mt-4 text-2xl font-black">{project}</h3>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}