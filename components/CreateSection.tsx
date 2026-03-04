"use client";

/**
 * components/CreateSection.tsx
 * ─────────────────────────────
 * 首页"提供素材与 API 信息"区块。
 * 用户选择故事类型、上传素材、填写 API 设置后，点击"开始生成"启动创作流程。
 *
 * 设计参考：design_project/components/layout/SettingsModal.tsx
 *   - 同样支持 302.ai / 直连 双模式
 *   - 设置存于 localStorage（键 lc_settings），页面加载时自动回填已缓存的值
 *   - API Key 不预填硬编码值，仅读取用户本地缓存
 */

import { useState, useEffect, useRef } from "react";
import {
  loadSettings, saveSettings,
  LLM_OPTIONS, GEN_OPTIONS,
  type AppSettings, type ApiSource, type LlmModel, type GenModel,
} from "@/lib/settings";

// ── 故事类型选项 ──────────────────────────────────────────
const STORY_TYPES = [
  { id: "life",   icon: "📖", label: "完整人生" },
  { id: "annual", icon: "📅", label: "年度回顾" },
  { id: "growth", icon: "🌱", label: "成长记录" },
  { id: "love",   icon: "♡",  label: "爱情故事" },
  { id: "family", icon: "🏡", label: "家族传记" },
] as const;

// ── 文件类型说明 ──────────────────────────────────────────
const FILE_HINTS = [
  { icon: "🖼️", label: "照片",     accept: "image/*" },
  { icon: "📝", label: "日记文字", accept: ".txt,.md,.docx" },
  { icon: "🎵", label: "音频",     accept: "audio/*" },
  { icon: "🎞️", label: "视频片段", accept: "video/*" },
];

// ── 帮助文本 ─────────────────────────────────────────────
const PROVIDER_HELP = {
  "302ai":  "302.ai 是统一代理服务，一个 key 即可使用 Claude、Gemini 等所有模型。",
  "direct": "直连各厂商需要分别填写 Claude（Anthropic）和 Gemini（Google）的 API Key。",
} as const;

