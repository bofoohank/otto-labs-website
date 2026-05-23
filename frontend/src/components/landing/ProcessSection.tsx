"use client";

import { motion } from "framer-motion";

import { processSteps } from "@/data/landing";
import { SectionContainer } from "@/components/layout/SectionContainer";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
};

export function ProcessSection() {
  return (
    <SectionContainer id="quytrinh" className="bg-orange-500 text-white">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="mb-12 max-w-3xl"
      >
        <p className="mb-3 text-sm font-black uppercase tracking-[0.25em]">
          Quy trình
        </p>

        <h2 className="text-4xl font-black md:text-6xl">
          4 bước gọn như một đường in đẹp.
        </h2>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-4">
        {processSteps.map((step, index) => (
          <motion.div
            key={step}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{
              duration: 0.45,
              delay: index * 0.1,
            }}
            className="rounded-3xl bg-black p-6 text-white"
          >
            <div className="mb-8 text-6xl font-black text-orange-500">
              0{index + 1}
            </div>

            <h3 className="text-xl font-black">{step}</h3>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}