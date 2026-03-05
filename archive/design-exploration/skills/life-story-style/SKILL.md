---
name: life-story-style
description: 为人生故事类页面制定视觉叙事风格与技术落地策略。Use when users ask to research style directions, map content elements to design languages, or output “元素/风格策略建议/推荐技术”矩阵，尤其适用于 Next.js 的用例展示/制作/分享页面。
---

# Life Story Style

将人物素材拆解为“视觉语言 + 动效节奏 + 技术实现”三层方案，直接产出可开发的风格策略。

## Workflow

1. 识别输入
- 提取人物类型、素材类型、目标页面模块（用例展示/制作/分享）。
- 提取语气关键词（如怀旧、庄重、成长、纪念）。

2. 生成风格矩阵
- 固定输出四列：`元素`、`风格策略建议`、`推荐技术`、`实现要点`。
- 先使用本技能默认矩阵，再按用户项目做小幅定制。

3. 生成叙事滚动方案
- 规划页面分段：封面 -> 时间线 -> 资料细节 -> 总结 -> CTA。
- 定义每段进入方式、停留信息密度、离场过渡方式。

4. 生成技术落地建议
- 区分 `MVP` 与 `Enhancement`。
- 明确 Next.js 组件归属：Server/Client、动画库、图表库、性能风险点。

5. 交付结果
- 交付风格矩阵。
- 交付滚动叙事节拍（section-by-section）。
- 交付实现优先级与依赖建议。

## Default Matrix

优先使用以下基线映射（可在项目里重排细节）：

| 元素 | 风格策略建议 | 推荐技术 | 实现要点 |
|---|---|---|---|
| 用户照片 | 采用 Spotify Wrapped 式动效：滤镜切换 + 几何遮罩 + 时间轴弹出卡片 | Framer Motion / CSS Filters | 用 `clip-path`、`mix-blend-mode`、卡片 stagger 动画，控制每屏 1 个主焦点 |
| 回忆图像 | 采用 Lupi 手绘风：照片外叠解释性注脚、情感连线、边注标签 | SVG / Illustrator | 用 SVG overlay 管理连线和注脚锚点，避免将注释烘焙进位图 |
| 自编文档 | 采用 Felton 极简排版：关键词、字数统计、章节密度可视化 | Google Fonts / Webflow / D3.js | 生产环境优先 Next.js + D3；Webflow 仅作为视觉原型参考 |
| 整体结构 | 采用 Scrollytelling：隐形纵向时间线贯穿全局 | GSAP + ScrollTrigger | 每段只回答一个问题，滚动时触发段落状态切换和时间节点高亮 |

## Output Template

按以下结构输出，避免只给抽象描述：

```markdown
### 风格总述
- 人物气质：
- 视觉主张：

### 风格矩阵
| 元素 | 风格策略建议 | 推荐技术 | 实现要点 |
|---|---|---|---|

### 滚动叙事节拍
1. Section A:
2. Section B:
3. Section C:

### 技术落地优先级
1. MVP:
2. Enhancement:
3. 性能与兼容性注意事项:
```

## Quality Bar

1. 保持“情绪一致性”，不要在单页混入过多互斥风格。
2. 优先可实现方案，避免依赖高成本离线设计流程。
3. 明确移动端降级策略（关闭重滤镜、减少并行动画）。
4. 确保可读性优先于炫技，正文对比度和字号必须稳定。

## References

- 需要风格来源与设计语言解释时，读取 [style-research.md](references/style-research.md)。
