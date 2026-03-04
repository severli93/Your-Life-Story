/**
 * lib/settings.ts
 * ───────────────
 * API 设置的类型定义与 localStorage 存取工具。
 * 架构参考 design_project/lib/settings/store.ts，适配生命长河业务。
 *
 * 存储键：lc_settings（避免与 design_project 的 nova_settings 冲突）
 */

// ── API 来源 ──────────────────────────────────────────────
/** '302ai' = 302.ai 统一代理（推荐，一个 key 访问所有模型）
 *  'direct' = 各厂商原生 API（需分别填 Claude key 和 Gemini key）*/
export type ApiSource = '302ai' | 'direct';

// ── 模型类型 ──────────────────────────────────────────────
/** 用于对话 / 记忆提炼的 LLM 文本模型 */
export type LlmModel =
  | 'claude-sonnet-4-6'
  | 'claude-opus-4-6'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-pro';

/** 用于故事可视化的图像生成模型 */
export type GenModel =
  | 'gemini-2.5-flash-image-preview'
  | 'gemini-2.5-flash-image'
  | 'gemini-3-pro-image-preview';

// ── 设置结构 ──────────────────────────────────────────────
export interface AppSettings {
  apiSource: ApiSource;
  api302Key: string;   // 302.ai 统一 key
  claudeKey: string;   // direct 模式 — Claude（Anthropic）
  geminiKey: string;   // direct 模式 — Gemini（Google）
  llmModel: LlmModel;
  genModel: GenModel;
}

export const DEFAULT_SETTINGS: AppSettings = {
  apiSource: '302ai',
  api302Key: '',      // 不预填；从 localStorage 加载
  claudeKey: '',
  geminiKey: '',
  llmModel: 'claude-sonnet-4-6',
  genModel: 'gemini-2.5-flash-image-preview',
};

const LS_KEY = 'lc_settings';

/** 从 localStorage 读取，合并 DEFAULT_SETTINGS（防止新增字段缺失） */
export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** 保存到 localStorage（不上传服务器） */
export function saveSettings(s: AppSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

// ── 下拉菜单选项 ──────────────────────────────────────────
export const LLM_OPTIONS: Array<{ value: LlmModel; label: string; vendor: 'claude' | 'gemini' }> = [
  { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6',  vendor: 'claude' },
  { value: 'claude-opus-4-6',   label: 'Claude Opus 4.6',    vendor: 'claude' },
  { value: 'gemini-2.5-flash',  label: 'Gemini 2.5 Flash',   vendor: 'gemini' },
  { value: 'gemini-2.5-pro',    label: 'Gemini 2.5 Pro',     vendor: 'gemini' },
];

export const GEN_OPTIONS: Array<{ value: GenModel; label: string }> = [
  { value: 'gemini-2.5-flash-image-preview', label: 'Gemini 2.5 Flash Image (Preview)' },
  { value: 'gemini-2.5-flash-image',         label: 'Gemini 2.5 Flash Image'            },
  { value: 'gemini-3-pro-image-preview',     label: 'Gemini 3 Pro Image (Preview)'      },
];
