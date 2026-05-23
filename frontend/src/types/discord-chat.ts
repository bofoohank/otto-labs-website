export type DiscordMessageRole =
  | "Bot"
  | "Member"
  | "Admin"
  | "Mod"
  | "System";

export type DiscordAttachment = {
  originalName: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
};

export type DiscordReaction = {
  emoji: string;
  count: number;
  reacted?: boolean;
};

export type DiscordReplyTo = {
  messageId: string;
  senderName: string;
  content: string;
};

export type DiscordMessage = {
  _id?: string;
  senderRole: DiscordMessageRole;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  content?: string;
  attachments?: DiscordAttachment[];
  createdAt?: string;
  replyTo?: DiscordReplyTo;
  reactions?: DiscordReaction[];
};

export type DiscordSuggestion = {
  _id?: string;
  label: string;
  message: string;
  mediaUrl?: string;
};