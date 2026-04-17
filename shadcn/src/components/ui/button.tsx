/**
 * 按钮组件
 *
 * 一个灵活、可访问的按钮组件，使用 Radix UI 原语和 class-variance-authority (CVA) 进行变体管理。
 * 支持多态渲染和多种视觉样式。
 */

// 导入 React 用于组件创建
import * as React from "react"

// 导入 CVA (Class Variance Authority) 用于管理组件变体
// 这允许我们基于 props 创建不同的按钮样式
import { cva, type VariantProps } from "class-variance-authority"

// 导入 Radix UI 的 Slot 组件用于多态渲染
// 这允许按钮作为任何元素/组件渲染，同时保持按钮行为
import { Slot } from "radix-ui"

// 导入用于合并 Tailwind 类的工具函数
import { cn } from "@/lib/utils"

/**
 * 按钮变体配置
 *
 * 使用 CVA (Class Variance Authority) 定义按钮的所有可能视觉样式。
 * 这创建了一种类型安全的方式来应用不同的按钮外观。
 */
const buttonVariants = cva(
  // 应用于所有按钮的基础样式
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    // 定义不同的视觉变体
    variants: {
      // 样式变体（视觉效果）
      variant: {
        // 主要按钮 - 带有实心背景的主要操作按钮
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",

        // 轮廓按钮 - 带边框的透明背景按钮
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        // 次要按钮 - 替代操作按钮
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",

        // 幽灵按钮 - 悬停前没有背景/边框
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",

        // 破坏性按钮 - 用于删除等危险操作
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",

        // 链接按钮 - 看起来像文本链接
        link: "text-primary underline-offset-4 hover:underline",
      },

      // 尺寸变体
      size: {
        // 默认尺寸
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",

        // 超小
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",

        // 小
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",

        // 大
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",

        // 仅图标按钮（方形）
        icon: "size-8",

        // 超小仅图标
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",

        // 小仅图标
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",

        // 大仅图标
        "icon-lg": "size-9",
      },
    },

    // 未指定时的默认变体值
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * 按钮组件
 *
 * 一个多态按钮组件，可以作为原生按钮或通过 `asChild` prop 作为任何其他组件渲染。
 */
function Button({
  className,
  variant = "default",  // 默认为主要样式
  size = "default",     // 默认为中等尺寸
  asChild = false,      // 默认渲染为 button 元素
  ...props              // 收集所有其他 props
}: React.ComponentProps<"button"> &  // 包含所有标准按钮 props
  VariantProps<typeof buttonVariants> & {  // 包含来自 CVA 的变体 props
    asChild?: boolean  // 用于多态渲染的额外 prop
  }) {
  // 确定要渲染哪个组件
  // 如果 asChild 为 true，使用 Radix Slot 渲染为子组件
  // 否则，渲染为标准 button 元素
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      // 添加数据属性用于样式设置和测试
      data-slot="button"      // 标识这是一个按钮组件
      data-variant={variant}  // 存储当前变体
      data-size={size}        // 存储当前尺寸

      // 应用变体类和任何额外的类
      className={cn(buttonVariants({ variant, size, className }))}

      // 转发所有其他 props（onClick、disabled 等）
      {...props}
    />
  )
}

// 导出组件和变体配置以供外部使用
export { Button, buttonVariants }