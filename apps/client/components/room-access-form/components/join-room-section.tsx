"use client";

import * as Form from "@radix-ui/react-form";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { NAME_MAX_LENGTH } from "@/lib/constants";
import type { JoinRoomForm } from "../types";
import { onRoomIdChange } from "../utils";

interface JoinRoomSectionProps {
  defaultRoomId: string;
  isCreating: boolean;
  isSubmitting: boolean;
  onSubmit: (data: JoinRoomForm) => void;
}

export const JoinRoomSection = ({
  defaultRoomId,
  onSubmit,
  isSubmitting,
  isCreating,
}: JoinRoomSectionProps) => {
  const isDisabled = isCreating || isSubmitting;

  return (
    <Form.Root
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = (formData.get("name") as string).trim();
        const roomId = formData.get("roomId") as string;
        onSubmit({ name, roomId });
      }}
    >
      <Form.Field className="flex flex-col gap-1.5" name="roomId">
        <Form.Label className="text-[11px] text-white/35 uppercase tracking-wider">
          Room ID
        </Form.Label>
        <Form.Control asChild>
          <input
            className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-purple-500/40 focus:bg-purple-500/5 disabled:opacity-50"
            defaultValue={defaultRoomId}
            disabled={isDisabled}
            name="roomId"
            onChange={onRoomIdChange}
            pattern="[A-Z0-9]{4}-[A-Z0-9]{4}"
            placeholder="XXXX-XXXX"
            required
          />
        </Form.Control>
        <Form.Message className="text-red-400 text-xs" match="valueMissing">
          Room ID is required
        </Form.Message>
        <Form.Message className="text-red-400 text-xs" match="patternMismatch">
          Invalid room ID format
        </Form.Message>
      </Form.Field>
      <Form.Field className="flex flex-col gap-1.5" name="name">
        <Form.Label className="text-[11px] text-white/35 uppercase tracking-wider">
          Your Name
        </Form.Label>
        <Form.Control asChild>
          <input
            autoComplete="name"
            className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-purple-500/40 focus:bg-purple-500/5 disabled:opacity-50"
            disabled={isDisabled}
            maxLength={NAME_MAX_LENGTH}
            name="name"
            placeholder="e.g. John Doe"
            required
          />
        </Form.Control>
        <Form.Message className="text-red-400 text-xs" match="valueMissing">
          Name is required
        </Form.Message>
        <Form.Message
          className="text-red-400 text-xs"
          match={(value) => value.trim().length > NAME_MAX_LENGTH}
        >
          {`Name must not exceed ${NAME_MAX_LENGTH} characters`}
        </Form.Message>
      </Form.Field>
      <Form.Submit asChild>
        <button
          aria-busy={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 py-3 text-sm text-white/60 transition-colors hover:bg-white/8 disabled:opacity-50"
          disabled={isDisabled}
        >
          {isSubmitting && <Spinner className="size-4" />}
          {isSubmitting ? "Joining..." : "Join Room"}
          {!isSubmitting && <ArrowRight className="size-4" />}
        </button>
      </Form.Submit>
    </Form.Root>
  );
};
