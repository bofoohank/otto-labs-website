import type { Role, User } from "./user";
import type { ChatConversation } from "./chat";
import type {
  AdminKeywordReply,
  BotSetting,
  BotSuggestion,
  KeywordReply,
} from "./bot";

export type AdminTab = "members" | "bot" | "support";

export type MemberTab = "info" | "roles";

export type TicketStatus = "all" | "waiting" | "answered" | "closed";

export type AdminUser = User & {
  _id: string;
  role: Role;
};

export type Ticket = ChatConversation & {
  userId: AdminUser;
  user?: AdminUser;
  assignedTo?: AdminUser | null;
  assignedAt?: string | null;
  updatedAt: string;
};

export type {
  AdminKeywordReply,
  BotSetting,
  BotSuggestion,
  KeywordReply,
};
