export const theme = {
  input:
    "w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition focus:border-orange-500",

  inputDark:
    "w-full rounded-2xl border border-white/10 bg-neutral-950 px-5 py-4 outline-none transition focus:border-orange-500",

  disabledInput:
    "w-full cursor-not-allowed rounded-2xl border border-white/10 bg-neutral-900 px-5 py-4 text-neutral-500 outline-none",

  button:
    "rounded-2xl bg-orange-500 px-5 py-4 font-black text-white transition hover:bg-orange-400 disabled:opacity-60",

  fullButton:
    "flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-400 disabled:opacity-60",

  outlineButton:
    "rounded-2xl border border-orange-500/30 px-5 py-4 font-black text-orange-500 transition hover:bg-orange-500 hover:text-white",

  pillButton:
    "rounded-full bg-orange-500 px-5 py-2.5 text-sm font-black text-white transition hover:bg-orange-400",

  outlinePill:
    "rounded-full border border-orange-500/30 px-5 py-2.5 text-sm font-black text-orange-500 transition hover:bg-orange-500 hover:text-white",

  card:
    "rounded-[1.5rem] border border-orange-500/20 bg-neutral-950",

  toastCard:
    "flex items-start gap-3 rounded-2xl border border-orange-500/20 bg-[#151515] p-5 shadow-[0_0_45px_rgba(249,115,22,0.18)]",
};

/*Dưới đây là bản đầy đủ AuthModal.tsx đã áp dụng theme.constants.*/
/*Áp dụng theme.input, theme.disabledInput, theme.fullButton, theme.outlineButton vào các phần tương ứng trong AuthModal để đảm bảo tính nhất quán về giao diện và trải nghiệm người dùng. Ví dụ, tất cả các trường input sẽ sử dụng theme.input, các trường input bị disabled sẽ sử dụng theme.disabledInput, nút lưu sẽ sử dụng theme.fullButton và nút xác nhận sẽ sử dụng theme.outlineButton. Điều này sẽ giúp giao diện của bạn trở nên chuyên nghiệp hơn và dễ dàng bảo trì hơn trong tương lai.*/   