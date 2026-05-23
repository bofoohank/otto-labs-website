export function StatsSection() {
  return (
    <section className="border-y border-orange-500/10 bg-orange-500 px-6 py-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 text-center md:grid-cols-3">
        <div>
          <div className="text-4xl font-black">500+</div>
          <p className="font-bold">Mẫu in đã hoàn thiện</p>
        </div>

        <div>
          <div className="text-4xl font-black">24h</div>
          <p className="font-bold">Phản hồi báo giá</p>
        </div>

        <div>
          <div className="text-4xl font-black">6+</div>
          <p className="font-bold">Vật liệu hỗ trợ</p>
        </div>
      </div>
    </section>
  );
}