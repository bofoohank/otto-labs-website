"use client";

import { motion } from "framer-motion";

import { faqs } from "@/data/landing";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
};

export function FAQSection() {
  return (
    <SectionContainer id="faq" innerClassName="mx-auto max-w-4xl">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading eyebrow="FAQ" title="Câu hỏi thường gặp" centered />
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.q}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
            }}
            className="rounded-3xl border border-white/10 bg-neutral-950 p-6"
          >
            <h3 className="text-lg font-black text-orange-500">{faq.q}</h3>

            <p className="mt-3 leading-7 text-neutral-400">{faq.a}</p>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}