"use client";

import { useEffect, useState } from "react";

import { AuthModal } from "@/components/auth/AuthModal";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ContactSection } from "@/components/landing/ContactSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { MaterialsSection } from "@/components/landing/MaterialsSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { ProjectsSection } from "@/components/landing/ProjectsSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { ToastStack } from "@/components/ui/ToastStack";

import { useHomeAuth } from "@/hooks/useHomeAuth";
import { useHomeChat } from "@/hooks/useHomeChat";
import { useToast } from "@/hooks/useToast";
import { getStoredUser } from "@/lib/storage";
import type { User } from "@/types/user";

export default function Home() {
  const { toasts, showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);

  const chat = useHomeChat({
    user,
    showToast,
  });

  const auth = useHomeAuth({
    showToast,
    setUser,
    onLogoutCleanup: chat.clearChatState,
  });

  useEffect(() => {
    void Promise.resolve().then(() => {
      setUser(getStoredUser());
    });
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <Header
        user={user}
        onOpenLogin={auth.openLogin}
        onLogout={auth.handleLogout}
      />

      <HeroSection onStart={auth.openRegister} />

      <StatsSection />
      <ServicesSection />
      <MaterialsSection />
      <ProjectsSection />
      <ProcessSection />
      <FAQSection />
      <ContactSection />
      <Footer />

      <AuthModal
        open={auth.openAuth}
        isLogin={auth.isLogin}
        loading={auth.loading}
        message={auth.message}
        formData={auth.formData}
        onClose={() => auth.setOpenAuth(false)}
        onSubmit={auth.handleSubmit}
        onChangeForm={auth.setFormData}
        onToggleMode={auth.toggleAuthMode}
        onForgotPassword={auth.openForgot}
      />

      <ForgotPasswordModal
        open={auth.openForgotPassword}
        loading={auth.forgotLoading}
        showCodeInput={auth.showForgotCodeInput}
        cooldown={auth.forgotCooldown}
        forgotData={auth.forgotData}
        onClose={() => auth.setOpenForgotPassword(false)}
        onSubmit={auth.resetPassword}
        onChangeForgotData={auth.setForgotData}
        onSendCode={auth.sendForgotPasswordCode}
        onBackToLogin={auth.backToLogin}
      />

      <ChatWidget
        user={user}
        openChat={chat.openChat}
        hasNewChat={chat.hasNewChat}
        chatLoading={chat.chatLoading}
        chatMessage={chat.chatMessage}
        chatFiles={chat.chatFiles}
        conversation={chat.conversation}
        botSetting={chat.botSetting}
        fileInputRef={chat.fileInputRef}
        chatBodyRef={chat.chatBodyRef}
        onOpenChat={() => {
          chat.setOpenChat(true);
          chat.setHasNewChat(false);
        }}
        onCloseChat={() => chat.setOpenChat(false)}
        onOpenLogin={auth.openLogin}
        onChangeMessage={chat.setChatMessage}
        onChangeFiles={chat.setChatFiles}
        onSendMessage={chat.sendChatMessage}
        onSendSuggestion={chat.sendSuggestion}
      />

      <ToastStack toasts={toasts} />
    </main>
  );
}
