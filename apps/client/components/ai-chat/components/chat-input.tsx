import { ArrowUp, Loader2 } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  input: string;
  setInput: (value: string) => void;
}

export function ChatInput({ onSend, isLoading, input, setInput }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
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
    <div className="p-2 border-t border-white/10">
      <div className="flex items-end gap-2 rounded-lg border border-white/10 bg-muted/30 px-3 py-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask about your code... (Enter to send)"
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent text-xs outline-none",
            "placeholder:text-muted-foreground leading-relaxed",
            "max-h-[120px] min-h-[20px]"
          )}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={cn(
            "mb-0.5 shrink-0 rounded-md p-1 transition-colors",
            input.trim() && !isLoading
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
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