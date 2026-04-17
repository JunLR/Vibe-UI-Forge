import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import type { StorybookConfig } from "@storybook/react-vite"
import { mergeConfig } from "vite"

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    "../src/stories/foundations/**/*.stories.@(ts|tsx|mdx)",
    "../src/stories/components/**/*.stories.@(ts|tsx|mdx)",
    "../src/component/**/*.stories.@(ts|tsx|mdx)",
    "../src/blocks/**/*.stories.@(ts|tsx|mdx)",
  ],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(dirname, "../src"),
        },
      },
    }),
}

export default config
