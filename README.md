# Vibe UI Forge ｜ 符合特定设计规范的UI生成工具

本项目提供了一套基于 shadcn/ui 的 UI 开发工作流，让人可以使用 shadcn SKILL，结合项目中的设计规范资源，生成符合规范的 UI 界面。



## 项目概述

本项目包含skill内容和两个设计规范的 UI playground

### shadcn SKILL

项目集成了 shadcn SKILL，提供组件选择、代码生成、样式规范等能力。

详细 SKILL 说明请参考：[.agent/skills/shadcn/SKILL.md](./.agent/skills/shadcn/SKILL.md)

### 规范资源与生成物

| 项目 | 设计规范 | 说明 |
|------|----------|------|
| `devui-playground` | devui | devui风格组件的 playground  |
| `harmony-ui-playground` | Harmony | Harmony 风格组件的 playground |

设计资源&生成物的项目目录结构（harmony-ui-playground 为例）

```
harmony-ui-playground/
├── .storybook/           # Storybook 配置
├── src/
│   ├── component/        # 组件目录（统一维护）
│   ├── blocks/           # Block 页面模板
│   ├── styles/           # 设计 token（devui-tokens.css）
│   ├── stories/          # 组件预览 stories
│   ├── lib/              # 工具函数
│   └── App.tsx           # 应用入口
├── components.json       # shadcn 配置
└── package.json
```

## 使用方式

在本项目中，你可以结合 shadcn SKILL 和项目中的设计规范资源，生成符合规范的 UI 界面。

### 使用示例

向Agent输入以下 prompt 即可生成 UI 页面：

```
在 harmony-ui-playground 生成一个鸿蒙风格的设置页到 app.tsx，使用 shadcn SKILL，根据 SKILL 参考并使用项目中的样式、component、blocks 资源。
```

或更详细的版本：

```
在 harmony-ui-playground 生成一个鸿蒙风格的设置页到 app.tsx，使用.agent/skills/shadcn 这个 SKILL，根据 SKILL 参考并使用项目中的样式、component、blocks 资源。
```

### 生成流程

1. **分析需求** - SKILL 会分析你的需求，执行workflow
2. **参考资源** - 使用项目中的 design token、组件、blocks 作为参考
3. **生成代码** - 生成符合规范的 UI 页面代码
4. **预览验证** - 启动 storybook 预览效果

## 快速开始

### 安装依赖

```bash
# devui-playground
cd devui-playground
npm install

# harmony-ui-playground
cd harmony-ui-playground
npm install
# 或使用 pnpm
cd harmony-ui-playground
pnpm install
```

### 运行项目

```bash
# devui-playground
cd devui-playground
npm run dev          # 启动应用页面
npm run storybook    # 启动组件预览（端口 6006）

# harmony-ui-playground
cd harmony-ui-playground
npm run dev          # 启动应用页面
npm run storybook    # 启动组件预览（端口 6006）
```

## 规范资源维护文档

详细的资源维护、预览环境等文档，请参考 `docs/` 

## 相关资源

- shadcn/ui 官方文档：https://ui.shadcn.com
- shadcn SKILL：`.agent/skills/shadcn/SKILL.md`