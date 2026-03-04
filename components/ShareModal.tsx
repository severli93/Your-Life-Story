"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────
export type ShareCardData = {
  title: string;          // "我的生命长河" | "高延清的故事"
  subtitle: string;       // "已连续记录 90 天" | "1933 — 2024"
  emotionLabel: string;   // "平静" | "传奇"
  emotionColor: string;   // hex
  stats?: Array<{ label: string; value: string }>;
  tagline?: string;
  quote?: string;
};

const CREDITS_PER_SHARE = 10;

// ─── Emotion → card palette ───────────────────────────────
function palette(emotionColor: string) {
  // Returns bg gradient stops, accent, glow based on emotion color
  return {
    bg1: emotionColor + "22",
    bg2: "#FDF8F3",
    accent: emotionColor,
    glow: emotionColor + "66",
  };
}

// ─── Decorative floating dot ──────────────────────────────
function FloatDot({
  x, y, r, color, opacity, delay,
}: { x: number; y: number; r: number; color: string; opacity: number; delay: number }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: r * 2, height: r * 2, borderRadius: "50%",
      background: color, opacity,
      animation: `floatBubble ${4 + delay}s ease-in-out infinite`,
      animationDelay: `${delay * -1.2}s`,
      pointerEvents: "none",
    }} />
  );
}

// ─── 4-point star sparkle ─────────────────────────────────
function Star({ x, y, size = 12, color = "#D4A853", opacity = 0.5 }: {
  x: number; y: number; size?: number; color?: string; opacity?: number;
}) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, opacity, pointerEvents: "none" }}>
      <svg viewBox="0 0 20 20" fill={color}>
        <path d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z" />
      </svg>
    </div>
  );
}

