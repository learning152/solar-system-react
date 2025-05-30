# 🌌 太阳系 3D 模拟器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r148-green)](https://threejs.org/)

一个基于 React 和 Three.js 构建的交互式太阳系 3D 模拟器，精确呈现八大行星的运行轨迹和物理特性。

## ✨ 项目特色

- **科学精确**：基于 NASA 最新行星轨道数据
- **3D 可视化**：真实比例的行星和轨道
- **交互体验**：
  - 鼠标拖动旋转视角
  - 滚轮缩放观察细节
  - 键盘控制移动视角
  - 点击行星查看详情
- **教育价值**：包含每个行星的 5 个趣味知识

## 🚀 快速开始

### 环境要求

- Node.js 16+ [下载 Node.js](https://nodejs.org/)
- npm 8+ 或 yarn 1.22+

### 安装步骤

1. 克隆项目仓库：

```bash
git clone https://github.com/your-repo/solar-system-simulator.git
cd solar-system-simulator
```

2. 安装依赖：

```bash
npm install
# 或
yarn install
```

3. 启动开发服务器：

```bash
npm start
# 或
yarn start
```

4. 在浏览器中访问：
   [http://localhost:3000](http://localhost:3000)

## 🎮 交互指南

| 操作方式 | 功能     |
| -------- | -------- |
| 鼠标拖动 | 旋转视角 |
| 滚轮滑动 | 缩放场景 |
| 方向键   | 移动视角 |
| 点击行星 | 查看详情 |

## ??️ 项目结构

```
solar-system/
├── public/            # 静态资源
├── src/
│   ├── components/    # 行星组件
│   ├── models/        # 行星数据模型
│   ├── scenes/        # 3D场景
│   ├── App.js         # 主组件
│   └── index.js       # 入口文件
├── package.json
└── README.md
```

## 🛠️ 开发指南

### 添加新行星

1. 在`src/models/PlanetModel.js`中添加行星数据
2. 创建对应的行星组件
3. 在场景中初始化行星

### 运行测试

```bash
npm test
```

### 构建生产版本

```bash
npm run build
```

## ❓ 常见问题

**Q: 如何调整行星大小比例？**
A: 修改`PlanetModel.js`中的 radius 参数

**Q: 如何添加新的行星知识？**
A: 在对应行星的 facts 数组中添加新条目

**Q: 为什么我的键盘控制不起作用？**
A: 请确保点击画布获得焦点后再使用键盘

## 🤝 参与贡献

欢迎提交 Pull Request 或报告 Issue

1. Fork 项目
2. 创建分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📜 许可证

MIT © 2025
