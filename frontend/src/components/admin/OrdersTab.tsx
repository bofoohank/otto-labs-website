"use client";

import { Package } from "lucide-react";

import { AdminPanelLayout } from "./AdminPanelLayout";

export function OrdersTab() {
  return (
    <AdminPanelLayout icon={<Package size={24} />} title="Đơn hàng">
      <div className="grid min-h-[420px] place-items-center rounded-2xl border border-white/10 bg-black p-6 text-center">
        <div>
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl bg-white/5 text-neutral-500">
            <Package size={40} />
          </div>

          <p className="text-xl font-black text-white">
            Chưa có dữ liệu đơn hàng
          </p>

          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">
            Danh sách đơn hàng, trạng thái in và thông tin giao hàng sẽ hiển thị
            tại đây khi module đơn hàng được kết nối.
          </p>
        </div>
      </div>
    </AdminPanelLayout>
  );
}
