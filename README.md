# VGOT Frontend - AI 驱动的电商视频创作平台

VGOT 前端项目，一站式 AI 电商视频工作流界面，从脚本生成到视频制作，助力创作者高效创作爆款电商视频。

## 功能特性

- 🎬 **HyperSell 视频生成** - AI 驱动的产品视频生成界面
- 📝 **智能脚本提取** - 自动提取热门视频脚本
- 🎨 **场景分析** - 逐帧解析视频画面提示词
- 🎭 **Super IP** - AI 数字人视频制作
- 💳 **订阅管理** - 灵活的会员计划管理
- 👥 **推广计划** - 10% 返现推荐系统
- 🌍 **多语言支持** - 中英文切换

## 技术栈

- React 18
- React Router v6
- Axios
- Tailwind CSS
- Supabase Client
- Stripe Integration

## 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 本地开发

```bash
# 1. 克隆项目
git clone <repository-url>
cd Vgot_front

# 2. 进入前端目录
cd frontend

# 3. 安装依赖
npm install

# 4. 配置环境变量
# 创建 .env.local 文件并配置：
# REACT_APP_API_BASE_URL=你的后端API地址
# REACT_APP_SUPABASE_URL=你的Supabase URL
# REACT_APP_SUPABASE_ANON_KEY=你的Supabase密钥

# 5. 启动开发服务器
npm start
```

访问 http://localhost:3000

## Vercel 部署

详细的部署配置请查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### 环境变量配置

在 Vercel Dashboard 中配置以下环境变量：

```
REACT_APP_API_BASE_URL=https://你的后端API地址
REACT_APP_API_BASE=https://你的后端API地址
REACT_APP_SUPABASE_URL=https://你的supabase项目.supabase.co
REACT_APP_SUPABASE_ANON_KEY=你的Supabase匿名密钥
REACT_APP_GOOGLE_CLIENT_ID=你的Google OAuth客户端ID
```

### 部署步骤

```bash
# 进入前端目录
cd frontend

# 部署到 Vercel
vercel --prod
```

## 项目结构

```
Vgot_front/
├── frontend/                # React 前端应用
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   │   ├── Home.js
│   │   │   ├── VideoGeneration.js
│   │   │   ├── VideoAnalysis.js
│   │   │   ├── SuperIP.js
│   │   │   ├── Pricing.js
│   │   │   └── ...
│   │   ├── components/     # 可复用组件
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── pricing/
│   │   │   ├── partner/
│   │   │   └── ...
│   │   ├── contexts/       # React Context
│   │   │   ├── AuthContext.js
│   │   │   ├── LanguageContext.js
│   │   │   └── UsageContext.js
│   │   ├── config/         # 配置文件
│   │   │   └── api.js      # API端点配置
│   │   ├── services/       # API 服务
│   │   │   ├── apiClient.js
│   │   │   ├── historyService.js
│   │   │   └── contentManager.js
│   │   ├── translations/   # 国际化翻译
│   │   ├── hooks/          # 自定义 Hooks
│   │   └── lib/            # 第三方库配置
│   ├── public/
│   ├── package.json
│   └── vercel.json         # Vercel 配置
├── VERCEL_DEPLOYMENT.md    # Vercel 部署指南
└── README.md               # 项目说明
```

## 开发指南

### API 配置

所有 API 地址统一在 `frontend/src/config/api.js` 管理：

```javascript
import { API_ENDPOINTS } from '../config/api';

// 使用示例
axios.post(API_ENDPOINTS.video.extractScript, data);
```

### 添加新的 API 端点

1. 在 `frontend/src/config/api.js` 添加端点配置
2. 在组件中导入并使用配置的端点
3. 确保后端 API 已实现对应的路由

### 环境变量说明

- `REACT_APP_API_BASE_URL` - 后端 API 基础地址
- `REACT_APP_SUPABASE_URL` - Supabase 项目地址
- `REACT_APP_SUPABASE_ANON_KEY` - Supabase 匿名访问密钥
- `REACT_APP_GOOGLE_CLIENT_ID` - Google OAuth 客户端 ID

### 构建生产版本

```bash
cd frontend
npm run build
```

构建产物在 `frontend/build` 目录。

## 许可证

Private License - 保留所有权利

## 联系方式

如有问题或建议，请联系项目维护者。
