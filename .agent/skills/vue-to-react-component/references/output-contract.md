# Output Contract

For reusable conversions, prefer this folder shape:

```text
.artifacts/vue-to-react-component/<component-slug>/
  react-output/
    index.ts
    <component>.tsx
    <component>-group.tsx
    <component>.types.ts
    <component>.css
  preview-app/
    index.html
    src/
      main.tsx
      App.tsx
      index.css
```

Guidelines:

- `index.ts` re-exports the public React API.
- `react-output/` is the handoff unit for later move/swap skills.
- `preview-app/` is only for validation and browser preview.
- Keep generated code self-contained so another skill can copy `react-output/` into a different target path.
- Use local relative imports inside each artifact subtree.
