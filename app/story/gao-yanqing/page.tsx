"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// ── Types ────────────────────────────────────────────────────────────────────
type Artifact = {
  id: string;
  img: string;
  title: string;
  tags: string[];
  shortDesc: string;
  fullDesc: string;
  year: string;
};

// ── Artifact data ─────────────────────────────────────────────────────────────
const ARTIFACTS: Artifact[] = [
  {
    id: "A-01",
    img: "/sample_data/人生轨迹照片/bc8aeac183858a50cc55bb362c289620.jpg",
    title: "军功章 + 中国民航登机牌",
    tags: ["朝鲜战争", "1950s", "勋章"],
    year: "1951—1952",
    shortDesc:
      "朝鲜军功章证明书（No.349711）与中国民航CAAC登机牌（北京至苏州），均夹于同一册日记本中，见证了戎马与生活交织的年代。",
    fullDesc: `朝鲜民主主义人民共和国向高延清颁发군공메달（军功勋章）第349711号，附朝鲜政府正式证明书，加盖红色官印——这是对他在战场上英勇表现的最高认定。

同一册日记本中，还夹藏着一张中国民航CAAC的老式登机牌：北京至苏州，票价、舱位、座位号均清晰可见。

军功章与民航票，战场与生活并置一页，道尽了那个年代军人的两重身份——既是冲锋陷阵的战士，也是买票出行的普通人。

两件文物同框，是高延清细心保存的习惯，也是他那个时代最诚实的生活侧面。`,
  },
  {
    id: "A-02",
    img: "/sample_data/人生轨迹照片/6684f6ae6f9d9b0ae541cddeee65c16d.jpg",
    title: "中央机关饭票 · 1952—1973",
    tags: ["中央机关", "日常生活", "历史文物"],
    year: "1952—1973",
    shortDesc:
      "志愿军大灶饭票（1952年）、中直机关夜餐券、○三六四支队军官食堂餐票……饭票上的每一枚印章，都是那个时代最生动的生活切片。",
    fullDesc: `这一批饭票跨越了高延清人生中最重要的二十年，按时间排列，几乎就是一部小型生活史：

1952年，朝鲜战场后勤期间，中国人民志愿军大灶饭票——当时物资匮乏，伙食统一管控，一张票换一顿饭，面值几分，分量极重。

1961年至1973年，调入中共中央专案组后，保存有中直机关工作人员夜餐券、○三六四支队军官食堂餐票、公安部饭票等多种类型。票面设计简洁，印章清晰，有的注明了斤两，有的标注了班次。

这些小小纸片，面值从几分到几角不等，每一枚印章背后，都是一个具体的日子、一顿具体的饭。高延清将它们一一收存，无意间完成了对那个时代最细腻的民间记录。`,
  },
  {
    id: "A-03",
    img: "/sample_data/人生轨迹照片/8663c972b1097a70adf4e774d3815cda.jpg",
    title: "建国二十周年预演参观券 · 1969",
    tags: ["天安门", "1969", "国庆观礼"],
    year: "1968—1970",
    shortDesc:
      "1969年9月25日，建国二十周年预演观摩「东红5台」邀请券；背面为建国十九周年天安门游行大会正式请柬。一张粉红色卡纸，封存了两段历史的重量。",
    fullDesc: `这张粉红色的硬纸卡，正反两面，封存了两段截然不同的历史：

正面：1969年9月25日「庆祝中华人民共和国成立二十周年预演观摩」邀请券，区域标注为「东红5台」，加盖国庆节筹备工作领导小组公章。

背面：建国十九周年（1968年）天安门广场群众庆祝游行大会正式请柬，标注观礼台区位，字迹工整，格式庄重。

高延清三次收到天安门观礼邀请——1968、1969和1970年，每次区位不同（东观礼台、西观礼台均有记录）。能连续三年受邀亲历广场观礼，在那个年代本身已是莫大的政治荣誉与信任。

他将这些请柬完好保存至今，让我们得以触摸那个红色年代的温度，感受一位普通军人与历史的贴近距离。`,
  },
  {
    id: "A-04",
    img: "/sample_data/人生轨迹照片/02c9b19233bd27860ff2158550b24fb7.jpg",
    title: "《清风霁月》手写原稿 · 1982",
    tags: ["文学创作", "1982", "毛笔手稿"],
    year: "1982年八月四日",
    shortDesc:
      "1982年八月四日，毛笔行书写就自序，印章「高延清」。文字流淌如水：「总之呼声，无始无终，爱之空间，无根无际」——这是一位老兵，用文字完成的最后一次冲锋。",
    fullDesc: `1982年八月四日，距离高延清正式退伍已三年。他铺开白纸，蘸墨，开始用毛笔行书写下《清风霁月》的自序。

原稿右上角，「高延清」红色印章端正落下，是他对这部作品最郑重的署名。

自序开篇写道：「人类社会，归根结底，它总像老子的呼空虚，是复忆过客。总之呼声，无始无终，爱之空间，无根无际。」——这不像一个行伍出身的人该有的文字，却是高延清最真实的精神底色。他用战场锻炼出的坚韧，转化为对生命、时间与爱的哲学沉思。

行书流畅，笔力内敛，每一个字都经过深思。整篇自序不足三百字，却字字有重量。

此后数十年，他陆续完成逾14个章节、收录124首诗词的自传与作品集。以笔为剑，完成了这位老兵一生中最后一次，也最持久的一次冲锋。`,
  },
];

