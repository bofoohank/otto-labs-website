"use client";

import Image from "next/image";
import { Paperclip } from "lucide-react";

import { API_URL } from "@/lib/api";
import type { Attachment } from "@/types/chat";

type Props = {
  attachments?: Attachment[];
};

function getAttachmentUrl(url: string) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_URL}${url}`;
}

function isImageAttachment(file: Attachment) {
  return file.mimeType?.startsWith("image/");
}

function shortenFileName(name: string) {
  if (name.length <= 28) return name;

  const ext = name.includes(".") ? name.split(".").pop() : "";

  return ext ? `${name.slice(0, 20)}....${ext}` : name.slice(0, 28);
}

export function ChatAttachments({ attachments }: Props) {
  if (!attachments?.length) return null;

  return (
    <div className="mt-3 space-y-2">
      {attachments.map((file, index) => {
        const url = getAttachmentUrl(file.url);

        if (isImageAttachment(file)) {
          return (
            <a
              key={`${file.filename}-${index}`}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block w-fit max-w-full overflow-hidden rounded-xl bg-black/25"
            >
              <Image
                src={url}
                alt=""
                width={360}
                height={240}
                unoptimized
                className="block h-auto max-h-80 w-auto max-w-full object-cover"
              />
            </a>
          );
        }

        return (
          <a
            key={`${file.filename}-${index}`}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl bg-black/25 px-3 py-2 text-xs font-bold underline"
          >
            <Paperclip size={14} />
            {shortenFileName(file.originalName)}
          </a>
        );
      })}
    </div>
  );
}
