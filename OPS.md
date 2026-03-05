# 生命长河 · 日常运维手册

> 本文档覆盖本地开发、构建、Git 工作流、腾讯云服务器部署与常见故障处理。

---

## 一、项目结构速览

```
YourLifeStory/
├── app/                         # Next.js 14 App Router 页面与 API
│   ├── page.tsx                 # 首页
│   ├── layout.tsx               # 全局布局（主题、字体、Navbar）
│   ├── globals.css              # 主题 CSS 变量（亮/暗色）
│   ├── api/chat/route.ts        # 长河对话 SSE 代理
│   ├── companion/page.tsx       # 长河对话页
│   ├── create/page.tsx          # 开始制作页（占位）
│   └── story/
│       ├── gao-yanqing/page.tsx # 高延清故事页（史诗风）
│       └── baby-growth/page.tsx # 小棠成长页（视频风）
│
├── components/
│   ├── Navbar.tsx               # 顶部导航（主题切换、BGM）
│   ├── CreateSection.tsx        # #start-creating 素材 & API 设置区
│   ├── ShareModal.tsx           # 分享卡片弹窗（Canvas 生成 PNG）
│   ├── Starfield.tsx            # 星空 Canvas 动画
│   ├── ThemeToggle.tsx          # 亮/暗主题切换按钮
│   └── MusicToggle.tsx          # BGM 开关
│
├── lib/
│   └── settings.ts              # API 设置 类型 + localStorage 存取
│
├── public/
│   ├── assets/audio/gao-theme.wav  # 高延清页背景音乐
│   ├── images/baby-growth/         # 小棠成长页图片（14张）
│   └── sample_data/                # 高延清页图片（⚠️ 未入 Git，需手动 scp）
│       ├── 个人肖像照片/
│       └── 人生轨迹照片/
│
├── DESIGN.md                    # 品牌、色板、字体、动效规范
├── TECH.md                      # 技术栈、架构、API 集成说明
├── OPS.md                       # 本文件
├── README.md                    # 项目简介
│
└── archive/                     # 历史文件存档（不参与构建）
    ├── html-prototypes/         # 早期 HTML 原型
    ├── docs-early/              # 早期 PRD / 架构 / 对话设计文档
    └── design-exploration/      # 风格探索（kimi_style、skills）
```

---

## 二、本地开发

### 前置要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Node.js | 20+ | 推荐通过 nvm 管理 |
| npm | 10+ | 随 Node 附带 |

### 启动步骤

```bash
# 进入项目目录
cd ~/Desktop/YourLifeStory

# 安装依赖（首次或 package.json 有变化时）
npm install

# 配置环境变量（仅首次）
cp .env.local.example .env.local   # 如无 example，直接编辑 .env.local
# 填入：NEXT_PUBLIC_302AI_KEY=your-302ai-key-here

# 启动开发服务器
npm run dev
# → 访问 http://localhost:3000
```

### 常用页面

| URL | 说明 |
|-----|------|
| `http://localhost:3000` | 首页 |
| `http://localhost:3000/companion` | 长河对话 |
| `http://localhost:3000/story/gao-yanqing` | 高延清故事页 |
| `http://localhost:3000/story/baby-growth` | 小棠成长页 |

### 环境变量说明

```bash
# .env.local
NEXT_PUBLIC_302AI_KEY=sk-xxx   # 302.ai 统一 API Key（必填，用于长河对话）
```

> API Key 在 https://302.ai 控制台获取。
> 用户端的 Claude / Gemini Key 通过页面 UI 填写，存入 `localStorage`（键名 `lc_settings`），不经服务端。

---

## 三、构建与预览

```bash
# 生产构建
npm run build

# 本地预览生产包（构建完成后）
npm start
# → 访问 http://localhost:3000
```

---

## 四、Git 工作流

### 仓库信息

| 项 | 值 |
|----|----|
| 远端 | `https://github.com/severli93/Your-Life-Story` |
| 主分支 | `main` |

### 日常提交流程

```bash
# 查看变更
git status
git diff

# 暂存（选择具体文件，避免误提交 .env.local）
git add app/ components/ lib/ public/ OPS.md DESIGN.md TECH.md README.md archive/

# 提交
git commit -m "feat: 修复暗色主题下高延清页面样式"

# 推送
git push origin main
```

### 注意事项

- **永远不要 `git add .`**，`.env.local` 含密钥，已在 `.gitignore` 中排除
- `public/sample_data/` 因体积大（~5MB）未入 Git，修改图片需手动 `scp` 到服务器（见第五章）

---

## 五、腾讯云服务器部署

### 连接信息

| 项 | 值 |
|----|-----|
| IP | `43.160.238.189` |
| 用户 | `ubuntu` |
| SSH 密钥 | `/Users/mulan/Downloads/轻量云 SSH 密钥.pem` |
| 应用目录 | `~/YourLifeStory` |
| 对外端口 | `3100`（Nginx 反代） |
| Node 进程端口 | `3000`（PM2 管理） |

### SSH 连接

```bash
ssh -i "/Users/mulan/Downloads/轻量云 SSH 密钥.pem" ubuntu@43.160.238.189
```

### 标准部署流程（代码有更新时）