// ── Shared components ─────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -48px 0px" }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Annotation: SVG line + label pointing to a photo detail
function Annotation({
  x1, y1, x2, y2, label, align = "left",
}: {
  x1: number; y1: number; x2: number; y2: number; label: string; align?: "left" | "right";
}) {
  return (
    <>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        style={{ overflow: "visible" }}
      >
        <line
          x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
          stroke="#D4A853" strokeWidth="1" strokeDasharray="4 3" opacity="0.7"
        />
        <circle cx={`${x1}%`} cy={`${y1}%`} r="3" fill="#D4A853" opacity="0.8" />
      </svg>
      <div
        className="absolute z-20 font-narrative italic text-[0.7rem] text-[#D4A853] leading-snug max-w-[110px] pointer-events-none"
        style={{
          left: align === "left" ? `${x2 + 1}%` : "auto",
          right: align === "right" ? `${100 - x2 + 1}%` : "auto",
          top: `${y2 - 3}%`,
        }}
      >
        {label}
      </div>
    </>
  );
}

// ── Artifact detail modal ─────────────────────────────────────────────────────
function ArtifactModal({
  artifact,
  onClose,
}: {
  artifact: Artifact;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center p-4 md:p-8 bg-[rgba(8,8,14,0.92)] backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.9),0_0_40px_rgba(212,168,83,0.12)] border border-[var(--color-border-main)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[rgba(26,26,42,0.75)] text-[#EDE8E0] flex items-center justify-center text-xl leading-none hover:bg-[#D4A853] hover:text-[#08080E] transition-all backdrop-blur-sm"
          aria-label="关闭"
        >
          ×
        </button>

        {/* Image */}
        <div className="relative h-60 md:h-72 overflow-hidden rounded-t-2xl">
          <Image
            src={artifact.img}
            alt={artifact.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-surface)]" style={{ opacity: 0.85 }} />
          <div className="absolute top-4 left-4 bg-[rgba(26,26,42,0.85)] text-[#D4A853] text-[9px] px-3 py-1 rounded-full font-ui tracking-widest uppercase backdrop-blur-sm">
            档案编号 {artifact.id}
          </div>
          <div className="absolute bottom-3 left-5 font-ui text-[9px] tracking-widest text-[#A07830] uppercase">{artifact.year}</div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 text-[var(--color-text-main)]">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-5 leading-snug">
            {artifact.title}
          </h3>

          <div className="space-y-4 mb-6">
            {artifact.fullDesc.split("\n\n").map((para, i) => (
              <p key={i} className="font-narrative text-[0.95rem] text-[var(--color-text-soft)] leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap border-t border-[var(--color-border-main)] pt-4">
            {artifact.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#D4A853]/15 text-[#A07830] text-[9px] px-3 py-1 rounded-full font-ui tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Share card modal ──────────────────────────────────────────────────────────
function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center p-4 md:p-8 bg-[rgba(8,8,14,0.92)] backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The share card */}
        <div className="rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(212,168,83,0.2),0_40px_80px_rgba(0,0,0,0.8)]">

          {/* Dark cinematic header */}
          <div className="relative bg-gradient-to-br from-[#0C0C18] via-[#1A1220] to-[#14100A] px-7 pt-7 pb-5">
            {/* Gold radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.14) 0%, transparent 65%)" }}
            />
            {/* Film-grain stripe texture */}
            <div
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.5) 4px)" }}
            />

            {/* Brand row */}
            <div className="flex items-center gap-2 mb-5 relative">
              <div className="w-2 h-2 rounded-full bg-[#D4A853] shadow-[0_0_8px_rgba(212,168,83,0.9)]" />
              <span className="font-display text-[0.9rem] font-semibold text-[#EDE8E0] tracking-wide">YourLife Story</span>
              <span className="font-ui text-[8px] text-[#D4A853] tracking-widest ml-auto opacity-80">Created by DaLa</span>
            </div>

            {/* Portrait + meta */}
            <div className="flex gap-3 items-start mb-5 relative">
              <div className="relative w-[72px] h-[88px] rounded-lg overflow-hidden border-2 border-white/10 shadow-lg -rotate-1 shrink-0">
                <Image
                  src="/sample_data/个人肖像照片/056857cf0aa1b52f4f5e4eb0720bff0e.jpg"
                  alt=""
                  fill
                  className="object-cover object-top"
                  style={{ filter: "sepia(0.45) contrast(1.05)" }}
                />
              </div>
              <div className="relative w-[56px] h-[72px] rounded-lg overflow-hidden border-2 border-white/10 shadow-lg rotate-1 mt-4 shrink-0">
                <Image
                  src="/sample_data/个人肖像照片/c2bc25730a7751fea32ff01f81fb2bf4.jpg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center pl-1 min-w-0">
                <div className="font-display text-[1.6rem] font-bold text-[#EDD89A] leading-none mb-1">高延清</div>
                <div className="font-ui text-[8px] tracking-widest text-[#D4A853] uppercase mb-2.5">人生长河 · Life Story</div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="font-ui text-[7px] text-[#A09888] bg-white/5 px-2 py-0.5 rounded-full">1933—今</span>
                  <span className="font-ui text-[7px] text-[#A09888] bg-white/5 px-2 py-0.5 rounded-full">志愿军老兵</span>
                </div>
              </div>
            </div>

            {/* Key stats row */}
            <div className="grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-4 relative">
              {[
                { n: "28年", l: "军旅" },
                { n: "3次", l: "天安门" },
                { n: "124首", l: "诗词" },
              ].map(({ n, l }) => (
                <div key={l} className="text-center">
                  <div className="font-display text-[0.95rem] font-bold text-[#D4A853]">{n}</div>
                  <div className="font-ui text-[7px] text-[#706858] uppercase tracking-wide mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gold incentive strip */}
          <div className="bg-gradient-to-r from-[#C49840] via-[#D4A853] to-[#ECC56A] px-7 py-4 flex items-center justify-between">
            <div>
              <p className="font-display text-[#0A0A14] font-bold text-[0.95rem] leading-tight">分享获得免费试用</p>
              <p className="font-ui text-[#5A3E0A] text-[0.8rem] mt-0.5">Token 不限量 · 1个月</p>
            </div>
            <div className="text-[#0A0A14] opacity-40 font-display text-3xl font-bold leading-none">✦</div>
          </div>
        </div>

        {/* Action buttons below card */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border-main)] text-[var(--color-text-main)] font-ui text-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all"
          >
            {copied ? "✓ 已复制链接" : "复制链接"}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-transparent border border-white/10 text-[var(--color-text-dim)] font-ui text-sm hover:border-white/30 transition-all"
          >
            关闭
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GaoYanqingPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".tl-event").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.15, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end: "bottom 22%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }, timelineRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 bg-[var(--color-midnight)] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(212,168,83,0.09) 0%, transparent 65%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(255,255,255,0.4) 49px)" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.42em" }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-ui text-[10px] uppercase text-[var(--color-gold)] mb-8 block"
          >
            中国人民志愿军老兵 · 人生长河
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.5, ease }}
            className="font-display font-bold leading-none mb-6"
            style={{ fontSize: "clamp(5rem, 18vw, 12rem)" }}
          >
            <span className="bg-gradient-to-b from-[#EDD89A] via-[#D4A853] to-[#A07830] bg-clip-text text-transparent">
              高延清
            </span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1, ease }}
            className="h-px w-48 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease }}
            className="font-narrative italic text-[var(--color-text-soft)] mb-3"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.4rem)" }}
          >
            &ldquo;总之呼声，无始无终，爱之空间，无根无际。&rdquo;
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)]"
          >
            — 《清风霁月》自序 · 1982年八月四日
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-14 flex flex-wrap justify-center gap-6 md:gap-12 text-center"
          >
            {[
              { n: "1933", l: "出生大连" },
              { n: "1951", l: "入朝参战" },
              { n: "28", l: "年军旅生涯" },
              { n: "90+", l: "岁仍笔耕不辍" },
            ].map(({ n, l }) => (
              <div key={n}>
                <div className="font-display text-2xl font-bold text-[var(--color-gold)]">{n}</div>
                <div className="font-ui text-[9px] tracking-widest text-[var(--color-text-dim)] uppercase mt-1">{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="absolute bottom-8 flex flex-col items-center gap-3"
        >
          <span className="font-ui text-[9px] tracking-[0.3em] uppercase text-[var(--color-text-dim)]">滑动翻阅一生</span>
          <div className="h-12 w-px bg-gradient-to-b from-[var(--color-gold)] to-transparent animate-[pulseBar_2s_ease-in-out_infinite]" />
        </motion.div>
      </section>

      {/* ═══ 2. OPENING PORTRAIT — adapts to theme ═══ */}
      <section className="bg-[var(--color-deep)] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Portraits collage */}
            <FadeIn className="relative h-[420px] md:h-[520px]">
              <div
                className="absolute top-0 left-0 w-52 h-64 md:w-64 md:h-80 rounded-sm overflow-hidden border-4 border-white shadow-2xl rotate-[-2deg]"
                style={{ filter: "sepia(0.3) contrast(1.1)" }}
              >
                <Image
                  src="/sample_data/个人肖像照片/056857cf0aa1b52f4f5e4eb0720bff0e.jpg"
                  alt="青年高延清"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="absolute top-12 right-0 w-44 h-56 md:w-56 md:h-72 rounded-sm overflow-hidden border-4 border-white shadow-xl rotate-[2deg]"
                style={{ filter: "sepia(0.4) contrast(1.05)" }}
              >
                <Image
                  src="/sample_data/个人肖像照片/a10bfbf0872e7d05e4d9698cd17a5c33.jpg"
                  alt="军官时期"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-12 w-40 h-52 md:w-52 md:h-64 rounded-sm overflow-hidden border-4 border-white shadow-xl rotate-[1deg]">
                <Image
                  src="/sample_data/个人肖像照片/c2bc25730a7751fea32ff01f81fb2bf4.jpg"
                  alt="晚年佩勋章"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-[-10px] left-2 bg-[#1A1A2A] text-[var(--color-gold)] text-[9px] px-2 py-0.5 rounded font-ui tracking-widest uppercase z-10">1950s · 参军时</div>
              <div className="absolute top-4 right-[-8px] bg-[#1A1A2A] text-[var(--color-gold)] text-[9px] px-2 py-0.5 rounded font-ui tracking-widest uppercase z-10">1960 · 任职军官</div>
              <div className="absolute bottom-[-10px] left-8 bg-[#D4A853] text-[#1A1A2A] text-[9px] px-2 py-0.5 rounded font-ui tracking-widest uppercase font-semibold z-10">佩勋章留影</div>
            </FadeIn>

            {/* Text */}
            <FadeIn delay={0.2} className="text-[var(--color-text-main)]">
              <span className="font-ui text-[10px] tracking-[0.36em] uppercase text-[#D4A853] mb-4 block">People&apos;s Volunteer Army Veteran</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                时代的<br />见证者
              </h2>
              <p className="font-narrative text-lg leading-loose text-[var(--color-text-soft)] mb-6">
                1933年，高延清出生于日本占领下的大连瓦房店。
                战火中的童年，磨砺出了坚韧的心性——
                18岁那年，他主动请缨，随中国人民志愿军跨过鸭绿江。
              </p>
              <p className="font-narrative text-lg leading-loose text-[var(--color-text-soft)] mb-8">
                此后二十八年，他历经朝鲜战场的硝烟、
                中央机关的沉稳岁月、辽阳石化的建设年代，
                最终以笔为剑，写就逾六万字的《清风霁月》，
                将一个时代的呼声，永远留存于纸页之间。
              </p>
              <div className="grid grid-cols-3 gap-4 border-t border-[var(--color-border-main)] pt-6">
                {[
                  { n: "2枚", l: "军功章" },
                  { n: "3次", l: "天安门观礼" },
                  { n: "124首", l: "诗词收录" },
                ].map(({ n, l }) => (
                  <div key={l} className="text-center">
                    <div className="font-display text-xl font-bold text-[#D4A853]">{n}</div>
                    <div className="font-ui text-[9px] tracking-widest text-[var(--color-text-dim)] uppercase mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 3. TIMELINE SCROLLYTELLING ═══ */}
      <section ref={timelineRef} className="bg-[var(--color-midnight)] py-24 px-6 relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--color-border-main)] to-transparent -translate-x-1/2" />

        <FadeIn className="text-center mb-20">
          <span className="font-ui text-[10px] tracking-[0.36em] uppercase text-[var(--color-gold)] block mb-3">Life Timeline</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">人生长河</h2>
        </FadeIn>

        <div className="max-w-5xl mx-auto space-y-28 relative z-10">

          {/* 1933 */}
          <div className="tl-event flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 md:text-right">
              <div className="font-display text-6xl md:text-7xl text-[var(--color-gold)] font-bold mb-4 leading-none">1933</div>
              <div className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)] uppercase mb-3">出生 · 大连瓦房店</div>
              <p className="font-narrative text-lg text-[var(--color-text-soft)] leading-loose">
                出生于辽宁大连瓦房店，彼时东北正处于日本殖民统治之下。
                动荡的童年并未压垮这个男孩，反而在心底种下了一颗
                <em>爱国与担当</em>的种子。
              </p>
            </div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-midnight)] border-4 border-[var(--color-gold)] z-10 shrink-0 shadow-[0_0_16px_rgba(212,168,83,0.6)]" />
            <div className="md:w-1/2 flex justify-start">
              <div className="bg-[var(--color-surface2)] rounded px-6 py-5 border border-[var(--color-border-main)] max-w-xs">
                <div className="font-ui text-[9px] tracking-widest text-[var(--color-text-dim)] uppercase mb-2">时代背景</div>
                <p className="font-narrative italic text-[var(--color-text-soft)] text-sm leading-loose">
                  1933年，九一八事变发生仅两年，东北沦陷。
                  大连作为日本租借地，被殖民统治长达半世纪。
                </p>
              </div>
            </div>
          </div>

          {/* 1951 */}
          <div className="tl-event flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            <div className="md:w-1/2">
              <div className="font-display text-6xl md:text-7xl text-[var(--color-gold)] font-bold mb-4 leading-none">1951</div>
              <div className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)] uppercase mb-3">入朝参战 · 抗美援朝</div>
              <p className="font-narrative text-lg text-[var(--color-text-soft)] leading-loose">
                年仅十八岁，高延清主动报名参加中国人民志愿军，
                随部队跨过鸭绿江，踏上硝烟弥漫的朝鲜半岛。
                这一段经历，成为他一生信念的基石。
              </p>
            </div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-midnight)] border-4 border-[var(--color-gold)] z-10 shrink-0 shadow-[0_0_16px_rgba(212,168,83,0.6)]" />
            <div className="md:w-1/2 flex justify-end">
              <div className="relative w-56 h-72 md:w-64 md:h-80">
                <div
                  className="w-full h-full rounded-sm overflow-hidden border-4 border-white shadow-2xl -rotate-2"
                  style={{ filter: "sepia(0.5) contrast(1.1)" }}
                >
                  <Image
                    src="/sample_data/个人肖像照片/056857cf0aa1b52f4f5e4eb0720bff0e.jpg"
                    alt="参军时期"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-[var(--color-midnight)] border border-[var(--color-gold)] text-[var(--color-gold)] text-[9px] px-2 py-1 rounded font-ui tracking-widest uppercase">入伍证件照</div>
              </div>
            </div>
          </div>

          {/* 1952 — 军功章 */}
          <div className="tl-event flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 md:text-right">
              <div className="font-display text-6xl md:text-7xl text-[var(--color-gold)] font-bold mb-4 leading-none">1952</div>
              <div className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)] uppercase mb-3">朝鲜军功奖章 · No.349711</div>
              <p className="font-narrative text-lg text-[var(--color-text-soft)] leading-loose">
                因在战场上的突出表现，朝鲜民主主义人民共和国
                向高延清颁发<em>军功勋章（군공메달）第349711号</em>，
                附有朝鲜政府证明书，加盖红色官印。
                这是他珍藏一生的荣誉凭证。
              </p>
            </div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-midnight)] border-4 border-[var(--color-gold)] z-10 shrink-0 shadow-[0_0_16px_rgba(212,168,83,0.6)]" />
            <div className="md:w-1/2 flex justify-start">
              <div className="relative w-64 h-72 md:w-72 md:h-80">
                <div className="w-full h-full rounded overflow-hidden shadow-2xl border border-white/10">
                  <Image
                    src="/sample_data/人生轨迹照片/8d48dbff19f775f65c4f338d4a444e02.jpg"
                    alt="군공메달证书"
                    fill
                    className="object-cover"
                  />
                </div>
                <Annotation x1={38} y1={22} x2={98} y2={10} label="군공메달勋章图样" align="right" />
                <Annotation x1={22} y1={68} x2={98} y2={60} label="No. 349711 编号" align="right" />
                <Annotation x1={38} y1={85} x2={98} y2={80} label="朝鲜政府红色官印" align="right" />
              </div>
            </div>
          </div>

          {/* 1960 — 任命书 */}
          <div className="tl-event flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            <div className="md:w-1/2">
              <div className="font-display text-6xl md:text-7xl text-[var(--color-gold)] font-bold mb-4 leading-none">1960</div>
              <div className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)] uppercase mb-3">解放军第三十九军任命书</div>
              <p className="font-narrative text-lg text-[var(--color-text-soft)] leading-loose">
                1960年10月1日，高延清被正式任命为
                <em>陆军第三十九军第117师政治部保卫科助理员</em>，
                任命书第1777号，由军长王东保、政治委员李少元联署。
                这份文件，是他军旅生涯的有力注脚。
              </p>
            </div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-midnight)] border-4 border-[var(--color-gold)] z-10 shrink-0 shadow-[0_0_16px_rgba(212,168,83,0.6)]" />
            <div className="md:w-1/2 flex justify-end">
              <div className="relative w-56 h-80 md:w-64 md:h-96">
                <div className="w-full h-full rounded overflow-hidden shadow-2xl border border-white/10 rotate-1">
                  <Image
                    src="/sample_data/人生轨迹照片/8668c5ac15534397ceac99b820ec0157.jpg"
                    alt="任命书"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <Annotation x1={50} y1={12} x2={4} y2={5} label="中华人民共和国国徽" />
                <Annotation x1={50} y1={55} x2={4} y2={48} label="第1777号任命书" />
                <Annotation x1={25} y1={88} x2={4} y2={82} label="军长王东保亲笔签名" />
              </div>
            </div>
          </div>

          {/* 1961-1973 — 中央机关 */}
          <div className="tl-event flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 md:text-right">
              <div className="font-display text-4xl md:text-5xl text-[var(--color-gold)] font-bold mb-4 leading-none">1961—1973</div>
              <div className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)] uppercase mb-3">中共中央机关 · 北京</div>
              <p className="font-narrative text-lg text-[var(--color-text-soft)] leading-loose">
                调入中共中央专案组工作，服务于中央直属机关。
                保存至今的<em>大灶饭票</em>、中直机关夜餐券、
                公安部饭票，无声记录了那个年代的日常：
                每一餐、每一分，都是历史的切片。
              </p>
            </div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-midnight)] border-4 border-[var(--color-gold)] z-10 shrink-0 shadow-[0_0_16px_rgba(212,168,83,0.6)]" />
            <div className="md:w-1/2 flex justify-start gap-3">
              <div className="relative w-44 h-60 md:w-52 md:h-72 rounded overflow-hidden shadow-xl border border-white/10">
                <Image
                  src="/sample_data/人生轨迹照片/6684f6ae6f9d9b0ae541cddeee65c16d.jpg"
                  alt="中央机关饭票"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* 1968-1970 — 天安门观礼 */}
          <div className="tl-event flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            <div className="md:w-1/2">
              <div className="font-display text-4xl md:text-5xl text-[var(--color-gold)] font-bold mb-4 leading-none">
                1968<span className="text-3xl opacity-60">—</span>1970
              </div>
              <div className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)] uppercase mb-3">三次受邀 · 天安门观礼</div>
              <p className="font-narrative text-lg text-[var(--color-text-soft)] leading-loose">
                建国十九、二十周年国庆，及1970年五一劳动节，
                高延清三次收到<em>天安门广场群众庆祝游行大会</em>正式请柬——
                东、西观礼台区位不同，
                每张粉红色卡纸上都盖有国庆节筹备工作领导小组印章。
                这是一个时代给予他的最高礼遇。
              </p>
            </div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-midnight)] border-4 border-[var(--color-gold)] z-10 shrink-0 shadow-[0_0_16px_rgba(212,168,83,0.6)]" />
            <div className="md:w-1/2 flex justify-end">
              <div className="relative w-64 h-52 md:w-80 md:h-64 rounded overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="/sample_data/人生轨迹照片/eb918bb8b6f07f72a42227d6a876db17.jpg"
                  alt="天安门观礼请柬"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,14,0.6)] to-transparent" />
                <div className="absolute bottom-3 left-3 font-ui text-[9px] tracking-widest text-[var(--color-gold)] uppercase">1969 · 1970 · 观礼邀请函</div>
              </div>
            </div>
          </div>

          {/* 1971 — 北京文体生活 */}
          <div className="tl-event flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 md:text-right">
              <div className="font-display text-6xl md:text-7xl text-[var(--color-gold)] font-bold mb-4 leading-none">1971</div>
              <div className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)] uppercase mb-3">北京 · 文体活动留存票根</div>
              <p className="font-narrative text-lg text-[var(--color-text-soft)] leading-loose">
                北京体育馆、首都体育馆、二七剧场、
                中国革命军事博物馆、中国美术馆……
                高延清将每一张票根、每一次参与，
                都细心夹入日记本，形成了一份
                <em>独属于那个年代的文化地图</em>。
              </p>
            </div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-midnight)] border-4 border-[var(--color-gold)] z-10 shrink-0 shadow-[0_0_16px_rgba(212,168,83,0.6)]" />
            <div className="md:w-1/2 flex justify-start gap-3">
              <div className="relative w-36 h-52 md:w-44 md:h-64 rounded overflow-hidden shadow-xl border border-white/10 rotate-[-1deg]">
                <Image
                  src="/sample_data/人生轨迹照片/e55ac1a0b44adced0090846a15700568.jpg"
                  alt="文体票根"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-36 h-52 md:w-44 md:h-64 rounded overflow-hidden shadow-xl border border-white/10 rotate-[1.5deg] mt-6">
                <Image
                  src="/sample_data/人生轨迹照片/e8cbb71b654e41d65fbe76b352d7b29a.jpg"
                  alt="体育馆票"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* 1982 — 开始写作 */}
          <div className="tl-event flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            <div className="md:w-1/2">
              <div className="font-display text-6xl md:text-7xl text-[var(--color-gold)] font-bold mb-4 leading-none">1982</div>
              <div className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)] uppercase mb-3">执笔 · 《清风霁月》</div>
              <p className="font-narrative text-lg text-[var(--color-text-soft)] leading-loose">
                1982年八月四日，高延清开始着笔，
                写下《清风霁月》自序——
                <em>&ldquo;人类社会，归根结底，它总像老子的呼空虚，是复忆过客。&rdquo;</em>
                毛笔行书，印章"高延清"。
                此后数十年，他陆续完成逾14章节、124首诗词的自传与作品集。
              </p>
            </div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-midnight)] border-4 border-[var(--color-gold)] z-10 shrink-0 shadow-[0_0_16px_rgba(212,168,83,0.6)]" />
            <div className="md:w-1/2 flex justify-end">
              <div className="relative w-56 h-72 md:w-64 md:h-80 rotate-1">
                <div className="w-full h-full rounded overflow-hidden shadow-2xl border-2 border-white/20">
                  <Image
                    src="/sample_data/人生轨迹照片/02c9b19233bd27860ff2158550b24fb7.jpg"
                    alt="手稿原件"
                    fill
                    className="object-cover"
                  />
                </div>
                <Annotation x1={60} y1={10} x2={4} y2={4} label="高延清 印章" />
                <Annotation x1={80} y1={85} x2={4} y2={80} label="1982年八月四日 落款" />
              </div>
            </div>
          </div>

          {/* 2020 — 纪念章 */}
          <div className="tl-event flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 md:text-right">
              <div className="font-display text-6xl md:text-7xl text-[var(--color-gold)] font-bold mb-4 leading-none">2020</div>
              <div className="font-ui text-[10px] tracking-widest text-[var(--color-text-dim)] uppercase mb-3">抗美援朝出国作战70周年纪念章</div>
              <p className="font-narrative text-lg text-[var(--color-text-soft)] leading-loose">
                中共中央、国务院、中央军委
                向全体在世志愿军老兵颁发
                <em>抗美援朝出国作战70周年纪念章</em>。
                87岁的高延清，再次因这枚沉甸甸的勋章，
                被历史郑重地看见。
              </p>
            </div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-midnight)] border-4 border-[var(--color-gold)] z-10 shrink-0 shadow-[0_0_16px_rgba(212,168,83,0.6)]" />
            <div className="md:w-1/2 flex justify-start gap-3">
              <div className="relative w-40 h-48 md:w-48 md:h-60 rounded overflow-hidden shadow-xl border border-white/10">
                <Image
                  src="/sample_data/人生轨迹照片/21d665a17ec694edf9ef6256ee7798ba.jpg"
                  alt="纪念章盒子"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-40 h-48 md:w-48 md:h-60 rounded overflow-hidden shadow-xl border border-white/10 mt-4">
                <Image
                  src="/sample_data/人生轨迹照片/cc7d59de0af7ee04371ca6ceb3140cd9.jpg"
                  alt="纪念章实物"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ 4. ARTIFACTS VAULT — Lupi style ═══ */}
      <section className="bg-[var(--color-surface)] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-4">
            <span className="font-ui text-[10px] tracking-[0.36em] uppercase text-[#D4A853] block mb-3">Archive · Lupi Style</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-text-main)]">岁月文档库</h2>
            <p className="font-narrative italic text-[var(--color-text-soft)] mt-3 text-lg">这些泛黄的纸片，是历史最诚实的证人。</p>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="text-center font-ui text-[10px] text-[#A07830] tracking-widest mb-12 uppercase">点击卡片查看文物详情</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {ARTIFACTS.map((artifact, i) => (
              <FadeIn
                key={artifact.id}
                delay={i * 0.08}
                className="relative bg-[var(--color-surface2)] rounded-xl shadow-md overflow-hidden border border-[var(--color-border-main)] cursor-pointer group hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div onClick={() => setActiveArtifact(artifact)} className="block">
                  <div className="relative h-64">
                    <Image
                      src={artifact.img}
                      alt={artifact.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-surface2)]" style={{ opacity: 0.9 }} />
                    {/* Hover reveal */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-[rgba(26,26,42,0.78)] text-[#D4A853] text-[10px] px-4 py-2 rounded-full font-ui tracking-widest uppercase backdrop-blur-sm border border-[#D4A853]/30">
                        查看详情 →
                      </div>
                    </div>
                  </div>
                  <div className="p-5 text-[var(--color-text-main)]">
                    <div className="font-ui text-[9px] tracking-widest text-[#D4A853] uppercase mb-1">档案编号 {artifact.id}</div>
                    <h3 className="font-display text-lg font-semibold mb-2">{artifact.title}</h3>
                    <p className="font-narrative text-sm text-[var(--color-text-soft)] leading-relaxed">{artifact.shortDesc}</p>
                    <div className="flex gap-2 mt-3">
                      {artifact.tags.map((tag) => (
                        <span key={tag} className="bg-[#D4A853]/15 text-[#A07830] text-[9px] px-2 py-0.5 rounded-full font-ui tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}

          </div>
        </div>
      </section>

      {/* ═══ 5. FELTON DATA PORTRAIT ═══ */}
      <section className="bg-[var(--color-surface)] py-24 px-6 border-t border-[var(--color-border-main)]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-ui text-[10px] tracking-[0.36em] uppercase text-[var(--color-gold)] block mb-3">Data Portrait · Felton Style</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold">一生数字档案</h2>
          </FadeIn>

          <FadeIn className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[var(--color-border-main)] rounded-2xl overflow-hidden mb-12">
            {[
              { n: "90", sup: "+", l: "岁", sub: "人生跨度" },
              { n: "28", sup: "", l: "年", sub: "军旅生涯" },
              { n: "3", sup: "", l: "次", sub: "天安门观礼" },
              { n: "124", sup: "", l: "首", sub: "诗词收录" },
            ].map(({ n, sup, l, sub }, i) => (
              <div
                key={sub}
                className={`flex flex-col items-center justify-center py-10 px-4 text-center ${i < 3 ? "border-b md:border-b-0 md:border-r border-[var(--color-border-main)]" : ""}`}
              >
                <div className="font-display text-5xl md:text-6xl font-bold text-[var(--color-text-main)] leading-none">
                  {n}<span className="text-2xl">{sup}</span>
                </div>
                <div className="font-display text-xl text-[var(--color-gold)] mt-1">{l}</div>
                <div className="font-ui text-[9px] tracking-widest text-[var(--color-text-dim)] uppercase mt-3 border-t border-[var(--color-border-main)] pt-2 w-12">{sub}</div>
              </div>
            ))}
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { year: "1933", event: "出生于大连瓦房店，时值日本占领东北第2年" },
              { year: "1951", event: "加入中国人民志愿军，入朝作战" },
              { year: "1952", event: "获朝鲜军功勋章，编号 No.349711" },
              { year: "1960", event: "任命为解放军第39军117师政治部保卫科助理员" },
              { year: "1961", event: "调中共中央专案组，开始12年中央机关生涯" },
              { year: "1968", event: "首次受邀参加天安门国庆观礼" },
              { year: "1979", event: "转业，赴辽阳石化投身工业建设" },
              { year: "1982", event: "执笔《清风霁月》，历时数十年完成全稿" },
              { year: "2020", event: "获颁抗美援朝出国作战70周年纪念章（中共中央·国务院·中央军委）" },
            ].map(({ year, event }) => (
              <div key={year} className="flex gap-4 items-start">
                <span className="font-display text-[var(--color-gold)] font-semibold text-sm shrink-0 mt-0.5 w-10">{year}</span>
                <span className="font-narrative text-[var(--color-text-soft)] text-sm leading-relaxed">{event}</span>
              </div>
            ))}
          </div>

          <FadeIn delay={0.1} className="p-8 rounded-2xl border border-[var(--color-border-main)] bg-[var(--color-glass)]">
            <div className="font-ui text-[9px] tracking-widest text-[var(--color-text-dim)] uppercase mb-6 border-l-2 border-[var(--color-gold)] pl-3">
              关键词拓扑 · Top Frequency from 《清风霁月》
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {[
                { w: "抗美援朝", s: 1.6 }, { w: "大连", s: 1.15 }, { w: "信念", s: 1.45 },
                { w: "辽阳石化", s: 1.05 }, { w: "母亲", s: 1.3 }, { w: "岁月", s: 1.5 },
                { w: "诗歌", s: 1.1 }, { w: "奉献", s: 1.2 }, { w: "家族", s: 1.0 },
                { w: "天安门", s: 1.25 }, { w: "志愿军", s: 1.4 }, { w: "军功章", s: 1.08 },
              ].map(({ w, s }, i) => (
                <span
                  key={w}
                  className="text-[var(--color-text-soft)] px-3 py-1.5 rounded border border-white/8 bg-white/3 hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)] transition-colors cursor-default"
                  style={{ fontSize: `${s}rem`, opacity: 1 - i * 0.04 }}
                >
                  {w}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 6. FAMILY & WARMTH ═══ */}
      <section className="bg-[var(--color-deep)] py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span className="font-ui text-[10px] tracking-[0.36em] uppercase text-[#D4A853] block mb-3">Family Moments</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-text-main)]">家人环绕的晚年</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <FadeIn className="relative h-72 md:h-96">
              <div className="absolute top-0 left-0 w-[58%] h-[75%] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/sample_data/个人肖像照片/7936633cfc309da92e1085b65b0afa41.jpg"
                  alt="家族合影"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[48%] h-[68%] rounded-xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="/sample_data/个人肖像照片/e97d599aa40037b39f061013f101e714.jpg"
                  alt="与孙女自拍"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-4 right-2 bg-[#D4A853] text-[#1A1A2A] text-[9px] font-semibold px-2.5 py-1 rounded-full font-ui tracking-widest uppercase shadow-md">
                四世同堂
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="text-[var(--color-text-main)]">
              <p className="font-narrative text-xl leading-loose text-[var(--color-text-main)] mb-5">
                子女成家，孙辈繁茂，重孙嬉闹——
                走过了战场与机关，高延清的晚年，
                被<em>家人的笑声</em>温柔地填满。
              </p>
              <p className="font-narrative text-xl leading-loose text-[var(--color-text-soft)] mb-6">
                孙女靠在他肩头自拍，孩子们挤在病床前，
                老人眼中的光，比任何勋章都要闪亮。
              </p>
              <blockquote className="border-l-2 border-[#D4A853] pl-5">
                <p className="font-narrative italic text-lg text-[var(--color-text-soft)] leading-loose">
                  &ldquo;我把每张票根都留着，不是因为贵，是因为
                  那是我真实活过的证明。&rdquo;
                </p>
                <footer className="font-ui text-[9px] tracking-widest text-[#D4A853] uppercase mt-2">— 高延清</footer>
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 7. CLOSING CTA ═══ */}
      <section className="bg-[var(--color-midnight)] py-32 px-6 border-t border-[var(--color-border-main)] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 100%, rgba(212,168,83,0.07) 0%, transparent 60%)" }}
        />

        <FadeIn className="max-w-3xl mx-auto text-center relative z-10">
          <p
            className="font-narrative italic text-[var(--color-text-main)] mb-12 leading-loose"
            style={{ fontSize: "clamp(1.15rem, 2.8vw, 1.65rem)" }}
          >
            <span className="text-6xl text-[rgba(212,168,83,0.15)] font-display leading-none relative top-4">&ldquo;</span>
            高延清的一生，是一个时代的缩影。<br />
            每一张泛黄的票根，每一枚沉甸甸的勋章，<br />
            都在无声地说：我来过，我爱过，我没有辜负。
            <span className="text-6xl text-[rgba(212,168,83,0.15)] font-display leading-none relative -top-4">&rdquo;</span>
          </p>

          <p className="font-ui text-[var(--color-text-dim)] text-sm mb-10 tracking-wide">
            你的家人，也有这样一生值得被记录。
          </p>

          <Link
            href="/create"
            className="inline-flex items-center justify-center bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-lt)] text-[var(--color-midnight)] py-4 px-10 rounded-full font-ui text-base font-medium tracking-wide transition-all hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(212,168,83,.5),0_15px_30px_rgba(0,0,0,.4)]"
          >
            ✦ 开始制作专属人生长河
          </Link>

          <p className="font-narrative italic text-[var(--color-text-dim)] text-sm mt-6">
            上传照片与文稿，AI 为你编织专属的人生可视化
          </p>
        </FadeIn>
      </section>

      {/* ═══ Modals ═══ */}
      {activeArtifact && (
        <ArtifactModal
          artifact={activeArtifact}
          onClose={() => setActiveArtifact(null)}
        />
      )}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}

      {/* ═══ Floating share button ═══ */}
      <button
        onClick={() => setShareOpen(true)}
        className="fixed bottom-8 right-8 z-[700] w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-lt)] text-[var(--color-midnight)] shadow-[0_0_40px_rgba(212,168,83,0.45),0_8px_20px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(212,168,83,0.65),0_12px_28px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center"
        title="分享此页面"
        aria-label="分享"
      >
        {/* Share icon */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="15" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="4" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="6.3" y1="11.2" x2="12.8" y2="14.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6.3" y1="8.8" x2="12.8" y2="5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

    </main>
  );
}
