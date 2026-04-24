import { User, Bot, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render message with code block support
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const lines = part.split("\n");
        const lang = lines[0].replace("```", "").trim();
        const code = lines.slice(1, -1).join("\n");
        return (
          <div key={i} className="relative my-2 rounded-md bg-black/40 text-xs">
            <div className="flex items-center justify-between px-3 py-1 border-b border-white/10">
              <span className="text-white/50 text-[10px]">{lang || "code"}</span>
              <button
                onClick={() => copyToClipboard(code)}
                className="text-white/50 hover:text-white/90 transition-colors"
              >
                {copied ? (
                  <Check className="size-3" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-3 text-green-400 leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return (
        <p key={i} className="leading-relaxed whitespace-pre-wrap text-xs">
          {part}
        </p>
      );
    });
  };

  return (
    <div
      className={cn(
        "flex gap-2 px-3 py-2 rounded-lg",
        isUser
          ? "bg-blue-500/10 border border-blue-500/20"
          : "bg-muted/30 border border-white/5"
      )}
    >
      <div className="mt-0.5 shrink-0">
        {isUser ? (
          <div className="size-5 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="size-3 text-white" />
          </div>
        ) : (
          <div className="size-5 rounded-full bg-purple-500 flex items-center justify-center">
            <Bot className="size-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {renderContent(message.content)}
      </div>
    </div>
  );
}