```bash
# 1. SSH 到服务器
ssh -i "/Users/mulan/Downloads/轻量云 SSH 密钥.pem" ubuntu@43.160.238.189

# 2. 拉取最新代码
cd ~/YourLifeStory
git pull origin main

# 3. 加载 nvm（非交互式 SSH 必须）
source ~/.nvm/nvm.sh

# 4. 安装新依赖（如 package.json 有变化）
npm install

# 5. 重新构建
npm run build

# 6. 重启服务
pm2 restart your-life-story

# 6. 验证
pm2 status
curl http://localhost:3000
```

### 快捷一键部署（无 package.json 变化时）

```bash
# ⚠️ 服务器 Node.js 通过 nvm 安装，非交互式 SSH 需显式 source nvm.sh
ssh -i "/Users/mulan/Downloads/轻量云 SSH 密钥.pem" ubuntu@43.160.238.189 \
  "source ~/.nvm/nvm.sh && cd ~/YourLifeStory && git pull origin main && npm run build && pm2 restart your-life-story"
```

### 同步图片资源（sample_data 未入 Git）

```bash
# 从本地推送到服务器（全量同步）
scp -i "/Users/mulan/Downloads/轻量云 SSH 密钥.pem" \
    -r /Users/mulan/Desktop/YourLifeStory/public/sample_data \
    ubuntu@43.160.238.189:~/YourLifeStory/public/

# 单张图片更新
scp -i "/Users/mulan/Downloads/轻量云 SSH 密钥.pem" \
    /Users/mulan/Desktop/YourLifeStory/public/sample_data/个人肖像照片/xxx.jpg \
    ubuntu@43.160.238.189:~/YourLifeStory/public/sample_data/个人肖像照片/
```

---

## 六、PM2 常用命令

```bash
# 查看所有进程状态
pm2 status

# 查看实时日志
pm2 logs your-life-story

# 查看最近 100 行日志
pm2 logs your-life-story --lines 100

# 重启（代码更新后）
pm2 restart your-life-story

# 强制重启（遇到进程卡死时）
pm2 delete your-life-story
pm2 start npm --name "your-life-story" -- start

# 开机自启（服务器重启后自动拉起）
pm2 save
pm2 startup
```

---

## 七、Nginx 配置

配置文件位于：`/etc/nginx/sites-available/your-life-story`

```nginx
server {
    listen 3100;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # SSE 流式响应（长河对话必需）
        proxy_read_timeout 300s;
        proxy_buffering off;
    }
}
```

### Nginx 常用命令

```bash
# 测试配置语法
sudo nginx -t

# 重载配置（不中断服务）
sudo nginx -s reload

# 查看状态
sudo systemctl status nginx
```

### 腾讯云防火墙

端口 `3100` 已在腾讯云控制台安全组中开放（TCP 入站）。
如需新增端口：控制台 → 轻量应用服务器 → 防火墙 → 添加规则。

---

## 八、常见问题

### Q: 页面能访问，但图片不显示

`public/sample_data/` 未入 Git，需手动同步：

```bash
scp -i "/Users/mulan/Downloads/轻量云 SSH 密钥.pem" \
    -r /Users/mulan/Desktop/YourLifeStory/public/sample_data \
    ubuntu@43.160.238.189:~/YourLifeStory/public/
```

---

### Q: 长河对话报错 "API key not configured"

服务器上的 `.env.local` 可能丢失或 Key 未填：

```bash
ssh -i "/Users/mulan/Downloads/轻量云 SSH 密钥.pem" ubuntu@43.160.238.189
cat ~/YourLifeStory/.env.local
# 如果为空或不存在：
echo "NEXT_PUBLIC_302AI_KEY=sk-你的key" > ~/YourLifeStory/.env.local
pm2 restart your-life-story
```

> `.env.local` 不在 Git 中，每次新部署服务器需手动写入。

---

### Q: npm run build 失败（TypeScript 报错）

先在本地确保构建通过再推送：

```bash
cd ~/Desktop/YourLifeStory
npm run build   # 本地通过后再 git push
```

---

### Q: PM2 进程已死，服务不可访问

```bash
pm2 status          # 查看状态（若 status=errored）
pm2 logs your-life-story --lines 50  # 查看错误原因
pm2 restart your-life-story          # 尝试重启
# 若仍失败，手动删除重建：
pm2 delete your-life-story
cd ~/YourLifeStory && pm2 start npm --name "your-life-story" -- start
```

---

### Q: 端口 3100 无法访问（外网）

1. 检查腾讯云控制台安全组是否开放 3100 端口
2. 检查 Nginx 是否运行：`sudo systemctl status nginx`
3. 检查 Node 进程是否运行：`pm2 status`

---

## 九、本地 localStorage 存储键

| 键名 | 内容 | 说明 |
|------|------|------|
| `lc-theme` | `"light"` / `"dark"` | 主题偏好 |
| `lc_bgm_enabled` | `"true"` / `"false"` | BGM 开关状态 |
| `lc-sessions` | JSON 数组 | 长河对话历史 |
| `lc_settings` | JSON 对象 | API 来源、Key、模型选择 |

清除所有用户设置：浏览器控制台执行 `localStorage.clear()`
