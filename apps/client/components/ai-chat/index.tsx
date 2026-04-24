/**
 * AI Chat sidebar component for CodeX.
 * Features:
 * - Gemini AI powered chat
 * - Code-aware context
 * - Chat history
 * - Clear chat
 */

"use client";

import { Bot, Trash2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./components/chat-input";
import { ChatMessage, type Message } from "./components/chat-message";

interface AiChatProps {
  code?: string | null;
  language?: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm your AI coding assistant powered by Gemini. I can see your current code and help you with:\n\n- 🐛 Finding and fixing bugs\n- 💡 Explaining code\n- ✨ Suggesting improvements\n- 📝 Writing documentation\n\nWhat would you like help with?",
};

export function AiChat({ code, language }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          code,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please check your Gemini API key and try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-purple-500/20">
            <Sparkles className="size-3 text-purple-400" />
          </div>
          <span className="text-xs font-semibold">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">
            {language || "No language"}
          </span>
          <button
            onClick={clearChat}
            title="Clear chat"
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
        {messages.map((message, i) => (
          <ChatMessage key={i} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-white/5">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-500">
              <Bot className="size-3 text-white" />
            </div>
            <div className="flex gap-1">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        isLoading={isLoading}
        onSend={sendMessage}
        setInput={setInput}
      />
    </div>
  );
}