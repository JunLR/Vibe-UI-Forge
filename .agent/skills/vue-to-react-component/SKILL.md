---
name: vue-to-react-component
description: Converts Vue component source files into reusable React component files, with support for single-file or multi-file output and a browser-previewable artifact flow under .artifacts. Use when migrating Vue SFC or Vue TSX components into React source that later skills can move into the formal project.
---

# Vue To React Component

Use this skill when the user wants a Vue component implementation turned into React source files that can be reused elsewhere in this repo.

## Inputs

Collect these before generating files:

- The Vue source files that define the component contract.
- The desired output mode: single-file or multi-file.
- The output folder for the React files.
- Whether the component should get a browser preview artifact.

If the user does not specify an output folder, default to:

- Artifact root: `.artifacts/vue-to-react-component/<component-slug>/`
- React output: `.artifacts/vue-to-react-component/<component-slug>/react-output/`
- Preview app: `.artifacts/vue-to-react-component/<component-slug>/preview-app/`

## Workflow

1. Read the component entry file, prop/type files, style files, and any demos that clarify behavior.
2. Extract the public API:
   - prop names and defaults
   - events
   - slot/content behavior
   - visual states and size/color variants
   - companion pieces such as groups, hooks, icons, or styles
3. Generate React output files.
   - Single-file mode: prefer one `.tsx` file plus an optional `.css` file if styles are non-trivial.
   - Multi-file mode: split into `index.ts`, component files, types, small helpers, and styles when that improves reuse.
4. Keep the generated React output copyable.
   - Avoid project-specific aliases.
   - Preserve CSS variables from the source design system when possible.
   - Prefer plain React and TypeScript over framework-coupled abstractions.
5. If preview is requested, create a dedicated preview app inside the same `.artifacts` component folder.
   - Keep preview-only files out of the formal React output folder.
   - Do not write generated component code into `ui-playground/src` or any formal app source tree.
6. Validate with:
   - `npm exec vite -- --config ui-playground/vite.artifacts.config.ts --root <preview-app-dir> build`
   - `npm exec vite -- --config ui-playground/vite.artifacts.config.ts --root <preview-app-dir> --host 127.0.0.1 --port 4173` when a live preview URL is needed

## Output Rules

- The output must be React source files, not prose.
- Preserve the original component API where practical. If React needs a rename, keep the source prop and map it internally.
- Include a barrel export in multi-file mode.
- Keep styles with the component output so another skill can copy or replace the component as a unit.
- Treat `.artifacts` as the only default destination for conversion-stage files and preview-stage files.
- When the source has demos, use them to build the preview surface and to verify the important states.

## Validation Notes

- Treat docs examples as the behavior contract when source-only intent is ambiguous.
- If the Vue source uses injections or composition hooks, convert them into React context or local hooks.
- If an icon system is referenced but not available in the target project, create a minimal adapter in the generated output instead of hard-blocking the migration.
