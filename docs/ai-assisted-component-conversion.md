# AI辅助组件转换指南

本文档描述AI辅助组件转换的详细执行流程，供AI参考和执行。

## AI辅助组件转换流程总览

### 流程图

```mermaid
graph TD
    A[开始转换] --> B{选择输入资源类型}
    B -->|Pixso MCP| C[解析设计资源]
    B -->|Vue组件| D[Vue to React]
    B -->|React组件| E[调整为项目规范]
    B -->|HTML/CSS| F[HTML转React]
    B -->|Markdown| G[解析需求描述]
    C --> H[选择目标项目]
    D --> H
    E --> H
    F --> H
    G --> H
    H --> I{harmony 或 devui}
    I -->|harmony| J[创建harmony风格组件]
    I -->|devui| K[创建devui风格组件]
    J --> L[生成文件结构]
    K --> L
    L --> M[编写组件代码]
    M --> N[添加样式]
    N --> O[编写Stories]
    O --> P[更新配置]
    P --> Q[验证检查]
    Q --> R[完成]
```

### 支持的输入资源

| 输入类型 | 说明 | 推荐AI技能 |
|----------|------|-----------|
| Pixso MCP | 从Pixso设计工具导出的组件 | component-converter |
| Vue组件 | .vue单文件组件 | vue-to-react-component |
| React组件 | 已有的React代码 | component-converter |
| HTML/CSS | HTML原型页面 | component-converter |
| Markdown | 用文字描述的组件需求 | component-converter |

---

## 新增组件详细流程

### 步骤1：准备工作

1. **明确组件需求**
   - 组件的功能是什么？
   - 需要哪些变体（样式、尺寸、状态）？
   - 有哪些交互行为？

2. **选择目标项目**
   - Harmony风格 → `harmony-ui-playground`
   - DevUI风格 → `devui-playground`

3. **准备输入资源**
   - 根据需求提供对应的输入文件或描述

### 步骤2：使用AI进行转换

#### 场景A：从Vue组件转换

使用 `vue-to-react-component` 技能：

**AI提示词模板：**

```
使用 vue-to-react-component 技能，将以下Vue组件转换为React组件：

[粘贴Vue组件代码]

要求：
- 目标项目：harmony-ui-playground（或devui-playground）
- 输出模式：多文件模式
- 组件位置：src/component/[ComponentName]/
- 需要生成Storybook stories
- 参考shadcn的button组件结构
```

**AI会自动处理：**
- Vue指令转换（v-if、v-for、v-model等）
- 生命周期钩子转换
- Props和Events转换
- 样式转换

#### 场景B：从其他资源转换

**AI提示词模板：**

```
帮我创建一个[组件名称]组件到harmony-ui-playground项目。

组件需求：(如果提供资源中有可以不描述)
[从你的输入资源中提取，例如]
- 类型：[描述组件类型]
- 变体：[列出需要的变体，如 primary/secondary, large/small等]
- 交互：[描述交互行为]
- 样式参考：[如果有参考图或CSS]

要求：
1. 按照项目规范创建文件结构
2. 使用CVA管理变体
3. 参考shadcn/button.tsx的结构
4. 添加完整的TypeScript类型定义
5. 创建Storybook stories
6. 更新导出文件
```

### 步骤3：创建组件文件结构

AI会创建以下文件：

```
src/component/ComponentName/
├── index.ts                    # 导出
├── ComponentName.tsx           # 组件
├── ComponentName.css           # 样式
└── ComponentName.stories.tsx   # Stories
```

### 步骤4：组件代码编写要点

#### TypeScript接口定义

```typescript
// 定义组件Props接口
export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement> {  // 继承原生HTML属性
  variant?: "primary" | "secondary" | "tertiary"  // 变体
  size?: "small" | "medium" | "large"             // 尺寸
  disabled?: boolean                               // 状态
  // ... 其他props
}
```

#### CVA变体管理

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  // 基础样式
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
      size: {
        small: "h-8 px-3 text-sm",
        medium: "h-10 px-4 text-base",
        large: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
)
```

#### 组件实现

```typescript
const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

ComponentName.displayName = "ComponentName"
export { ComponentName, componentVariants }
```

### 步骤5：样式文件

CSS文件使用CSS变量实现主题化：

```css
.my-component {
  --my-component-bg: var(--primary);
  --my-component-color: var(--primary-foreground);
  /* 其他样式 */
}
```

### 步骤6：Storybook Stories

```typescript
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ComponentName } from "./ComponentName"

const meta = {
  title: "Components/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
  args: {
    variant: "primary",
    size: "medium",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      <ComponentName {...args} variant="primary">Primary</ComponentName>
      <ComponentName {...args} variant="secondary">Secondary</ComponentName>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <ComponentName {...args} size="small">Small</ComponentName>
      <ComponentName {...args} size="medium">Medium</ComponentName>
      <ComponentName {...args} size="large">Large</ComponentName>
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="flex gap-3">
      <ComponentName {...args}>Default</ComponentName>
      <ComponentName {...args} disabled>Disabled</ComponentName>
    </div>
  ),
}
```

### 步骤7：更新项目配置

#### 对于harmony-ui-playground：

1. 更新 `src/component/index.ts`：
```typescript
export { ComponentName } from "./ComponentName"
```

2. 如果组件需要在blocks中使用，更新 `registry.json`：
```json
{
  "name": "@harmony",
  "blocks": [
    {
      "name": "block-name",
      "dependencies": ["component-name", ...]
    }
  ]
}
```

#### 对于devui-playground：

1. 更新 `src/components/ui/index.ts`（如果存在）或确保组件可以通过路径正确导入

---

## 修改组件流程

### 修改场景

1. **添加新的变体**（如新增颜色、尺寸）
2. **修改现有变体的样式**
3. **添加新的属性**
4. **调整组件行为**

### 修改步骤

1. **明确修改需求**

2. **使用AI进行修改**

**AI提示词模板：**

```
修改 harmony-ui-playground/src/component/ComponentName/ComponentName.tsx：

需要做的修改：
1. [具体修改内容1]
2. [具体修改内容2]

同时需要更新：
- ComponentName.tsx（主文件）
- ComponentName.css（样式文件，如果涉及样式修改）
- ComponentName.stories.tsx（Stories，添加新的示例）
- index.ts（如果需要新的导出）
```

3. **验证修改结果**
