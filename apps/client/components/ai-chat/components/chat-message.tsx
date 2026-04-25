import { Bot, Check, Copy, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Message {
  content: string;
  role: "user" | "assistant";
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
          <div className="relative my-2 rounded-md bg-black/40 text-xs" key={i}>
            <div className="flex items-center justify-between border-white/10 border-b px-3 py-1">
              <span className="text-[10px] text-white/50">
                {lang || "code"}
              </span>
              <button
                className="text-white/50 transition-colors hover:text-white/90"
                onClick={() => copyToClipboard(code)}
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
        <p className="whitespace-pre-wrap text-xs leading-relaxed" key={i}>
          {part}
        </p>
      );
    });
  };

  return (
    <div
      className={cn(
        "flex gap-2 rounded-lg px-3 py-2",
        isUser
          ? "border border-blue-500/20 bg-blue-500/10"
          : "border border-white/5 bg-muted/30"
      )}
    >
      <div className="mt-0.5 shrink-0">
        {isUser ? (
          <div className="flex size-5 items-center justify-center rounded-full bg-blue-500">
            <User className="size-3 text-white" />
          </div>
        ) : (
          <div className="flex size-5 items-center justify-center rounded-full bg-purple-500">
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
