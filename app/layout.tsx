/**
 * app/layout.tsx
 * ──────────────
 * 根布局。职责：
 *   1. 字体变量注入（Playfair Display / Nunito 等）
 *   2. 主题初始化脚本（内联 script，HTML 解析阶段执行，防止亮/暗色闪烁）
 *   3. suppressHydrationWarning — 防止 data-theme SSR/CSR 不一致报错
 *   4. 全局 Navbar 挂载
 */
import type { Metadata } from 'next';
import { Playfair_Display, EB_Garamond, DM_Sans, Nunito, Caveat, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
});

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  weight: ['300', '400', '500'],
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: '生命长河',
  description: '记录你的每一个珍贵瞬间',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* Restore theme from localStorage before paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('lc-theme');document.documentElement.dataset.theme=t||'light';}catch(e){document.documentElement.dataset.theme='light';}` }} />
      </head>
      <body className={`${playfair.variable} ${garamond.variable} ${dmSans.variable} ${nunito.variable} ${caveat.variable} ${ibmPlexMono.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
