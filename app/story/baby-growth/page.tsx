"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import ShareModal, { type ShareCardData } from "@/components/ShareModal";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type Stat = { label: string; value: string };

type Chapter = {
  id: string;
  dayNum: number;       // numeric day for progress calc
  dayLabel: string;     // "第 1 天"
  symbol: string;
  image?: string;
  title: string;
  subtitle?: string;
  body: string;
  stats?: Stat[];
  bg: string;
  accent: string;
  textColor: string;
};

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════

const CHAPTERS: Chapter[] = [
  {
    id: "cover",
    dayNum: 0,
    dayLabel: "",
    symbol: "✦",
    image: "/images/baby-growth/image_01_cover_east_asian.png",
    title: "小棠的\n第一千天",
    subtitle: "2022.04.17 — 2025.01.16",
    body: "从她第一次呼吸，到她第一次说「我爱你」——\n1095 天，记录了一个生命最初的样子。",
    bg: "#FFF4F0",
    accent: "#FFB5A7",
    textColor: "#3D2218",
  },
  {
    id: "birth",
    dayNum: 1,
    dayLabel: "第 1 天",
    symbol: "♡",
    image: "/images/baby-growth/image_02_birth_east_asian.png",
    title: "来到这个世界",
    body: "2022年4月17日，凌晨 3:22。\n\n她重 3.4 公斤，长 50 厘米。\n哭声响彻了整个走廊。\n\n护士把她抱来的那一刻，\n我们都忘记了呼吸。",
    stats: [
      { label: "体重", value: "3.4 kg" },
      { label: "身长", value: "50 cm" },
      { label: "到来时刻", value: "03:22" },
    ],
    bg: "#FFF0EC",
    accent: "#FFB5A7",
    textColor: "#3D2218",
  },
  {
    id: "smile",
    dayNum: 47,
    dayLabel: "第 47 天",
    symbol: "☀",
    image: "/images/baby-growth/image_03_smile_east_asian.png",
    title: "第一次微笑",
    body: "妈妈在喂奶，突然发现她嘴角上扬。\n\n「不算数，那是打嗝。」\n爸爸说。\n\n但我们都知道——\n算数的。",
    bg: "#FFFBF0",
    accent: "#FFE0A3",
    textColor: "#3D3018",
  },
  {
    id: "roll",
    dayNum: 89,
    dayLabel: "第 89 天",
    symbol: "↻",
    image: "/images/baby-growth/image_04_roll_east_asian.png",
    title: "第一次翻身",
    body: "我们在客厅等了整整一个下午。\n\n手机架好了，镜头对准了，零食备好了——\n\n结果她在没人看的时候，\n悄悄翻过去了。",
    bg: "#F2FBF5",
    accent: "#A8E6C3",
    textColor: "#1A3828",
  },
  {
    id: "babble",
    dayNum: 156,
    dayLabel: "第 156 天",
    symbol: "♪",
    image: "/images/baby-growth/image_05_babble_east_asian.png",
    title: "第一声「爸——」",
    body: "其实更像「啊啊啊——」。\n\n但她的眼睛看着我，\n那一刻我确定，\n\n她在叫我。",
    bg: "#F0F6FF",
    accent: "#A3C4FF",
    textColor: "#1A2840",
  },
  {
    id: "sit",
    dayNum: 234,
    dayLabel: "第 234 天",
    symbol: "◎",
    image: "/images/baby-growth/image_06_sit_east_asian.png",
    title: "第一次坐起来",
    body: "摇摇晃晃，像一个小小的不倒翁。\n\n坐了三秒钟又倒下去。\n又爬起来。又倒下去。\n\n第七次，她稳了。",
    bg: "#F6F0FF",
    accent: "#C8A8FF",
    textColor: "#28183D",
  },
  {
    id: "walk",
    dayNum: 312,
    dayLabel: "第 312 天",
    symbol: "→",
    image: "/images/baby-growth/image_07_walk.png",
    title: "第一步",
    body: "从沙发走向茶几，总共三步。\n\n我们每人在一边，双手张开，\n假装不是在保护她。\n\n她走过去了，转身，笑了。",
    bg: "#FFF4F8",
    accent: "#FFB5D0",
    textColor: "#3D1828",
  },
  {
    id: "bday1",
    dayNum: 365,
    dayLabel: "第 365 天",
    symbol: "🕯",
    image: "/images/baby-growth/image_08_bday1.png",
    title: "一岁",
    subtitle: "小蛋糕，大蜡烛",
    body: "她不知道今天是什么日子。\n\n但她认真地盯着那一根蜡烛的火苗，\n深深地吸了一口气——\n\n吹灭了。",
    stats: [
      { label: "体重", value: "9.8 kg" },
      { label: "身长", value: "76 cm" },
      { label: "掌握词汇", value: "3 个" },
    ],
    bg: "#FFF0EC",
    accent: "#FFB5A7",
    textColor: "#3D2218",
  },
  {
    id: "bday2",
    dayNum: 730,
    dayLabel: "第 730 天",
    symbol: "✦",
    image: "/images/baby-growth/image_09_bday2.png",
    title: "两岁",
    subtitle: "第一次说「我不要」",
    body: "她开始有了意见。\n\n不要穿这件衣服，不要吃这个，不要睡觉。\n\n每一个「不要」背后，\n是一个小人在练习成为她自己。",
    stats: [
      { label: "体重", value: "13.2 kg" },
      { label: "身长", value: "89 cm" },
      { label: "每日词汇量", value: "200+" },
    ],
    bg: "#F2FBF5",
    accent: "#A8E6C3",
    textColor: "#1A3828",
  },
  {
    id: "bday3",
    dayNum: 1095,
    dayLabel: "第 1095 天",
    symbol: "♡",
    image: "/images/baby-growth/image_10_bday3.png",
    title: "三岁",
    subtitle: "「妈妈，我爱你」",
    body: "睡前，突然说了这五个字。\n\n没有原因，没有前因后果。\n\n就是——说了。\n\n我们坐在那里，好久没有动。",
    stats: [
      { label: "体重", value: "15.8 kg" },
      { label: "身长", value: "98 cm" },
      { label: "最爱的事", value: "唱歌" },
    ],
    bg: "#FFFBF0",
    accent: "#FFE0A3",
    textColor: "#3D3018",
  },
  {
    id: "stats",
    dayNum: 1095,
    dayLabel: "",
    symbol: "∞",
    image: "/images/baby-growth/image_11_stats.png",
    title: "1095 天，在一起",
    body: "她的每一天，我们都没有错过。",
    bg: "#FFF4F0",
    accent: "#FFB5A7",
    textColor: "#3D2218",
  },
];

