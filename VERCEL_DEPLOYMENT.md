# VGOT Frontend - Vercel 部署指南

## 前端部署到 Vercel

### 一、准备工作

#### 1. 安装 Vercel CLI（可选）
```bash
npm install -g vercel
```

#### 2. 确保后端 API 已部署
前端需要连接到已部署的后端 API。确保你的后端 API 地址可访问。

### 二、配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
REACT_APP_API_BASE_URL=https://你的后端API地址
REACT_APP_API_BASE=https://你的后端API地址
REACT_APP_SUPABASE_URL=https://你的项目.supabase.co
REACT_APP_SUPABASE_ANON_KEY=你的Supabase匿名密钥
REACT_APP_GOOGLE_CLIENT_ID=你的Google OAuth客户端ID
```

**设置步骤：**
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 Settings → Environment Variables
4. 逐个添加上述环境变量
5. 选择环境：Production（生产环境必选）

### 三、部署方式

#### 方式 1：通过 Vercel Dashboard（推荐）

1. 登录 Vercel Dashboard
2. 点击 "Add New..." → "Project"
3. 导入你的 Git 仓库
4. 配置项目：
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. 添加环境变量（见上方）
6. 点击 "Deploy"

#### 方式 2：使用 Vercel CLI

```bash
# 进入前端目录
cd frontend

# 登录 Vercel（首次使用）
vercel login

# 部署到生产环境
vercel --prod
```

### 四、自定义域名配置

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名（例如：vgot.ai）
3. 根据提示配置 DNS 记录：
   - **A 记录**: 指向 Vercel IP
   - 或 **CNAME 记录**: 指向 `cname.vercel-dns.com`
4. 等待 DNS 生效（通常 5-10 分钟）

### 五、验证部署

1. **访问网站**
   - 访问你的 Vercel 默认域名或自定义域名
   - 检查页面是否正常加载

2. **测试功能**
   - 测试登录注册功能
   - 测试 API 连接（查看浏览器控制台）
   - 测试视频生成等核心功能

3. **检查 CORS**
   - 打开浏览器开发者工具（F12）
   - 查看 Console 标签，确保没有 CORS 错误
   - 如有 CORS 错误，需要在后端配置允许你的前端域名

### 六、后续配置

#### 1. 更新第三方服务回调地址

**Google OAuth**
- 进入 [Google Cloud Console](https://console.cloud.google.com/)
- APIs & Services → Credentials
- 编辑 OAuth 2.0 客户端
- 添加授权的重定向 URI：`https://你的域名`

**Supabase**
- 进入 Supabase Dashboard
- Settings → Authentication → URL Configuration
- 添加 Site URL: `https://你的域名`
- 添加 Redirect URLs: `https://你的域名/**`

#### 2. 通知后端更新 CORS 配置
确保后端的 `FRONTEND_URL` 环境变量包含你的前端域名。

### 七、常见问题

#### 1. API 请求失败 (404/CORS)
- 检查 `REACT_APP_API_BASE_URL` 是否正确
- 确认后端 API 是否可访问
- 检查后端 CORS 配置是否包含前端域名

#### 2. 环境变量未生效
- 确保在 Vercel Dashboard 中已保存环境变量
- 环境变量修改后需要重新部署
- 注意：React 环境变量必须以 `REACT_APP_` 开头

#### 3. 构建失败
- 检查 `frontend/package.json` 依赖是否完整
- 查看 Vercel 构建日志找出具体错误
- 确保 Node.js 版本兼容（推荐 16+）

#### 4. 页面刷新 404
- 检查 `frontend/vercel.json` 是否配置了路由重写
- 应该包含：
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 八、部署后检查清单

- [ ] 前端网站可以正常访问
- [ ] 登录注册功能正常
- [ ] API 请求正常（无 CORS 错误）
- [ ] 视频生成功能正常
- [ ] 支付功能正常
- [ ] SSL 证书正常（https）
- [ ] Google OAuth 回调地址已更新
- [ ] Supabase URL 配置已更新
- [ ] 所有环境变量已正确配置

### 九、更新部署

#### 自动部署（推荐）
- 连接 Git 仓库后，每次推送到主分支会自动触发部署

#### 手动部署
```bash
cd frontend
vercel --prod
```

### 十、监控和日志

- **Vercel Dashboard**: https://vercel.com/dashboard
- **实时日志**: 在项目页面的 "Deployments" 标签查看
- **性能监控**: 使用 Vercel Analytics（需单独启用）

---

## 快速参考

### 环境变量模板
```bash
REACT_APP_API_BASE_URL=https://api.你的域名.com
REACT_APP_API_BASE=https://api.你的域名.com
REACT_APP_SUPABASE_URL=https://项目id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...你的密钥
REACT_APP_GOOGLE_CLIENT_ID=你的客户端ID.apps.googleusercontent.com
```

### 部署命令
```bash
cd frontend
vercel --prod
```

### 有用的链接
- [Vercel 文档](https://vercel.com/docs)
- [Create React App 部署](https://create-react-app.dev/docs/deployment/)
- [Vercel CLI 文档](https://vercel.com/docs/cli)

