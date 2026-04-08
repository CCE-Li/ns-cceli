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

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License
