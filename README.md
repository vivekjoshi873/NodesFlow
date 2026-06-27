# FlowForge — Visual Workflow Builder

FlowForge is a production-quality visual workflow builder built as a single-page React application. Design automation flows with triggers, decisions, delays, and actions on an interactive canvas — then validate, simulate, save, and export your workflows locally.

## Setup

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Features

- **Visual canvas** — Drag, connect, and configure workflow nodes with react-flow
- **Four node types** — Trigger, Decision (TRUE/FALSE branches), Delay, Action
- **Connection rules** — Invalid connections are rejected with toast feedback
- **Validation** — Structural checks including cycle detection and reachability
- **Simulation** — Step-through execution with decision prompts and animated edges
- **Persistence** — Save/load workflows via localStorage (`flowforge_workflows`)
- **Import/Export** — Download and upload workflow JSON files

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

## Project Structure

```
src/
  components/     # Canvas, sidebar, panels, toolbar, modals, UI primitives
  store/          # Redux slices, selectors, middleware
  hooks/          # Validation, simulation, unsaved-changes
  utils/          # Validation logic, layout, import/export
  types/          # Shared TypeScript types
```

## Assumptions

- **Decision simulation** uses simple string/number comparison (numeric when both operands parse as numbers)
- **Delay simulation** is capped at 3 seconds per delay node for UX, regardless of configured duration
- **No backend** — all data lives in the browser via localStorage
- **Manual save** — changes are tracked as unsaved until the user clicks Save

## Known Limitations

- No real-time collaboration
- No undo/redo (planned for future scope)
- Simulation does not execute real external actions — it visualizes the path only
- Single Trigger node per workflow is enforced by validation

## Design Decisions

- **Redux Toolkit** centralizes workflow, UI, and saved-workflow state with predictable updates
- **react-flow** provides battle-tested node/edge rendering, minimap, and controls
- **dagre** auto-layout keeps complex graphs readable without manual positioning
- **shadcn/ui + Radix** delivers accessible dialogs, toasts, and form controls with full styling control
- **Custom localStorage middleware** persists saved workflows without redux-persist overhead
