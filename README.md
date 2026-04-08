# 路由配置考试模拟器

一个基于 React 的华为路由配置考试模拟器，帮助用户练习和掌握路由器配置技能。

## 功能特点

- 🎯 模拟真实的路由配置考试环境
- 💻 交互式命令行界面
- ✅ 实时配置验证
- 📊 进度跟踪和成绩统计
- 🎨 现代化 UI 设计

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **图标**: Lucide React

## 本地部署

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/CCE-Li/ns-cceli.git
   cd ns-cceli
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   
   打开浏览器访问 `http://localhost:5173`

### 其他命令

- **构建生产版本**
  ```bash
  npm run build
  ```

- **预览生产版本**
  ```bash
  npm run preview
  ```

- **代码检查**
  ```bash
  npm run lint
  ```

## 项目结构

```
├── src/
│   ├── components/          # React 组件
│   │   └── ui/             # UI 基础组件
│   ├── lib/                # 工具函数
│   ├── App.jsx             # 主应用组件
│   ├── main.jsx            # 应用入口
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── router_config_exam_simulator.jsx  # 主模拟器文件
└── package.json            # 项目配置
```

## 使用说明

1. 启动应用后，选择考试模式
2. 根据提示完成路由配置任务
3. 提交配置并查看结果
4. 查看详细的错误提示和正确答案

## 服务器部署

### Nginx 配置

将以下配置添加到 Nginx 配置文件中（通常在 `/etc/nginx/sites-available/` 或 `/etc/nginx/conf.d/` 目录）：

```nginx
server {
    listen 80;
    server_name ns.cceli.icu;
    
    root /home/lyx/nginx/www/ns-cceli;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.html;
        add_header Access-Control-Allow-Origin *;
    }
    
    location ~* \.(jpg|jpeg|png|gif|css|js|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
    
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 部署步骤

1. **构建项目**
   ```bash
   npm run build
   ```

2. **创建目标目录**
   ```bash
   sudo mkdir -p /home/lyx/nginx/www/ns-cceli
   ```

3. **复制构建文件**
   ```bash
   sudo cp -r dist/* /home/lyx/nginx/www/ns-cceli/
   ```

4. **设置权限**
   ```bash
   sudo chown -R lyx:lyx /home/lyx/nginx/www/ns-cceli/
   sudo chmod -R 755 /home/lyx/nginx/www/ns-cceli/
   ```

5. **重载 Nginx**
   ```bash
   sudo systemctl reload nginx
   ```

6. **访问应用**
   
   打开浏览器访问 `http://ns.cceli.icu`

### 自动化部署

使用项目提供的部署脚本：
```bash
chmod +x deploy.sh
./deploy.sh
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License
