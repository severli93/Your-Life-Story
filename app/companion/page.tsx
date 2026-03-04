"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import ShareModal, { type ShareCardData } from "@/components/ShareModal";

// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS — light theme (kimi paper aesthetic)
// ═══════════════════════════════════════════════════════════

const C = {
  paper:      "#FDFCF9",
  warm:       "#F9F6F0",
  parchment:  "#F3EFE7",
  ink:        "#2C2420",
  inkLight:   "#5A5048",
  inkMuted:   "#8B8075",
  accent:     "#D4A574",
  accentSoft: "#F0DFD0",
  border:     "rgba(44,36,32,.08)",
  borderD:    "rgba(44,36,32,.14)",
  shadow:     "0 2px 12px rgba(44,36,32,.06)",
  shadowMd:   "0 4px 20px rgba(44,36,32,.08)",
  r:          "24px",  // default border-radius
  rLg:        "32px",
} as const;

// ═══════════════════════════════════════════════════════════
// EMOTION CONFIG
// ═══════════════════════════════════════════════════════════

const E = {
  calm:    { label: "平静", bg: "#A8D5BA", glow: "168,213,186", breathMs: 4000 },
  joy:     { label: "喜悦", bg: "#FFB5C2", glow: "255,181,194", breathMs: 2500 },
  anxiety: { label: "焦虑", bg: "#FFD4A3", glow: "255,212,163", breathMs: 1800 },
  tired:   { label: "疲惫", bg: "#C9B8E8", glow: "201,184,232", breathMs: 5000 },
  sad:     { label: "失落", bg: "#A3C4E8", glow: "163,196,232", breathMs: 3500 },
  excited: { label: "兴奋", bg: "#D4E8A3", glow: "212,232,163", breathMs: 2000 },
} as const;
type EKey = keyof typeof E;

// ═══════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════

type DayRecord = { day: number; emotion: EKey; temp: number; note: string };
type MsgRole = "assistant" | "user";
type Msg = { id: string; role: MsgRole; text: string };

function seedRand(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

const NOTES: Record<EKey, string[]> = {
  calm:    ["今天很安静，一个人喝茶", "散步了很久，没什么特别的", "看了本书，挺好"],
  joy:     ["好朋友突然来访", "项目被夸了，很开心", "吃到了想念的食物"],
  anxiety: ["明天要交的方案还没完成", "一直在担心一件事", "睡前脑子停不下来"],
  tired:   ["连续开了8小时会", "太累了，什么都不想做", "身体有点沉"],
  sad:     ["突然很想家", "和老朋友失联了", "感觉有点被忽视"],
  excited: ["有个新想法，睡不着", "终于要出发了", "收到了好消息"],
};

function genMockData(): DayRecord[] {
  const rand = seedRand(42);
  const phases: { emotion: EKey; weight: number }[][] = [
    [{ emotion: "anxiety", weight: .5 }, { emotion: "tired", weight: .3 }, { emotion: "calm", weight: .2 }],
    [{ emotion: "excited", weight: .4 }, { emotion: "joy", weight: .4 }, { emotion: "calm", weight: .2 }],
    [{ emotion: "tired", weight: .5 }, { emotion: "sad", weight: .3 }, { emotion: "calm", weight: .2 }],
    [{ emotion: "sad", weight: .3 }, { emotion: "calm", weight: .4 }, { emotion: "joy", weight: .3 }],
    [{ emotion: "calm", weight: .4 }, { emotion: "joy", weight: .4 }, { emotion: "excited", weight: .2 }],
    [{ emotion: "excited", weight: .5 }, { emotion: "joy", weight: .3 }, { emotion: "anxiety", weight: .2 }],
    [{ emotion: "calm", weight: .35 }, { emotion: "joy", weight: .25 }, { emotion: "anxiety", weight: .2 }, { emotion: "tired", weight: .2 }],
  ];
  return Array.from({ length: 90 }, (_, i) => {
    const phase = phases[Math.floor(i / 13) % phases.length];
    const r = rand();
    let cumul = 0; let emotion: EKey = "calm";
    for (const p of phase) { cumul += p.weight; if (r < cumul) { emotion = p.emotion; break; } }
    const notes = NOTES[emotion];
    return { day: i, emotion, temp: Math.round(2 + rand() * 8), note: notes[Math.floor(rand() * notes.length)] };
  });
}

const DATA = genMockData();

// ═══════════════════════════════════════════════════════════
// SESSION — localStorage persistence
// ═══════════════════════════════════════════════════════════

type Session = {
  id: string;
  date: string;       // "3月4日"
  label: string;      // "第90天"
  emotion: EKey;
  temp: number;
  preview: string;    // first user message
  messages: Msg[];
};

const LS_KEY = "lc-sessions";

function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch { return []; }
}

function saveSessions(sessions: Session[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(sessions.slice(-20))); } catch { /* quota */ }
}

