import { API_URL } from "@/lib/api";

import type { Attachment } from "@/types/chat";

export function attachmentUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_URL}${url}`;
}

export function isImageAttachment(
  attachment: Attachment,
) {
  return attachment.mimeType.startsWith("image/");
}

export function shortenFileName(name: string) {
  if (name.length <= 26) return name;

  const ext = name.split(".").pop();

  return `${name.slice(0, 17)}....${ext}`;
}