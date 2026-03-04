# 生命长河 · 设计说明

> 版本：v0.3 · 更新：2026-03-04

---

## 一、品牌定位

**生命长河**（River of Life）是一个 AI 辅助的人生故事记录平台。
核心理念：**每段生命都值得被好好记录**。

产品帮助用户通过日常对话沉淀记忆，最终生成可浏览、可分享的人生故事可视化。

---

## 二、视觉语言

### 2.1 色彩

| Token | 值 | 用途 |
|---|---|---|
| `--color-midnight` | `#08080E` | 页面底色（暗色模式） |
| `--color-deep` | `#0E0E1C` | 次级区块背景 |
| `--color-gold` | `#D4A853` | 主题色 · 强调 · 交互态 |
| `--color-gold-lt` | `#ECC56A` | 金色高光 · 渐变结束色 |
| `--color-text-main` | `#EDE8E0` | 主文字（暗色背景） |
| `--color-text-soft` | `#A09888` | 次要文字 |

**亮色模式覆写**（通过 `[data-theme="light"]`）：
- 底色切换为暖白 `#F9F7F4`，文字切换为深褐 `#1E1A16`
- 金色系保持不变，确保跨主题一致性

**情感色映射**（用于日历 / 情绪节点 / 分享卡片）：

| 情绪 | 颜色 | 场景 |
|---|---|---|
| 喜悦 | `#F6D860` | 记录喜悦天 |
| 平静 | `#A8D5BA` | 平静状态 |
| 焦虑 | `#F4A261` | 焦虑情绪 |
| 忧郁 | `#9DB4C0` | 低落情绪 |
| 愤怒 | `#E76F51` | 激烈情绪 |
| 感动 | `#C77DFF` | 被触动的时刻 |
| 思念 | `#D4A8A8` | 回忆往事 |

---

### 2.2 字体

| 变量 | 字体 | 用途 |
|---|---|---|
| `--font-display` | `Playfair Display` | 大标题 · 卡片主标 · 情绪感强的文字 |
| `--font-ui` | `Nunito` | UI 按钮 · 标签 · 正文 |

选型逻辑：
- **Playfair Display**：衬线体，兼具书卷气和历史感，适合人生叙事主题
- **Nunito**：圆润无衬线，亲切感强，作为 UI 层形成视觉对比

---

### 2.3 空间与节奏

- **段落间距**：各 Section 垂直 padding 100px，形成充分呼吸感
- **卡片圆角**：主卡片 20px，小元素 10–12px，pill 按钮 999px
- **层叠效果**：Starfield 星空粒子 + 径向渐变 glow 叠加，构建空间感深度
- **悬浮卡片**：Hero 区记忆碎片通过 `framer-motion` animateMotion 漂浮

---

### 2.4 动效原则

- **入场**：`opacity 0→1 + translateY 28→0`，`duration 0.75s`，staggered delay
- **滚动触发**：`whileInView` + `viewport.once = true`，避免重复播放
- **星空**：Canvas requestAnimationFrame，每颗星独立闪烁周期
- **情绪球呼吸**：`scale 1→1.12→1`，`3.5s infinite ease-in-out`
- **分享卡弹入**：`scale .9 + translateY 16 → scale 1`，`cubic-bezier(.34,1.46,.64,1)`（弹性感）

---

## 三、页面结构

```
首页 /
├── Navbar（固定）
│     生命之书 | 长河对话 | 开始制作 | ThemeToggle | MusicToggle
├── Hero（星空 + 漂浮记忆碎片）
│     大标题 + tagline + 双 CTA（开始对话 / 查看样例）
├── 如何运作（cream 背景）
│     3 步骤：对话 → 沉淀 → 可视化
├── 生命之书 #samples
│     3 样例卡片：高延清 | 小棠 | 年度报告（即将上线）
│     高延清 / 小棠卡片各有「✦ 分享」按钮 → ShareModal
├── 故事类型
│     4 卡片：年度回顾 | 爱情故事 | 成长记录 | 家族传记
├── 提供素材与 API 信息 #start-creating（CreateSection）
│     故事类型选择 | 素材上传 | API 设置（来源/key/模型）
└── 最终 CTA
      「记录属于你的生命长河」

对话页 /companion
├── 左侧边栏（可折叠）
│     日历（情绪色点） | 统计行 | 历史会话
├── 主区域
│     聊天界面 | 流式回复 | 情绪标注
└── 右面板（可切换）
      生命长河（SVG 可视化 + 粒子动效）| 记忆列表（垂直时间轴）
```

---

## 四、核心组件设计决策

### ShareModal
- 卡片背景根据 `emotionColor` 动态调色，每张卡片视觉独特
- Canvas 2D API 生成 800×480 PNG 用于下载（宽屏横向，适合分享）
- 积分奖励每次操作仅计一次（`credited` flag 防重复）

### LifeRiver（SVG 可视化）
- 根据情绪数据计算蜿蜒路径，每个节点颜色对应情绪色
- `<animateMotion>` + `<mpath>` 实现粒子沿路径流动
- 点击节点 → 激活对应记忆 → MemoryList 高亮同步

### 日历
- 90 天 × 情绪色点，hover 时 Tooltip 显示当日详情
- selectedDay 状态同步到顶栏（动态显示当天信息）

---

## 五、主题切换

通过 `document.documentElement.dataset.theme` 控制，持久化到 `localStorage`（键 `lc-theme`）。

- 默认：`light`（暖米白）
- 切换：`dark`（深空黑金）
- Navbar 通过 CSS 变量实时响应，无 JS 重新渲染
