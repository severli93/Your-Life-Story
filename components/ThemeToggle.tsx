"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  // Sync with the actual html attribute after mount
  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme !== "light");
  }, []);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("lc-theme", next);
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggle}
      title={isDark ? "切换到浅色模式" : "切换到深色模式"}
      suppressHydrationWarning
      style={{
        width: 36, height: 36,
        borderRadius: "50%",
        border: "1.5px solid var(--nav-border)",
        background: "transparent",
        color: "var(--nav-text-dim)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        transition: "border-color .2s, transform .2s",
        flexShrink: 0,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "rotate(20deg)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nav-link-hover)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "rotate(0deg)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--nav-border)"; }}
    >
      {isDark ? "☀" : "◑"}
    </button>
  );
}
