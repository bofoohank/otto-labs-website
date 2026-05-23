"use client";

import { Package } from "lucide-react";

export function ProfileOrdersTab() {
  return (
    <div className="grid min-h-[360px] place-items-center rounded-2xl border border-white/10 bg-black p-6 text-center">
      <div>
        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl bg-white/5 text-neutral-500">
          <Package size={40} />
        </div>

        <p className="text-xl font-black text-white">Chưa có đơn hàng</p>

        <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">
          Các đơn hàng in 3D của bạn sẽ xuất hiện tại đây khi hệ thống đơn hàng
          được kết nối.
        </p>
      </div>
    </div>
  );
}
