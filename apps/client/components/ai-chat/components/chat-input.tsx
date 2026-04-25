import { ArrowUp, Loader2 } from "lucide-react";
import { type KeyboardEvent, useRef } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onSend: (message: string) => void;
  setInput: (value: string) => void;
}

export function ChatInput({
  onSend,
  isLoading,
  input,
  setInput,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || isLoading) {
      return;
    }
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="border-white/10 border-t p-2">
      <div className="flex items-end gap-2 rounded-lg border border-white/10 bg-muted/30 px-3 py-2">
        <textarea
          className={cn(
            "flex-1 resize-none bg-transparent text-xs outline-none",
            "leading-relaxed placeholder:text-muted-foreground",
            "max-h-[120px] min-h-[20px]"
          )}
          onChange={(e) => setInput(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your code... (Enter to send)"
          ref={textareaRef}
          rows={1}
          value={input}
        />
        <button
          className={cn(
            "mb-0.5 shrink-0 rounded-md p-1 transition-colors",
            input.trim() && !isLoading
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          )}
          disabled={!input.trim() || isLoading}
          onClick={handleSend}
        >
          {isLoading ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <ArrowUp className="size-3" />
          )}
        </button>
      </div>
      <p className="mt-1 text-center text-[10px] text-muted-foreground">
        Shift+Enter for new line
      </p>
    </div>
  );
}
