# FlowForge — Visual Workflow Builder

FlowForge is a production-quality visual workflow builder built as a single-page React application. Design automation flows with triggers, decisions, delays, and actions on an interactive canvas — then validate, simulate, save, and export your workflows locally.

---

## Prerequisites

- **Node.js** 18 or later (20+ recommended)
- **npm** 9 or later (comes with Node.js)

---

## Running the Application Locally

From the project root:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

3. Open the URL printed in the terminal (usually **http://localhost:5173**).
4. The FlowForge UI loads in your browser — no additional configuration or `.env` file is required.

### Production build (optional)

```bash
npm run build    # compile TypeScript + bundle for production
npm run preview  # serve the production build locally
```

### Lint (optional)

```bash
npm run lint
```

---

## Quick Start Guide

1. **Add nodes** — Click a node type in the left sidebar (Trigger, Decision, Delay, Action).
2. **Connect nodes** — Drag from an output handle (right) to an input handle (left).
3. **Configure nodes** — Click a node to open the right config panel.
4. **Validate** — Click **Validate** in the toolbar. Fix any errors shown in the modal until you see **“Workflow is valid ✓”**.
5. **Simulate** — Click **Simulate** (enabled only after successful validation). Enter test values at Decision nodes when prompted.
6. **Save** — Click **Save** to persist the workflow to `localStorage`.

---

## Features

- **Visual canvas** — Drag, connect, and configure workflow nodes with react-flow
- **Four node types** — Trigger, Decision (TRUE/FALSE branches), Delay, Action
- **Connection rules** — Invalid connections are rejected with toast feedback
- **Validation** — Structural checks including cycle detection and reachability
- **Simulation** — Step-through execution with decision prompts and animated edges
- **Persistence** — Save/load workflows via localStorage (`flowforge_workflows`)
- **Import/Export** — Download and upload workflow JSON files

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| UI | React 18, TypeScript (strict), Tailwind CSS, shadcn/ui |
| State | Redux Toolkit with custom localStorage middleware |
| Canvas | react-flow (reactflow) |
| Layout | @dagrejs/dagre auto-layout |
| Build | Vite |
| Icons | lucide-react |
| IDs | uuid |

---

## Project Structure

```
src/
  components/     # Canvas, sidebar, panels, toolbar, modals, UI primitives
  store/          # Redux slices, selectors, middleware
  hooks/          # Validation, simulation, unsaved-changes
  utils/          # Validation logic, layout, import/export
  types/          # Shared TypeScript types
```

---

## Assumptions

- **Decision simulation** uses simple string/number comparison (numeric when both operands parse as numbers)
- **Delay simulation** is capped at 3 seconds per delay node for UX, regardless of configured duration
- **No backend** — all data lives in the browser via `localStorage` only
- **Manual save** — changes are tracked as unsaved until the user clicks Save (no auto-save)
- **Single Trigger** — each workflow must have exactly one Trigger node
- **Valid connection rules** are enforced on the canvas (e.g. Trigger → Decision/Action, Decision → Action/Delay, etc.)
- **Modern browser** with JavaScript enabled (Chrome, Firefox, Edge, Safari)

---

## Known Limitations

- No real-time collaboration
- No undo/redo (future scope)
- Simulation does not execute real external actions — it visualizes the path only
- Single Trigger node per workflow is enforced by validation
- Saved workflows are browser-local — clearing site data or switching browsers loses unsaved/saved data unless exported
- Validation must be run manually before simulation is enabled; editing the canvas after validation does not auto-invalidate

---

## Design Decisions

- **Redux Toolkit** centralizes workflow, UI, and saved-workflow state with predictable updates
- **react-flow** provides battle-tested node/edge rendering, minimap, and controls
- **dagre** auto-layout keeps complex graphs readable without manual positioning
- **shadcn/ui + Radix** delivers accessible dialogs, toasts, and form controls with full styling control
- **Custom localStorage middleware** persists saved workflows without redux-persist overhead
