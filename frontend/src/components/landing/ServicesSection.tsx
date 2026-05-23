"use client";

import { motion } from "framer-motion";

import { services } from "@/data/landing";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
};

export function ServicesSection() {
  return (
    <SectionContainer id="dichvu">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading
          eyebrow="Dịch vụ"
          title="Từ file số đến sản phẩm thật."
        />
      </motion.div>

      <div className="grid gap-5 md:grid-cols-4">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            whileHover={{ y: -10 }}
            className="rounded-3xl border border-white/10 bg-neutral-950 p-6 transition hover:border-orange-500/60"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-xl font-black text-white">
              {index + 1}
            </div>

            <h3 className="text-xl font-black">{service.title}</h3>

            <p className="mt-4 text-sm leading-6 text-neutral-400">
              {service.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}