const PLAY_DURATION = 5000; // ms per chapter during auto-play

// ═══════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

export default function BabyGrowthStory() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playPct, setPlayPct] = useState(0);
  const [showShare, setShowShare] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const playStartRef = useRef<number>(0);
  const currentRef = useRef(0); // mirror for RAF closure

  // Keep ref in sync
  useEffect(() => { currentRef.current = current; }, [current]);

  // ── Scroll to chapter ────────────────────────────────────
  const scrollTo = useCallback((idx: number) => {
    const els = containerRef.current?.querySelectorAll<HTMLElement>(".chapter");
    els?.[idx]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ── IntersectionObserver: track active chapter ───────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            const idx = Number(e.target.getAttribute("data-idx"));
            setCurrent(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    container.querySelectorAll(".chapter").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Auto-play ────────────────────────────────────────────
  const stopPlay = useCallback(() => {
    setIsPlaying(false);
    setPlayPct(0);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const startPlay = useCallback(() => {
    setIsPlaying(true);
    playStartRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - playStartRef.current;
      const pct = Math.min((elapsed / PLAY_DURATION) * 100, 100);
      setPlayPct(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        const next = currentRef.current + 1;
        if (next >= CHAPTERS.length) {
          stopPlay();
          return;
        }
        scrollTo(next);
        // setCurrent will be updated by IntersectionObserver
        playStartRef.current = Date.now();
        setPlayPct(0);
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [scrollTo, stopPlay]);

  const togglePlay = () => {
    if (isPlaying) stopPlay();
    else startPlay();
  };

  // Stop auto-play when user manually scrolls
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => { if (isPlaying) stopPlay(); };
    el.addEventListener("wheel", handler, { passive: true });
    el.addEventListener("touchstart", handler, { passive: true });
    return () => {
      el.removeEventListener("wheel", handler);
      el.removeEventListener("touchstart", handler);
    };
  }, [isPlaying, stopPlay]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const ch = CHAPTERS[current];

  return (
    <div
      style={{
        fontFamily: "var(--font-nunito, 'Nunito', sans-serif)",
        position: "relative",
        height: "100dvh",
        overflow: "hidden",
        // Override global dark bg for this page
        background: ch.bg,
        color: ch.textColor,
        transition: "background 0.6s ease, color 0.6s ease",
      }}
    >
      {/* ── Progress bar ──────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 60, // below Navbar (py-4 * 2 + text ≈ 60px)
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          gap: 4,
          padding: "10px 20px",
          background: `linear-gradient(to bottom, rgba(0,0,0,0.08), transparent)`,
        }}
      >
        {CHAPTERS.map((_, i) => (
          <button
            key={i}
            onClick={() => { scrollTo(i); stopPlay(); }}
            style={{
              flex: 1,
              height: 3,
              background: "rgba(0,0,0,0.12)",
              border: "none",
              borderRadius: 2,
              padding: 0,
              cursor: "pointer",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                borderRadius: 2,
                background: ch.textColor,
                width:
                  i < current
                    ? "100%"
                    : i === current
                      ? `${playPct}%`
                      : "0%",
                transition: i < current ? "none" : "width 0.1s linear",
              }}
            />
          </button>
        ))}
      </div>

      {/* ── Chapter scroll container ───────────────────── */}
      <div
        ref={containerRef}
        style={{
          height: "100dvh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }

          /* Chapter entrance animation */
          .chapter-content {
            opacity: 0;
            transform: translateY(24px);
            transition: opacity 0.7s ease, transform 0.7s ease;
          }
          .chapter.active .chapter-content {
            opacity: 1;
            transform: translateY(0);
          }

          /* Stat cards */
          .stat-card {
            background: rgba(255,255,255,0.65);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 18px;
            padding: 16px 22px;
            text-align: center;
            min-width: 80px;
          }

          /* Big stat card */
          .big-stat {
            background: rgba(255,255,255,0.6);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 20px 16px;
            text-align: center;
          }

          /* Decorative blob */
          .blob {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
          }

          /* Scroll hint bounce */
          @keyframes bounce-y {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50%       { transform: translateX(-50%) translateY(6px); }
          }
          .scroll-hint {
            animation: bounce-y 2s ease-in-out infinite;
          }

          /* CTA button */
          .cta-primary {
            display: inline-block;
            border-radius: 40px;
            padding: 16px 36px;
            font-family: var(--font-nunito, Nunito, sans-serif);
            font-size: 15px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          }
        `}</style>

        {CHAPTERS.map((chapter, i) =>
          chapter.id === "stats" ? (
            <StatsChapter key={chapter.id} chapter={chapter} idx={i} isActive={current === i} />
          ) : (
            <MilestoneChapter key={chapter.id} chapter={chapter} idx={i} isActive={current === i} isFirst={i === 0} />
          )
        )}
      </div>

      {/* ── Controls ──────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <button
          onClick={togglePlay}
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "none",
            borderRadius: 28,
            padding: "11px 22px",
            fontFamily: "var(--font-nunito, Nunito, sans-serif)",
            fontSize: 13,
            fontWeight: 700,
            color: "#3D2218",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
            transition: "transform 0.15s",
          }}
        >
          {isPlaying ? "⏸ 暂停" : "▶ 自动播放"}
        </button>

        <Link
          href="/create"
          style={{
            background: ch.textColor,
            color: ch.bg,
            border: "none",
            borderRadius: 28,
            padding: "11px 22px",
            fontFamily: "var(--font-nunito, Nunito, sans-serif)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
            textDecoration: "none",
            display: "inline-block",
            transition: "transform 0.15s",
          }}
        >
          记录宝宝的故事
        </Link>

        {/* 分享按钮 */}
        <button
          onClick={() => setShowShare(true)}
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "none",
            borderRadius: 28,
            padding: "11px 18px",
            fontFamily: "var(--font-nunito, Nunito, sans-serif)",
            fontSize: 13,
            fontWeight: 700,
            color: "#C4603A",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
            transition: "transform 0.15s",
          }}
        >
          ✦ 分享
        </button>
      </div>

      {/* Share modal */}
      {showShare && (
        <ShareModal
          data={{
            title: "小棠的第一千天",
            subtitle: "第 1 天 → 第 1095 天",
            emotionLabel: "喜悦",
            emotionColor: "#FFB5A7",
            stats: [
              { value: "1095", label: "天记录" },
              { value: "10", label: "个里程碑" },
            ],
            tagline: "每一个瞬间，都值得被铭记",
            quote: "妈妈，我爱你",
          } satisfies ShareCardData}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MILESTONE CHAPTER
// ═══════════════════════════════════════════════════════════

function MilestoneChapter({
  chapter,
  idx,
  isActive,
  isFirst,
}: {
  chapter: Chapter;
  idx: number;
  isActive: boolean;
  isFirst: boolean;
}) {
  return (
    <section
      className={`chapter${isActive ? " active" : ""}`}
      data-idx={idx}
      style={{
        height: "100dvh",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 32px 110px",
        position: "relative",
        overflow: "hidden",
        background: chapter.bg,
        color: chapter.textColor,
      }}
    >
      {/* Decorative blobs */}
      <div
        className="blob"
        style={{
          width: "min(340px, 70vw)",
          height: "min(340px, 70vw)",
          background: chapter.accent,
          opacity: 0.18,
          top: "-80px",
          right: "-80px",
        }}
      />
      <div
        className="blob"
        style={{
          width: "min(220px, 50vw)",
          height: "min(220px, 50vw)",
          background: chapter.accent,
          opacity: 0.12,
          bottom: "60px",
          left: "-60px",
        }}
      />

      <div className="chapter-content" style={{ position: "relative", zIndex: 1, textAlign: "center", width: "100%", maxWidth: 540 }}>
        {/* Day label */}
        {chapter.dayLabel && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              opacity: 0.45,
              marginBottom: 20,
            }}
          >
            {chapter.dayLabel}
          </div>
        )}

        {/* Symbol */}
        <div
          style={{
            fontSize: 52,
            lineHeight: 1,
            marginBottom: 24,
            display: "block",
          }}
        >
          {chapter.symbol}
        </div>

        {/* Image */}
        {chapter.image && (
          <div style={{ margin: "0 auto 32px", width: "100%", maxWidth: 360, borderRadius: 20, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chapter.image} alt={chapter.title} style={{ width: "100%", height: "auto", display: "block", aspectRatio: "1 / 1", objectFit: "cover" }} />
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-nunito, Nunito, sans-serif)",
            fontSize: "clamp(34px, 9vw, 68px)",
            fontWeight: 800,
            lineHeight: 1.15,
            margin: "0 0 8px",
            whiteSpace: "pre-line",
            letterSpacing: "-0.02em",
          }}
        >
          {chapter.title}
        </h1>

        {/* Subtitle */}
        {chapter.subtitle && (
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              opacity: 0.55,
              marginBottom: 28,
            }}
          >
            {chapter.subtitle}
          </div>
        )}

        {/* Body */}
        {chapter.body && (
          <p
            style={{
              fontSize: "clamp(15px, 2.8vw, 18px)",
              lineHeight: 1.95,
              opacity: 0.78,
              whiteSpace: "pre-line",
              margin: chapter.subtitle ? "0" : "20px 0 0",
            }}
          >
            {chapter.body}
          </p>
        )}

        {/* Stats */}
        {chapter.stats && (
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 32,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {chapter.stats.map((s) => (
              <div className="stat-card" key={s.label}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    marginBottom: 4,
                    color: chapter.textColor,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.55,
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll hint — only on first chapter */}
      {isFirst && (
        <div
          className="scroll-hint"
          style={{
            position: "absolute",
            bottom: 110,
            left: "50%",
            fontSize: 11,
            opacity: 0.38,
            letterSpacing: "0.1em",
            pointerEvents: "none",
          }}
        >
          向下滑动 ↓
        </div>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// STATS / CTA CHAPTER (final)
// ═══════════════════════════════════════════════════════════

function StatsChapter({
  chapter,
  idx,
  isActive,
}: {
  chapter: Chapter;
  idx: number;
  isActive: boolean;
}) {
  const BIG_STATS = [
    { num: "1,095", label: "在一起的天数" },
    { num: "26,280", label: "共同的小时" },
    { num: "47", label: "记录的珍贵瞬间" },
    { num: "3", label: "岁，她长大了" },
  ];

  return (
    <section
      className={`chapter${isActive ? " active" : ""}`}
      data-idx={idx}
      style={{
        height: "100dvh",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 32px 110px",
        position: "relative",
        overflow: "hidden",
        background: chapter.bg,
        color: chapter.textColor,
      }}
    >
      {/* Blobs */}
      <div
        className="blob"
        style={{
          width: "min(400px, 80vw)",
          height: "min(400px, 80vw)",
          background: "#FFB5A7",
          opacity: 0.15,
          top: "-120px",
          right: "-100px",
        }}
      />
      <div
        className="blob"
        style={{
          width: "min(280px, 60vw)",
          height: "min(280px, 60vw)",
          background: "#A8E6C3",
          opacity: 0.12,
          bottom: "80px",
          left: "-80px",
        }}
      />

      <div
        className="chapter-content"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20 }}>{chapter.symbol}</div>

        {chapter.image && (
          <div style={{ margin: "0 auto 32px", width: "100%", maxWidth: 360, borderRadius: 20, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chapter.image} alt={chapter.title} style={{ width: "100%", height: "auto", display: "block", aspectRatio: "1 / 1", objectFit: "cover" }} />
          </div>
        )}

        <h1
          style={{
            fontFamily: "var(--font-nunito, Nunito, sans-serif)",
            fontSize: "clamp(28px, 7vw, 54px)",
            fontWeight: 800,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          {chapter.title}
        </h1>

        <p style={{ opacity: 0.55, fontSize: 14, margin: "0 0 32px" }}>
          {chapter.body}
        </p>

        {/* Big stats grid */}
        <div className="stats-grid" style={{ display: "grid", gap: 12, marginBottom: 36 }}>
          <style>{`
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            @media (min-width: 600px) {
              .stats-grid { grid-template-columns: repeat(4, 1fr); }
            }
          `}</style>
          {BIG_STATS.map((s) => (
            <div className="big-stat" key={s.label}>
              <div
                style={{
                  fontSize: "clamp(28px, 6vw, 40px)",
                  fontWeight: 800,
                  lineHeight: 1,
                  marginBottom: 6,
                  color: chapter.textColor,
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: 12, opacity: 0.55, lineHeight: 1.4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Link
            href="/create"
            className="cta-primary"
            style={{
              background: chapter.textColor,
              color: chapter.bg,
            }}
          >
            记录宝宝的成长故事 →
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 13,
              color: chapter.textColor,
              opacity: 0.5,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            返回首页
          </Link>
        </div>
      </div>
    </section>
  );
}
