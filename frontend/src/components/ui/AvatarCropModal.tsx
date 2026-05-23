"use client";

import { useRef, useState } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";

import {
  ImageCropper,
  type ImageCropperHandle,
} from "@/components/ui/image-cropper/ImageCropper";
import { AppButton } from "@/components/ui/AppButton";

type Props = {
  file: File;
  title?: string;
  onCancel: () => void;
  onCrop: (file: File, dataUrl: string) => void;
};

export function AvatarCropModal({
  file,
  title = "Cắt và xoay",
  onCancel,
  onCrop,
}: Props) {
  const cropperRef = useRef<ImageCropperHandle | null>(null);
  const [cropping, setCropping] = useState(false);

  async function handleCrop() {
    setCropping(true);
    const cropped = await cropperRef.current?.crop();
    setCropping(false);

    if (!cropped) return;

    onCrop(cropped.file, cropped.dataUrl);
  }

  return (
    <div className="fixed inset-0 z-[160] grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur">
      <div className="flex max-h-[calc(100dvh-32px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-2xl">
        <div className="grid h-14 shrink-0 grid-cols-[56px_minmax(0,1fr)_56px] items-center border-b border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="grid h-14 w-14 place-items-center text-neutral-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Quay lại"
          >
            <ArrowLeft size={21} />
          </button>

          <h3 className="truncate text-center text-sm font-bold">{title}</h3>

          <button
            type="button"
            className="grid h-14 w-14 place-items-center text-neutral-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Tùy chọn"
          >
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <ImageCropper
            ref={cropperRef}
            file={file}
            aspectRatio={1}
            outputWidth={512}
            outputHeight={512}
            circularGuide
            actions={
              <AppButton
                type="button"
                onClick={handleCrop}
                disabled={cropping}
                loading={cropping}
                variant="pill"
                className="inline-flex items-center justify-center gap-2"
              >
                Tiếp theo
              </AppButton>
            }
          />
        </div>
      </div>
    </div>
  );
}
