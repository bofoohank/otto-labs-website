"use client";

import { Paperclip, SendHorizonal, X } from "lucide-react";
import { getStandaloneImageUrl } from "@/lib/media-url";

type Props = {
  value: string;
  files?: File[];
  mediaUrl?: string;
  loading?: boolean;
  disabled?: boolean;
  allowMedia?: boolean;
  placeholder?: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  dense?: boolean;
  onChange: (value: string) => void;
  onChangeFiles: (files: File[]) => void;
  onClearMediaUrl?: () => void;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
};

export function DiscordComposer({
  value,
  files = [],
  mediaUrl = "",
  loading = false,
  disabled = false,
  allowMedia = true,
  placeholder = "Nhập tin nhắn...",
  fileInputRef,
  dense = false,
  onChange,
  onChangeFiles,
  onClearMediaUrl,
  onSubmit,
}: Props) {
  const typedMediaUrl = allowMedia ? getStandaloneImageUrl(value) : "";
  const previewMediaUrl = mediaUrl || typedMediaUrl;

  function removeFileAt(indexToRemove: number) {
    onChangeFiles(files.filter((_, index) => index !== indexToRemove));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function clearPreviewMediaUrl() {
    if (mediaUrl && onClearMediaUrl) {
      onClearMediaUrl();
      return;
    }

    if (typedMediaUrl) {
      onChange("");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`shrink-0 border-t border-white/10 bg-[#121212] ${dense ? "p-2" : "p-3"}`}
    >
      {allowMedia && (files.length > 0 || previewMediaUrl) && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <span
              key={`${file.name}-${index}`}
              className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-neutral-300"
            >
              <span className="min-w-0 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFileAt(index)}
                className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-neutral-500 transition hover:bg-white/10 hover:text-red-300"
                title="Xoá file"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {previewMediaUrl && (
            <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-neutral-300">
              <span className="min-w-0 truncate">
                Ảnh/GIF: {previewMediaUrl}
              </span>

              {(mediaUrl || typedMediaUrl) && (
                <button
                  type="button"
                  onClick={clearPreviewMediaUrl}
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-neutral-500 transition hover:bg-white/10 hover:text-red-300"
                  title="Xoá ảnh/GIF"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {allowMedia && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              accept=".png,.jpg,.jpeg,.webp,.gif,.stl,.obj,.step,.stp,.3mf,.zip"
              onChange={(e) => {
                onChangeFiles(Array.from(e.target.files || []));
              }}
            />

            <button
              type="button"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className={`${dense ? "h-10 w-10" : "h-11 w-11"} grid shrink-0 place-items-center rounded-xl border border-white/10 text-neutral-300 transition hover:border-orange-500 hover:text-orange-500 disabled:opacity-50`}
            >
              <Paperclip size={20} />
            </button>
          </>
        )}

        <input
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${dense ? "h-10" : "h-11"} min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-orange-500 disabled:opacity-50`}
        />

        <button
          disabled={loading || disabled}
          className={`${dense ? "h-10 w-11" : "h-11 w-12"} grid shrink-0 place-items-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-400 disabled:opacity-60`}
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </form>
  );
}
