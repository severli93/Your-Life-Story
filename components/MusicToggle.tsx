"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { withBase } from "@/lib/basePath";

// One theme per story: the veteran's page gets the piano-and-strings piece,
// the baby-growth page a lighter one. Both generated with Suno (via kie.ai).
function themeFor(pathname: string): string {
    return pathname.startsWith("/story/baby-growth")
        ? withBase("/assets/audio/baby-theme.mp3")
        : withBase("/assets/audio/gao-theme.mp3");
}

export default function MusicToggle() {
    const [on, setOn] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // initialize audio
        // Self-hosted theme first (loads without外网); fall back to the Suno CDN
        // track (Peaceful Serenity by @blendfactor) if the local file is missing.
        const audio = new Audio(themeFor(pathname));
        audio.onerror = () => {
            audio.onerror = null;
            audio.src = "https://cdn1.suno.ai/74ad1d6e-7d17-4530-afa0-b3df47f1ee89.mp3";
        };
        audioRef.current = audio;
        audioRef.current.loop = true;
        audioRef.current.volume = 0.28;

        if (localStorage.getItem("lc_bgm_enabled") === "1") {
            audioRef.current.play().then(() => setOn(true)).catch(() => {
                setOn(false);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Route change → swap the track, preserving play state.
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const next = themeFor(pathname);
        if (audio.src.endsWith(next)) return;
        const wasPlaying = !audio.paused;
        audio.src = next;
        if (wasPlaying) audio.play().catch(() => {});
    }, [pathname]);

    const toggle = async () => {
        if (!audioRef.current) return;
        if (on) {
            audioRef.current.pause();
            setOn(false);
            localStorage.setItem("lc_bgm_enabled", "0");
        } else {
            try {
                await audioRef.current.play();
                setOn(true);
                localStorage.setItem("lc_bgm_enabled", "1");
            } catch (e) {
                alert("浏览器阻止了自动播放，请再点击一次音乐按钮。");
            }
        }
    };

    return (
        <button
            onClick={toggle}
            aria-pressed={on}
            className={`border border-[rgba(212,168,83,.4)] rounded-full px-3 py-2 text-xs transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${on
                    ? "bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-lt)] text-[var(--color-midnight)] border-transparent"
                    : "bg-[rgba(212,168,83,.08)] text-[var(--color-gold)] hover:border-[rgba(212,168,83,.65)] hover:-translate-y-px hover:shadow-[0_0_20px_rgba(212,168,83,.2)]"
                }`}
        >
            ♪ 音乐：{on ? "开" : "关"}
        </button>
    );
}
