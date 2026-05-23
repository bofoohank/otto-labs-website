"use client";

import { useEffect, useMemo, useState } from "react";

import type {
    DiscordMessage as DiscordMessageType,
    DiscordReplyTo,
    DiscordSuggestion,
} from "@/types/discord-chat";

import { DiscordComposer } from "./DiscordComposer";
import { DiscordDateDivider } from "./DiscordDateDivider";
import { DiscordMessage } from "./DiscordMessage";
import { DiscordReplyPreview } from "./DiscordReplyPreview";
import { DiscordSuggestions } from "./DiscordSuggestions";

type Props = {
    messages: DiscordMessageType[];
    bodyRef: React.RefObject<HTMLDivElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;

    inputValue: string;
    files?: File[];
    loading?: boolean;
    disabled?: boolean;
    allowMedia?: boolean;
    dense?: boolean;

    botName?: string;
    botAvatar?: string;
    currentUserAvatar?: string;

    suggestions?: DiscordSuggestion[];
    suggestionTitle?: string;
    mediaUrl?: string;

    placeholder?: string;

    onChangeInput: (value: string) => void;
    onChangeFiles: (files: File[]) => void;
    onClearMediaUrl?: () => void;
    onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    onSelectSuggestion?: (suggestion: DiscordSuggestion) => void;

    onReply?: (message: DiscordMessageType) => void;
    onReact?: (message: DiscordMessageType, emoji: string) => void;
};

function getMessageKey(message: DiscordMessageType, index: number) {
    return message._id || `${message.senderRole}-${message.createdAt}-${index}`;
}

function isSameDay(a?: string, b?: string) {
    if (!a || !b) return false;

    const da = new Date(a);
    const db = new Date(b);

    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
    );
}

function isSameSender(
    a?: DiscordMessageType,
    b?: DiscordMessageType,
) {
    if (!a || !b) return false;
    if (a.senderRole === "System" || b.senderRole === "System") return false;

    return (
        a.senderRole === b.senderRole &&
        (a.senderId || a.senderName) === (b.senderId || b.senderName)
    );
}

export function DiscordChat({
    messages,
    bodyRef,
    fileInputRef,
    inputValue,
    files = [],
    loading = false,
    disabled = false,
    allowMedia = true,
    dense = false,
    botName,
    botAvatar,
    currentUserAvatar,
    suggestions = [],
    suggestionTitle,
    mediaUrl = "",
    placeholder,
    onChangeInput,
    onChangeFiles,
    onClearMediaUrl,
    onSubmit,
    onSelectSuggestion,
    onReply,
    onReact,
}: Props) {
    const [replyTo, setReplyTo] = useState<DiscordReplyTo | null>(null);

    const renderedMessages = useMemo(() => messages || [], [messages]);

    function handleReply(message: DiscordMessageType) {
        const nextReply: DiscordReplyTo = {
            messageId: message._id || "",
            senderName: message.senderName || message.senderRole,
            content: message.content || "",
        };

        setReplyTo(nextReply);
        onReply?.(message);
    }

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (bodyRef.current) {
                bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
            }
        }, 50);

        return () => window.clearTimeout(timer);
    }, [bodyRef, renderedMessages.length]);

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div
                ref={bodyRef}
                className={`otto-scrollbar min-h-0 flex-1 overflow-y-auto px-3 ${
                    dense ? "py-1" : "py-2"
                }`}
            >
                {renderedMessages.map((message, index) => {
                    const previous = renderedMessages[index - 1];

                    const showDateDivider =
                        index === 0 ||
                        !isSameDay(previous?.createdAt, message.createdAt);

                    const compact =
                        isSameSender(previous, message) &&
                        isSameDay(previous?.createdAt, message.createdAt);

                    return (

                        <div key={getMessageKey(message, index)} className="contents">

                            {showDateDivider && (

                                <DiscordDateDivider date={message.createdAt} />

                            )}

                            <DiscordMessage
                                message={message}
                                compact={compact}
                                botName={botName}
                                botAvatar={botAvatar}
                                currentUserAvatar={currentUserAvatar}
                                onReply={handleReply}
                                onReact={onReact}
                                dense={dense}
                            />
                        </div>
                    );
                })}
            </div>

            <DiscordSuggestions
                title={suggestionTitle}
                items={suggestions}
                loading={loading}
                dense={dense}
                onSelect={(suggestion) => {
                    onSelectSuggestion?.(suggestion);
                }}
            />

            <DiscordReplyPreview
                replyTo={replyTo}
                onCancel={() => setReplyTo(null)}
            />

            <DiscordComposer
                value={inputValue}
                files={files}
                mediaUrl={mediaUrl}
                loading={loading}
                disabled={disabled}
                allowMedia={allowMedia}
                placeholder={placeholder}
                fileInputRef={fileInputRef}
                dense={dense}
                onChange={onChangeInput}
                onChangeFiles={onChangeFiles}
                onClearMediaUrl={onClearMediaUrl}
                onSubmit={(e) => {
                    onSubmit(e);
                    setReplyTo(null);
                }}
            />
        </div>
    );
}
