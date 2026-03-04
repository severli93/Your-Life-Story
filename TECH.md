# 生命长河 · 技术说明

> 版本：v0.3 · 更新：2026-03-04

---

## 一、技术栈

| 层次 | 技术 | 说明 |
|---|---|---|
| 框架 | Next.js 14（App Router） | 文件路由，RSC + Client 混合 |
| 语言 | TypeScript | 全量类型覆盖 |
| 样式 | Tailwind CSS v4 + 行内 style | 布局用 Tailwind，动效/主题用 CSS 变量 |
| 动效 | Framer Motion | 首页 scroll reveal / 漂浮碎片 |
| AI API | 302.ai 代理（`/api/chat`）| 兼容 OpenAI SDK 格式，支持 Claude / Gemini |
| 状态 | React useState / useCallback | 无全局状态管理库 |
| 持久化 | localStorage | 主题、BGM、对话历史、API 设置 |

---

## 二、目录结构

```
YourLifeStory/
├── app/
│   ├── layout.tsx          # 根布局：字体加载、主题初始化脚本、Navbar
│   ├── page.tsx            # 首页：Hero / 3步骤 / 样例 / 类型 / 创建区 / CTA
│   ├── globals.css         # 全局样式：CSS 变量 / 主题系统 / 字体
│   ├── api/
│   │   └── chat/route.ts   # API 代理：流式转发至 302.ai
│   ├── companion/
│   │   └── page.tsx        # 对话页（~900 行，含日历/生命河/记忆列表）
│   └── story/
│       ├── gao-yanqing/    # 高延清故事页
│       └── baby-growth/    # 小棠成长页
├── components/
│   ├── Navbar.tsx          # 固定顶栏：Logo / 导航 / 工具栏
│   ├── CreateSection.tsx   # "提供素材与API信息"区块
│   ├── ShareModal.tsx      # 分享卡片弹窗（Canvas 生成 PNG）
│   ├── MusicToggle.tsx     # 背景音乐开关（Suno CDN）
│   ├── ThemeToggle.tsx     # 亮/暗色切换
│   └── Starfield.tsx       # Canvas 星空粒子背景
├── lib/
│   └── settings.ts         # API 设置类型 + localStorage 存取工具
├── public/
│   └── assets/             # 字体、图片等静态资源
├── DESIGN.md               # 设计说明
└── TECH.md                 # 本文件
```

---

## 三、主题系统

主题通过 `data-theme` attribute 控制，写在 `<html>` 标签上：

```html
<!-- layout.tsx 内联脚本，在 HTML 解析阶段执行，防止闪白 -->
<script>
  try {
    var t = localStorage.getItem('lc-theme');
    document.documentElement.dataset.theme = t || 'light';
  } catch(e) {
    document.documentElement.dataset.theme = 'light';
  }
</script>
```

**CSS 变量结构（globals.css）：**

```css
/* 默认 = 亮色 */
:root, [data-theme="light"] {
  --page-bg: #F9F7F4;
  --color-midnight: #FAF8F4;
  --color-text-main: #1E1A16;
  /* ... */
}

/* 暗色覆写 */
[data-theme="dark"] {
  --page-bg: #08080E;
  --color-midnight: #08080E;
  --color-text-main: #EDE8E0;
  /* ... */
}
```

`suppressHydrationWarning` 加在 `<html>` 标签上，防止 SSR/客户端 theme 不一致导致的 hydration error。

---

## 四、API 集成

### `/app/api/chat/route.ts` — 流式代理

```
POST /api/chat
Body: { messages: Array<{role, content}> }
Response: text/event-stream (SSE)
```

代理流程：
1. 从请求体提取 `messages`
2. 注入系统提示（"长河"角色设定）
3. 转发至 `https://api.302.ai/v1/chat/completions`（Claude Sonnet 4.6）
4. 透传 SSE 流到客户端

