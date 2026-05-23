import { SectionContainer } from "@/components/layout/SectionContainer";

export function ContactSection() {
  return (
    <SectionContainer id="lienhe">
      <div className="overflow-hidden rounded-[2rem] border border-orange-500/20 bg-neutral-950">
        <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-orange-500 p-8 text-white md:p-14">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.25em]">
              Liên hệ
            </p>

            <h2 className="text-4xl font-black md:text-5xl">
              Có file rồi? Gửi Otto Labs kiểm tra ngay.
            </h2>

            <p className="mt-5 leading-7">
              Gửi mô tả, kích thước, số lượng và loại vật liệu mong muốn để
              nhận tư vấn chi tiết.
            </p>
          </div>

          <form className="space-y-4 p-6 md:p-10">
            <input
              placeholder="Họ và tên"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition focus:border-orange-500"
            />

            <input
              placeholder="Email hoặc số điện thoại"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition focus:border-orange-500"
            />

            <textarea
              rows={5}
              placeholder="Mô tả sản phẩm cần in"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition focus:border-orange-500"
            />

            <button className="w-full rounded-full bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-400">
              Gửi yêu cầu báo giá
            </button>
          </form>
        </div>
      </div>
    </SectionContainer>
  );
}