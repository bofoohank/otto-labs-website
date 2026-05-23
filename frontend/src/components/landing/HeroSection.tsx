"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 36,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

type Props = {
  onStart: () => void;
};

export function HeroSection({ onStart }: Props) {
  return (
    <section className="relative px-6 pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="absolute left-1/2 top-24 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-orange-600/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{
            duration: 0.7,
          }}
        >
          <p className="mb-5 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">
            Studio in 3D nhỏ, sắc nét và linh hoạt
          </p>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Từ ý tưởng số
            <br />
            đến sản phẩm
            <br />
            <span className="text-orange-500">cầm được trên tay.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-400">
            Chúng tôi in 3D mô hình, prototype, linh kiện và sản phẩm tuỳ chỉnh
            cho cá nhân, maker, designer và doanh nghiệp nhỏ.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={onStart}
              className="rounded-full bg-orange-500 px-8 py-4 font-black text-white transition hover:bg-orange-400"
            >
              Bắt đầu ngay
            </button>

            <a
              href="#dichvu"
              className="rounded-full border border-white/10 px-8 py-4 text-center font-black text-white transition hover:border-orange-500 hover:text-orange-500"
            >
              Xem dịch vụ
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            rotate: 2,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="relative"
        >
          <div className="rounded-[2rem] border border-orange-500/20 bg-neutral-950 p-5 shadow-[0_0_80px_rgba(249,115,22,0.12)]">
            <div className="rounded-[1.5rem] border border-white/10 bg-black p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-black text-white">
                  PRINT READY
                </span>

                <span className="text-sm text-neutral-500">
                  Layer 0.12mm
                </span>
              </div>

              <div className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl border border-orange-500/10 bg-[linear-gradient(to_right,rgba(249,115,22,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(249,115,22,0.08)_1px,transparent_1px)] bg-[size:28px_28px]">
                <motion.div
                  animate={{
                    y: [0, -14, 0],
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="grid h-52 w-52 place-items-center rounded-[2rem] bg-orange-500 text-8xl shadow-[0_0_90px_rgba(249,115,22,0.35)]"
                >
                  🧱
                </motion.div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm font-bold">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  PLA
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  PETG
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  TPU
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}