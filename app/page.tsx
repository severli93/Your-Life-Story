"use client";

import { useState } from "react";
import Starfield from "@/components/Starfield";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ShareModal, { type ShareCardData } from "@/components/ShareModal";
import CreateSection from "@/components/CreateSection";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// ── Scroll-reveal wrapper ────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Floating memory fragment ─────────────────────────────
function Fragment({
  children,
  style,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: (style as Record<string, unknown>)["--dur"] as number ?? 7,
        delay: (style as Record<string, unknown>)["--delay"] as number ?? 0,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        background: "rgba(255,255,255,.045)",
        border: "1px solid rgba(212,168,83,.18)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderRadius: 12,
        padding: "9px 13px",
        fontSize: 12,
        color: "var(--color-text-soft)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 1,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Data ─────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    icon: "💬",
    label: "对话",
    title: "长河陪伴",
    desc: "像跟老朋友聊天一样，说说今天的心情、突然想起的往事，或难以言说的情绪。长河用 A·I·R 方法引导你觉察感受。",
  },
  {
    num: "02",
    icon: "🌊",
    label: "沉淀",
    title: "记忆成型",
    desc: "每次对话自动提炼为带时间戳的记忆节点。日/周/月/年，粒度由你决定。过去的照片和日记，也可以一键导入。",
  },
  {
    num: "03",
    icon: "✨",
    label: "可视化",
    title: "生成长河",
    desc: "积累的记忆，在你准备好时，生成一部可浏览、可分享的人生故事页。年度报告、成长记录、完整时间轴——你来选。",
  },
];

const STORY_TYPES = [
  { icon: "📅", bg: "rgba(212,168,83,.1)",   title: "年度回顾", desc: "365天喜怒哀乐，浓缩成一份专属年度报告。" },
  { icon: "♡",  bg: "rgba(255,181,167,.1)",  title: "爱情故事", desc: "从初见到相伴，记录两人每一个心跳瞬间。" },
  { icon: "🌱", bg: "rgba(168,230,195,.1)",  title: "成长记录", desc: "从孩提到今日，见证你如何在时光中生长。" },
  { icon: "🏡", bg: "rgba(163,196,255,.1)",  title: "家族传记", desc: "父母、祖辈的故事，留给未来的孩子阅读。" },
];

