"use client";

import * as Form from "@radix-ui/react-form";
import { CirclePlus } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { NAME_MAX_LENGTH } from "@/lib/constants";
import type { CreateRoomForm } from "../types";

interface CreateRoomSectionProps {
  isJoining: boolean;
  isSubmitting: boolean;
  onSubmit: (data: CreateRoomForm) => void;
}

export const CreateRoomSection = ({
  onSubmit,
  isSubmitting,
  isJoining,
}: CreateRoomSectionProps) => {
  const isDisabled = isSubmitting || isJoining;

  return (
    <Form.Root
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = (formData.get("name") as string).trim();
        onSubmit({ name });
      }}
    >
      <Form.Field className="flex flex-col gap-1.5" name="name">
        <Form.Label className="text-[11px] text-white/35 uppercase tracking-wider">
          Your Name
        </Form.Label>
        <Form.Control asChild>
          <input
            autoComplete="name"
            autoFocus
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
      {/* <Form.Submit asChild> */}
      <Button
        aria-busy={isSubmitting}
        className="relative flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-sm text-white shadow-[0_4px_20px_rgba(168,85,247,0.014)] transition-all hover:scale-[1.02] hover:opacity-95 disabled:opacity-50"
        disabled={isDisabled}
        style={{
          background:
            "linear-gradient(135deg, #ff2e63 0%, #ff4ecd 20%, #7c3aed 100%)",
        }}
      >
        {isSubmitting ? (
          <Spinner className="size-4" />
        ) : (
          <CirclePlus className="size-4" />
        )}
        {isSubmitting ? "Creating..." : "Create Room"}
      </Button>
      {/* </Form.Submit> */}
    </Form.Root>
  );
};
