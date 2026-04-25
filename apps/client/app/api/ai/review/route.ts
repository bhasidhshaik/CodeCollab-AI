import { GoogleGenerativeAI } from "@google/generative-ai";
import { type NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    if (!code?.trim()) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are an expert code reviewer. Analyze the provided code and return a JSON response with this exact structure:
{
  "summary": "Brief overall assessment in 1-2 sentences",
  "score": <number 0-100 representing code quality>,
  "bugs": [
    { "line": <line number or null>, "severity": "high|medium|low", "description": "issue description", "fix": "suggested fix" }
  ],
  "improvements": [
    { "description": "improvement description", "example": "code example or null" }
  ],
  "bestPractices": [
    { "passed": <true|false>, "description": "practice description" }
  ],
  "security": [
    { "severity": "high|medium|low", "description": "security issue", "fix": "suggested fix" }
  ]
}
Return ONLY valid JSON, no markdown, no explanation.`,
    });

    const prompt = `Review this ${language || "code"}:\n\n\`\`\`${language || ""}\n${code}\n\`\`\``;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const clean = text.replace(/```json|```/g, "").trim();
    const review = JSON.parse(clean);

    return NextResponse.json(review);
  } catch (error) {
    console.error("Code review error:", error);
    return NextResponse.json(
      { error: "Failed to review code" },
      { status: 500 }
    );
  }
}
