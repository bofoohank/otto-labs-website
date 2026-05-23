"use client";

import { useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

import { MessageCircle, X } from "lucide-react";

import { DiscordChat } from "@/components/chat/discord/DiscordChat";

import { AdminHeaderSearch } from "./AdminHeaderSearch";
import { AdminPanelLayout } from "./AdminPanelLayout";
import { TicketHeader } from "./support/TicketHeader";
import { TicketList } from "./support/TicketList";
import { TicketStatusFilter } from "./support/TicketStatusFilter";

import type { AdminKeywordReply, BotSetting, Ticket, TicketStatus } from "@/types/admin";

type Props = {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  openedTicket: Ticket | null;
  ticketStatus: TicketStatus;

  replyMessage: string;
  replyFiles: File[];
  replyMediaUrl: string;
  replyLoading: boolean;

  botSetting: BotSetting;

  adminMessagesRef: RefObject<HTMLDivElement | null>;
  replyFileInputRef: RefObject<HTMLInputElement | null>;

  onChangeTicketStatus: (status: TicketStatus) => void;
  onAssignTicket: (ticket: Ticket) => void;
  onOpenTicket: (ticket: Ticket) => void;
  onCloseTicket: () => void;

  onSendReply: (e?: React.FormEvent<HTMLFormElement>) => void;
  onChangeReplyMessage: (value: string) => void;
  onChangeReplyFiles: (files: File[]) => void;
  onChangeReplyMediaUrl: (value: string) => void;
  onSendAdminSuggestion: (item: AdminKeywordReply) => void;
};

export function SupportTab({
  tickets,
  selectedTicket,
  openedTicket,
  ticketStatus,
  replyMessage,
  replyFiles,
  replyMediaUrl,
  replyLoading,
  botSetting,
  adminMessagesRef,
  replyFileInputRef,
  onChangeTicketStatus,
  onAssignTicket,
  onOpenTicket,
  onCloseTicket,
  onSendReply,
  onChangeReplyMessage,
  onChangeReplyFiles,
  onChangeReplyMediaUrl,
  onSendAdminSuggestion,
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [fullChatOpen, setFullChatOpen] = useState(false);
  const fullChatMessagesRef = useRef<HTMLDivElement | null>(null);

  const filteredTickets = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) return tickets;

    return tickets.filter((ticket) => {
      const user = ticket.userId || ticket.user || {};
      return user.name?.toLowerCase().includes(keyword);
    });
  }, [tickets, searchValue]);

  return (
    <AdminPanelLayout
        icon={<MessageCircle size={24} />}
        title="Hỗ trợ khách hàng"
        actions={
          <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(180px,1fr)_150px]">
            <AdminHeaderSearch
              value={searchValue}
              placeholder="Tìm tên khách hàng..."
              onChange={setSearchValue}
            />
            <TicketStatusFilter
              value={ticketStatus}
              onChange={onChangeTicketStatus}
              size="md"
            />
          </div>
        }
      >
      <div className="grid h-full min-h-0 gap-2 xl:grid-cols-[minmax(240px,300px)_1fr]">
        <TicketList
          tickets={filteredTickets}
          selectedTicket={selectedTicket}
          onSelectTicket={onOpenTicket}
        />

        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black">
          {selectedTicket ? (
            <>
              <TicketHeader
                selectedTicket={selectedTicket}
                openedTicket={openedTicket}
                onAssignTicket={onAssignTicket}
                onOpenTicket={onOpenTicket}
                onOpenFullChat={() => setFullChatOpen(true)}
                onCloseTicket={onCloseTicket}
              />

              {!openedTicket ? (
                <div className="grid min-h-0 flex-1 place-items-center p-6 text-center">
                  <div>
                    <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-white/5 text-neutral-500">
                      <MessageCircle size={42} />
                    </div>

                    <p className="text-xl font-black text-white">
                      Ticket chưa được mở
                    </p>

                    <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">
                      Hãy mở ticket để xem nội dung chat.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <DiscordChat
                    messages={openedTicket.messages || []}
                    bodyRef={adminMessagesRef}
                    fileInputRef={replyFileInputRef}
                    inputValue={replyMessage}
                    files={replyFiles}
                    loading={replyLoading}
                    disabled={!openedTicket.assignedTo}
                    botName={botSetting.botName}
                    botAvatar={botSetting.avatar}
                    suggestions={(botSetting.adminKeywordReplies || []).map(
                      (item) => ({
                        _id: item._id,
                        label: item.keyword,
                        message: item.reply,
                        mediaUrl: item.mediaUrl,
                      }),
                    )}
                    mediaUrl={replyMediaUrl}
                    suggestionTitle="Gợi ý cho Admin"
                    placeholder={
                      openedTicket.assignedTo
                        ? "Nhập phản hồi..."
                        : "Bấm Giao cho tôi để gửi phản hồi..."
                    }
                    onChangeInput={onChangeReplyMessage}
                    onChangeFiles={onChangeReplyFiles}
                    onClearMediaUrl={() => onChangeReplyMediaUrl("")}
                    onSubmit={onSendReply}
                    onSelectSuggestion={(suggestion) =>
                      onSendAdminSuggestion({
                        _id: suggestion._id,
                        keyword: suggestion.label,
                        reply: suggestion.message,
                        mediaUrl: suggestion.mediaUrl || "",
                      })
                    }
                    dense
                  />
                </>
              )}
            </>
          ) : filteredTickets.length === 0 ? (
            <div className="grid flex-1 place-items-center p-6 text-center text-neutral-500">
              Không tìm thấy ticket phù hợp.
            </div>
          ) : (
            <div className="grid flex-1 place-items-center text-neutral-500">
              Chưa chọn ticket.
            </div>
          )}
        </div>
      </div>

      {openedTicket && fullChatOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 p-[clamp(8px,1.5vw,24px)] backdrop-blur">
          <div className="mx-auto flex h-full max-w-[min(1500px,100%)] flex-col overflow-hidden rounded-2xl border border-orange-500/20 bg-black text-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="min-w-0 truncate text-lg font-black">
                Ticket #{openedTicket.ticketCode || openedTicket._id}
              </h3>

              <button
                type="button"
                onClick={() => setFullChatOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-neutral-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <DiscordChat
              messages={openedTicket.messages || []}
              bodyRef={fullChatMessagesRef}
              fileInputRef={replyFileInputRef}
              inputValue={replyMessage}
              files={replyFiles}
              loading={replyLoading}
              disabled={!openedTicket.assignedTo}
              botName={botSetting.botName}
              botAvatar={botSetting.avatar}
              suggestions={(botSetting.adminKeywordReplies || []).map(
                (item) => ({
                  _id: item._id,
                  label: item.keyword,
                  message: item.reply,
                  mediaUrl: item.mediaUrl,
                }),
              )}
              mediaUrl={replyMediaUrl}
              placeholder={
                openedTicket.assignedTo
                  ? "Nhập phản hồi..."
                  : "Bấm Giao cho tôi để gửi phản hồi..."
              }
              onChangeInput={onChangeReplyMessage}
              onChangeFiles={onChangeReplyFiles}
              onClearMediaUrl={() => onChangeReplyMediaUrl("")}
              onSubmit={onSendReply}
              onSelectSuggestion={(suggestion) =>
                onSendAdminSuggestion({
                  _id: suggestion._id,
                  keyword: suggestion.label,
                  reply: suggestion.message,
                  mediaUrl: suggestion.mediaUrl || "",
                })
              }
            />
          </div>
        </div>
      )}
    </AdminPanelLayout>
  );
}