// ─── Card preview ─────────────────────────────────────────
function CardPreview({ data, shareUrl }: { data: ShareCardData; shareUrl: string }) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
  const pal = palette(data.emotionColor);

  return (
    <div style={{
      // Warm parchment gradient + emotion tint
      background: `linear-gradient(150deg, ${pal.bg1} 0%, #FEF9F4 35%, #F7EEE3 100%)`,
      borderRadius: 24,
      border: `1.5px solid ${data.emotionColor}44`,
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 16px 48px ${data.emotionColor}22, 0 2px 0 rgba(255,255,255,.9) inset`,
      padding: "28px 26px 22px",
    }}>

      {/* ── Background decoration ── */}
      {/* Large soft blob, top-right */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 200, height: 200, borderRadius: "50%",
        background: `radial-gradient(circle, ${pal.glow} 0%, transparent 68%)`,
        pointerEvents: "none",
      }} />
      {/* Small blob, bottom-left */}
      <div style={{
        position: "absolute", bottom: -30, left: -20,
        width: 130, height: 130, borderRadius: "50%",
        background: `radial-gradient(circle, ${data.emotionColor}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      {/* Floating dots */}
      <FloatDot x={260} y={60} r={4} color={data.emotionColor} opacity={0.25} delay={1.2} />
      <FloatDot x={240} y={100} r={2.5} color="#D4A853" opacity={0.3} delay={2.4} />
      <FloatDot x={20} y={160} r={3} color={data.emotionColor} opacity={0.2} delay={0.7} />
      <FloatDot x={35} y={80} r={2} color="#ECC56A" opacity={0.25} delay={3.1} />
      {/* Stars */}
      <Star x={248} y={14} size={11} color="#D4A853" opacity={0.35} />
      <Star x={278} y={44} size={7} color={data.emotionColor} opacity={0.3} />
      <Star x={14} y={200} size={8} color="#D4A853" opacity={0.2} />

      {/* ── Top accent line ── */}
      <div style={{
        position: "absolute", top: 0, left: "12%", right: "12%", height: 2.5, borderRadius: 2,
        background: `linear-gradient(to right, transparent, ${data.emotionColor}88, #D4A85388, transparent)`,
      }} />

      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#D4A853",
            boxShadow: "0 0 10px #D4A85388, 0 0 20px #D4A85333",
          }} />
          <span style={{
            fontFamily: "var(--font-display,'Playfair Display',serif)",
            fontSize: 13.5, color: "#2C2420", letterSpacing: ".04em", fontWeight: 400,
          }}>生命长河</span>
        </div>
        <span style={{ fontSize: 10.5, color: "#B8A898", letterSpacing: ".07em" }}>{dateStr}</span>
      </div>

      {/* ── Main content ── */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>

        {/* Left: text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-display,'Playfair Display',serif)",
            fontSize: 23, color: "#1A1614", lineHeight: 1.2, marginBottom: 5,
            letterSpacing: ".01em",
          }}>
            {data.title}
          </div>
          <div style={{ fontSize: 12.5, color: "#9A8878", marginBottom: data.tagline ? 8 : 14, letterSpacing: ".02em" }}>
            {data.subtitle}
          </div>
          {data.tagline && (
            <div style={{
              fontSize: 11.5, color: "#6B5840", fontStyle: "italic",
              lineHeight: 1.65, marginBottom: 14,
              borderLeft: `2px solid ${data.emotionColor}66`, paddingLeft: 9,
            }}>
              {data.tagline}
            </div>
          )}

          {/* Stats pills */}
          {data.stats && data.stats.length > 0 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {data.stats.map((s, i) => (
                <div key={i} style={{
                  background: `linear-gradient(135deg, ${data.emotionColor}15, ${data.emotionColor}08)`,
                  border: `1px solid ${data.emotionColor}33`,
                  borderRadius: 12, padding: "6px 11px",
                  display: "flex", flexDirection: "column", alignItems: "center", minWidth: 48,
                }}>
                  <span style={{
                    fontFamily: "var(--font-display,'Playfair Display',serif)",
                    fontSize: 21, color: data.emotionColor, lineHeight: 1,
                  }}>{s.value}</span>
                  <span style={{ fontSize: 9.5, color: "#A89888", letterSpacing: ".06em", marginTop: 2 }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: emotion orb */}
        <div style={{ flexShrink: 0, position: "relative", width: 84, height: 84, marginTop: 4 }}>
          {/* Breathing outer ring */}
          <div style={{
            position: "absolute", inset: -14,
            borderRadius: "50%", border: `1.5px solid ${data.emotionColor}44`,
            animation: "orbBreath 3.5s ease-in-out infinite",
          }} />
          {/* Mid ring */}
          <div style={{
            position: "absolute", inset: -5,
            borderRadius: "50%", border: `1px solid ${data.emotionColor}66`,
          }} />
          {/* Core orb */}
          <div style={{
            width: 84, height: 84, borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${data.emotionColor}FF, ${data.emotionColor}BB)`,
            boxShadow: `0 4px 20px ${data.emotionColor}66, 0 0 0 2px rgba(255,255,255,.3) inset`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Inner frosted circle */}
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(255,255,255,.55)",
              backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,.06) inset",
            }}>
              <span style={{
                fontSize: 12, fontWeight: 800, color: "#2C2420",
                fontFamily: "var(--font-display,'Playfair Display',serif)",
              }}>{data.emotionLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      {data.quote && (
        <div style={{
          marginTop: 14, fontSize: 12, color: "#8B7868",
          fontStyle: "italic", lineHeight: 1.75,
          background: "rgba(255,255,255,.5)",
          borderRadius: 10, padding: "8px 12px",
          border: "1px solid rgba(212,168,83,.15)",
        }}>
          「{data.quote}」
        </div>
      )}

      {/* ── Bottom URL strip ── */}
      <div style={{
        marginTop: 16, paddingTop: 12,
        borderTop: "1.5px dashed rgba(212,168,83,.3)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          {/* Mini QR placeholder */}
          <div style={{
            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            background: `linear-gradient(135deg, ${data.emotionColor}33, rgba(212,168,83,.2))`,
            border: `1px solid ${data.emotionColor}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12,
          }}>⊞</div>
          <span style={{ fontSize: 10.5, color: "#C4A870", fontWeight: 700, letterSpacing: ".03em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {shareUrl}
          </span>
        </div>
        <div style={{
          fontSize: 10, color: "#B8A898", flexShrink: 0,
          background: "rgba(212,168,83,.08)", border: "1px solid rgba(212,168,83,.18)",
          borderRadius: 20, padding: "3px 9px",
        }}>
          长按保存
        </div>
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: "12%", right: "12%", height: 2, borderRadius: 2,
        background: `linear-gradient(to right, transparent, ${data.emotionColor}66, transparent)`,
      }} />
    </div>
  );
}

// ─── Canvas drawing for image download ────────────────────
function drawCard(data: ShareCardData, shareUrl: string): string {
  const canvas = document.createElement("canvas");
  const W = 800, H = 480;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const ec = data.emotionColor;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, ec + "25");
  bg.addColorStop(0.4, "#FEF9F4");
  bg.addColorStop(1, "#F5EDE0");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Glow blobs
  const glow1 = ctx.createRadialGradient(W * 0.82, H * 0.3, 0, W * 0.82, H * 0.3, 180);
  glow1.addColorStop(0, ec + "44"); glow1.addColorStop(1, "transparent");
  ctx.fillStyle = glow1; ctx.beginPath(); ctx.arc(W * 0.82, H * 0.3, 180, 0, Math.PI * 2); ctx.fill();
  const glow2 = ctx.createRadialGradient(W * 0.08, H * 0.85, 0, W * 0.08, H * 0.85, 100);
  glow2.addColorStop(0, ec + "22"); glow2.addColorStop(1, "transparent");
  ctx.fillStyle = glow2; ctx.beginPath(); ctx.arc(W * 0.08, H * 0.85, 100, 0, Math.PI * 2); ctx.fill();

  // Top accent line
  const topLine = ctx.createLinearGradient(0, 0, W, 0);
  topLine.addColorStop(0, "transparent");
  topLine.addColorStop(0.3, ec + "99");
  topLine.addColorStop(0.7, "#D4A85399");
  topLine.addColorStop(1, "transparent");
  ctx.fillStyle = topLine; ctx.fillRect(0, 0, W, 3);

  // Logo dot + text
  ctx.fillStyle = "#D4A853";
  ctx.beginPath(); ctx.arc(48, 52, 5, 0, Math.PI * 2); ctx.fill();
  ctx.font = "400 17px 'Georgia', serif";
  ctx.fillStyle = "#2C2420"; ctx.textAlign = "left";
  ctx.fillText("生命长河", 62, 57);

  // Date
  const now = new Date();
  ctx.font = "400 13px Arial, sans-serif";
  ctx.fillStyle = "#B8A898"; ctx.textAlign = "right";
  ctx.fillText(`${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`, W - 44, 57);

  // Title
  ctx.textAlign = "left";
  ctx.font = "bold 44px 'Georgia', serif";
  ctx.fillStyle = "#1A1614";
  ctx.fillText(data.title, 48, 140);

  // Subtitle
  ctx.font = "300 20px Arial, sans-serif";
  ctx.fillStyle = "#9A8878";
  ctx.fillText(data.subtitle, 48, 172);

  // Tagline
  if (data.tagline) {
    ctx.font = "italic 15px Georgia, serif";
    ctx.fillStyle = "#6B5840";
    ctx.fillText(data.tagline, 56, 204);
  }

  // Stats pills
  if (data.stats) {
    data.stats.forEach((s, i) => {
      const x = 48 + i * 130;
      const y = data.tagline ? 240 : 220;
      // Pill bg
      ctx.fillStyle = ec + "18";
      const rr = 10;
      const pw = 108, ph = 52;
      ctx.beginPath();
      ctx.moveTo(x + rr, y); ctx.lineTo(x + pw - rr, y);
      ctx.quadraticCurveTo(x + pw, y, x + pw, y + rr);
      ctx.lineTo(x + pw, y + ph - rr);
      ctx.quadraticCurveTo(x + pw, y + ph, x + pw - rr, y + ph);
      ctx.lineTo(x + rr, y + ph); ctx.quadraticCurveTo(x, y + ph, x, y + ph - rr);
      ctx.lineTo(x, y + rr); ctx.quadraticCurveTo(x, y, x + rr, y); ctx.closePath();
      ctx.fill();
      // Value
      ctx.font = "bold 28px Georgia, serif";
      ctx.fillStyle = ec; ctx.textAlign = "center";
      ctx.fillText(s.value, x + pw / 2, y + 32);
      ctx.font = "400 11px Arial, sans-serif";
      ctx.fillStyle = "#A89888";
      ctx.fillText(s.label.toUpperCase(), x + pw / 2, y + 47);
    });
  }

  // Emotion orb (right side)
  const cx = W * 0.82, cy = H * 0.45;
  // Outer ring
  ctx.strokeStyle = ec + "44"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2); ctx.stroke();
  // Mid ring
  ctx.strokeStyle = ec + "66"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, 67, 0, Math.PI * 2); ctx.stroke();
  // Core fill
  const orbGrad = ctx.createRadialGradient(cx - 20, cy - 20, 0, cx, cy, 56);
  orbGrad.addColorStop(0, ec + "FF"); orbGrad.addColorStop(1, ec + "BB");
  ctx.fillStyle = orbGrad;
  ctx.beginPath(); ctx.arc(cx, cy, 56, 0, Math.PI * 2); ctx.fill();
  // Inner frosted
  ctx.fillStyle = "rgba(255,255,255,.55)";
  ctx.beginPath(); ctx.arc(cx, cy, 37, 0, Math.PI * 2); ctx.fill();
  // Label
  ctx.font = "bold 18px Georgia, serif";
  ctx.fillStyle = "#2C2420"; ctx.textAlign = "center";
  ctx.fillText(data.emotionLabel, cx, cy + 6);

  // Quote block
  if (data.quote) {
    const qy = H - 120;
    ctx.fillStyle = "rgba(255,255,255,.45)";
    const qw = W * 0.6;
    ctx.beginPath();
    ctx.roundRect(44, qy - 12, qw, 44, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(212,168,83,.2)"; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.stroke();
    ctx.font = "italic 14px Georgia, serif";
    ctx.fillStyle = "#8B7868"; ctx.textAlign = "left";
    ctx.fillText(`「${data.quote}」`, 58, qy + 13);
  }

  // Divider
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "rgba(212,168,83,.35)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(44, H - 60); ctx.lineTo(W - 44, H - 60); ctx.stroke();
  ctx.setLineDash([]);

  // Share URL
  ctx.textAlign = "center";
  ctx.font = "600 16px Arial, sans-serif";
  ctx.fillStyle = "#C4A870";
  ctx.fillText(shareUrl, W / 2, H - 30);

  // Bottom accent
  ctx.fillStyle = topLine; ctx.fillRect(0, H - 3, W, 3);

  return canvas.toDataURL("image/png");
}

// ─── Main modal ───────────────────────────────────────────
export default function ShareModal({
  data, onClose,
}: { data: ShareCardData; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [credited, setCredited] = useState(false);
  const [totalCredits, setTotalCredits] = useState(0);
  const [shareId] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());

  const shareUrl = `shengmingchanghe.com/s/${shareId}`;

  const earn = () => {
    if (!credited) { setTotalCredits(c => c + CREDITS_PER_SHARE); setCredited(true); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${shareUrl}`).catch(() => {});
    setCopied(true); earn();
    setTimeout(() => setCopied(false), 2400);
  };

  const downloadCard = useCallback(() => {
    const dataUrl = drawCard(data, shareUrl);
    const a = document.createElement("a");
    a.download = `生命长河-${shareId}.png`;
    a.href = dataUrl; a.click();
    earn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, shareId, shareUrl]);

  return (
    <>
      <style>{`
        @keyframes orbBreath {
          0%,100% { transform:scale(1); opacity:.45; }
          50% { transform:scale(1.15); opacity:.85; }
        }
        @keyframes floatBubble {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-8px); }
        }
        @keyframes shareIn {
          from { opacity:0; transform:scale(.9) translateY(16px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes creditPop {
          0%   { opacity:0; transform:translateY(6px) scale(.95); }
          20%  { opacity:1; transform:translateY(0) scale(1); }
          80%  { opacity:1; transform:translateY(0) scale(1); }
          100% { opacity:0; transform:translateY(-6px) scale(.95); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: "fixed", inset: 0, zIndex: 3000,
          background: "rgba(16,12,10,.78)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
      >
        {/* Modal panel */}
        <div style={{
          background: "linear-gradient(170deg, #FDFCFA 0%, #F9F3EB 100%)",
          borderRadius: 30,
          padding: "30px 28px 26px",
          width: "100%", maxWidth: 468,
          maxHeight: "94vh", overflowY: "auto",
          position: "relative",
          boxShadow: "0 48px 120px rgba(0,0,0,.45), 0 0 0 1.5px rgba(212,168,83,.25), 0 0 40px rgba(212,168,83,.06) inset",
          animation: "shareIn .4s cubic-bezier(.34,1.46,.64,1) forwards",
        }}>

          {/* Decorative top glow */}
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 2.5, borderRadius: 2,
            background: "linear-gradient(to right, transparent, rgba(212,168,83,.8), transparent)",
          }} />

          {/* Close */}
          <button onClick={onClose} style={{
            position: "absolute", top: 18, right: 18,
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(44,36,32,.07)",
            border: "1px solid rgba(44,36,32,.06)",
            cursor: "pointer", fontSize: 13, color: "#8B7868",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(44,36,32,.13)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(44,36,32,.07)"; }}
          >✕</button>

          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase",
              color: "#D4A853", fontWeight: 700, marginBottom: 4,
            }}>
              ✦ SHARE CARD
            </div>
            <div style={{
              fontFamily: "var(--font-display,'Playfair Display',serif)",
              fontSize: 22, color: "#1A1614", letterSpacing: ".01em",
            }}>
              生成分享卡片
            </div>
          </div>

          {/* Credits toast */}
          {totalCredits > 0 && (
            <div style={{
              background: "linear-gradient(135deg, rgba(212,168,83,.14), rgba(236,197,106,.08))",
              border: "1px solid rgba(212,168,83,.45)",
              borderRadius: 14, padding: "11px 16px",
              marginBottom: 16, fontSize: 13, color: "#6B5030",
              display: "flex", alignItems: "center", gap: 10,
              animation: "creditPop .5s ease forwards",
            }}>
              <span style={{ fontSize: 18 }}>🎉</span>
              <div>
                已获得 <strong style={{ color: "#C4872A" }}>+{totalCredits} 积分</strong>
                <span style={{ fontSize: 11, color: "#A08060", marginLeft: 4 }}>· 感谢你的分享！</span>
              </div>
            </div>
          )}

          {/* Card preview */}
          <div style={{ marginBottom: 16 }}>
            <CardPreview data={data} shareUrl={shareUrl} />
          </div>

          {/* Incentive strip */}
          <div style={{
            background: "rgba(255,250,240,.8)",
            border: "1.5px dashed rgba(212,168,83,.38)",
            borderRadius: 14, padding: "12px 15px",
            marginBottom: 16, fontSize: 12.5, color: "#6B5030",
            display: "flex", alignItems: "center", gap: 12, lineHeight: 1.65,
          }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>🎁</span>
            <div>
              分享链接 / 保存卡片可各获 <strong>+{CREDITS_PER_SHARE} 积分</strong><br />
              <span style={{ fontSize: 11.5, color: "#A89878" }}>积分可兑换高级故事生成功能 · 无上限累积</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={copyLink} style={{
              flex: 1, padding: "14px 0", borderRadius: 16,
              border: `1.5px solid ${copied ? "rgba(212,168,83,.7)" : "rgba(212,168,83,.3)"}`,
              background: copied ? "rgba(212,168,83,.14)" : "rgba(255,255,255,.6)",
              color: copied ? "#6B5030" : "#8B7868",
              fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              transition: "all .2s",
              backdropFilter: "blur(4px)",
            }}>
              {copied ? "✓ 链接已复制！" : "⎘ 复制分享链接"}
            </button>
            <button onClick={downloadCard} style={{
              flex: 1, padding: "14px 0", borderRadius: 16, border: "none",
              background: "linear-gradient(135deg, #D4A853 0%, #ECC56A 55%, #D4A853 100%)",
              backgroundSize: "200% 100%",
              color: "#3D2A0E", fontSize: 13, fontWeight: 800,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 5px 20px rgba(212,168,83,.4)",
              transition: "transform .15s, box-shadow .15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 28px rgba(212,168,83,.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 5px 20px rgba(212,168,83,.4)"; }}
            >
              ↓ 保存为图片
            </button>
          </div>

          {/* Fine print */}
          <p style={{
            marginTop: 12, textAlign: "center", fontSize: 11,
            color: "#C8B8A8", letterSpacing: ".02em",
          }}>
            分享链接 · 邀请好友 · 积分永久有效
          </p>

        </div>
      </div>
    </>
  );
}
