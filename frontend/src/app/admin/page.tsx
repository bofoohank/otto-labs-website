"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BotSettingsTab } from "@/components/admin/BotSettingsTab";
import { MembersTab } from "@/components/admin/MembersTab";
import { SupportTab } from "@/components/admin/SupportTab";
import { ToastStack } from "@/components/ui/ToastStack";
import { AvatarCropModal } from "@/components/ui/AvatarCropModal";

import { useAdminData } from "@/hooks/useAdminData";
import { useAdminSocket } from "@/hooks/useAdminSocket";
import { useToast } from "@/hooks/useToast";

import { getToken } from "@/lib/storage";

import type {
  AdminTab,
  MemberTab,
  TicketStatus,
} from "@/types/admin";

export default function AdminPage() {
  const adminMessagesRef =
    useRef<HTMLDivElement | null>(null);

  const botAvatarInputRef =
    useRef<HTMLInputElement | null>(null);
  const [botAvatarFile, setBotAvatarFile] = useState<File | null>(null);

  const replyFileInputRef =
    useRef<HTMLInputElement | null>(null);

  const { toasts, showToast } = useToast();

  const [activeTab, setActiveTab] =
    useState<AdminTab>("support");

  const [memberTab, setMemberTab] =
    useState<MemberTab>("info");

  const [ticketStatus, setTicketStatus] =
    useState<TicketStatus>("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const token = useMemo(() => getToken(), []);

  const admin = useAdminData({
    token,
    showToast,
    adminMessagesRef,
    replyFileInputRef,
  });

  const supportUnreadCount = admin.tickets.reduce(
    (total, ticket) =>
      total + (ticket.unreadForStaff || 0),
    0,
  );

  useAdminSocket({
    token,
    setTickets: admin.setTickets,
    setSelectedTicket: admin.setSelectedTicket,
    setOpenedTicket: admin.setOpenedTicket,
  });

  useEffect(() => {
    admin.fetchAdminData(ticketStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (admin.loading) {
    return (
      <main className="grid h-screen place-items-center overflow-hidden bg-black text-white">
        <Loader2
          className="animate-spin text-orange-500"
          size={42}
        />
      </main>
    );
  }
  return (
  <>
    <AdminShell
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <AdminSidebar
          activeTab={activeTab}
          supportUnreadCount={supportUnreadCount}
          onChangeTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleMenu={() => {
            setSidebarCollapsed((collapsed) => !collapsed);
          }}
        />
      }
    >
      {activeTab === "members" && (
        <MembersTab
          users={admin.users}
          memberTab={memberTab}
          onChangeMemberTab={setMemberTab}
          onUpdateRole={admin.updateRole}
        />
      )}

      {activeTab === "bot" && (
        <BotSettingsTab
          botSetting={admin.botSetting}
          savingBot={admin.savingBot}
          onChangeBotSetting={admin.setBotSetting}
          onSave={admin.saveBotSetting}
          onChooseAvatar={() => botAvatarInputRef.current?.click()}
          onUploadKeywordMedia={admin.uploadKeywordMedia}
        />
      )}

      {activeTab === "support" && (
        <SupportTab
          tickets={admin.tickets}
          selectedTicket={admin.selectedTicket}
          openedTicket={admin.openedTicket}
          ticketStatus={ticketStatus}
          replyMessage={admin.replyMessage}
          replyFiles={admin.replyFiles}
          replyLoading={admin.replyLoading}
          botSetting={admin.botSetting}
          adminMessagesRef={adminMessagesRef}
          replyFileInputRef={replyFileInputRef}
          onChangeTicketStatus={(status) => {
            setTicketStatus(status);
            admin.fetchTickets(status);
            admin.setOpenedTicket(null);
          }}
          onAssignTicket={admin.assignTicket}
          onOpenTicket={admin.openTicket}
          onCloseTicket={admin.closeTicket}
          onSendReply={admin.sendReply}
          onChangeReplyMessage={admin.setReplyMessage}
          onChangeReplyFiles={admin.setReplyFiles}
          replyMediaUrl={admin.replyMediaUrl}
          onChangeReplyMediaUrl={admin.setReplyMediaUrl}
          onSendAdminSuggestion={admin.sendAdminSuggestion}
        />
      )}
    </AdminShell>

    <ToastStack toasts={toasts} />

    <input
      ref={botAvatarInputRef}
      type="file"
      accept="image/*"
      hidden
      onChange={(event) => {
        const file = event.target.files?.[0];

        if (file) {
          setBotAvatarFile(file);
        }

        event.target.value = "";
      }}
    />

    {botAvatarFile && (
      <AvatarCropModal
        file={botAvatarFile}
        title="Cắt ảnh Bot"
        onCancel={() => setBotAvatarFile(null)}
        onCrop={(file) => {
          admin.handleBotAvatarUpload(file);
          setBotAvatarFile(null);
        }}
      />
    )}
  </>
);
}