// Fallback keyword reply when API key not configured
function getReplyFallback(input: string, histLen: number): string {
  const t = input.toLowerCase();
  if (histLen === 1) {
    if (t.includes("累") || t.includes("疲")) return "累了。\n\n是身体上的那种，还是心里也一起累了？";
    if (t.includes("焦虑") || t.includes("担心")) return "焦虑，嗯。\n\n那个感觉现在大概几分？0 是完全平静，10 是风暴。";
    if (t.includes("好") || t.includes("不错")) return "听起来是平静的一天。\n\n有什么让你印象深刻的瞬间吗？";
    return "谢谢你说这些。\n\n今天里，有什么最想先聊的？";
  }
  if (t.includes("怎么办") || t.includes("帮我")) return "在说怎么办之前——\n\n你现在最需要的是被听见，还是一起找方法？";
  const pool = [
    "我好奇——\n\n你说这些的时候，心里是什么感受？",
    "听起来这件事不只是表面那样。\n\n里面有什么你还没说出来的？",
    "嗯。\n\n你想继续说吗？我在。",
    "这件事，它让你感受到了什么？",
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════

export default function CompanionPage() {
  // Theme follows user preference — no override here

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activePanel, setActivePanel] = useState<"chart" | "river">("chart");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "history">("chat");
  const [selHistory, setSelHistory] = useState<string | null>(null);
  const [histMsgs, setHistMsgs] = useState<Msg[]>([]);
  const [histPlaying, setHistPlaying] = useState(false);
  const [calTooltip, setCalTooltip] = useState<DayRecord | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayRecord | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeMemoryDay, setActiveMemoryDay] = useState<number | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [curSessionId] = useState(() => `s-${Date.now()}`);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialized = useRef(false);
  const playTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load saved sessions on mount
  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setTimeout(() => setMessages([{ id: "open", role: "assistant", text: "你好，我是长河。\n\n今天，过得怎么样？" }]), 600);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping, histMsgs]);

  // Save current session to localStorage whenever messages change (debounced)
  useEffect(() => {
    const userMsgs = messages.filter(m => m.role === "user");
    if (userMsgs.length === 0) return;
    const today = DATA[DATA.length - 1];
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`;
    const session: Session = {
      id: curSessionId,
      date: dateStr,
      label: `第${DATA.length}天`,
      emotion: today.emotion,
      temp: today.temp,
      preview: userMsgs[0].text.slice(0, 30),
      messages,
    };
    setSessions(prev => {
      const others = prev.filter(s => s.id !== curSessionId);
      const next = [...others, session];
      saveSessions(next);
      return next;
    });
  }, [messages, curSessionId]);

  const playHistory = useCallback((id: string) => {
    const hist = sessions.find(h => h.id === id);
    if (!hist) return;
    setSelHistory(id);
    setHistMsgs([]);
    setHistPlaying(true);
    if (playTimer.current) clearInterval(playTimer.current);
    let idx = 0;
    const tick = () => {
      if (idx >= hist.messages.length) { setHistPlaying(false); if (playTimer.current) clearInterval(playTimer.current); return; }
      const m = hist.messages[idx];
      setHistMsgs(prev => [...prev, { ...m, id: `${id}-${idx}` }]);
      idx++;
    };
    tick();
    playTimer.current = setInterval(tick, 420);
  }, [sessions]);

  useEffect(() => () => {
    if (playTimer.current) clearInterval(playTimer.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  // Handle calendar day click — show in sidebar
  const handleDayClick = useCallback((d: DayRecord) => {
    setSelectedDay(d);
    setSidebarOpen(true);
    setSidebarTab("history");
    setSelHistory(null);
    setHistMsgs([]);
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    const userMsg: Msg = { id: Date.now().toString(), role: "user", text };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");
    setIsTyping(true);

    // Build API payload (exclude opening assistant msg for brevity)
    const apiMsgs = allMsgs
      .filter(m => m.id !== "open")
      .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));

    // Try streaming API, fallback to keyword reply
    const replyId = (Date.now() + 1).toString();
    try {
      abortRef.current = new AbortController();
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMsgs }),
        signal: abortRef.current.signal,
      });
      if (!resp.ok || !resp.body) throw new Error("no stream");

      setIsTyping(false);
      setMessages(prev => [...prev, { id: replyId, role: "assistant", text: "" }]);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const chunk = JSON.parse(data);
            const delta = chunk.choices?.[0]?.delta?.content ?? "";
            if (delta) setMessages(prev => prev.map(m => m.id === replyId ? { ...m, text: m.text + delta } : m));
          } catch { /* skip bad chunks */ }
        }
      }
    } catch {
      // Fallback to keyword reply
      const histLen = messages.filter(m => m.role === "user").length + 1;
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
      setIsTyping(false);
      setMessages(prev => [...prev, { id: replyId, role: "assistant", text: getReplyFallback(text, histLen) }]);
    }
  }, [input, isTyping, messages]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
  };

  const today = DATA[DATA.length - 1];
  const shownMsgs = sidebarTab === "history" && selHistory ? histMsgs : messages;
  const inHistory = sidebarTab === "history" && !!selHistory;

  // Stats
  const recent30 = DATA.slice(-30);
  const avgTemp = (recent30.reduce((s, d) => s + d.temp, 0) / 30).toFixed(1);
  const mostCommon = (() => {
    const c: Partial<Record<EKey, number>> = {};
    recent30.forEach(d => { c[d.emotion] = (c[d.emotion] || 0) + 1; });
    return (Object.entries(c) as [EKey, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] as EKey;
  })();
  const calmDays = recent30.filter(d => d.emotion === "calm" || d.emotion === "joy").length;

  return (
    <div style={{
      height: "100svh",
      display: "flex",
      flexDirection: "column",
      background: C.paper,
      fontFamily: "var(--font-nunito, 'Nunito', sans-serif)",
      color: C.ink,
      paddingTop: 60,
      overflow: "hidden",
    }}>
      <style>{`
        /* scrollbar */
        .slim::-webkit-scrollbar { width: 3px; }
        .slim::-webkit-scrollbar-thumb { background: ${C.borderD}; border-radius: 2px; }

        /* chat animations */
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .msg-in { animation: msgIn .35s ease forwards; }
        @keyframes readIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        .read-in { animation: readIn .4s ease forwards; opacity:0; }

        /* typing dots */
        @keyframes dot { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-4px);opacity:1} }
        .dot { width:5px;height:5px;border-radius:50%;background:${C.accent};display:inline-block;animation:dot 1.3s ease-in-out infinite; }
        .dot:nth-child(2){animation-delay:.17s}.dot:nth-child(3){animation-delay:.34s}

        /* sidebar slide */
        .sidebar { transition: width .28s cubic-bezier(.25,.46,.45,.94); overflow:hidden; flex-shrink:0; }

        /* status pulse */
        @keyframes statusPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .status-dot { animation: statusPulse 2.2s ease-in-out infinite; }

        /* breathing dots — Pillow Talk */
        @keyframes bCalm    { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(168,213,186,.7)} 50%{transform:scale(1.35);box-shadow:0 0 0 4px rgba(168,213,186,0)} }
        @keyframes bJoy     { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,181,194,.7)} 50%{transform:scale(1.35);box-shadow:0 0 0 4px rgba(255,181,194,0)} }
        @keyframes bAnxiety { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,212,163,.7)} 50%{transform:scale(1.38);box-shadow:0 0 0 4px rgba(255,212,163,0)} }
        @keyframes bTired   { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(201,184,232,.7)} 50%{transform:scale(1.3); box-shadow:0 0 0 4px rgba(201,184,232,0)} }
        @keyframes bSad     { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(163,196,232,.7)} 50%{transform:scale(1.3); box-shadow:0 0 0 4px rgba(163,196,232,0)} }
        @keyframes bExcited { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(212,232,163,.7)} 50%{transform:scale(1.4); box-shadow:0 0 0 4px rgba(212,232,163,0)} }

        .bc { border-radius:50%; border:1.5px solid rgba(44,36,32,.45); cursor:pointer; flex-shrink:0; }
        .bc-calm    { animation: bCalm    4s   ease-in-out infinite; }
        .bc-joy     { animation: bJoy     2.5s ease-in-out infinite; }
        .bc-anxiety { animation: bAnxiety 1.8s ease-in-out infinite; }
        .bc-tired   { animation: bTired   5s   ease-in-out infinite; }
        .bc-sad     { animation: bSad     3.5s ease-in-out infinite; }
        .bc-excited { animation: bExcited 2s   ease-in-out infinite; }
        .bc:hover   { transform:scale(1.7) !important; transition:transform .15s !important; }

        /* tab button */
        .vtab { padding:6px 16px;border-radius:999px;cursor:pointer;font-size:12px;font-weight:700;
          font-family:inherit;transition:background .15s,color .15s,border-color .15s; }
        .vtab-on  { background:rgba(212,168,83,.14);color:#6B5030;border:1.5px solid rgba(212,168,83,.45); }
        .vtab-off { background:transparent;color:${C.inkMuted};border:1.5px dashed ${C.borderD}; }
        .vtab-off:hover { border-color:${C.accent};color:${C.accent}; }

        /* history item */
        .hist-btn { transition:transform .15s,box-shadow .15s; }
        .hist-btn:hover { transform:translateY(-2px);box-shadow:${C.shadowMd}; }

        /* textarea */
        .chat-ta { resize:none;outline:none;border:none;background:transparent;font-family:inherit; }
        .chat-ta::placeholder { color:${C.inkMuted}; }
      `}</style>

      {/* ── TOPBAR ─────────────────────────────────── */}
      {(() => {
        const hovered = calTooltip;
        const displayDay = hovered || today;
        const now = new Date();
        const todayLabel = `${now.getMonth() + 1}月${now.getDate()}日`;
        const dayLabel = hovered ? `第 ${hovered.day + 1} 天` : `今日 · ${todayLabel}`;
        return (
          <div style={{
            height: 60, flexShrink: 0,
            display: "flex", alignItems: "center", gap: 14, padding: "0 24px",
            background: C.warm,
            borderBottom: `1px solid ${C.border}`,
          }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
              <span style={{ fontFamily: "var(--font-display,'Playfair Display',serif)", fontSize: 15, color: C.ink }}>长河</span>
            </Link>

            <div style={{ width: 1, height: 20, background: C.borderD }} />

            {/* Dynamic day info — updates on calendar hover */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div className={`bc bc-${displayDay.emotion}`} style={{ width: 10, height: 10, background: E[displayDay.emotion].bg, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{dayLabel}</span>
                <span style={{ fontSize: 12, color: C.inkLight }}>{E[displayDay.emotion].label}</span>
                <span style={{ fontSize: 11, color: C.inkMuted }}>温度 {displayDay.temp}/10</span>
              </div>
              {hovered && (
                <div style={{ fontSize: 11, color: C.inkMuted, fontStyle: "italic", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>
                  {hovered.note}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── MAIN LAYOUT ───────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <div style={{ display: "flex", flexShrink: 0 }}>
          <aside className="sidebar" style={{
            width: sidebarOpen ? 340 : 60,
            background: C.warm,
            borderRight: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
          }}>

            {/* COLLAPSED STRIP */}
            {!sidebarOpen && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 0", gap: 14 }}>
                <button onClick={() => setSidebarOpen(true)} style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.accentSoft},${C.accent})`,
                  border: `1.5px solid rgba(44,36,32,.25)`,
                  fontSize: 18, cursor: "pointer", boxShadow: C.shadow,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>🌊</button>
                {sessions.filter(s => s.id !== curSessionId).slice(-6).map(h => (
                  <div key={h.id} title={h.date}
                    className={`bc bc-${h.emotion}`}
                    style={{ width: 12, height: 12, background: E[h.emotion].bg, cursor: "pointer", animationDelay: "0s" }}
                    onClick={() => { setSidebarOpen(true); setSidebarTab("history"); playHistory(h.id); }} />
                ))}
              </div>
            )}

            {/* EXPANDED */}
            {sidebarOpen && (
              <>
                {/* Header */}
                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: `linear-gradient(135deg,${C.accentSoft},${C.accent})`,
                    border: `1.5px solid rgba(44,36,32,.2)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>🌊</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>长河</div>
                    <div style={{ fontSize: 11, color: C.inkMuted, display: "flex", alignItems: "center", gap: 5 }}>
                      <span className="status-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#7DB89A", display: "inline-block" }} />在线
                    </div>
                  </div>
                  {/* Tabs */}
                  <div style={{ display: "flex", gap: 4 }}>
                    {(["chat", "history"] as const).map(t => (
                      <button key={t} onClick={() => { setSidebarTab(t); if (t === "chat") { setSelHistory(null); setHistMsgs([]); } }}
                        style={{
                          padding: "4px 10px", borderRadius: 999,
                          border: `1.5px ${sidebarTab === t ? "solid" : "dashed"} ${sidebarTab === t ? C.accent : C.borderD}`,
                          background: sidebarTab === t ? `${C.accent}22` : "transparent",
                          color: sidebarTab === t ? C.accent : C.inkMuted,
                          fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                        }}>
                        {t === "chat" ? "今天" : "历史"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HISTORY LIST / DAY DETAIL */}
                {sidebarTab === "history" && !selHistory && (
                  <div className="slim" style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Day detail from calendar click */}
                    {selectedDay && (
                      <div style={{ background: C.warm, borderRadius: C.r, padding: "14px 16px", border: `1px solid ${C.borderD}`, marginBottom: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>第 {selectedDay.day + 1} 天</span>
                          <button onClick={() => setSelectedDay(null)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 11, color: C.inkMuted, fontFamily: "inherit" }}>✕ 关闭</button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <div className={`bc bc-${selectedDay.emotion}`} style={{ width: 12, height: 12, background: E[selectedDay.emotion].bg, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.inkLight }}>{E[selectedDay.emotion].label}</span>
                          <span style={{ fontSize: 11, color: C.inkMuted }}>温度 {selectedDay.temp}/10</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.65, fontStyle: "italic" }}>{selectedDay.note}</div>
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: C.inkMuted, marginBottom: 4, padding: "0 2px" }}>
                      {sessions.filter(s => s.id !== curSessionId).length === 0 ? "暂无历史记录，开始对话后自动保存" : "点击任意对话回放"}
                    </div>
                    {sessions.filter(s => s.id !== curSessionId).slice().reverse().map(h => (
                      <button key={h.id} className="hist-btn" onClick={() => playHistory(h.id)}
                        style={{
                          display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left",
                          padding: "12px 14px", borderRadius: C.r,
                          background: C.paper, border: `1px solid ${C.border}`,
                          cursor: "pointer", fontFamily: "inherit", boxShadow: C.shadow,
                        }}>
                        <div style={{ flexShrink: 0, paddingTop: 2 }}>
                          <div className={`bc bc-${h.emotion}`} style={{ width: 14, height: 14, background: E[h.emotion].bg }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{h.date}</span>
                            <span style={{ fontSize: 11, color: C.inkMuted }}>{h.label}</span>
                          </div>
                          <div style={{ fontSize: 12, color: C.inkMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.preview}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* CHAT / HISTORY PLAYBACK */}
                {(sidebarTab === "chat" || (sidebarTab === "history" && selHistory)) && (
                  <>
                    {/* History back bar */}
                    {inHistory && (
                      <div style={{ padding: "8px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <button onClick={() => { setSelHistory(null); setHistMsgs([]); }}
                          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: C.inkMuted, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                          ← 历史列表
                        </button>
                        {(() => { const h = sessions.find(h => h.id === selHistory); return h ? (
                          <span style={{ marginLeft: "auto", fontSize: 12, color: C.inkLight, fontWeight: 600 }}>{h.date} · {E[h.emotion].label}</span>
                        ) : null; })()}
                        {histPlaying && <div style={{ display: "flex", gap: 3 }}><span className="dot"/><span className="dot"/><span className="dot"/></div>}
                      </div>
                    )}

                    {/* Messages */}
                    <div className="slim" style={{ flex: 1, overflowY: "auto", padding: "14px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                      {shownMsgs.map((m, idx) => (
                        <div key={m.id} className={inHistory ? "read-in" : "msg-in"}
                          style={{ animationDelay: `${idx * 0.04}s`, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                          {m.role === "assistant" && (
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.accentSoft},${C.accent})`, border: `1.5px solid rgba(44,36,32,.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🌊</div>
                          )}
                          <div style={{
                            maxWidth: "80%", padding: "10px 14px",
                            borderRadius: m.role === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                            background: m.role === "user" ? C.accent : C.paper,
                            color: m.role === "user" ? C.paper : C.ink,
                            fontSize: 13.5, lineHeight: 1.72, whiteSpace: "pre-wrap",
                            border: m.role === "user" ? "none" : `1px solid ${C.border}`,
                            boxShadow: C.shadow,
                          }}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      {isTyping && sidebarTab === "chat" && (
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.accentSoft},${C.accent})`, border: `1.5px solid rgba(44,36,32,.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🌊</div>
                          <div style={{ background: C.paper, borderRadius: "20px 20px 20px 6px", padding: "10px 14px", display: "flex", gap: 4, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                            <span className="dot"/><span className="dot"/><span className="dot"/>
                          </div>
                        </div>
                      )}
                      <div ref={bottomRef} />
                    </div>

                    {/* Quick prompts */}
                    {sidebarTab === "chat" && messages.filter(m => m.role === "user").length === 0 && (
                      <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {["今天有点累…", "有件事放不下", "我想记录一下"].map(p => (
                          <button key={p} onClick={() => { setInput(p); inputRef.current?.focus(); }}
                            style={{ background: "transparent", border: `1.5px dashed ${C.borderD}`, borderRadius: 999, padding: "5px 12px", fontSize: 12, color: C.inkLight, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input area */}
                    {sidebarTab === "chat" && (
                      <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, background: C.paper, border: `1.5px solid ${C.borderD}`, borderRadius: 999, padding: "8px 8px 8px 16px", boxShadow: C.shadow }}>
                          <textarea ref={inputRef} className="chat-ta" value={input} onChange={handleChange} onKeyDown={handleKey}
                            placeholder="此刻的心情……" rows={1}
                            style={{ flex: 1, fontSize: 13.5, color: C.ink, lineHeight: 1.6, minHeight: 20, maxHeight: 100 }} />
                          <button onClick={send} disabled={!input.trim() || isTyping}
                            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", flexShrink: 0, cursor: input.trim() && !isTyping ? "pointer" : "default", transition: "background .2s",
                              background: input.trim() && !isTyping ? C.ink : C.borderD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M7 3l4 4-4 4" stroke={input.trim() && !isTyping ? C.paper : C.inkMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                        <div style={{ textAlign: "center", marginTop: 6, fontSize: 10, color: C.inkMuted }}>Enter 发送 · 对话仅存本地</div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </aside>

          {/* Collapse handle — intentionally subtle */}
          <button onClick={() => setSidebarOpen(v => !v)}
            style={{ width: 12, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.borderD, flexShrink: 0, opacity: 0.35, transition: "opacity .2s, color .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.color = C.accent; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.35"; (e.currentTarget as HTMLButtonElement).style.color = C.borderD; }}>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
              {sidebarOpen
                ? <path d="M5 1L1 6l4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M1 1l4 5-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
            </svg>
          </button>
        </div>

        {/* ── VIZ PANEL ──────────────────────────────── */}
        <main style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: C.paper,
          minWidth: 0,
        }}>
          {/* Viz header */}
          <div style={{ padding: "10px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {activePanel === "river" && (
                <button onClick={() => setActivePanel("chart")}
                  style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: C.inkMuted, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                  ← 情绪图表
                </button>
              )}
              <div>
                <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: C.accent, fontWeight: 700 }}>
                  {activePanel === "chart" ? "EMOTION DASHBOARD" : "LIFE RIVER"}
                </div>
                <div style={{ fontFamily: "var(--font-display,'Playfair Display',serif)", fontSize: 18, color: C.ink, lineHeight: 1.2 }}>
                  {activePanel === "chart" ? "情绪图表" : "生命长河"}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.inkMuted }}>
              连续记录 {DATA.length} 天 · {new Date().getFullYear()}年{new Date().getMonth() + 1}月
            </div>
          </div>

          {/* Charts — fixed-height, no scroll */}
          {activePanel === "chart" ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 20px", gap: 12, overflow: "hidden", minHeight: 0 }}>

              {/* Row 1: Stats (fixed height) */}
              {(() => {
                const now = new Date();
                const todayStr = `${now.getMonth() + 1}/${now.getDate()}`;
                const stats = [
                  { v: todayStr, label: "今日日期", color: E.joy.bg, click: null },
                  { v: E[mostCommon]?.label ?? "-", label: "主导情绪", color: E[mostCommon]?.bg ?? "#eee", click: null },
                  { v: String(calmDays), label: "平静/喜悦天", color: E.calm.bg, click: null },
                  { v: String(DATA.length), label: "连续记录天 →", color: E.tired.bg, click: () => setActivePanel("river") },
                ];
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, flexShrink: 0 }}>
                    {stats.map((s, i) => (
                      <div key={i}
                        onClick={s.click ?? undefined}
                        style={{
                          padding: "12px 14px", background: C.warm, borderRadius: C.r,
                          border: `1px solid ${s.click ? C.borderD : C.border}`,
                          boxShadow: C.shadow, position: "relative",
                          cursor: s.click ? "pointer" : "default",
                          transition: "transform .15s, box-shadow .15s",
                        }}
                        onMouseEnter={s.click ? e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = C.shadowMd; } : undefined}
                        onMouseLeave={s.click ? e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = C.shadow; } : undefined}
                      >
                        <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: s.color, border: "1.5px solid rgba(44,36,32,.35)" }} />
                        <div style={{ fontFamily: "var(--font-display,'Playfair Display',serif)", fontSize: 26, color: C.accent, lineHeight: 1 }}>{s.v}</div>
                        <div style={{ fontSize: 10, color: s.click ? C.accent : C.inkMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Row 2: Calendar (left) + Week + Donut (right) — flex-1 */}
              <div style={{ flex: 1, display: "flex", gap: 12, minHeight: 0 }}>

                {/* Calendar */}
                <div style={{ flex: 2, background: C.warm, borderRadius: C.rLg, padding: "16px 18px", border: `1px solid ${C.border}`, boxShadow: C.shadow, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.inkLight }}>情绪日历</span>
                    <span style={{ fontSize: 11, color: C.inkMuted }}>每点 = 一天</span>
                  </div>
                  <CalendarGrid data={DATA} tooltip={calTooltip} onHover={setCalTooltip} selectedDay={selectedDay} onDayClick={handleDayClick} />
                </div>

                {/* Right col: Week + Donut */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
                  <div style={{ flex: 1, background: C.warm, borderRadius: C.rLg, padding: "14px 16px", border: `1px solid ${C.border}`, boxShadow: C.shadow, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: C.inkLight, marginBottom: 8, flexShrink: 0 }}>本周节律</div>
                    <WeekBars data={DATA} />
                  </div>
                  <div style={{ flex: 1, background: C.warm, borderRadius: C.rLg, padding: "14px 16px", border: `1px solid ${C.border}`, boxShadow: C.shadow, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: C.inkLight, marginBottom: 8, flexShrink: 0 }}>情绪构成</div>
                    <MiniDonut data={DATA} />
                  </div>
                </div>
              </div>

              {/* Row 3: Trend + Bubbles (fixed height) */}
              <div style={{ display: "flex", gap: 12, flexShrink: 0, height: 124 }}>
                <div style={{ flex: 2, background: C.warm, borderRadius: C.rLg, padding: "14px 18px", border: `1px solid ${C.border}`, boxShadow: C.shadow, overflow: "hidden" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.inkLight, marginBottom: 6 }}>月度情绪温度</div>
                  <MiniTrend data={DATA} />
                </div>
                <div style={{ flex: 1, background: C.warm, borderRadius: C.rLg, padding: "14px 16px", border: `1px solid ${C.border}`, boxShadow: C.shadow, overflow: "hidden" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.inkLight, marginBottom: 8 }}>情绪频次</div>
                  <MiniCluster data={DATA} />
                </div>
              </div>

            </div>
          ) : (
            /* River panel */
            <div className="slim" style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: C.warm, borderRadius: C.rLg, padding: "18px 20px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.inkLight, marginBottom: 12 }}>生命长河 · 过去 90 天情绪流动</div>
                <LifeRiver data={DATA} activeDay={activeMemoryDay} />
              </div>
              <MemoryList activeDay={activeMemoryDay} onSelect={setActiveMemoryDay} />
              <div style={{ background: C.warm, borderRadius: C.rLg, padding: "20px 24px", border: `1px solid ${C.border}`, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display,'Playfair Display',serif)", fontSize: 20, marginBottom: 6 }}>将长河生成你的故事</div>
                <div style={{ fontSize: 13, color: C.inkLight, marginBottom: 18 }}>{DATA.length}天的情绪记录，生成一份属于你的人生长河</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setShowShare(true)} style={{
                    background: "linear-gradient(135deg, #D4A853, #ECC56A)",
                    color: "#3D2A0E", border: "none", borderRadius: 999,
                    padding: "12px 28px", fontSize: 13, fontWeight: 800,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 4px 16px rgba(212,168,83,.35)",
                  }}>
                    ✦ 生成分享卡片
                  </button>
                  <Link href="/create" style={{ textDecoration: "none" }}>
                    <button style={{ background: "transparent", color: C.ink, border: `1.5px solid ${C.borderD}`, borderRadius: 999, padding: "11px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      生成完整故事 →
                    </button>
                  </Link>
                </div>
              </div>

              {/* Share Modal */}
              {showShare && (() => {
                const shareData: ShareCardData = {
                  title: "我的生命长河",
                  subtitle: `已连续记录 ${DATA.length} 天`,
                  emotionLabel: E[mostCommon]?.label ?? "平静",
                  emotionColor: E[mostCommon]?.bg ?? "#A8D5BA",
                  stats: [
                    { value: String(DATA.length), label: "记录天数" },
                    { value: String(calmDays), label: "平静喜悦天" },
                  ],
                  tagline: "每一天的感受，都值得被好好记录",
                };
                return <ShareModal data={shareData} onClose={() => setShowShare(false)} />;
              })()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CALENDAR — breathing dots, fixed 12px, fits in flex container
// ═══════════════════════════════════════════════════════════

function CalendarGrid({ data, tooltip, onHover, selectedDay, onDayClick }: {
  data: DayRecord[];
  tooltip: DayRecord | null;
  onHover: (d: DayRecord | null) => void;
  selectedDay: DayRecord | null;
  onDayClick: (d: DayRecord) => void;
}) {
  const rand = seedRand(99);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Grid */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(13, 1fr)", gridTemplateRows: "repeat(7, 1fr)", gap: 5, minHeight: 0 }}>
        {data.slice(0, 91).map((d, i) => {
          const size = 9 + (d.temp / 10) * 5; // 9–14px
          const delay = ((i % 13) * 0.11 + Math.floor(i / 13) * 0.06 + rand() * 0.25).toFixed(2);
          const isSelected = selectedDay?.day === d.day;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                className={`bc bc-${d.emotion}`}
                style={{
                  width: isSelected ? size + 3 : size,
                  height: isSelected ? size + 3 : size,
                  background: E[d.emotion].bg,
                  animationDelay: `${delay}s`,
                  opacity: isSelected ? 1 : 0.55 + d.temp / 20,
                  outline: isSelected ? `2px solid ${C.accent}` : "none",
                  outlineOffset: 2,
                  cursor: "pointer",
                  transition: "width .15s, height .15s, outline .15s",
                } as React.CSSProperties}
                onMouseEnter={() => onHover(d)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onDayClick(d)}
                title={`第${d.day + 1}天 · ${E[d.emotion].label} · ${d.note}`}
              />
            </div>
          );
        })}
      </div>

      {/* Legend + tooltip in one row */}
      <div style={{ marginTop: 8, flexShrink: 0, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {tooltip ? (
          <div style={{ fontSize: 11, color: C.inkLight, display: "flex", alignItems: "center", gap: 6 }}>
            <div className={`bc bc-${tooltip.emotion}`} style={{ width: 8, height: 8, background: E[tooltip.emotion].bg, flexShrink: 0 }} />
            <strong>{E[tooltip.emotion].label}</strong> · 第 {tooltip.day + 1} 天 · 温度 {tooltip.temp}/10
            <span style={{ color: C.inkMuted, fontStyle: "italic" }}>{tooltip.note}</span>
          </div>
        ) : (
          (Object.entries(E) as [EKey, typeof E[EKey]][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.inkMuted }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.bg, border: "1.5px solid rgba(44,36,32,.4)" }} />
              {v.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WEEK BARS — compact
// ═══════════════════════════════════════════════════════════

function WeekBars({ data }: { data: DayRecord[] }) {
  const DAYS = ["一", "二", "三", "四", "五", "六", "日"];
  const d7 = data.slice(-7);
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6, paddingBottom: 18, position: "relative" }}>
      {d7.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", gap: 4 }}>
          <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: "100%", height: `${(d.temp / 10) * 90}%`, minHeight: 4, background: E[d.emotion].bg, borderRadius: "5px 5px 0 0", border: "1.5px solid rgba(44,36,32,.3)", borderBottom: "none", opacity: .85 }} />
          </div>
          <div style={{ fontSize: 10, color: C.inkMuted, fontWeight: 600, position: "absolute", bottom: 2, left: `calc(${(i / 7) * 100}% + 50%/${7})` }}>
            {DAYS[i]}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MINI DONUT — compact
// ═══════════════════════════════════════════════════════════

function MiniDonut({ data }: { data: DayRecord[] }) {
  const counts: Record<string, number> = {};
  data.forEach(d => { counts[d.emotion] = (counts[d.emotion] || 0) + 1; });
  const total = data.length;
  const CX = 44, CY = 44, R = 36, IN = 23;
  let angle = -Math.PI / 2;
  const slices = (Object.entries(counts) as [EKey, number][]).map(([k, v]) => {
    const start = angle, sweep = (v / total) * Math.PI * 2;
    angle += sweep;
    const x1 = CX + R * Math.cos(start), y1 = CY + R * Math.sin(start);
    const x2 = CX + R * Math.cos(start + sweep), y2 = CY + R * Math.sin(start + sweep);
    const ix1 = CX + IN * Math.cos(start), iy1 = CY + IN * Math.sin(start);
    const ix2 = CX + IN * Math.cos(start + sweep), iy2 = CY + IN * Math.sin(start + sweep);
    const lg = sweep > Math.PI ? 1 : 0;
    const d = `M${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${lg},1 ${x2.toFixed(1)},${y2.toFixed(1)} L${ix2.toFixed(1)},${iy2.toFixed(1)} A${IN},${IN} 0 ${lg},0 ${ix1.toFixed(1)},${iy1.toFixed(1)} Z`;
    return { key: k, pct: Math.round(v / total * 100), d };
  });
  const top = slices.sort((a, b) => b.pct - a.pct)[0];
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, minHeight: 0 }}>
      <svg width={88} height={88} viewBox="0 0 88 88" style={{ flexShrink: 0 }}>
        {slices.map(s => <path key={s.key} d={s.d} fill={E[s.key as EKey]?.bg ?? "#eee"} stroke="rgba(44,36,32,.12)" strokeWidth={.8} />)}
        <text x={CX} y={CY - 5} textAnchor="middle" fontFamily="Playfair Display,serif" fontSize={14} fontWeight={700} fill={C.accent}>{top?.pct}%</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontFamily="Nunito,sans-serif" fontSize={9} fill={C.inkMuted}>{E[top?.key as EKey]?.label}</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {slices.slice(0, 4).map(s => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: E[s.key as EKey]?.bg, border: "1.5px solid rgba(44,36,32,.4)", flexShrink: 0 }} />
            <span style={{ color: C.inkLight }}>{E[s.key as EKey]?.label}</span>
            <span style={{ color: C.inkMuted, fontSize: 11 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MINI TREND — compact SVG
// ═══════════════════════════════════════════════════════════

function MiniTrend({ data }: { data: DayRecord[] }) {
  const recent = data.slice(-30);
  const W = 400, H = 56;
  const pts = recent.map((d, i) => ({ x: (i / 29) * W, y: H - (d.temp / 10) * (H - 8), ...d }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 14}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.accent} stopOpacity=".22"/>
          <stop offset="100%" stopColor={C.accent} stopOpacity=".02"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#tg2)" />
      <path d={line} fill="none" stroke={C.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      {pts.filter(p => p.temp >= 8 || p.temp <= 3).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={E[p.emotion].bg} stroke={C.ink} strokeWidth={1.2} />
      ))}
      {[0, 14, 29].map(i => (
        <text key={i} x={pts[i]?.x ?? 0} y={H + 13} fontSize={10} textAnchor="middle" fill={C.inkMuted} fontFamily="Nunito,sans-serif">
          {i === 0 ? "30天前" : i === 14 ? "15天前" : "今天"}
        </text>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// MINI CLUSTER — compact bubbles
// ═══════════════════════════════════════════════════════════

function MiniCluster({ data }: { data: DayRecord[] }) {
  const counts: Partial<Record<EKey, number>> = {};
  data.forEach(d => { counts[d.emotion] = (counts[d.emotion] || 0) + 1; });
  const max = Math.max(...Object.values(counts) as number[]);
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      {(Object.entries(counts) as [EKey, number][]).sort((a, b) => b[1] - a[1]).map(([k, v]) => {
        const sz = 22 + (v / max) * 18;
        return (
          <div key={k} style={{ width: sz, height: sz, borderRadius: "50%", background: E[k].bg, border: "1.5px solid rgba(44,36,32,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz > 32 ? 10 : 8, fontWeight: 700, color: C.ink, opacity: .88, cursor: "default" }}
            title={`${E[k].label}: ${v} 天`}>
            {sz > 32 ? E[k].label : ""}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LIFE RIVER
// ═══════════════════════════════════════════════════════════

function LifeRiver({ data, activeDay }: { data: DayRecord[]; activeDay: number | null }) {
  const W = 680, H = 130, SEG = 5;
  const segs: { emotion: EKey; temp: number }[] = [];
  for (let i = 0; i < data.length; i += SEG) {
    const chunk = data.slice(i, i + SEG);
    const c: Partial<Record<EKey, number>> = {};
    chunk.forEach(d => { c[d.emotion] = (c[d.emotion] || 0) + 1; });
    const dom = (Object.entries(c) as [EKey, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] as EKey;
    segs.push({ emotion: dom, temp: chunk.reduce((s, d) => s + d.temp, 0) / chunk.length });
  }
  const rand = seedRand(7);
  const sw = W / segs.length;
  const pts = segs.map((s, i) => ({
    x: i * sw + sw / 2,
    y: H / 2 + Math.sin(i * .7 + 1.2) * 20 + (rand() - .5) * 7,
    ...s,
  }));
  const paths = pts.slice(0, -1).map((p, i) => {
    const nx = pts[i + 1];
    const d = `M${p.x.toFixed(1)},${p.y.toFixed(1)} Q${((p.x + nx.x) / 2).toFixed(1)},${((p.y + nx.y) / 2).toFixed(1)} ${nx.x.toFixed(1)},${nx.y.toFixed(1)}`;
    return { d, color: E[p.emotion].bg, w: 7 + (p.temp / 10) * 14, i };
  });
  // Which segment corresponds to activeDay?
  const activeSeg = activeDay !== null ? Math.min(Math.floor(activeDay / SEG), paths.length - 1) : null;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={W} height={H + 30} viewBox={`0 0 ${W} ${H + 30}`} style={{ minWidth: W }}>
        <defs>
          {/* Path definitions used by animateMotion particles */}
          {paths.map(p => <path key={`def-${p.i}`} id={`rp-${p.i}`} d={p.d} />)}
        </defs>

        {/* Base colored river strokes */}
        {paths.map(p => (
          <path key={p.i} d={p.d} fill="none" stroke={p.color} strokeWidth={p.w}
            strokeLinecap="round" opacity={activeSeg !== null && activeSeg !== p.i ? 0.45 : 0.78}
            style={{ transition: "opacity .3s" }} />
        ))}

        {/* Center guide dashes */}
        <path d={pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
          fill="none" stroke="rgba(44,36,32,.08)" strokeWidth={1.2} strokeDasharray="3,5" />

        {/* Active segment highlight ring */}
        {activeSeg !== null && (
          <>
            <path d={paths[activeSeg].d} fill="none" stroke={paths[activeSeg].color}
              strokeWidth={paths[activeSeg].w + 10} strokeLinecap="round" opacity={0.2} />
            <path d={paths[activeSeg].d} fill="none" stroke="rgba(44,36,32,.55)"
              strokeWidth={2} strokeLinecap="round" strokeDasharray="4,3" opacity={0.6} />
          </>
        )}

        {/* Flowing particles — 2 per segment, staggered */}
        {paths.map(p => (
          <g key={`par-${p.i}`}>
            {[0, 1.8].map((delay, j) => (
              <g key={j}>
                <circle r={0} fill={p.color} opacity={0}>
                  <animateMotion dur="3.6s" repeatCount="indefinite" begin={`${delay}s`}>
                    <mpath href={`#rp-${p.i}`} />
                  </animateMotion>
                  <animate attributeName="r" values="0;3.5;2.5;0" keyTimes="0;0.12;0.8;1"
                    dur="3.6s" repeatCount="indefinite" begin={`${delay}s`} />
                  <animate attributeName="opacity" values="0;0.95;0.7;0" keyTimes="0;0.12;0.8;1"
                    dur="3.6s" repeatCount="indefinite" begin={`${delay}s`} />
                </circle>
              </g>
            ))}
          </g>
        ))}

        {/* Time labels */}
        {[0, 29, 59, 89].map(d => (
          <text key={d} x={(d / 89) * W} y={H + 24} textAnchor="middle" fontSize={11}
            fontFamily="Nunito,sans-serif" fill={C.inkMuted}>
            {d === 0 ? "90天前" : d === 29 ? "60天前" : d === 59 ? "30天前" : "今天"}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MEMORY LIST
// ═══════════════════════════════════════════════════════════

const MEMS = [
  { day: 3,  e: "anxiety" as EKey, title: "第一次截止日期", note: "通宵了一晚，但完成了" },
  { day: 18, e: "joy"     as EKey, title: "好朋友重逢",     note: "五年没见，像没分开过" },
  { day: 31, e: "tired"   as EKey, title: "最长的一周",     note: "连续7天高强度工作" },
  { day: 47, e: "sad"     as EKey, title: "离别时刻",       note: "送走了一位重要的人" },
  { day: 72, e: "excited" as EKey, title: "新项目启动",     note: "终于等到这个机会" },
];

function MemoryList({ activeDay, onSelect }: { activeDay: number | null; onSelect: (day: number | null) => void }) {
  return (
    <div style={{ background: C.warm, borderRadius: C.rLg, padding: "18px 20px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: C.inkLight, marginBottom: 18 }}>记忆节点</div>

      {/* Timeline container */}
      <div style={{ position: "relative", paddingLeft: 36 }}>

        {/* Vertical dashed line */}
        <div style={{
          position: "absolute", left: 10, top: 10, bottom: 10,
          borderLeft: `2px dashed ${C.borderD}`,
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {MEMS.map((m, i) => {
            const isActive = activeDay === m.day;
            return (
              <div key={i} style={{ position: "relative" }} onClick={() => onSelect(isActive ? null : m.day)}>

                {/* Timeline dot — sits on the dashed line */}
                <div style={{
                  position: "absolute", left: -26, top: 13,
                  width: 20, height: 20, borderRadius: "50%", zIndex: 1,
                  background: isActive ? E[m.e].bg : C.paper,
                  border: `2px solid ${isActive ? E[m.e].bg : C.borderD}`,
                  boxShadow: isActive ? `0 0 0 5px ${E[m.e].bg}33` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .25s",
                  cursor: "pointer",
                }}>
                  {isActive && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                </div>

                {/* Memory card */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px", borderRadius: 16, cursor: "pointer",
                  background: isActive ? `${E[m.e].bg}1A` : C.paper,
                  border: `1px solid ${isActive ? E[m.e].bg + "88" : C.border}`,
                  boxShadow: isActive ? `0 3px 14px ${E[m.e].bg}44` : C.shadow,
                  transition: "all .25s",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.ink }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 2, fontStyle: "italic" }}>{m.note}</div>
                  </div>
                  <div style={{ fontSize: 11, color: isActive ? E[m.e].bg : C.inkMuted, fontWeight: isActive ? 700 : 400, whiteSpace: "nowrap", transition: "color .25s" }}>
                    第 {m.day + 1} 天
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
