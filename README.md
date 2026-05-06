# ImagePro

跨平台桌面端图片对比工具，用于 AIGC 任务中不同实验结果的图片对比与筛选。

## 功能

- **多文件夹对比**：选择最多 8 个文件夹，并排对比图片
- **同名匹配/自由选择**：按文件名自动对齐或独立选择
- **Peek 叠图对比**：按住按钮将其他格子的图临时叠加到当前格
- **Tag 标记系统**：4 色标签（待处理/优/劣/疑问），快捷键打标
- **预览模式**：单文件夹大图浏览 + tag 过滤 + 批量操作
- **独立缩放/平移**：每个格子独立或全局同步
- **侧边栏可伸缩**：最大化对比区域

## 技术栈

- **桌面框架**：Electron
- **UI**：React 18 + TypeScript
- **状态管理**：Zustand
- **图像渲染**：HTML5 Canvas
- **构建**：Vite + electron-builder

## 开发

```bash
npm install
npm run dev     # 启动开发模式 (Vite + Electron)
npm run build   # 构建生产版本
npm run preview # 构建并预览
```

## 项目结构

```
├── electron/          # Electron 主进程
│   ├── main.ts        # 窗口创建、生命周期
│   ├── preload.ts     # contextBridge API
│   └── ipc/           # IPC 处理器
├── src/               # React 渲染进程
│   ├── components/    # UI 组件
│   ├── stores/        # Zustand 状态管理
│   ├── hooks/         # 自定义 Hooks
│   ├── types/         # TypeScript 类型
│   ├── utils/         # 工具函数
│   └── styles/        # CSS 样式
└── resources/         # 应用图标
```

## 快捷键

| 键 | 功能 |
|---|---|
| ← → | 翻页 |
| 1/2/3/4 | 给当前图打 tag |
| Ctrl+1~4 | 给所有格打 tag |
| 0 | 清除当前 tag |
| 滚轮 | 缩放当前格 |
| Ctrl+滚轮 | 缩放所有格 |
| 拖动 | 平移当前格 |
| Ctrl+拖动 | 平移所有格 |
| 0 | 重置缩放 |
| P | Peek baseline |
| F | 全屏当前格 |
| F1 / ? | 帮助面板 |