// ─────────────────────────────────────────────────────────
export default function CreateSection() {
  // ── 设置状态（初始值等到客户端再从 localStorage 加载）──
  const [settings, setSettings] = useState<AppSettings>({
    apiSource: "302ai", api302Key: "", claudeKey: "", geminiKey: "",
    llmModel: "claude-sonnet-4-6", genModel: "gemini-2.5-flash-image-preview",
  });
  const [storyType, setStoryType] = useState<string>("life");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);   // "已保存"提示
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 客户端挂载后从 localStorage 读取缓存设置（含 API Keys）
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  // 便捷 setter：修改单个字段并立即持久化
  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  // ── 文件处理 ─────────────────────────────────────────────
  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setFiles(prev => [...prev, ...Array.from(newFiles)]);
  };

  const removeFile = (i: number) =>
    setFiles(prev => prev.filter((_, idx) => idx !== i));

  // ── 提交 ────────────────────────────────────────────────
  const handleStart = () => {
    // TODO: 跳转到 /create 页面并传递 storyType + files
    alert("功能即将上线 🚀\n现在你可以先在「长河对话」页面体验 AI 陪伴功能。");
  };

  // ── 样式变量 ─────────────────────────────────────────────
  const gold = "#D4A853";
  const borderColor = "rgba(212,168,83,.22)";
  const inputStyle: React.CSSProperties = {
    width: "100%", borderRadius: 10,
    border: `1px solid ${borderColor}`,
    background: "rgba(255,255,255,.06)",
    color: "var(--color-text-main)",
    padding: "10px 14px", fontSize: 13,
    outline: "none", fontFamily: "inherit",
    transition: "border-color .15s",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, letterSpacing: ".1em",
    textTransform: "uppercase" as const,
    color: "rgba(212,168,83,.75)", fontWeight: 700, marginBottom: 6,
    display: "block",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23D4A853'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 32,
    cursor: "pointer",
  };

  return (
    <section
      id="start-creating"
      style={{
        background: "var(--color-midnight)",
        padding: "100px 32px 90px",
        borderTop: "1px solid rgba(212,168,83,.07)",
        scrollMarginTop: 60, // 偏移固定 Navbar 高度
      }}
    >
      {/* ── 区块标题 ──────────────────────────────────────── */}
      <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 60px" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: ".22em",
          textTransform: "uppercase", color: gold, marginBottom: 14,
        }}>
          开始制作
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 4.5vw, 42px)",
          color: "var(--color-text-main)", lineHeight: 1.2, marginBottom: 14,
        }}>
          提供素材与 API 信息
        </h2>
        <p style={{ fontSize: 15, color: "var(--color-text-soft)", lineHeight: 1.75 }}>
          上传你的照片、日记或音频，配置 AI 模型，<br />
          长河将自动提炼记忆，生成你的专属故事页。
        </p>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* ── 行 1：故事类型 ──────────────────────────────── */}
        <Card title="选择故事类型" icon="✦">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {STORY_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setStoryType(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "9px 18px", borderRadius: 30,
                  border: `1.5px solid ${storyType === t.id ? gold : borderColor}`,
                  background: storyType === t.id
                    ? "rgba(212,168,83,.15)"
                    : "rgba(255,255,255,.03)",
                  color: storyType === t.id ? gold : "var(--color-text-soft)",
                  fontSize: 13, fontWeight: storyType === t.id ? 700 : 400,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all .18s",
                }}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </Card>

        {/* ── 行 2：素材上传 ──────────────────────────────── */}
        <Card title="上传素材" icon="📂">
          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault(); setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            style={{
              border: `2px dashed ${dragging ? gold : borderColor}`,
              borderRadius: 16,
              padding: "36px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: dragging ? "rgba(212,168,83,.06)" : "rgba(255,255,255,.02)",
              transition: "all .2s",
              marginBottom: files.length ? 16 : 0,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>📤</div>
            <div style={{ fontSize: 14, color: "var(--color-text-main)", marginBottom: 6 }}>
              点击或拖拽上传素材
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-soft)" }}>
              支持：{FILE_HINTS.map(f => `${f.icon} ${f.label}`).join(" · ")}
            </div>
          </div>
          <input
            ref={fileInputRef} type="file" multiple
            accept="image/*,audio/*,video/*,.txt,.md,.docx"
            style={{ display: "none" }}
            onChange={e => addFiles(e.target.files)}
          />

          {/* File list */}
          {files.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {files.map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 14px", borderRadius: 10,
                  border: `1px solid ${borderColor}`,
                  background: "rgba(212,168,83,.04)",
                }}>
                  <span style={{ fontSize: 16 }}>
                    {f.type.startsWith("image") ? "🖼️" : f.type.startsWith("audio") ? "🎵" : f.type.startsWith("video") ? "🎞️" : "📝"}
                  </span>
                  <span style={{ flex: 1, fontSize: 13, color: "var(--color-text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.name}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--color-text-soft)", flexShrink: 0 }}>
                    {(f.size / 1024).toFixed(0)} KB
                  </span>
                  <button onClick={() => removeFile(i)} style={{
                    background: "none", border: "none",
                    color: "var(--color-text-soft)", cursor: "pointer",
                    fontSize: 14, lineHeight: 1, flexShrink: 0, padding: "0 2px",
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── 行 3：API 设置 ──────────────────────────────── */}
        <Card
          title="API 设置"
          icon="🔑"
          badge={saved ? "已保存" : undefined}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* API 来源切换 */}
            <div>
              <label style={labelStyle}>API 来源</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {(["302ai", "direct"] as ApiSource[]).map(src => (
                  <button
                    key={src}
                    onClick={() => set("apiSource", src)}
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 10,
                      border: `1.5px solid ${settings.apiSource === src ? gold : borderColor}`,
                      background: settings.apiSource === src
                        ? "rgba(212,168,83,.15)" : "rgba(255,255,255,.03)",
                      color: settings.apiSource === src ? gold : "var(--color-text-soft)",
                      fontSize: 13, fontWeight: settings.apiSource === src ? 700 : 400,
                      cursor: "pointer", fontFamily: "inherit", transition: "all .18s",
                    }}
                  >
                    {src === "302ai" ? "302.ai（推荐）" : "直连各厂商"}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: "rgba(212,168,83,.55)", lineHeight: 1.6, margin: 0 }}>
                {PROVIDER_HELP[settings.apiSource]}
              </p>
            </div>

            {/* API Key 输入 */}
            {settings.apiSource === "302ai" ? (
              <div>
                <label style={labelStyle}>302.ai API Key</label>
                <input
                  type="password"
                  value={settings.api302Key}
                  onChange={e => set("api302Key", e.target.value)}
                  placeholder="sk-302ai-..."
                  style={inputStyle}
                  onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = gold; }}
                  onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = borderColor; }}
                />
                <p style={{ fontSize: 11, color: "var(--color-text-soft)", marginTop: 5, lineHeight: 1.5 }}>
                  获取 key：<a href="https://302.ai" target="_blank" rel="noreferrer"
                    style={{ color: gold, textDecoration: "none" }}>302.ai</a>
                  {" · "}设置仅存本地，不上传服务器
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Claude API Key（Anthropic）</label>
                  <input
                    type="password"
                    value={settings.claudeKey}
                    onChange={e => set("claudeKey", e.target.value)}
                    placeholder="sk-ant-..."
                    style={inputStyle}
                    onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = gold; }}
                    onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = borderColor; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Gemini API Key（Google）</label>
                  <input
                    type="password"
                    value={settings.geminiKey}
                    onChange={e => set("geminiKey", e.target.value)}
                    placeholder="AIzaSy..."
                    style={inputStyle}
                    onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = gold; }}
                    onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = borderColor; }}
                  />
                </div>
              </div>
            )}

            {/* 模型选择 — 两列 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>LLM 模型</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={settings.llmModel}
                    onChange={e => set("llmModel", e.target.value as LlmModel)}
                    style={selectStyle}
                    onFocus={e => { (e.currentTarget as HTMLSelectElement).style.borderColor = gold; }}
                    onBlur={e => { (e.currentTarget as HTMLSelectElement).style.borderColor = borderColor; }}
                  >
                    <optgroup label="Claude（Anthropic）">
                      {LLM_OPTIONS.filter(o => o.vendor === "claude").map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Gemini（Google）">
                      {LLM_OPTIONS.filter(o => o.vendor === "gemini").map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <p style={{ fontSize: 10.5, color: "var(--color-text-soft)", marginTop: 5 }}>
                  用于对话与记忆提炼
                </p>
              </div>

              <div>
                <label style={labelStyle}>生成模型</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={settings.genModel}
                    onChange={e => set("genModel", e.target.value as GenModel)}
                    style={selectStyle}
                    onFocus={e => { (e.currentTarget as HTMLSelectElement).style.borderColor = gold; }}
                    onBlur={e => { (e.currentTarget as HTMLSelectElement).style.borderColor = borderColor; }}
                  >
                    {GEN_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <p style={{ fontSize: 10.5, color: "var(--color-text-soft)", marginTop: 5 }}>
                  用于故事可视化图像
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 提交按钮 ────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <button
            onClick={handleStart}
            style={{
              background: "linear-gradient(135deg, #D4A853, #ECC56A)",
              color: "#2C1A06",
              border: "none", borderRadius: 40,
              padding: "16px 52px",
              fontSize: 15, fontWeight: 800,
              letterSpacing: ".03em",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 6px 28px rgba(212,168,83,.4)",
              transition: "transform .2s, box-shadow .2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.02)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 36px rgba(212,168,83,.55)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(212,168,83,.4)";
            }}
          >
            ✦ 开始生成我的故事
          </button>
          <p style={{ marginTop: 12, fontSize: 11.5, color: "var(--color-text-soft)" }}>
            设置自动保存在本地 · 不上传服务器
          </p>
        </div>

      </div>
    </section>
  );
}

// ── 内部卡片容器 ─────────────────────────────────────────
function Card({
  title, icon, badge, children,
}: {
  title: string;
  icon: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,.025)",
      border: "1px solid rgba(212,168,83,.14)",
      borderRadius: 20,
      padding: "28px 28px 24px",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
      }}>
        <span style={{ fontSize: 17 }}>{icon}</span>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: 16, color: "var(--color-text-main)", fontWeight: 400,
        }}>
          {title}
        </span>
        {badge && (
          <span style={{
            marginLeft: "auto", fontSize: 11, color: "#D4A853",
            background: "rgba(212,168,83,.12)",
            border: "1px solid rgba(212,168,83,.3)",
            borderRadius: 20, padding: "3px 10px", fontWeight: 700,
          }}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
