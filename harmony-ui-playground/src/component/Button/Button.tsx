import * as React from "react"
import "./Button.css"

// ============================================
// 类型定义
// ============================================

/** 按钮样式变体类型 */
export type ButtonVariant =
  | "primary"   // 主要按钮（默认样式）
  | "default"   // 默认按钮
  | "danger"    // 危险/删除按钮（红色）
  | "info"      // 信息按钮
  | "success"   // 成功按钮（绿色）

/** 按钮尺寸类型 */
export type ButtonSize = "large" | "small"

/**
 * 按钮组件属性接口
 * 继承自原生 button 元素属性，但移除 type 属性（使用 type 表示样式变体）
 */
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** 按钮样式变体，默认为 "primary" */
  type?: ButtonVariant
  /** 按钮尺寸，默认为 "large" */
  size?: ButtonSize
  /** 是否为朴素按钮（镂空样式） */
  plain?: boolean
  /** 是否为圆角按钮 */
  round?: boolean
  /** 是否为块级按钮（占满宽度） */
  block?: boolean
  /** 是否为加载状态 */
  loading?: boolean
  /** 原生 button 的类型属性 */
  nativeType?: "button" | "submit" | "reset"
  /** 自定义渲染标签，默认为 "button" */
  tag?: React.ElementType
  /** 自定义背景色 */
  color?: string
  /** 自定义文字颜色 */
  textColor?: string
}

// ============================================
// 辅助函数
// ============================================

/**
 * 拼接 CSS 类名
 * 过滤掉 falsy 值（false、undefined、空字符串），然后用空格连接
 * @param parts - 类名数组，可包含字符串、false 或 undefined
 * @returns 拼接后的类名字符串
 */
function getClassNames(parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ")
}

// ============================================
// Button 组件
// ============================================

/**
 * Button 按钮组件
 *
 * 一个功能丰富的按钮组件，支持：
 * - 多种样式变体（primary、default、danger、info、success）
 * - 两种尺寸（large、small）
 * - 朴素样式、圆角样式、块级样式
 * - 加载状态
 * - 自定义渲染标签
 * - 自定义颜色
 */
export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  function Button(
    {
      type = "primary",      // 默认样式变体为主要按钮
      size = "large",        // 默认尺寸为大号
      plain = false,         // 默认非朴素样式
      round = false,         // 默认非圆角
      block = false,         // 默认非块级
      disabled = false,      // 默认可用
      loading = false,       // 默认非加载状态
      nativeType = "button", // 默认原生 button 类型
      tag: Tag = "button",   // 默认使用 button 标签
      color = "",            // 默认无自定义颜色
      textColor = "",        // 默认无自定义文字颜色
      className,             // 额外的 CSS 类名
      style,                 // 内联样式
      onClick,               // 点击事件处理器
      children,              // 子元素（按钮文字或内容）
      ...rest                // 其他传入的属性
    },
    ref                      // 转发 ref
  ) {
    // ----------------------------------------
    // 状态计算
    // ----------------------------------------

    // 判断是否使用原生 button 标签
    const isButtonTag = Tag === "button"
    // 按钮是否处于禁用状态（禁用或加载中）
    const isDisabled = disabled || loading
    // 将 Tag 断言为 React 元素类型
    const Component = Tag as React.ElementType

    // ----------------------------------------
    // 样式计算
    // ----------------------------------------

    /**
     * 计算合并后的样式对象
     * 根据 color 和 textColor 属性生成 CSS 变量
     * 使用 useMemo 缓存计算结果，避免不必要的重新计算
     */
    const mergedStyle = React.useMemo<React.CSSProperties>(() => {
      const nextStyle: React.CSSProperties & Record<string, string> = {}

      // 如果设置了自定义背景色，生成对应的 CSS 变量
      if (color) {
        nextStyle["--my-btn-bg"] = color

        // 如果只设置了背景色没设置文字色，默认文字为白色
        if (!textColor) {
          nextStyle["--my-btn-color"] = "#fff"
        }
      }

      // 如果设置了自定义文字颜色，生成对应的 CSS 变量
      if (textColor) {
        nextStyle["--my-btn-color"] = textColor
      }

      return nextStyle
    }, [color, textColor])

    // ----------------------------------------
    // 事件处理
    // ----------------------------------------

    /**
     * 点击事件处理器
     * 如果按钮处于禁用状态，阻止默认行为
     * 否则调用传入的 onClick 回调
     */
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (isDisabled) {
          event.preventDefault()
          return
        }

        onClick?.(event as React.MouseEvent<HTMLButtonElement>)
      },
      [isDisabled, onClick]
    )

    // ----------------------------------------
    // 类名计算
    // ----------------------------------------

    /**
     * 计算按钮的 CSS 类名
     * 基础类名 + 变体类名 + 尺寸类名 + 状态类名 + 自定义类名
     */
    const classes = getClassNames([
      "my-btn",                    // 基础类名
      `my-btn--${type}`,          // 样式变体类名
      `my-btn--${size}`,          // 尺寸类名
      plain && "my-btn--plain",   // 朴素样式类名（条件渲染）
      round && "my-btn--round",   // 圆角样式类名（条件渲染）
      block && "my-btn--block",   // 块级样式类名（条件渲染）
      disabled && "my-btn--disabled",  // 禁用样式类名（条件渲染）
      loading && "my-btn--loading",    // 加载样式类名（条件渲染）
      className,                  // 传入的自定义类名
    ])

    // ----------------------------------------
    // 共享属性
    // ----------------------------------------

    /**
     * 共享的 DOM 属性
     * 提取出两组渲染都需要用到的公共属性
     */
    const sharedProps = {
      ...rest,                    // 展开其他传入的属性
      className: classes,        // 计算后的类名
      style: {
        ...mergedStyle,          // 计算后的自定义颜色样式
        ...style,                // 传入的内联样式（优先级更高）
      },
      onClick: handleClick,      // 点击事件处理器
      "aria-disabled": isDisabled || undefined,  // 无障碍属性：是否禁用
      "data-disabled": isDisabled || undefined,  // 数据属性：是否禁用（用于 CSS 选择器）
      "data-loading": loading || undefined,      // 数据属性：是否加载中（用于 CSS 选择器）
    }

    // ----------------------------------------
    // 渲染
    // ----------------------------------------

    // 如果使用原生 button 标签
    if (isButtonTag) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          {...(sharedProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          type={nativeType}       // 原生 button 的 type 属性
          disabled={isDisabled}   // 原生 disabled 属性
        >
          {/* 加载状态指示器 */}
          {loading ? <span className="my-btn__loading" aria-hidden="true" /> : null}
          {/* 按钮文字/内容 */}
          <span className="my-btn__text">{children}</span>
        </button>
      )
    }

    // 如果使用自定义标签（如 a、div 等）
    return (
      <Component
        ref={ref as never}
        {...(sharedProps as any)}
        role={rest.role ?? "button"}    // 默认 role 为 button，确保无障碍访问
        aria-disabled={isDisabled || undefined}
      >
        {/* 加载状态指示器 */}
        {loading ? <span className="my-btn__loading" aria-hidden="true" /> : null}
        {/* 按钮文字/内容 */}
        <span className="my-btn__text">{children}</span>
      </Component>
    )
  }
)

// ============================================
// 组件元数据
// ============================================

/** 设置组件在 React DevTools 中显示的名称 */
Button.displayName = "Button"

/** 默认导出 Button 组件 */
export default Button
