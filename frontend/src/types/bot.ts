export type BotSuggestion = {
  _id?: string;
  label: string;
  message: string;
};

export type BotPublicSetting = {
  botName: string;
  botAvatar: string;
  allowCustomerMedia?: boolean;
  suggestions: BotSuggestion[];
};

export type KeywordReply = {
  _id?: string;
  keyword: string;
  reply: string;
  mediaUrl: string;
};

export type AdminKeywordReply = {
  _id?: string;
  keyword: string;
  reply: string;
  mediaUrl: string;
};

export type BotSetting = {
  botName: string;
  avatar: string;
  botAvatar?: string;
  enabled: boolean;
  delaySeconds: number;
  fallbackMessage: string;
  allowCustomerMedia: boolean;
  keywordReplies: KeywordReply[];
  adminKeywordReplies: AdminKeywordReply[];
  suggestions: BotSuggestion[];
};