**API Key 管理：**
- 服务端：`process.env.NEXT_PUBLIC_302AI_KEY`（写在 `.env.local`）
- 客户端设置：存于 `localStorage`（键 `lc_settings`），通过 `CreateSection` 收集
- **绝对不预填硬编码 key**；除非是用户本人存过的本地缓存

### `lib/settings.ts` — 客户端设置

支持两种 API 来源模式：
- **302.ai（推荐）**：一个 key 访问所有 Claude / Gemini 模型
- **直连各厂商**：分别填 `sk-ant-...`（Claude）和 `AIzaSy...`（Gemini）

支持的模型：

| 类型 | 模型 ID | 说明 |
|---|---|---|
| LLM | `claude-sonnet-4-6` | 默认，对话 + 记忆提炼 |
| LLM | `claude-opus-4-6` | 最强推理 |
| LLM | `gemini-2.5-flash` | 快速响应 |
| LLM | `gemini-2.5-pro` | Gemini 旗舰 |
| 生成 | `gemini-2.5-flash-image-preview` | 默认图像生成 |
| 生成 | `gemini-2.5-flash-image` | 稳定版 |
| 生成 | `gemini-3-pro-image-preview` | 最高质量 |

---

## 五、数据存储（localStorage）

| 键 | 类型 | 内容 |
|---|---|---|
| `lc-theme` | `"light"` \| `"dark"` | 主题偏好 |
| `lc_bgm_enabled` | `"0"` \| `"1"` | 背景音乐开关 |
| `lc-sessions` | `JSON string` | 对话历史（Session[]） |
| `lc_settings` | `JSON string` | API 设置（AppSettings） |

**Session 结构：**
```ts
type Session = {
  id: string;
  date: string;       // "2026-03-04"
  label: string;      // 会话标题
  emotion: EKey;      // 情绪键
  temp: number;       // 情绪温度 1-10
  preview: string;    // 最后一条消息预览
  messages: Msg[];    // 完整消息数组
};
```

---

## 六、对话页关键架构

```
companion/page.tsx
├── DATA[]              # 90 天模拟情绪记录（seedRand 可复现）
├── Sessions            # localStorage 持久化会话
├── send()              # SSE 流式请求 + fallback 关键词回复
│   └── AbortController # 可取消进行中的请求
├── Calendar            # 90 天情绪日历（hover → topbar 动态展示）
├── LifeRiver           # SVG 路径 + animateMotion 粒子流动
│   └── activeDay       # 点击节点 → 激活 → MemoryList 高亮
└── MemoryList          # 垂直时间轴 + 点击同步到生命河
```

---

## 七、关键技术决策

### 为什么用行内 style 而不是纯 Tailwind？
- 大量动态值（情绪颜色、渐变参数）需要运行时计算
- 主题 CSS 变量 + 动态颜色混用时，行内 style 更直接
- Tailwind 主要用于布局和 spacing 工具类

### 为什么不用 Redux / Zustand？
- 状态主要是页面级局部状态（messages, sessions, activeDay）
- 跨组件共享通过 props 传递，没有复杂跨页面状态
- 减少依赖，保持架构简单

### SSE 流式解析
```ts
const reader = resp.body!.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const lines = decoder.decode(value).split('\n');
  for (const line of lines) {
    if (!line.startsWith('data: ')) continue;
    const json = line.slice(6);
    if (json === '[DONE]') return;
    const delta = JSON.parse(json).choices[0].delta.content ?? '';
    setMessages(prev => /* append delta to last message */);
  }
}
```

### Canvas 分享卡片
- `drawCard()` 在内存中创建 `<canvas>`（800×480），绘制完成后 `toDataURL('image/png')`
- 使用 `<a download>` 触发浏览器下载，无需服务端
- 卡片中使用系统字体回退（`Georgia, serif`），保证跨平台一致性

---

## 八、运行与部署

```bash
# 开发
npm run dev   # → localhost:3000

# 类型检查
npx tsc --noEmit

# 构建
npm run build

# 必需环境变量（.env.local）
NEXT_PUBLIC_302AI_KEY=your-302ai-key-here
```

**.env.local 不进 git**（已在 .gitignore 中）。
