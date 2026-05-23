"use client";

import { motion } from "framer-motion";

import { materials } from "@/data/landing";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
};

export function MaterialsSection() {
  return (
    <SectionContainer
      id="vatlieu"
      className="bg-neutral-950"
      innerClassName="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.85fr_1.15fr]"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading
          eyebrow="Vật liệu"
          title="Chọn đúng vật liệu, bản in sẽ biết “nói chuyện”."
          className="mb-0"
        />

        <p className="mt-5 text-neutral-400">
          Otto Labs tư vấn loại nhựa theo độ bền, độ dẻo, nhiệt độ sử dụng và
          mục đích hoàn thiện.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {materials.map((material, index) => (
          <motion.div
            key={material}
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
            }}
            className="rounded-3xl border border-orange-500/10 bg-black p-6"
          >
            <h3 className="text-2xl font-black text-orange-500">
              {material}
            </h3>

            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Phù hợp cho nhiều mục đích từ mô hình trưng bày đến sản phẩm thử
              nghiệm và chi tiết sử dụng thực tế.
            </p>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}