/**
 * app/api/chat/route.ts
 * ──────────────────────
 * 流式 AI 对话代理。将客户端消息转发至 302.ai（Claude Sonnet 4.6），
 * 并将 SSE 流直接透传回客户端，避免整包等待。
 *
 * - API Key 从 .env.local 读取（NEXT_PUBLIC_302AI_KEY）
 * - 系统提示固定为"长河"角色，引导用户觉察情绪
 * - max_tokens: 400 保持回复简短有力
 */
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.302.ai/v1/chat/completions";

const SYSTEM_PROMPT = `你是"长河"，一个温柔、富有洞察力的AI生命记录伴侣。
你帮助用户记录情绪、回忆往事、整理内心感受。
你的风格：简洁、温暖、富有诗意，善用短句。
提问时用开放式问题，不要急着给建议，先帮用户觉察和表达。
每次回复不超过100字，简短但有分量。`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_302AI_KEY;
  if (!apiKey || apiKey === "your-302ai-key-here") {
    return NextResponse.json({ error: "302.ai API key not configured" }, { status: 500 });
  }

  const { messages } = await req.json();

  const resp = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
      max_tokens: 400,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    return NextResponse.json({ error: err }, { status: resp.status });
  }

  // Stream back to client
  return new NextResponse(resp.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
