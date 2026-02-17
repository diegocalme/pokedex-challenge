# Skill: Design Sync (Pencil MCP)

## Purpose

Orchestrate bidirectional synchronization between Pencil `.pen` design files and React component code using the Pencil MCP server. This skill is invoked whenever the workflow involves visual UI — creating new components from designs, updating code to match revised designs, or generating design files from existing components.

---

## Prerequisites

- Pencil desktop app or IDE extension installed and running.
- Pencil MCP server connected (verify via IDE Settings → MCP).
- `.pen` files stored in the repository under `designs/` at the project root.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| `direction` | Yes | `design-to-code`, `code-to-design`, or `verify` |
| `penFile` | Yes | Path to the `.pen` design file (e.g., `designs/pokemon-list.pen`) |
| `componentPath` | If design-to-code or verify | Path to the target component file |
| `frameName` | No | Specific frame/artboard name within the `.pen` file to target |

---

## Procedures

### Direction: `design-to-code`

Generate or update a React component to match a Pencil design.

**Step 1 — Read design specs via MCP**

Prompt the Pencil MCP server to inspect the target frame:

> "Inspect the frame `{frameName}` in `{penFile}`. Extract all visual properties: layout (flex direction, alignment, gap, wrapping), spacing (padding, margin), typography (font family, size, weight, line height, letter spacing), colors (background, text, border), borders (width, radius, style), shadows, and any design variables or tokens referenced."

Capture the structured output.

**Step 2 — Map to implementation**

Convert extracted values to the project's styling approach:

- If using CSS Modules: generate a `.module.css` file with exact values.
- If using Tailwind: map to utility classes.
- If using inline styles: construct a styles object.

> **Important:** Preserve design tokens/variables as CSS custom properties or theme constants — do not hardcode hex values inline.

**Step 3 — Generate component**

Use the `create-component` skill with the extracted design data as input. The component's JSX structure should mirror the `.pen` file's layer hierarchy:

- Each `.pen` frame → a container `div` or semantic HTML element.
- Each `.pen` text layer → a text element (`p`, `h1`, `span`, etc.).
- Each `.pen` image/rectangle → an appropriate HTML element.

**Step 4 — Verify fidelity**

Run the `verify` direction (below) to confirm the generated code matches the design.

---

### Direction: `code-to-design`

Generate or update a `.pen` design file from existing React components.

**Step 1 — Analyze component**

Read the component file and extract:
- JSX structure (element hierarchy).
- Applied styles (classes, inline styles, CSS module references).
- Computed dimensions and spacing.

**Step 2 — Generate design via MCP**

Prompt the Pencil MCP server:

> "In `{penFile}`, create a frame named `{frameName}` that matches this component structure: {structured description of the component's visual tree with all style values}."

**Step 3 — Verify**

Open the `.pen` file in Pencil and visually confirm the generated design matches the rendered component.

---

### Direction: `verify`

Compare a rendered component against its `.pen` design source and report mismatches.

**Step 1 — Extract design values**

> "Inspect frame `{frameName}` in `{penFile}`. Return all spacing, typography, color, and layout values as a structured table."

**Step 2 — Extract code values**

Read the component's styles from its source file (CSS modules, Tailwind classes, or inline styles). Resolve any theme variables or design tokens to concrete values.

**Step 3 — Diff**

Compare each property:

| Property | Design Value | Code Value | Match |
|---|---|---|---|
| padding-top | 16px | 16px | ✅ |
| font-size | 18px | 16px | ❌ |
| color | #1A1A2E | #1A1A2E | ✅ |
| gap | 12px | 8px | ❌ |

**Step 4 — Report**

Output a mismatch report. For each mismatch, provide:
- The property name.
- The design value (source of truth).
- The code value (current).
- The file and line number in the code where the value is defined.
- A suggested fix.

---

## `.pen` File Management

### Repository Structure

```
designs/
├── pokemon-list.pen          # List view designs
├── pokemon-detail.pen        # Detail view designs
├── pokedex-collection.pen    # Collection view designs
└── shared-components.pen     # Buttons, inputs, type badges, etc.
```

### Git Integration

`.pen` files are JSON-based and version-control friendly. Commit them alongside code:

```bash
git add designs/pokemon-list.pen src/pokemon/components/...
git commit -m "feat(pokemon): implement list card from design"
```

Design and code changes for the same component SHOULD be in the same commit to maintain traceability.

---

## Integration with Other Skills

| Workflow | Skills Involved |
|---|---|
| New component from design | `design-sync` (design-to-code) → `create-component` → `write-tests` |
| Update component after design revision | `design-sync` (verify) → identify mismatches → `design-sync` (design-to-code) |
| Document existing component as design | `design-sync` (code-to-design) |
| `/develop` command with `.pen` reference | `write-tests` → `create-component` + `design-sync` (design-to-code) → verify |

---

## Checklist

- [ ] `.pen` file exists and is readable by the Pencil MCP server.
- [ ] Design values extracted before code generation (design is the visual source of truth).
- [ ] Design tokens preserved as variables, not hardcoded values.
- [ ] Component JSX structure mirrors `.pen` layer hierarchy.
- [ ] Verification diff run after generation.
- [ ] Mismatches resolved — code matches design within acceptable tolerance.
- [ ] `.pen` file and code committed together in the same logical commit.
