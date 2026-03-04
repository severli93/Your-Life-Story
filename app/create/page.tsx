"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadCloud } from "lucide-react";

export default function CreateStory() {
    const [procPhase, setProcPhase] = useState("");
    const [procActive, setProcActive] = useState(false);
    const [procPct, setProcPct] = useState(0);

    const startProc = () => {
        setProcActive(true);
        setProcPct(0);
        const PHASES = ['正在建立安全连接...', '提取情感脉络...', '分析时间线...', '编织视觉叙事...', '最终润色生成...'];

        let currentPct = 0;
        const interval = setInterval(() => {
            currentPct += Math.random() * 3.5 + 0.8;
            if (currentPct >= 100) {
                currentPct = 100;
                clearInterval(interval);
                setTimeout(() => {
                    setProcActive(false);
                    window.location.href = '/story/gao-yanqing';
                }, 800);
            }
            setProcPct(Math.floor(currentPct));

            const phaseIdx = Math.min(Math.floor((currentPct / 100) * PHASES.length), PHASES.length - 1);
            setProcPhase(PHASES[phaseIdx]);
        }, 70);
    };

    return (
        <main className="pt-[100px] pb-24 min-h-screen">
            <section className="max-w-[1120px] mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="font-ui text-[10px] tracking-[0.36em] uppercase text-[var(--color-gold)] mb-3 block">Step 02 · 专属配置</span>
                    <h2 className="font-display text-4xl font-semibold">提供素材与 API 信息</h2>
                </div>

                {/* Steps */}
                <div className="flex items-center justify-center gap-0 mb-16 flex-wrap">
                    <div className="flex items-center gap-2 text-[0.78rem] text-[var(--color-text-soft)]">
                        <div className="w-7 h-7 rounded-full border border-current flex items-center justify-center font-medium">✓</div>
                        <span>选择类型</span>
                    </div>
                    <div className="w-12 h-px bg-[var(--color-border-main)] mx-2" />
                    <div className="flex items-center gap-2 text-[0.78rem] text-[var(--color-gold)]">
                        <div className="w-7 h-7 rounded-full border-transparent bg-[var(--color-gold)] text-[var(--color-midnight)] shadow-[0_0_18px_rgba(212,168,83,.45)] flex items-center justify-center font-medium">2</div>
                        <span>素材参数</span>
                    </div>
                    <div className="w-12 h-px bg-[var(--color-border-main)] mx-2" />
                    <div className="flex items-center gap-2 text-[0.78rem] text-[var(--color-text-dim)]">
                        <div className="w-7 h-7 rounded-full border border-current flex items-center justify-center font-medium">3</div>
                        <span>AI 解析</span>
                    </div>
                    <div className="w-12 h-px bg-[var(--color-border-main)] mx-2" />
                    <div className="flex items-center gap-2 text-[0.78rem] text-[var(--color-text-dim)]">
                        <div className="w-7 h-7 rounded-full border border-current flex items-center justify-center font-medium">4</div>
                        <span>生成预览</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Left panel: Assets */}
                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-[var(--color-gold)]/30 rounded-2xl p-8 text-center cursor-pointer transition-colors hover:bg-[var(--color-gold)]/5 hover:border-[var(--color-gold)]/60 min-h-[220px] flex flex-col items-center justify-center gap-4 bg-[var(--color-gold)]/5">
                            <div className="w-14 h-14 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)] animate-[floatY_3s_ease-in-out_infinite]">
                                <UploadCloud size={24} />
                            </div>
                            <div>
                                <div className="font-display text-lg text-[var(--color-text-soft)] mb-1">拖入照片、文稿以开始</div>
                                <div className="text-xs text-[var(--color-text-dim)]">JPG · PNG · TXT · PDF (最大 50MB)</div>
                            </div>
                        </div>

                        <div>
                            <span className="text-[0.76rem] text-[var(--color-text-dim)] tracking-[0.1em] block mb-3">API 配置（用于生成文字与结构）</span>
                            <div className="p-5 rounded-xl border border-[var(--color-border-main)] bg-[var(--color-glass)] space-y-4">
                                <div>
                                    <label className="text-xs text-[var(--color-text-soft)] mb-1.5 block">Provider</label>
                                    <select className="w-full bg-[var(--color-surface2)] border border-[var(--color-border-main)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-gold)]/50">
                                        <option>302.ai API</option>
                                        <option>OpenAI / Compatible API</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--color-text-soft)] mb-1.5 block">API Key</label>
                                    <input type="password" placeholder="sk-..." className="w-full bg-[var(--color-surface2)] border border-[var(--color-border-main)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-gold)]/50" />
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--color-text-soft)] mb-1.5 block">Model</label>
                                    <input type="text" defaultValue="gemini-1.5-pro" className="w-full bg-[var(--color-surface2)] border border-[var(--color-border-main)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-gold)]/50" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right panel: Meta */}
                    <div className="space-y-6 flex flex-col">
                        <div className="flex-1 flex flex-col">
                            <span className="text-[0.76rem] text-[var(--color-text-dim)] tracking-[0.1em] block mb-3">额外文案补充</span>
                            <textarea
                                className="w-full flex-1 bg-[var(--color-glass)] border border-[var(--color-border-main)] rounded-xl p-5 font-narrative text-[0.94rem] text-[var(--color-text-main)] resize-none outline-none focus:border-[var(--color-gold)]/50 min-h-[160px] leading-relaxed"
                                placeholder="写下你想说的话，或提供基本人物背景..."
                            ></textarea>
                        </div>

                        <div>
                            <span className="text-[0.76rem] text-[var(--color-text-dim)] tracking-[0.1em] block mb-3">情感基调与重点选项</span>
                            <div className="flex flex-wrap gap-2">
                                {['坚韧', '成长', '平淡', '感恩', '励志', '思念', '辉煌'].map((mood, i) => (
                                    <button key={mood} className={`px-4 py-1.5 rounded-full border text-xs transition-colors ${i % 2 === 0 ? 'bg-[rgba(212,168,83,.14)] border-[var(--color-gold)] text-[var(--color-gold)]' : 'bg-transparent border-white/10 text-[var(--color-text-soft)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]'}`}>
                                        {mood}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={startProc} className="relative w-full p-4 rounded-xl border-none cursor-pointer overflow-hidden bg-gradient-to-br from-[#B8901E] via-[var(--color-gold)] to-[#E8C56A] text-[var(--color-midnight)] font-display text-lg font-semibold tracking-wide transition-all shadow-lg hover:-translate-y-1 hover:shadow-[0_0_52px_rgba(212,168,83,.42),0_14px_32px_rgba(0,0,0,.3)] mt-4 group">
                            <span className="inline-block animate-[spinScale_2.4s_linear_infinite] mr-2">✦</span>
                            召唤 AI 解析与生成
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Processing Overlay */}
            {procActive && (
                <div className="fixed inset-0 z-[800] flex flex-col items-center justify-center bg-[rgba(8,8,14,.97)] backdrop-blur-3xl">
                    <div className="relative z-10 text-center flex flex-col items-center">

                        <div className="relative w-[156px] h-[156px] mb-10">
                            <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 156 156">
                                <circle cx="78" cy="78" r="70" fill="none" stroke="rgba(212,168,83,.09)" strokeWidth="2" />
                                <circle
                                    cx="78" cy="78" r="70" fill="none" stroke="var(--color-gold)" strokeWidth="2.2" strokeLinecap="round"
                                    strokeDasharray={439.82}
                                    strokeDashoffset={439.82 - (procPct / 100) * 439.82}
                                    className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(212,168,83,.65)]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-display text-4xl font-semibold text-[var(--color-gold)] leading-none">{procPct}</span>
                                <span className="text-[10px] text-[var(--color-text-dim)] tracking-widest mt-1 uppercase">%</span>
                            </div>
                        </div>

                        <div className="font-display text-2xl font-light text-[var(--color-text-main)] mb-3 min-h-[2rem]">
                            {procPhase}
                        </div>
                        <div className="text-sm text-[var(--color-text-dim)] tracking-wider">
                            你的专属页面即将诞生
                        </div>

                    </div>
                </div>
            )}
        </main>
    );
}