// ══════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════
export default function Home() {
  const router = useRouter();
  const [showShare, setShowShare] = useState<null | "gao" | "tang">(null);

  return (
    <main>

      {/* ── HERO ──────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "120px 32px 80px",
        }}
      >
        <Starfield />

        {/* Glow overlays */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(212,168,83,.05), transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Floating memory fragments */}
        <Fragment style={{ top: "18%", left: "5%", transform: "rotate(-4deg)", opacity: 0.65, "--dur": 6.4, "--delay": 0 } as React.CSSProperties}>
          <span style={{ color: "var(--color-gold-lt)", fontWeight: 600 }}>第 1 天 ♡</span>{" "}
          <span style={{ opacity: 0.7 }}>来到这个世界</span>
        </Fragment>
        <Fragment style={{ top: "26%", right: "6%", transform: "rotate(3.5deg)", opacity: 0.5, "--dur": 7.2, "--delay": -2 } as React.CSSProperties}>
          <span style={{ opacity: 0.7 }}>情绪温度</span>{" "}
          <span style={{ color: "var(--color-gold-lt)", fontWeight: 600 }}>8 / 10</span>{" "}
          <span style={{ opacity: 0.7 }}>· 比较焦虑</span>
        </Fragment>
        <Fragment style={{ top: "68%", left: "4%", transform: "rotate(2deg)", opacity: 0.45, "--dur": 8, "--delay": -1.5 } as React.CSSProperties}>
          <span style={{ color: "var(--color-gold-lt)", fontWeight: 600 }}>2024年11月</span>{" "}
          <span style={{ opacity: 0.7 }}>· 47个记忆节点</span>
        </Fragment>
        <Fragment style={{ top: "72%", right: "5%", transform: "rotate(-3deg)", opacity: 0.6, "--dur": 6.8, "--delay": -3 } as React.CSSProperties}>
          <span style={{ opacity: 0.7 }}>第一次说</span>{" "}
          <span style={{ color: "var(--color-gold-lt)", fontWeight: 600 }}>「我爱你」</span>
        </Fragment>
        <Fragment style={{ top: "42%", left: "2%", transform: "rotate(5deg)", opacity: 0.38, "--dur": 9, "--delay": -4 } as React.CSSProperties}>
          <span style={{ color: "var(--color-gold-lt)", fontWeight: 600 }}>军功章 No.349711</span>{" "}
          <span style={{ opacity: 0.7 }}>· 1951年</span>
        </Fragment>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 720 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "var(--color-gold)",
              marginBottom: 24,
            }}
          >
            <span style={{ width: 28, height: 1, background: "var(--color-gold)", opacity: 0.4, display: "inline-block" }} />
            AI 生命记录伴侣
            <span style={{ width: 28, height: 1, background: "var(--color-gold)", opacity: 0.4, display: "inline-block" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(64px, 13vw, 118px)",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              background: "linear-gradient(160deg, var(--color-text-main) 30%, var(--color-gold-lt) 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 20,
            }}
          >
            生命长河
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease }}
            style={{
              fontSize: "clamp(15px, 2.4vw, 18px)",
              fontWeight: 400,
              color: "var(--color-text-soft)",
              lineHeight: 1.8,
              maxWidth: 460,
              margin: "0 auto 44px",
            }}
          >
            有些时刻，值得被好好记录。<br />
            长河陪你<strong style={{ color: "var(--color-text-main)", fontWeight: 600 }}>对话、沉淀</strong>，
            将散落的记忆，织成一部只属于你的<strong style={{ color: "var(--color-text-main)", fontWeight: 600 }}>人生可视化</strong>。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease }}
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/companion"
              style={{
                background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-lt))",
                color: "var(--color-midnight)",
                borderRadius: 40,
                padding: "15px 38px",
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "0.02em",
                textDecoration: "none",
                display: "inline-block",
                boxShadow: "0 0 28px rgba(212,168,83,.3)",
                transition: "transform .2s, box-shadow .2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.02)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(212,168,83,.5)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(212,168,83,.3)";
              }}
            >
              开始对话
            </Link>
            <Link
              href="/story/gao-yanqing"
              style={{
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.12)",
                color: "var(--color-text-main)",
                borderRadius: 40,
                padding: "14px 36px",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
                backdropFilter: "blur(8px)",
                transition: "background .2s, border-color .2s, transform .2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,83,.3)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.05)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.12)";
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              查看样例
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 8, fontSize: 11, color: "var(--color-text-dim)", letterSpacing: "0.12em",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
          </svg>
          向下探索
        </motion.div>
      </section>


      {/* ── 3-STEP LOOP (cream) ────────────────────────── */}
      <section style={{ background: "#FFF9F5", padding: "100px 32px", color: "#2A1E18" }}>
        <Reveal style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 64px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C4873A", marginBottom: 14 }}>
            如何运作
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.2, color: "#1E140E", marginBottom: 14 }}>
            对话，沉淀，可视化
          </h2>
          <p style={{ fontSize: 16, color: "#7A6560", lineHeight: 1.75 }}>
            三个步骤，将日常的碎片，凝聚成完整的人生叙事。
          </p>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 32,
          maxWidth: 880,
          margin: "0 auto",
        }}>
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.12} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                background: "#FFF4EE",
                border: "1.5px solid rgba(212,168,83,.28)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, marginBottom: 24, position: "relative",
                boxShadow: "0 4px 20px rgba(212,168,83,.08)",
              }}>
                {s.icon}
                <span style={{
                  position: "absolute", top: -6, right: -6,
                  width: 22, height: 22, borderRadius: "50%",
                  background: "#C4873A", color: "white",
                  fontSize: 11, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {i + 1}
                </span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C4873A", marginBottom: 8 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#1E140E", marginBottom: 10 }}>
                {s.title}
              </div>
              <p style={{ fontSize: 14, color: "#7A6560", lineHeight: 1.75 }}>{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── SAMPLES ───────────────────────────────────── */}
      <section id="samples" style={{ background: "var(--color-midnight)", padding: "100px 32px" }}>
        <Reveal style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: 14 }}>
            真实样例
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 44px)", color: "var(--color-text-main)", marginBottom: 14 }}>
            看看别人的人生长河
          </h2>
          <p style={{ fontSize: 15, color: "var(--color-text-soft)" }}>每个人的故事，都有完全不同的样子。</p>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
          maxWidth: 1040,
          margin: "0 auto",
        }}>

          {/* 高延清 */}
          <Reveal delay={0.1}>
            <div style={{
              background: "linear-gradient(160deg, #0D0B1A, #181228)",
              border: "1px solid rgba(212,168,83,.2)",
              borderRadius: 20, padding: "36px 30px 28px",
              minHeight: 320, cursor: "pointer",
              transition: "transform .25s, box-shadow .25s",
              position: "relative",
            }}
              onClick={() => router.push("/story/gao-yanqing")}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 64px rgba(0,0,0,.5)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-gold)", border: "1px solid rgba(212,168,83,.15)", borderRadius: 20, padding: "5px 12px", display: "inline-block", marginBottom: 28 }}>
                完整人生
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 34, color: "var(--color-text-main)", marginBottom: 4 }}>高延清</div>
              <div style={{ fontStyle: "italic", fontSize: 13, color: "var(--color-gold)", opacity: 0.7, marginBottom: 12 }}>1933 — 2024</div>
              <div style={{ fontSize: 12, color: "var(--color-text-soft)", letterSpacing: "0.08em", marginBottom: 20 }}>军人 · 诗人 · 父亲</div>
              <div style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(237,232,224,.5)", borderLeft: "2px solid rgba(212,168,83,.3)", paddingLeft: 14, fontStyle: "italic", marginBottom: 24 }}>
                「时光荏苒，岁月如歌。回首往事，我所珍视的，是那些平凡而真实的瞬间。」
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {["1951 参军入朝", "1979 转业", "1994 开始创作"].map(t => (
                  <span key={t} style={{ fontSize: 11, color: "var(--color-gold)", border: "1px solid rgba(212,168,83,.2)", borderRadius: 20, padding: "4px 10px", fontWeight: 600 }}>{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(212,168,83,.1)", paddingTop: 18 }}>
                <span style={{ fontSize: 13, color: "var(--color-gold)", fontWeight: 700 }}>查看人生长河 →</span>
                <button
                  onClick={e => { e.stopPropagation(); setShowShare("gao"); }}
                  style={{
                    background: "rgba(212,168,83,.1)", border: "1px solid rgba(212,168,83,.25)",
                    borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700,
                    color: "var(--color-gold)", cursor: "pointer", letterSpacing: "0.05em",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,168,83,.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,168,83,.1)"; }}
                >
                  ✦ 分享
                </button>
              </div>
            </div>
          </Reveal>

          {/* 小棠 */}
          <Reveal delay={0.2}>
            <div style={{
              background: "linear-gradient(160deg, #FFF4F0, #FFF8F5)",
              border: "1.5px solid rgba(255,181,167,.4)",
              borderRadius: 20, padding: "36px 30px 28px",
              minHeight: 320, cursor: "pointer", color: "#3D2218",
              transition: "transform .25s, box-shadow .25s",
            }}
              onClick={() => router.push("/story/baby-growth")}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 64px rgba(0,0,0,.2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C4603A", border: "1px solid rgba(196,96,58,.2)", borderRadius: 20, padding: "5px 12px", display: "inline-block", marginBottom: 28 }}>
                婴儿成长
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#3D2218", marginBottom: 6 }}>小棠的第一千天</div>
              <div style={{ fontSize: 12, color: "#C4603A", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 18 }}>第 1 天 → 第 1095 天</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
                {[["第 47 天", "第一次微笑"], ["第 312 天", "第一步"], ["第 1095 天", "「妈妈，我爱你」"]].map(([day, ev]) => (
                  <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#7A5040" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#C4603A", background: "rgba(196,96,58,.08)", borderRadius: 8, padding: "3px 8px", flexShrink: 0 }}>{day}</span>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(196,96,58,.3)", flexShrink: 0 }} />
                    {ev}
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,181,167,.2)", borderRadius: 4, height: 5, marginBottom: 22, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "72%", background: "linear-gradient(to right, #FFB5A7, #FF8F7A)", borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(196,96,58,.12)", paddingTop: 18 }}>
                <span style={{ fontSize: 13, color: "#C4603A", fontWeight: 700 }}>自动播放故事 ▶</span>
                <button
                  onClick={e => { e.stopPropagation(); setShowShare("tang"); }}
                  style={{
                    background: "rgba(196,96,58,.08)", border: "1px solid rgba(196,96,58,.25)",
                    borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700,
                    color: "#C4603A", cursor: "pointer", letterSpacing: "0.05em",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(196,96,58,.16)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(196,96,58,.08)"; }}
                >
                  ✦ 分享
                </button>
              </div>
            </div>
          </Reveal>

          {/* 年度报告 */}
          <Reveal delay={0.3}>
            <div style={{
              background: "linear-gradient(160deg, #0E1420, #141E2C)",
              border: "1px solid rgba(100,160,255,.15)",
              borderRadius: 20, padding: "36px 30px 28px",
              minHeight: 320, position: "relative", opacity: 0.8,
            }}>
              <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(100,160,255,.12)", border: "1px solid rgba(100,160,255,.3)", color: "#80AAFF", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 20, padding: "5px 12px" }}>
                即将上线
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#80AAFF", border: "1px solid rgba(100,160,255,.15)", borderRadius: 20, padding: "5px 12px", display: "inline-block", marginBottom: 28 }}>
                年度报告
              </div>
              <div style={{ fontFamily: "var(--font-nunito)", fontSize: 28, fontWeight: 800, color: "var(--color-text-main)", marginBottom: 6, letterSpacing: "-0.02em" }}>2025 年度报告</div>
              <div style={{ fontSize: 12, color: "rgba(128,170,255,.6)", marginBottom: 20 }}>像 Spotify Wrapped，但是你的人生</div>
              {/* Mini bar chart */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 52, marginBottom: 20 }}>
                {[30, 55, 40, 75, 60, 85, 50, 70, 45, 95, 65, 80].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0", opacity: 0.7, background: i % 3 === 2 ? "#A0C0FF" : i % 3 === 1 ? "#80AAFF" : "#4A7BDA" }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {[["312", "天记录"], ["焦虑→平静", "主旋律"], ["47", "个成长时刻"]].map(([v, l]) => (
                  <div key={l} style={{ background: "rgba(100,160,255,.08)", border: "1px solid rgba(100,160,255,.15)", borderRadius: 8, padding: "6px 10px", fontSize: 11, color: "rgba(237,232,224,.7)" }}>
                    <strong style={{ color: "#80AAFF" }}>{v}</strong> {l}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(100,160,255,.4)", fontWeight: 700, borderTop: "1px solid rgba(100,160,255,.08)", paddingTop: 18 }}>
                <span>加入候补名单</span><span>→</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Share modals for sample cards */}
        {showShare === "gao" && (
          <ShareModal
            data={{
              title: "高延清的故事",
              subtitle: "1933 — 2024 · 军人 · 诗人 · 父亲",
              emotionLabel: "思念",
              emotionColor: "#D4A853",
              stats: [
                { value: "91", label: "岁月" },
                { value: "3", label: "历史战役" },
                { value: "1994", label: "开始创作" },
              ],
              tagline: "一位军人的完整人生长河",
              quote: "时光荏苒，岁月如歌",
            } satisfies ShareCardData}
            onClose={() => setShowShare(null)}
          />
        )}
        {showShare === "tang" && (
          <ShareModal
            data={{
              title: "小棠的第一千天",
              subtitle: "第 1 天 → 第 1095 天",
              emotionLabel: "喜悦",
              emotionColor: "#FFB5A7",
              stats: [
                { value: "1095", label: "天记录" },
                { value: "47", label: "个里程碑" },
                { value: "72%", label: "成长进度" },
              ],
              tagline: "每一个瞬间，都值得被铭记",
              quote: "妈妈，我爱你",
            } satisfies ShareCardData}
            onClose={() => setShowShare(null)}
          />
        )}
      </section>


      {/* ── STORY TYPES ───────────────────────────────── */}
      <section style={{ background: "var(--color-deep)", padding: "100px 32px", borderTop: "1px solid rgba(212,168,83,.06)" }}>
        <Reveal style={{ textAlign: "center", maxWidth: 540, margin: "0 auto 56px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: 14 }}>
            故事类型
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 44px)", color: "var(--color-text-main)" }}>
            选择你的记录方式
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, maxWidth: 1040, margin: "0 auto" }}>
          {STORY_TYPES.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.07}>
              <Link href={`/create?type=${["annual","love","growth","family"][i]}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div style={{
                  background: "#141424", border: "1px solid rgba(255,255,255,.06)",
                  borderRadius: 18, padding: "28px 24px",
                  display: "flex", flexDirection: "column", gap: 12, cursor: "pointer",
                  transition: "background .2s, border-color .2s, transform .2s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "#1C1C2E";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,83,.2)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "#141424";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.06)";
                    (e.currentTarget as HTMLElement).style.transform = "";
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {t.icon}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--color-text-main)" }}>{t.title}</div>
                  <p style={{ fontSize: 13, color: "var(--color-text-soft)", lineHeight: 1.65, margin: 0 }}>{t.desc}</p>
                  <div style={{ marginTop: "auto", fontSize: 18, color: "#4A4A6A", transition: "color .2s" }}>→</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── START CREATING ────────────────────────────── */}
      <CreateSection />


      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section style={{ background: "var(--color-midnight)", padding: "120px 32px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(212,168,83,.06), transparent)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <Reveal>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: 24 }}>
              开始你的旅程
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 7vw, 64px)",
              lineHeight: 1.15,
              background: "linear-gradient(160deg, var(--color-text-main) 30%, var(--color-gold-lt) 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 20,
            }}>
              记录属于你的<br />生命长河
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: 16, color: "var(--color-text-soft)", lineHeight: 1.75, marginBottom: 48 }}>
              每段生命都值得被好好记录。<br />
              游客身份即可体验全部功能，随时开始。
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/companion"
                style={{
                  background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-lt))",
                  color: "var(--color-midnight)", borderRadius: 40, padding: "16px 38px",
                  fontSize: 15, fontWeight: 800, textDecoration: "none", display: "inline-block",
                  boxShadow: "0 0 28px rgba(212,168,83,.3)", transition: "transform .2s, box-shadow .2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(212,168,83,.5)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(212,168,83,.3)";
                }}
              >
                立即开始对话
              </Link>
              <Link
                href="/create"
                style={{
                  background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)",
                  color: "var(--color-text-main)", borderRadius: 40, padding: "15px 36px",
                  fontSize: 15, fontWeight: 600, textDecoration: "none", display: "inline-block",
                  backdropFilter: "blur(8px)", transition: "background .2s, border-color .2s, transform .2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,83,.3)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.12)";
                  (e.currentTarget as HTMLElement).style.transform = "";
                }}
              >
                直接上传素材生成
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <p style={{ marginTop: 28, fontSize: 12, color: "#4A4A6A" }}>
              无需注册 · 游客可用 · 生成报告时获取 Token
            </p>
          </Reveal>
        </div>
      </section>

    </main>
  );
}
