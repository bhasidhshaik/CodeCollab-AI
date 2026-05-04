"use server";

import { JUDGE0_API_URL } from "@/lib/constants";

// Maps your Monaco/Piston language names to Judge0 language IDs
const LANGUAGE_MAP: Record<string, number> = {
  // Monaco alias (exact) → Judge0 ID
  "python": 109,
  "javascript": 102,
  "typescript": 101,
  "java": 91,
  "c++": 105,
  "cpp": 105,
  "c": 103,
  "c#": 51,
  "csharp": 51,
  "go": 107,
  "rust": 108,
  "kotlin": 111,
  "ruby": 72,
  "swift": 83,
  "php": 98,
  "scala": 112,
  "r": 99,
  "dart": 90,
  "shell": 46,
  "bash": 46,
  "sql": 82,
  "mysql": 82,
  "haskell": 61,
  "lua": 64,
};
interface ExecuteInput {
  args?: string[];
  code: string;
  language: string;
  stdin?: string;
}

function toBase64(str: string): string {
  return Buffer.from(str).toString("base64");
}

function fromBase64(str: string): string {
  if (!str) return "";
  return Buffer.from(str, "base64").toString("utf-8");
}

export async function executeCode(input: ExecuteInput) {
  if (!input.code) throw new Error("Code is required");
  if (!input.language) throw new Error("Language is required");

  const languageKey = input.language.toLowerCase();
  const languageId = LANGUAGE_MAP[languageKey];

  if (!languageId) {
    const message = [
      `Language "${input.language}" is not supported.`,
      "",
      "Supported languages: " + Object.keys(LANGUAGE_MAP).join(", "),
      "",
      "To change language, use the dropdown in the bottom right corner.",
    ].join("\n");

    return {
      language: input.language,
      version: "*",
      run: {
        stdout: "",
        stderr: message,
        code: 1,
        signal: null,
        output: message,
      },
      metadata: {
        args: input.args || [],
        stdin: input.stdin || "",
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Step 1 — Submit code to Judge0
  const submitRes = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
  language_id: languageId,
  source_code: toBase64(input.code),
  stdin: toBase64(input.stdin || ""),
  cpu_time_limit: 10,
  wall_time_limit: 20,
}),
  });

 if (!submitRes.ok) {
    const errorBody = await submitRes.text();
    console.error("Judge0 422 details:", errorBody);
    const message = `Judge0 error: ${submitRes.status} ${submitRes.statusText} — ${errorBody}`;
    return {
      language: input.language,
      version: "*",
      run: {
        stdout: "",
        stderr: message,
        code: 1,
        signal: null,
        output: message,
      },
      metadata: {
        args: input.args || [],
        stdin: input.stdin || "",
        timestamp: new Date().toISOString(),
      },
    };
  }

  const data = await submitRes.json();

  const stdout = fromBase64(data.stdout || "");
  const stderr = fromBase64(data.stderr || "") || fromBase64(data.compile_output || "");
  const output = stdout || stderr;

  // Normalize to same shape your app already expects from Piston
  return {
    language: input.language,
    version: "*",
    run: {
      stdout,
      stderr,
      code: data.exit_code ?? (data.status?.id === 3 ? 0 : 1),
      signal: null,
      output,
    },
    metadata: {
      args: input.args || [],
      stdin: input.stdin || "",
      timestamp: new Date().toISOString(),
    },
  };
}