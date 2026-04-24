import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { messages, code, language } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `You are an expert coding assistant integrated into CodeX, 
      a real-time collaborative coding platform. You help users with their code by 
      answering questions, explaining concepts, finding bugs, and suggesting improvements.
      Be concise, helpful, and format code snippets with proper markdown.
      ${code ? `The user is currently working with the following ${language || "code"}:\n\`\`\`${language || ""}\n${code}\n\`\`\`` : ""}`,
    });

    // Filter history: remove last message, remove welcome message,
    // and ensure history starts with a user message
    const history = messages
      .slice(0, -1)
      .filter((msg: { role: string; content: string }) => 
        msg.role === "user" || msg.role === "assistant"
      )
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Gemini requires history to start with user role
    const validHistory = history[0]?.role === "user" ? history : [];

    const chat = model.startChat({
      history: validHistory,
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}