"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Package, UserRound } from "lucide-react";

import { AdminPanelLayout } from "@/components/admin/AdminPanelLayout";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileOrdersTab } from "@/components/profile/ProfileOrdersTab";
import {
  ProfileSidebar,
  type ProfileTab,
} from "@/components/profile/ProfileSidebar";
import { ToastStack } from "@/components/ui/ToastStack";
import { AvatarCropModal } from "@/components/ui/AvatarCropModal";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/useToast";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");

  const { toasts, showToast } = useToast();

  const profile = useProfile({
    showToast,
  });

  if (profile.pageLoading || !profile.user) {
    return (
      <main className="grid h-screen place-items-center overflow-hidden bg-black text-white">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </main>
    );
  }

  const headerActions = (
    <div className="flex shrink-0 items-center gap-2">
      {(profile.user.role === "Mod" || profile.user.role === "Admin") && (
        <Link
          href="/admin"
          className="inline-flex h-10 items-center rounded-xl border border-orange-500/30 px-4 text-sm font-black text-orange-500 transition hover:bg-orange-500 hover:text-white"
        >
          Admin Panel
        </Link>
      )}

      <Link
        href="/"
        className="inline-flex h-10 items-center rounded-xl border border-white/10 px-4 text-sm font-black text-neutral-300 transition hover:border-orange-500 hover:text-orange-500"
      >
        Về trang chủ
      </Link>
    </div>
  );

  return (
    <>
      <AdminShell
        title="Profile"
        headerActions={headerActions}
        sidebar={
          <ProfileSidebar
            user={profile.user}
            avatar={profile.formData.avatar}
            activeTab={activeTab}
            fileInputRef={fileInputRef}
            onAvatarFile={setAvatarFile}
            onChangeTab={setActiveTab}
          />
        }
      >
        {activeTab === "info" && (
          <AdminPanelLayout
            icon={<UserRound size={24} />}
            title="Thông tin"
            actions={
              <div className="grid w-full grid-cols-[1fr_150px] items-center gap-2">
                <div />
                <button
                  type="submit"
                  form="profile-info-form"
                  disabled={profile.loading}
                  className="flex h-11 w-full items-center justify-center whitespace-nowrap rounded-xl bg-orange-500 px-5 text-sm font-black text-white transition hover:bg-orange-400 disabled:opacity-60"
                >
                  {profile.loading && (
                    <Loader2 className="mr-2 animate-spin" size={18} />
                  )}
                  Lưu
                </button>
              </div>
            }
          >
            <ProfileForm
              user={profile.user}
              formData={profile.formData}
              onChangeFormData={profile.setFormData}
              passwordData={profile.passwordData}
              passwordLoading={profile.passwordLoading}
              onChangePasswordData={profile.setPasswordData}
              sendingEmailCode={profile.sendingEmailCode}
              sendingPhoneCode={profile.sendingPhoneCode}
              showEmailCodeInput={profile.showEmailCodeInput}
              showPhoneCodeInput={profile.showPhoneCodeInput}
              emailCooldown={profile.emailCooldown}
              phoneCooldown={profile.phoneCooldown}
              emailCode={profile.emailCode}
              phoneCode={profile.phoneCode}
              onChangeEmailCode={profile.setEmailCode}
              onChangePhoneCode={profile.setPhoneCode}
              onSubmit={profile.updateProfile}
              onSubmitPassword={profile.updatePassword}
              onSendEmailCode={profile.sendEmailCode}
              onVerifyEmailCode={profile.verifyEmailCode}
              onSendPhoneCode={profile.sendPhoneCode}
              onVerifyPhoneCode={profile.verifyPhoneCode}
            />
          </AdminPanelLayout>
        )}

        {activeTab === "orders" && (
          <AdminPanelLayout
            icon={<Package size={24} />}
            title="Đơn hàng"
          >
            <ProfileOrdersTab />
          </AdminPanelLayout>
        )}
      </AdminShell>

      <ToastStack toasts={toasts} />

      {avatarFile && (
        <AvatarCropModal
          file={avatarFile}
          title="Cắt ảnh đại diện"
          onCancel={() => setAvatarFile(null)}
          onCrop={(file, dataUrl) => {
            profile.handleAvatarFile(file, dataUrl);
            setAvatarFile(null);
          }}
        />
      )}
    </>
  );
}
