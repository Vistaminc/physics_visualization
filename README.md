# 物理可视化系统

一个基于Vue.js和PIXI.js构建的交互式物理现象可视化平台，旨在帮助学生直观理解复杂的物理概念。

## 功能模块

该项目包含多个物理学分支的可视化模块：

### 电学 (Electricity)
- 电路模拟：基础电路元件的连接与仿真
- 电磁感应：电磁感应现象展示
- 电磁引擎：电磁马达与发电机原理

### 磁学 (Magnetism)
- 磁场可视化：不同形状磁体的磁场分布
- 电磁相互作用：带电粒子在磁场中的运动

### 光学 (Optics)
- 双缝干涉：杨氏双缝干涉实验模拟
- 光的反射与折射：光路追踪演示

### 力学 (Mechanics)
- 牛顿运动定律：力与加速度关系
- 弹性碰撞：动量守恒演示

## 技术栈

- 前端框架：Vue 3 + Composition API
- 路由：Vue Router
- 图形渲染：PIXI.js
- 数学计算：Math.js
- 物理引擎：Matter.js (力学模块)
- 样式：SCSS

## 开发指南

### 安装依赖
```
npm install
```

### 本地开发服务器
```
npm run dev
```

### 构建生产版本
```
npm run build
```

## 添加新模块

1. 在`src/modules/`下创建对应物理分支的目录（如果不存在）
2. 添加Vue组件实现可视化功能
3. 在`src/router/index.js`中添加路由配置
4. 更新主页面导航栏以包含新模块

## 贡献指南

欢迎通过Pull Request或Issue参与项目开发和改进。新的物理模块、交互功能或UI优化建议均受欢迎。

## 📖 项目介绍

物理可视化是一个基于 Vue 3 和 TypeScript 的应用程序，旨在通过使用 D3、Three.js 和 Matter.js 等现代前端技术，以交互式的方式可视化物理概念。本项目致力于创造直观、生动且具有教育意义的物理模拟，帮助学习者更好地理解物理原理。

## ✨ 主要特性

- 🔮 **交互式物理模拟**：通过直观的交互体验物理规律
- 📊 **2D可视化**：使用 D3 和 Matter.js 构建二维物理场景
- 🌐 **3D可视化**：借助 Three.js 实现三维物理现象展示
- 📱 **响应式设计**：采用 Element Plus UI 组件，确保在各种设备上的良好体验
- 🎨 **精美动画**：通过 GSAP 实现流畅的过渡和动画效果

## 🛠 技术栈

- **前端框架**：Vue 3 (采用 Composition API 和 `<script setup>` 语法)
- **开发语言**：TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **CSS预处理器**：SASS
- **可视化库**：D3.js、Three.js、Matter.js
- **UI框架**：Element Plus

## 📥 安装使用

### 克隆仓库

```bash
# 克隆项目仓库
git clone https://github.com/yourusername/physics-visualization.git
cd physics-visualization
```

### 安装依赖

```bash
# 使用 npm 安装
npm install

# 或使用 pnpm 安装
pnpm install
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm dev
```

开发服务器启动后，访问 http://localhost:5173（或终端中显示的端口）即可查看项目。

## 🚀 生产环境构建

```bash
# 使用 npm 构建
npm run build

# 或使用 pnpm 构建
pnpm build
```

构建完成后，将在 `dist` 目录生成可部署的文件。

## 🤝 贡献指南

我们欢迎各种形式的贡献，无论是新功能、错误修复还是文档改进：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m '添加了某个惊人的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 📃 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

- 感谢 Vue.js 团队提供的卓越框架
- 感谢所有使本项目成为可能的开源库和工具
- 感谢所有贡献者和使用者的支持与反馈

---

<div align="center">
  <sub>用 ❤️ 制作</sub>
</div>
