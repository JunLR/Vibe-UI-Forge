# 预览环境

本文档介绍 harmony-ui-playground 项目中的组件预览环境，基于 Storybook 构建。

## 快速开始

### 安装依赖

```bash
cd harmony-ui-playground
npm install
# 或使用 pnpm
pnpm install
```

### 启动 Storybook

```bash
# 启动开发服务器（默认端口 6006）
npm run storybook
```

启动后访问 http://localhost:6006 查看组件预览。

### 构建静态产物

```bash
# 构建 Storybook 静态文件（用于 CI/部署/视觉回归）
npm run build-storybook
```

构建产物输出到 `storybook-static/` 目录。

## Storybook 配置

### 主配置

`.storybook/main.ts` 包含：
- stories 匹配规则
- Vite alias 配置
- Tailwind 插件

### 预览配置

`.storybook/preview.ts` 包含：
- 全局样式引入
- 全局布局配置
- controls 配置

## Stories 目录结构

```
src/
├── component/
│   └── <ComponentName>/
│       └── <ComponentName>.stories.tsx    # 组件级 stories
├── stories/
│   ├── foundations/
│   │   └── *.stories.tsx                   # 设计基础能力预览
│   └── components/
│       └── showcase.stories.tsx            # 组件总览页
└── App.stories.tsx                         # 应用级 stories
```

### Stories 类型

1. **组件级 Stories**：跟随组件目录，如 `component/Button/Button.stories.tsx`
2. **设计基础 Stories**：`stories/foundations/` - 展示设计 Token
3. **组件总览 Stories**：`stories/components/showcase.stories.tsx` - 快速 smoke-check

## 查看组件

1. 启动 `npm run storybook`
2. 打开 http://localhost:6006
3. 左侧导航包含：
   - `Components/*` - 组件预览与交互控制
   - `Foundations/*` - 设计 Token 与基础样式预览
   - `Components/Showcase` - 组件总览页

## 在开发中使用

### 开发组件时

1. 编写组件代码和样式
2. 同步编写 `.stories.tsx` 文件
3. 运行 `npm run storybook` 手动验收
4. 提交前运行 `npm run build-storybook` 确保预览可构建

### 调试组件时

Storybook 提供了良好的调试环境：

- **Controls**：通过 UI 控制组件 Props
- **Actions**：查看事件触发日志
- **Viewport**：测试不同屏幕尺寸
- **Backgrounds**：测试不同背景色

## 设计基础预览

`stories/foundations/` 目录包含设计 Token 的可视化预览：

- 颜色（品牌色、状态色、文本色）
- 字体（字号、字重、行高）
- 间距
- 圆角
- 阴影
- 动效
- z-index

这些预览会自动解析 `src/styles/tokens.css` 文件，实时反映设计规范的当前状态。

## 相关资源(harmony-ui-playground为例)

- Storybook 配置：`harmony-ui-playground/.storybook/`
- 组件 stories：`harmony-ui-playground/src/component/*/*.stories.tsx`
- 设计 Token：`harmony-ui-playground/src/styles/tokens.css`