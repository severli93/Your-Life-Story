"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import MusicToggle from './MusicToggle';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // "开始制作" → scroll to #start-creating on homepage, navigate there from other pages
  const handleCreate = () => {
    if (pathname === '/') {
      document.getElementById('start-creating')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/#start-creating');
    }
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: 60,
      background: "var(--nav-bg)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--nav-border)",
      transition: "background .3s, border-color .3s",
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "var(--nav-link-hover)",
          boxShadow: "0 0 10px var(--nav-link-hover)",
        }} />
        <span style={{
          fontFamily: "var(--font-display, 'Playfair Display', serif)",
          fontSize: 17,
          color: "var(--nav-text)",
          letterSpacing: ".03em",
        }}>
          生命长河
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 28, alignItems: "center", paddingRight: 8 }}>
          <NavLink href="/#samples">生命之书</NavLink>
          <NavLink href="/companion">长河对话</NavLink>
          <button
            onClick={handleCreate}
            style={{
              background: "var(--nav-pill-bg)",
              color: "var(--nav-pill-text)",
              border: "1px solid var(--nav-pill-border)",
              borderRadius: 999,
              padding: "7px 20px",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-ui, 'Nunito', sans-serif)",
              letterSpacing: ".02em",
              transition: "opacity .2s, transform .2s",
              cursor: "pointer",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = ".85"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            开始制作
          </button>
        </div>
        <ThemeToggle />
        <MusicToggle />
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{ textDecoration: "none", fontSize: 13, color: "var(--nav-text-dim)", letterSpacing: ".04em", transition: "color .15s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--nav-link-hover)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--nav-text-dim)"; }}
    >
      {children}
    </Link>
  );
}
