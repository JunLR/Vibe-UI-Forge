# 组件维护指南

## 目录

- [1. 文档说明](#1-文档说明)
  - [1.1 文档目的](#11-文档目的)
  - [1.2 适合人群](#12-适合人群)
  - [1.3 前置知识](#13-前置知识)
- [2. 项目概览](#2-项目概览)
  - [2.1 项目结构](#21-项目结构)
  - [2.2 组件文件组织](#22-组件文件组织)
  - [2.3 shadcn设计系统简介](#23-shadcn设计系统简介)
- [3. 组件维护方式](#3-组件维护方式)
  - [3.1 维护方式分类](#31-维护方式分类)
  - [3.2 方式一：基于shadcn体系二次定制](#32-方式一基于shadcn体系二次定制)
  - [3.3 方式二：添加符合目标规范的组件](#33-方式二添加符合目标规范的组件)
- [4. Token维护要点](#4-token维护要点)
- [5. 快速命令参考](#5-快速命令参考)
- [6. AI辅助开发](#6-ai辅助开发)
  - [6.1 使用react-component-integrator辅助新增组件](#61-使用react-component-integrator辅助新增组件)
  - [6.2 常见问题解决方案](#62-常见问题解决方案)
  - [6.3 推荐的AI提示词模板](#63-推荐的ai提示词模板)
- [7. 维护完成后的最小验收清单](#7-维护完成后的最小验收清单)
- [8. 相关资源](#8-相关资源)

---

## 1. 文档说明

### 1.1 文档目的

本文档用于维护项目内两个playground的组件代码，覆盖新增、删除、修改与校验流程。同时为开发者提供项目结构、规范说明和开发指导。

### 1.2 适合人群

- 项目维护者
- 需要开发/修改组件的开发者
- 不熟悉项目结构的新成员

### 1.3 前置知识

如果你不了解React基础概念，建议先阅读：
- [React基础概念指南](./react-basics.md)（待创建）

---

## 2. 项目概览

### 2.1 项目结构

本项目包含两个设计规范的UI playground：

| 项目 | 设计规范 | 组件路径 | 说明 |
|------|----------|----------|------|
| `harmony-ui-playground` | Harmony | `src/component/` | 鸿蒙风格组件 |
| `devui-playground` | DevUI | `src/components/ui/` | DevUI风格组件 |

### 2.2 组件文件组织

每个组件都放在独立的文件夹中，结构如下：

```
ComponentName/
├── index.ts                    # ⚠️ 必须 - 组件入口，导出组件和类型
├── ComponentName.tsx           # 组件主文件
├── ComponentName.css           # 样式文件
└── ComponentName.stories.tsx   # Storybook测试文件
```

#### 关于 index.ts

**index.ts 是必须的**，它有两个作用：

1. **组件文件夹内的 index.ts** - 组件自己的入口

   ```typescript
   // ComponentName/index.ts
   export { ComponentName } from "./ComponentName"
   export type { ComponentNameProps } from "./ComponentName"
   ```

   - 提供清晰的导入路径：`import { ComponentName } from "@/component/ComponentName"`
   - 同时导出组件和类型定义

2. **项目的 barrel index.ts** - 集中导出所有组件

   ```typescript
   // harmony-ui-playground/src/component/index.ts
   export { Button } from "./Button"
   export { Checkbox } from "./Checkbox"
   export { ComponentName } from "./ComponentName"
   ```

   - 提供统一导入路径：`import { Button, ComponentName } from "@/component"`
   - 作为组件的"公共API"

### 2.3 shadcn设计系统简介

本项目基于shadcn/ui设计系统，核心特点：

- 使用 **class-variance-authority (CVA)** 管理组件变体
- 支持 **Tailwind CSS** 进行样式管理
- 使用 **TypeScript** 保证类型安全
- 支持 **asChild** 属性实现多态渲染

参考示例：[shadcn Button组件](../shadcn/src/components/ui/button.tsx)

---

## 3. 组件维护方式

### 3.1 维护方式分类

组件维护按来源分为两种方式（两类都不是"原生未改动组件"）：

1. 基于 shadcn 组件体系添加并二次定制
2. 添加符合目标设计规范的组件（Harmony / DevUI 风格，自主实现）

当前仓库映射（仅说明现状，不代表方式绑定项目）：

| 项目 | 当前主要维护方式 |
|------|------------------|
| `devui-playground` | 添加符合目标规范的组件（项目特有组件维护） |
| `harmony-ui-playground` | 添加符合目标规范的组件（项目特有组件维护） |

**注意事项：**
- `devui-playground` 与 `harmony-ui-playground` 都是项目内维护组件，不是"原生未改动组件"。
- 两个 playground 都依赖 `src/styles/tokens.css` 与 `src/index.css` 的 token 映射。

### 3.2 方式一：基于shadcn体系二次定制

#### 3.2.1 新增组件

在目标项目目录执行：

```bash
npx shadcn@latest add <component> --dry-run
npx shadcn@latest add <component>
```

**校验点：**

1. 文件是否生成到项目定义的 `aliases.ui` 目录
2. 导入 alias 是否与项目 `components.json` 一致
3. 是否引入了项目不需要的样式或依赖
4. 是否补充/更新了对应 `*.stories.tsx`

#### 3.2.2 删除组件

推荐步骤：

```bash
rg "<ui-alias>/<name>" src
rg "<name>" src src/stories
```

1. 先清理所有导入和使用
2. 删除组件文件/目录（实际路径以 `aliases.ui` 为准）
3. 删除对应 stories
4. 运行 `npm run build` 与 `npm run build-storybook`

#### 3.2.3 修改组件

可直接改该项目 `aliases.ui` 指向目录下的文件。建议流程：

1. `npx shadcn@latest add <component> --dry-run` 看上游变更范围
2. `npx shadcn@latest add <component> --diff <file>` 对比单文件
3. 保留本地定制后手动合并

**不要直接用 `--overwrite` 覆盖有本地改动的文件。**

### 3.3 方式二：添加符合目标规范的组件

#### 3.3.1 目录与命名

常见结构：

```text
src/component/<ComponentName>/
├── <ComponentName>.tsx
├── <ComponentName>.css
├── <ComponentName>.stories.tsx
└── index.ts
```

**说明：**

- 目录通常用 PascalCase（如 `TaskCard`、`StatusBar`）
- 但 `registry.json` 的 `dependencies` 使用 kebab-case 名称（如 `task-card`、`status-bar`）
- 以现有组件风格为准，不强制所有组件都必须提供 default export

#### 3.3.2 新增组件

1. 在 `src/component/<ComponentName>/` 新建 TSX/CSS/`index.ts`
2. 在 `src/component/index.ts` 增加导出
3. 需要对外给 block 使用时，同步更新 `registry.json` 里的 `dependencies`
4. 新增 stories 并跑构建校验

#### 3.3.3 删除组件

```bash
rg "@/component/<ComponentName>" src
rg "<component-kebab-name>" registry.json src/blocks src/component/index.ts
```

1. 清理导入与使用点
2. 删除组件目录
3. 更新 `src/component/index.ts`
4. 更新 `registry.json` 中引用项
5. 运行 `npm run build` 与 `npm run build-storybook`

#### 3.3.4 修改组件

修改后至少检查：

- TS 类型是否与 props 行为一致
- CSS 是否继续使用 token（避免硬编码主题色）
- stories 是否覆盖关键状态（默认/禁用/交互态）

---

## 4. Token维护要点

两个 playground 都有独立 token 文件：

- `devui-playground/src/styles/tokens.css`
- `harmony-ui-playground/src/styles/tokens.css`

**修改 token 时：**

1. 评估是否两个 playground 都要改
2. 如需在 Tailwind 语义类中使用，补充 `src/index.css` 的 `@theme inline` 映射
3. 回归 Storybook（`Foundations/*` 与关键组件 stories）

---

## 5. 快速命令参考

```bash
# 类型检查
npm run type-check

# 构建项目
npm run build

# 构建Storybook
npm run build-storybook

# 启动开发服务器
npm run dev

# 启动Storybook
npm run storybook
```

---

## 6. AI辅助开发

### 6.1 使用react-component-integrator辅助新增组件

#### 6.1.1 shadcn CLI 使用规则

**方式一项目（基于 shadcn 体系）的一般规则：**

- `components.json` 需满足 shadcn CLI 的标准校验
- 可用命令：
  - `npx shadcn@latest info`
  - `npx shadcn@latest add ...`
  - `npx shadcn@latest add ... --diff ...`

#### 6.1.2 本仓库现状

- `devui-playground`：可正常使用上面的 shadcn CLI 命令
- `harmony-ui-playground`：当前 `components.json` 中

```json
"registries": {
  "@harmony": "./registry.json"
}
```

该写法用于本仓库工作流，但不满足 shadcn CLI 对 registry URL 模板（需含 `{name}`）的校验要求。
因此当前直接执行 `npx shadcn@latest info` / `view @harmony/...` 会报配置错误。

**结论：**
- 两个项目都属于"项目特有组件维护"语境，验收应以源码一致性与构建结果为主
- `harmony-ui-playground` 不要依赖上述两个 CLI 命令做验收
- 改用文件一致性校验：`registry.json`、`src/blocks/*`、`src/component/index.ts`、构建命令

### 6.2 常见问题解决方案

使用AI时遇到问题很正常，不用慌！以下是小白最容易遇到的问题和解决方案。

#### 6.2.1 问题1：AI做出来的不是我想要的

**怎么判断是这个问题？**
- AI生成的组件功能不对
- 组件的样子和预期不符
- 缺少某些功能或变体

**怎么解决？**
直接告诉AI哪里不对：

```
这个组件不是我想要的，需要修改：

1. 按钮应该有红色、绿色、蓝色三种颜色，现在只有红色
2. 点击后应该弹出提示，但现在什么都没发生
3. 文字应该在按钮中间，现在偏左了

请按照我的要求修改。
```

#### 6.2.2 问题2：代码报错看不懂

**常见错误样子：**
- `Cannot find module`
- `Property 'xxx' does not exist`
- `Type 'string' is not assignable`

**怎么解决？**
把错误信息直接复制给AI：

```
我的代码报错了，错误信息如下：

[把完整的错误信息贴在这里]

请帮我：
1. 告诉我错在哪里（用简单的话解释）
2. 帮我修复这个错误
3. 解释为什么会出现这个错误
```

#### 6.2.3 问题3：样式不对，颜色/大小/位置有问题

**怎么解决？**
直接描述你看到的问题：

```
这个组件的样式需要修改：

当前问题：
1. 背景颜色是黑色，我想要蓝色
2. 按钮太小了，希望能大一点
3. 文字颜色和背景颜色太接近，看不清楚

请参考这个正常工作的按钮的样式：
harmony-ui-playground/src/component/Button/Button.css
```

#### 6.2.4 问题4：运行时提示"找不到某个文件"

**怎么解决？**
```
我的代码报错说找不到文件：

[把错误信息贴在这里]

请帮我检查：
1. 这些文件在项目中是否存在？
2. 如果不存在，告诉我应该创建什么文件
3. 如果存在，帮我修正导入的路径
```

#### 6.2.5 问题5：Storybook页面显示不出来

**怎么解决？**
```
我的Storybook story无法正常显示，显示这样的错误：

[把错误信息贴在这里]

这个是stories的代码：

[把 ComponentName.stories.tsx 的代码路径贴在这里]（可选）

请帮我修复，让它能正常显示组件。
```

#### 6.2.6 问题6：npm run build 失败

**怎么解决？**
把构建的错误信息全部复制给AI：

```
我运行 npm run build 失败了，错误信息如下：

[把构建失败的完整错误信息贴在这里，从头到尾都复制]

请帮我：
1. 找出是哪里出错了
2. 告诉我怎么修改才能成功构建
3. 简单解释为什么会出现这个错误
```

#### 6.2.7 小技巧：如何更有效地和AI沟通

##### 1. 说话要具体

❌ **不够具体：**
```
帮我做一个按钮。
```

✅ **更具体：**
```
帮我做一个按钮组件，用在harmony-ui-playground项目中。

需求：
- 有三种颜色：红色（删除）、绿色（确认）、蓝色（普通）
- 点击时有动画效果
- 大小有小、中、大三种
```

##### 2. 提供参考

❌ **没有参考：**
```
帮我做一个卡片组件。
```

✅ **有参考：**
```
帮我做一个卡片组件，参考这个Button的结构：
harmony-ui-playground/src/component/Button/Button.tsx

卡片要有标题区域和内容区域，和按钮的风格保持一致。
```

##### 3. 直接复制错误

看到错误不要怕，直接复制完整的信息给AI，包括：
- 错误的文件路径
- 错误的行号
- 错误的具体信息

示例：
```
错误位置：harmony-ui-playground/src/component/MyComponent/MyComponent.tsx
错误行号：第45行
错误信息：Property 'color' does not exist on type 'MyComponentProps'
```

##### 4. 分步骤提出需求

如果需求比较复杂，分步骤让AI做：
```
第一步：先帮我创建一个基础的按钮组件，只要能显示文字和点击。

做完之后，我再告诉你下一步要添加什么功能。
```

##### 5. 用大白话描述

不要用专业术语，用你能理解的方式描述：

❌ **术语多：**
```
组件的variant需要支持destructive模式，要有hover和focus状态。
```

✅ **大白话：**
```
按钮需要有一个红色的样式，用来表示删除操作。
鼠标放上去颜色要深一点，点击时有边框。
```

##### 6. 万能提问模板

如果你不知道怎么问AI，就用这个模板：

```
我遇到了一个[描述问题的简单标题]，请帮我。

**情况：**
[用简单的语言描述发生了什么，比如：我运行代码后看到错误、组件显示不出来、样式不对]

**期望：**
[你希望发生什么，比如：正常显示组件、按钮是蓝色的、点击后有反应]

**错误信息（如果有）：**
[把错误信息完整复制贴在这里]

**相关代码：**
[把相关的代码贴在这里]

请用简单的话告诉我：
1. 问题出在哪里
2. 怎么修改
3. 为什么会出现这个问题
```

### 6.3 推荐的AI提示词模板

#### 6.3.1 Vue转换模板

```
使用vue-to-react-component技能，将以下Vue组件转换为React组件：

[粘贴Vue组件代码]

要求：
- 目标项目：[项目名称]
- 输出模式：多文件模式
- 生成Storybook stories
```

#### 6.3.2 修改组件模板

```
修改[项目路径]中的[组件名称]组件：

需要做的修改：
1. [具体修改1]
2. [具体修改2]

同时需要更新：
- [需要更新的文件列表]
```

#### 6.3.3 调试模板

```
以下组件有问题，请帮我修复：

[粘贴组件代码]

错误信息：
[粘贴错误信息]

要求：
1. 找出问题原因
2. 提供修复方案
3. 解释为什么会出现这个问题
```

---

## 7. 维护完成后的最小验收清单

新增/删除/修改任一组件后至少执行：

```bash
# devui-playground 或 harmony-ui-playground 目录内
npm run build
npm run build-storybook
```

并人工确认：
- 组件导出入口无断链
- stories 可正常渲染
- token 变更未引发明显视觉回归
- 若涉及 block，`registry.json` 的 `dependencies` 与实际组件一致

---

## 8. 相关资源

- [shadcn/ui官方文档](https://ui.shadcn.com)
- [class-variance-authority文档](https://cva.style)
- [Tailwind CSS文档](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Storybook文档](https://storybook.js.org)
- [AI辅助组件转换指南](./ai-assisted-component-conversion.md)
- [react-component-integrator技能参考](../.agent/skills/react-component-integrator/)
