import type { User } from "./user";

export type Attachment = {
  originalName: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
};

export type ChatMessage = {
  _id?: string;
  senderRole: "Member" | "Mod" | "Admin" | "Bot";
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  attachments?: Attachment[];
  readByStaff?: boolean;
  readByMember?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ChatConversation = {
  _id: string;
  ticketCode?: string;
  userId?: User;
  assignedTo?: User | null;
  assignedAt?: string | null;
  status: "waiting" | "answered" | "closed";
  unreadForStaff: number;
  unreadForMember: number;
  lastCustomerMessageAt?: string | null;
  lastStaffMessageAt?: string | null;
  botRepliedAt?: string | null;
  messages: ChatMessage[];
  createdAt?: string;
  updatedAt?: string;
};