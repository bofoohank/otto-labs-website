"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminPanelLayout } from "./AdminPanelLayout";
import { AppFilter } from "@/components/ui/AppFilter";

import {
  ArrowDown,
  ArrowUp,
  Bot,
  Loader2,
  Paperclip,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  AdminKeywordReply,
  BotSetting,
  BotSuggestion,
  KeywordReply,
} from "@/types/admin";

type SetupTab = "bot" | "chat" | "web";

const setupFilterItems = [
  { label: "Bot", value: "bot" },
  { label: "Chat", value: "chat" },
  { label: "Web", value: "web" },
] satisfies { label: string; value: SetupTab }[];

type Props = {
  botSetting: BotSetting;
  savingBot: boolean;
  onChangeBotSetting: (setting: BotSetting) => void;
  onSave: () => void;
  onChooseAvatar: () => void;
  onUploadKeywordMedia: (
    target: "bot" | "admin",
    index: number,
    file: File,
  ) => void;
};

export function BotSettingsTab({
  botSetting,
  savingBot,
  onChangeBotSetting,
  onSave,
  onChooseAvatar,
  onUploadKeywordMedia,
}: Props) {
  const [setupTab, setSetupTab] = useState<SetupTab>("bot");

  function patchBotSetting(patch: Partial<BotSetting>) {
    onChangeBotSetting({
      ...botSetting,
      ...patch,
    });
  }

  function addBotSuggestion() {
    patchBotSetting({
      suggestions: [{ label: "", message: "" }, ...botSetting.suggestions],
      keywordReplies: [
        { keyword: "", reply: "", mediaUrl: "" },
        ...botSetting.keywordReplies,
      ],
    });
  }

  function updateBotSuggestion(index: number, patch: Partial<BotSuggestion>) {
    const nextSuggestions = botSetting.suggestions.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item,
    );

    patchBotSetting({
      suggestions: nextSuggestions,
      keywordReplies:
        patch.label === undefined
          ? botSetting.keywordReplies
          : botSetting.keywordReplies.map((item, itemIndex) =>
              itemIndex === index
                ? {
                    ...item,
                    keyword: patch.label || "",
                  }
                : item,
            ),
    });
  }

  function moveBotSuggestion(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= botSetting.suggestions.length) return;

    const suggestions = [...botSetting.suggestions];

    [suggestions[index], suggestions[nextIndex]] = [
      suggestions[nextIndex],
      suggestions[index],
    ];

    patchBotSetting({ suggestions });
  }

  function removeBotSuggestion(index: number) {
    patchBotSetting({
      suggestions: botSetting.suggestions.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
      keywordReplies: botSetting.keywordReplies.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });
  }

  function updateKeywordReply(index: number, patch: Partial<KeywordReply>) {
    patchBotSetting({
      keywordReplies: botSetting.keywordReplies.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  }

  function addAdminKeywordReply() {
    patchBotSetting({
      adminKeywordReplies: [
        { keyword: "", reply: "", mediaUrl: "" },
        ...botSetting.adminKeywordReplies,
      ],
    });
  }

  function updateAdminKeywordReply(
    index: number,
    patch: Partial<AdminKeywordReply>,
  ) {
    patchBotSetting({
      adminKeywordReplies: botSetting.adminKeywordReplies.map(
        (item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  }

  function moveAdminKeywordReply(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= botSetting.adminKeywordReplies.length) {
      return;
    }

    const adminKeywordReplies = [...botSetting.adminKeywordReplies];

    [adminKeywordReplies[index], adminKeywordReplies[nextIndex]] = [
      adminKeywordReplies[nextIndex],
      adminKeywordReplies[index],
    ];

    patchBotSetting({ adminKeywordReplies });
  }

  function removeAdminKeywordReply(index: number) {
    patchBotSetting({
      adminKeywordReplies: botSetting.adminKeywordReplies.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });
  }

  return (
    <AdminPanelLayout
        icon={<Bot size={24} />}
        title="Setup"
        actions={
          <div className="grid w-full grid-cols-[1fr_150px_150px] items-center gap-2">
            <div />
            <button
              type="button"
              onClick={onSave}
              disabled={savingBot}
              className="flex h-11 w-full items-center justify-center whitespace-nowrap rounded-xl bg-orange-500 px-5 text-sm font-black text-white transition hover:bg-orange-400 disabled:opacity-60"
            >
              {savingBot && <Loader2 className="mr-2 animate-spin" size={18} />}
              Lưu setup bot
            </button>
            <AppFilter<SetupTab>
              value={setupTab}
              items={setupFilterItems}
              onChange={setSetupTab}
            />
          </div>
        }
      >
        <div className="rounded-2xl border border-white/10 bg-black p-4">
          {setupTab === "bot" ? (
            <div className="grid gap-4 xl:grid-cols-[140px_minmax(260px,0.8fr)_1fr]">
              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <label className="mb-3 block text-sm font-black text-neutral-400">
                  Ảnh
                </label>

                <button
                  type="button"
                  onClick={onChooseAvatar}
                  className="group relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500 text-3xl font-black text-white"
                >
                  {botSetting.avatar ? (
                    <Image
                      src={botSetting.avatar}
                      alt="Bot Avatar"
                      fill
                      sizes="108px"
                      unoptimized
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    botSetting.botName.charAt(0)
                  )}

                  <span className="absolute inset-0 grid place-items-center bg-black/55 text-xs font-black opacity-0 transition group-hover:opacity-100">
                    Đổi ảnh
                  </span>
                </button>

              </div>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <div>
                  <label className="mb-2 block text-sm font-black text-neutral-400">
                    Tên bot
                  </label>

                  <input
                    value={botSetting.botName}
                    onChange={(e) =>
                      patchBotSetting({
                        botName: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-neutral-400">
                    Delay bot trả lời (s)
                  </label>

                  <input
                    type="number"
                    min={0}
                    max={300}
                    value={botSetting.delaySeconds}
                    onChange={(e) =>
                      patchBotSetting({
                        delaySeconds: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
                  />
                </div>

                <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-black px-4 py-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-black">Trả lời tự động</h3>
                    <p className="mt-1 truncate text-xs text-neutral-400">
                      Bot trả lời khi ticket chưa có người nhận xử lý.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      patchBotSetting({
                        enabled: !botSetting.enabled,
                      })
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
                      botSetting.enabled
                        ? "bg-orange-500 text-white"
                        : "bg-white/10 text-neutral-400"
                    }`}
                  >
                    {botSetting.enabled ? "Bật" : "Tắt"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <label className="mb-2 block text-sm font-black text-neutral-400">
                  Nội dung trả lời tự động
                </label>

                <textarea
                  rows={8}
                  value={botSetting.fallbackMessage}
                  onChange={(e) =>
                    patchBotSetting({
                      fallbackMessage: e.target.value,
                    })
                  }
                  className="h-[calc(100%-28px)] min-h-44 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>
            </div>
          ) : setupTab === "chat" ? (
            <div className="space-y-4">
              <BotSuggestionsEditor
                suggestions={botSetting.suggestions}
                onAdd={addBotSuggestion}
                onUpdate={updateBotSuggestion}
                onMove={moveBotSuggestion}
                onRemove={removeBotSuggestion}
              />

              <KeywordRepliesEditor
                title="Từ khoá của Admin"
                addLabel="Thêm từ khoá Admin"
                replies={botSetting.adminKeywordReplies}
                replyPlaceholder="Nội dung phản hồi"
                onAdd={addAdminKeywordReply}
                onUpdate={updateAdminKeywordReply}
                onMove={moveAdminKeywordReply}
                onRemove={removeAdminKeywordReply}
                onUpload={(index, file) =>
                  onUploadKeywordMedia("admin", index, file)
                }
              />

              <BotKeywordRepliesEditor
                customerKeywords={botSetting.suggestions}
                replies={botSetting.keywordReplies}
                onUpdate={updateKeywordReply}
                onUpload={(index, file) =>
                  onUploadKeywordMedia("bot", index, file)
                }
              />
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <h3 className="text-lg font-black">Chat ngay</h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Kiểm soát quyền gửi media của người dùng trên widget chat.
                </p>

                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black px-4 py-3">
                  <div>
                    <p className="text-sm font-black text-white">
                      Chặn gửi ảnh, file và link GIF
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Bật để người dùng chỉ gửi nội dung chữ.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      patchBotSetting({
                        allowCustomerMedia: !botSetting.allowCustomerMedia,
                      })
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
                      !botSetting.allowCustomerMedia
                        ? "bg-orange-500 text-white"
                        : "bg-white/10 text-neutral-400"
                    }`}
                  >
                    {!botSetting.allowCustomerMedia ? "Bật" : "Tắt"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </AdminPanelLayout>
  );
}

type BotSuggestionsEditorProps = {
  suggestions: BotSuggestion[];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<BotSuggestion>) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
};

function BotSuggestionsEditor({
  suggestions,
  onAdd,
  onUpdate,
  onMove,
  onRemove,
}: BotSuggestionsEditorProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm font-black text-neutral-400">
          Từ khoá của khách
        </label>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 px-4 py-2 text-sm font-black text-orange-500 transition hover:bg-orange-500 hover:text-white"
        >
          <Plus size={16} />
          Thêm gợi ý
        </button>
      </div>

      <div className="space-y-3">
        {suggestions.map((item, index) => (
          <div
            key={item._id || index}
            className="grid gap-3 rounded-xl border border-white/10 bg-black p-3 xl:grid-cols-[220px_1fr_auto]"
          >
            <input
              placeholder="Nhãn nút"
              value={item.label}
              onChange={(e) =>
                onUpdate(index, {
                  label: e.target.value,
                })
              }
              className="rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
            />

            <input
              placeholder="Tin nhắn sẽ gửi"
              value={item.message}
              onChange={(e) =>
                onUpdate(index, {
                  message: e.target.value,
                })
              }
              className="rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
            />

            <MoveRemoveButtons
              index={index}
              total={suggestions.length}
              onMove={onMove}
              onRemove={onRemove}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type BotKeywordRepliesEditorProps = {
  customerKeywords: BotSuggestion[];
  replies: KeywordReply[];
  onUpdate: (index: number, patch: Partial<KeywordReply>) => void;
  onUpload: (index: number, file: File) => void;
};

function BotKeywordRepliesEditor({
  customerKeywords,
  replies,
  onUpdate,
  onUpload,
}: BotKeywordRepliesEditorProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm font-black text-neutral-400">
          Từ khoá của Bot
        </label>
      </div>

      <div className="space-y-3">
        {customerKeywords.map((customerKeyword, index) => {
          const item = replies[index] || {
            keyword: customerKeyword.label,
            reply: "",
            mediaUrl: "",
          };

          return (
            <div
              key={customerKeyword._id || index}
              className="grid gap-3 rounded-xl border border-white/10 bg-black p-3 xl:grid-cols-[220px_1fr_320px_64px]"
            >
              <input
                value={customerKeyword.label}
                disabled
                className="rounded-xl border border-white/10 bg-black px-4 py-3 text-neutral-400 outline-none"
              />

              <input
                placeholder="Nội dung Bot trả lời"
                value={item.reply}
                onChange={(e) =>
                  onUpdate(index, {
                    keyword: customerKeyword.label,
                    reply: e.target.value,
                  })
                }
                className="rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
              />

              <MediaUrlInput
                value={item.mediaUrl || ""}
                onChange={(value) =>
                  onUpdate(index, {
                    keyword: customerKeyword.label,
                    mediaUrl: value,
                  })
                }
              />

              <label
                aria-label="Upload ảnh/GIF"
                title="Upload ảnh/GIF"
                className="grid h-12 cursor-pointer place-items-center rounded-xl border border-white/10 text-neutral-400 transition hover:border-orange-500 hover:text-orange-500"
              >
                <Paperclip size={18} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      onUpload(index, file);
                    }

                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type KeywordRepliesEditorProps<T extends KeywordReply | AdminKeywordReply> = {
  title: string;
  addLabel: string;
  replies: T[];
  replyPlaceholder?: string;
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<T>) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
  onUpload: (index: number, file: File) => void;
};

function KeywordRepliesEditor<T extends KeywordReply | AdminKeywordReply>({
  title,
  addLabel,
  replies,
  replyPlaceholder = "Nội dung trả lời",
  onAdd,
  onUpdate,
  onMove,
  onRemove,
  onUpload,
}: KeywordRepliesEditorProps<T>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm font-black text-neutral-400">{title}</label>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 px-4 py-2 text-sm font-black text-orange-500 transition hover:bg-orange-500 hover:text-white"
        >
          <Plus size={16} />
          {addLabel}
        </button>
      </div>

      <div className="space-y-3">
        {replies.map((item, index) => (
          <div
            key={item._id || index}
            className="grid gap-3 rounded-xl border border-white/10 bg-black p-3 xl:grid-cols-[220px_1fr_320px_auto]"
          >
            <input
              placeholder="Từ khoá"
              value={item.keyword}
              onChange={(e) =>
                onUpdate(index, {
                  keyword: e.target.value,
                } as Partial<T>)
              }
              className="rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
            />

            <input
              placeholder={replyPlaceholder}
              value={item.reply}
              onChange={(e) =>
                onUpdate(index, {
                  reply: e.target.value,
                } as Partial<T>)
              }
              className="rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
            />

            <MediaUrlInput
              value={item.mediaUrl || ""}
              onChange={(value) =>
                onUpdate(index, {
                  mediaUrl: value,
                } as Partial<T>)
              }
            />

            <KeywordActionButtons
              index={index}
              total={replies.length}
              onUpload={(file) => onUpload(index, file)}
              onMoveUp={() => onMove(index, -1)}
              onMoveDown={() => onMove(index, 1)}
              onRemove={() => onRemove(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type MediaUrlInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function MediaUrlInput({ value, onChange }: MediaUrlInputProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_72px]">
      <input
        placeholder="Link ảnh/GIF"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
      />

      <div className="relative grid h-12 place-items-center overflow-hidden rounded-xl border border-white/10 bg-black text-[10px] font-black text-neutral-600">
        {value ? (
          <Image
            src={value}
            alt=""
            fill
            sizes="72px"
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          "Preview"
        )}
      </div>
    </div>
  );
}

type MoveRemoveButtonsProps = {
  index: number;
  total: number;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
};

function MoveRemoveButtons({
  index,
  total,
  onMove,
  onRemove,
}: MoveRemoveButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index, -1)}
        className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 text-neutral-400 transition hover:border-orange-500 hover:text-orange-500 disabled:opacity-35"
      >
        <ArrowUp size={18} />
      </button>

      <button
        type="button"
        disabled={index === total - 1}
        onClick={() => onMove(index, 1)}
        className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 text-neutral-400 transition hover:border-orange-500 hover:text-orange-500 disabled:opacity-35"
      >
        <ArrowDown size={18} />
      </button>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="grid h-12 w-12 place-items-center rounded-xl border border-red-500/30 text-red-400 transition hover:bg-red-500 hover:text-white"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

type KeywordActionButtonsProps = {
  index: number;
  total: number;
  onUpload: (file: File) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

function KeywordActionButtons({
  index,
  total,
  onUpload,
  onMoveUp,
  onMoveDown,
  onRemove,
}: KeywordActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <label
        aria-label="Upload ảnh/GIF"
        title="Upload ảnh/GIF"
        className="grid h-12 w-12 cursor-pointer place-items-center rounded-xl border border-white/10 text-neutral-400 transition hover:border-orange-500 hover:text-orange-500"
      >
        <Paperclip size={18} />

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              onUpload(file);
            }

            e.target.value = "";
          }}
        />
      </label>

      <button
        type="button"
        disabled={index === 0}
        onClick={onMoveUp}
        className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 text-neutral-400 transition hover:border-orange-500 hover:text-orange-500 disabled:opacity-35"
      >
        <ArrowUp size={18} />
      </button>

      <button
        type="button"
        disabled={index === total - 1}
        onClick={onMoveDown}
        className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 text-neutral-400 transition hover:border-orange-500 hover:text-orange-500 disabled:opacity-35"
      >
        <ArrowDown size={18} />
      </button>

      <button
        type="button"
        onClick={onRemove}
        className="grid h-12 w-12 place-items-center rounded-xl border border-red-500/30 text-red-400 transition hover:bg-red-500 hover:text-white"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
