import type { Meta, StoryObj } from "@storybook/react-vite"
import { useMemo, type ReactNode } from "react"
import globalSource from "@/index.css?raw"
import devuiTokenSource from "@/styles/tokens.css?raw"

type TokenEntry = {
  name: string
  value: string
}

const tokenRegex = /(--[\w-]+)\s*:\s*([^;]+);/g

function parseTokens(source: string): TokenEntry[] {
  return Array.from(source.matchAll(tokenRegex)).map((match) => ({
    name: match[1],
    value: match[2].trim(),
  }))
}

const allTokens = [...parseTokens(globalSource), ...parseTokens(devuiTokenSource)]

const uniqueTokens = Array.from(
  new Map(allTokens.map((token) => [token.name, token])).values()
)

const colorValueRegex = /^(#|rgb|hsl)/i
const byName = (left: TokenEntry, right: TokenEntry) =>
  left.name.localeCompare(right.name)

const isColorToken = (token: TokenEntry) =>
  token.name.includes("color") || colorValueRegex.test(token.value)

const colorTokens = uniqueTokens.filter(isColorToken).sort(byName)
const fontFamilyTokens = uniqueTokens
  .filter((token) => token.name.includes("font-family"))
  .sort(byName)
const fontSizeTokens = uniqueTokens
  .filter((token) => token.name.includes("font-size"))
  .sort(byName)
const fontWeightTokens = uniqueTokens
  .filter(
    (token) => token.name.includes("font-") && token.name.includes("weight")
  )
  .sort(byName)
const lineHeightTokens = uniqueTokens
  .filter((token) => token.name.includes("line-height"))
  .sort(byName)
const spacingTokens = uniqueTokens
  .filter(
    (token) => token.name.includes("padding") || token.name.includes("indent")
  )
  .sort(byName)
const radiusTokens = uniqueTokens
  .filter((token) => token.name.includes("radius"))
  .sort(byName)
const shadowColorTokens = uniqueTokens
  .filter(
    (token) =>
      token.name.includes("shadow") &&
      !token.name.includes("length") &&
      (token.value.includes("rgba") || token.value.includes("#") || token.value.includes("var("))
  )
  .sort(byName)
const shadowLengthTokens = uniqueTokens
  .filter((token) => token.name.includes("shadow-length"))
  .sort(byName)
const animationTokens = uniqueTokens
  .filter((token) => token.name.includes("animation"))
  .sort(byName)
const zIndexTokens = uniqueTokens
  .filter((token) => token.name.includes("z-index"))
  .sort(byName)

const meta = {
  title: "Foundations/Tokens",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Section({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{count} tokens</span>
      </div>
      {children}
    </section>
  )
}

function TokenRow({
  name,
  value,
  resolvedValue,
  preview,
}: {
  name: string
  value: string
  resolvedValue: string
  preview?: ReactNode
}) {
  return (
    <div className="grid items-center gap-2 rounded-md border border-border px-3 py-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
      <code className="text-xs text-muted-foreground">{name}</code>
      <code className="text-xs" title={value}>
        {value}
      </code>
      <code className="text-xs" title={resolvedValue}>
        {resolvedValue}
      </code>
      <div className="justify-self-end">{preview}</div>
    </div>
  )
}

function TokensPreview() {
  const resolvedValues = useMemo(() => {
    if (typeof window === "undefined") {
      return {}
    }

    const style = getComputedStyle(document.documentElement)
    const next: Record<string, string> = {}
    uniqueTokens.forEach((token) => {
      next[token.name] = style.getPropertyValue(token.name).trim() || "—"
    })
    return next
  }, [])

  const getResolvedValue = (name: string) => resolvedValues[name] || "—"

  return (
    <div className="min-h-screen bg-background p-6 text-foreground md:p-8">
      <div className="mb-4 grid grid-cols-[1.4fr_1fr_1fr_auto] gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
        <span>Token</span>
        <span>Source Value</span>
        <span>Resolved Value</span>
        <span>Preview</span>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        <Section title="Colors" count={colorTokens.length}>
          <div className="flex flex-col gap-2">
            {colorTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <div className="flex items-center gap-2">
                    <span
                      className="h-7 w-14 rounded-md border border-border"
                      style={{ backgroundColor: `var(${token.name})` }}
                    />
                    <span
                      className="rounded-md border border-border bg-card px-2 py-1 text-xs"
                      style={{ color: `var(${token.name})` }}
                    >
                      Aa
                    </span>
                  </div>
                }
              />
            ))}
          </div>
        </Section>

        <Section
          title="Typography (Family / Size / Weight / Line Height)"
          count={
            fontFamilyTokens.length +
            fontSizeTokens.length +
            fontWeightTokens.length +
            lineHeightTokens.length
          }
        >
          <div className="flex flex-col gap-2">
            {fontFamilyTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <span style={{ fontFamily: `var(${token.name})` }}>
                    Aa字体 Font
                  </span>
                }
              />
            ))}
            {fontSizeTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <span style={{ fontSize: `var(${token.name})` }}>Sample</span>
                }
              />
            ))}
            {fontWeightTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <span style={{ fontWeight: `var(${token.name})` }}>
                    Weight
                  </span>
                }
              />
            ))}
            {lineHeightTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <span
                    className="block max-w-[120px] text-xs"
                    style={{ lineHeight: `var(${token.name})` }}
                  >
                    line one line two
                  </span>
                }
              />
            ))}
          </div>
        </Section>

        <Section title="Spacing" count={spacingTokens.length}>
          <div className="flex flex-col gap-2">
            {spacingTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <span
                    className="rounded border border-border bg-muted text-xs"
                    style={{ padding: `var(${token.name})` }}
                  >
                    space
                  </span>
                }
              />
            ))}
          </div>
        </Section>

        <Section title="Radius" count={radiusTokens.length}>
          <div className="flex flex-col gap-2">
            {radiusTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <span
                    className="inline-flex h-7 w-14 items-center justify-center border border-border bg-primary/20 text-[10px]"
                    style={{ borderRadius: `var(${token.name})` }}
                  >
                    R
                  </span>
                }
              />
            ))}
          </div>
        </Section>

        <Section
          title="Shadow"
          count={shadowColorTokens.length + shadowLengthTokens.length}
        >
          <div className="flex flex-col gap-2">
            {shadowColorTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <span
                    className="h-7 w-14 rounded-md bg-card"
                    style={{
                      boxShadow: `${shadowLengthTokens[0]?.value ?? "0 2px 6px 0"} var(${token.name})`,
                    }}
                  />
                }
              />
            ))}
            {shadowLengthTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <span
                    className="h-7 w-14 rounded-md border border-border bg-card"
                    style={{
                      boxShadow: `var(${token.name}) var(--devui-shadow)`,
                    }}
                  />
                }
              />
            ))}
          </div>
        </Section>

        <Section title="Motion" count={animationTokens.length}>
          <div className="flex flex-col gap-2">
            {animationTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
              />
            ))}
          </div>
        </Section>

        <Section title="Z-Index" count={zIndexTokens.length}>
          <div className="flex flex-col gap-2">
            {zIndexTokens.map((token) => (
              <TokenRow
                key={token.name}
                name={token.name}
                value={token.value}
                resolvedValue={getResolvedValue(token.name)}
                preview={
                  <span className="text-xs text-muted-foreground">
                    z={getResolvedValue(token.name)}
                  </span>
                }
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

export const Palette: Story = {
  render: () => <TokensPreview />,
}
