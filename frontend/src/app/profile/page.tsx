"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ToastStack } from "@/components/ui/ToastStack";
import { AvatarCropModal } from "@/components/ui/AvatarCropModal";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/useToast";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

  return (
    <main className="h-screen overflow-hidden bg-black p-4 text-white">
      <div className="mx-auto flex h-full max-w-6xl flex-col">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <Link href="/" className="text-sm font-bold text-orange-500">
            ← Về trang chủ
          </Link>

          {(profile.user.role === "Mod" || profile.user.role === "Admin") && (
            <Link
              href="/admin"
              className="rounded-full border border-orange-500/30 px-5 py-2.5 text-sm font-black text-orange-500 transition hover:bg-orange-500 hover:text-white"
            >
              Admin Panel
            </Link>
          )}
        </div>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[320px_1fr]">
          <ProfileSidebar
            user={profile.user}
            avatar={profile.formData.avatar}
            fileInputRef={fileInputRef}
            onAvatarFile={setAvatarFile}
          />

          <ProfileForm
            user={profile.user}
            loading={profile.loading}
            formData={profile.formData}
            onChangeFormData={profile.setFormData}
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
            onSendEmailCode={profile.sendEmailCode}
            onVerifyEmailCode={profile.verifyEmailCode}
            onSendPhoneCode={profile.sendPhoneCode}
            onVerifyPhoneCode={profile.verifyPhoneCode}
          />
        </div>
      </div>

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
    </main>
  );
}
