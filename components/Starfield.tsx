"use client";

import { useEffect, useRef } from "react";

export default function Starfield() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let rafId: number;
        let stars: Array<{ x: number; y: number; r: number; op: number; tw: number; ts: number }> = [];

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];
            const n = Math.floor((canvas.width * canvas.height) / 3800);
            for (let i = 0; i < n; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 1.3 + 0.18,
                    op: Math.random() * 0.55 + 0.12,
                    tw: Math.random() * Math.PI * 2,
                    ts: Math.random() * 0.018 + 0.004,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const dark = document.documentElement.dataset.theme === "dark";
            const starRGB = dark ? "255,248,220" : "44,36,32";
            stars.forEach((s) => {
                s.tw += s.ts;
                const a = s.op * (0.48 + 0.52 * Math.sin(s.tw));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${starRGB},${a * (dark ? 1 : 0.35)})`;
                ctx.fill();
                if (s.r > 1.05) {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r * 2.8, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(212,168,83,${a * 0.14})`;
                    ctx.fill();
                }
            });
            rafId = requestAnimationFrame(draw);
        };

        init();
        draw();
        window.addEventListener("resize", init);

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (!rafId) draw();
                } else {
                    cancelAnimationFrame(rafId);
                    rafId = 0;
                }
            },
            { threshold: 0 }
        );
        if (canvas.parentElement) {
            observer.observe(canvas.parentElement);
        }

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", init);
            observer.disconnect();
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}
