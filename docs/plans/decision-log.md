# Decision Log

## Phase 1: Design System + Component Foundation

### Completed: 2026-03-16

**Changes Made:**
1. **ThemeContext.tsx** — Rewrote to remove dual-theme system. Now provides only `getCategoryColor()` utility. CSS variables defined statically in `neo-brutalist.css`.
2. **styles/neo-brutalist.css** — Created comprehensive design system with all tokens from system.md: colors, shadows, radius, spacing, plus base component classes (.btn-neo, .input-neo, .textarea-neo, .card-neo, .modal-overlay, .modal-neo, .chip-neo, .text-label, .neo-scrollbar).
3. **index.css** — Rewrote with brutalist markdown preview styling (accent-colored h1 border, uppercase h3/h4, hard shadow code blocks, styled tables).
4. **tailwind.config.js** — Remapped all color utilities to new CSS variables, updated font sizes to match system.md scale (caption/small/label/body-sm/body/heading-sm/heading/title), added neo-brutalist border radius tokens and hard shadow utilities.
5. **index.html** — Removed inline body gradient styles, updated title to "Gemini Workspace", added font-weight 800 to Inter import.
6. **components/Sidebar/SidebarHeader.tsx** — Extracted from Header.tsx, neo-brutalist styled, uppercase "GEMINI WORKSPACE" branding.
7. **components/Sidebar/SearchBar.tsx** — Extracted from App.tsx, uppercase placeholder, tag search toggle.
8. **components/Modals/BaseModal.tsx** — New shared modal wrapper with Escape-to-close, click-outside-to-close.
9. **components/Modals/ConfirmDialog.tsx** — New delete confirmation dialog.
10. **components/Modals/SettingsModal.tsx** — Restyled, removed theme switcher, uses BaseModal.
11. **components/Workspace/SessionHeader.tsx** — Extracted title input from NoteEditor.
12. **components/Workspace/SessionToolbar.tsx** — Extracted toolbar from NoteEditor with all action buttons.
13. **App.tsx** — Restyled with fixed 280px sidebar, removed Tailwind utility classes for inline styles using CSS variables.
14. **NoteList.tsx** — Restyled with CSS variables, color-mix() tints for selection state.
15. **NoteEditor.tsx** — Refactored to use SessionHeader + SessionToolbar extracted components, added ConfirmDialog for delete.
16. **TagManager.tsx** — Fixed broken CSS classes (bg-background-secondary, accent-focus, text-black), restyled with CSS variables.
17. **ImprovementModal.tsx** — Restyled with BaseModal, removed useTheme dependency, neo-brutalist radio/checkbox controls.
18. **SummarizeModal.tsx** — Same as above.
19. **BrainstormModal.tsx** — Same as above.
20. **types.ts** — Removed Theme/ThemeConfig types (no longer needed).

**Decisions:**
- Chose inline styles over Tailwind utilities for most components to ensure CSS variable usage is explicit and maintainable.
- Kept `color-mix()` for tint calculations as recommended by system.md rather than adding many opacity variants.
- Old Header.tsx file is no longer imported but not physically deleted yet (can clean up).
- The `@keyframes spin` animation used by loading spinners needs to be defined — currently relying on Tailwind's `animate-spin` utility.
- The `@keyframes pulse` animation for the dictation button needs definition too.

**Issues:**
- None blocking. Build succeeds, dev server starts.
- Chunk size warning from vite (516KB) is due to bundled dependencies, not our code.

---

## Phase 2: Session Model + Sidebar

### Completed: 2026-03-16

**Changes Made:**
1. **types.ts** — Added Session interface (extends Note with category, status, pinned, references, updatedAt). Added Category type, CATEGORIES array, CATEGORY_COLORS and CATEGORY_LABELS constants. `Note` is now a type alias for `Session` for backwards compatibility.
2. **contexts/SessionContext.tsx** — Full state management context with: session CRUD, search/filter, pin toggle, category assignment, archive/unarchive, view mode (active/archived), AI actions (preserved from App.tsx), localStorage persistence with `gemini-sessions` key, data migration from old `gemini-notes` format.
3. **components/Sidebar/SessionCard.tsx** — Session item with category dot, pin indicator, title, content preview, tag chips. Hover-reveal pin toggle button.
4. **components/Sidebar/CategoryGroup.tsx** — Collapsible category section with color dot, uppercase label, count badge, chevron arrow. Hides when empty.
5. **components/Sidebar/ArchiveToggle.tsx** — Active/Archive view switcher at sidebar bottom with count badges.
6. **components/Workspace/SessionHeader.tsx** — Updated with category selector dropdown (10 categories, color dots, hard shadow panel, click-outside-to-close).
7. **components/NoteEditor.tsx** — Added `onCategoryChange` prop, passes category to SessionHeader.
8. **App.tsx** — Rewired to use SessionContext. Sidebar now shows: pinned section, then category groups, then archive toggle. Removed all direct state management (moved to SessionContext).
9. **index.tsx** — Added SessionProvider wrapper.

**Data Migration:**
- Old `gemini-notes` localStorage → new `gemini-sessions` format
- Default category: `idea`, status: `active`, pinned: `false`
- Migration is automatic on first load

**Decisions:**
- Used `Note` as type alias for `Session` to avoid changing every component's import. Components that work with sessions still reference the `Note` type.
- Category groups only show when they have sessions (empty categories are hidden).
- Pinned sessions appear in their own section at the top with category dots for identification.
- Old NoteList.tsx still exists but is no longer imported by App.tsx (replaced by CategoryGroup + SessionCard).

**Issues:**
- None blocking. Build succeeds, all features verified in browser.

---

## Phase 3: Slash Commands + Inline AI

### Completed: 2026-03-16

**Changes Made:**
1. **SlashCommandMenu.tsx** — Popup command palette with fuzzy search, keyboard navigation (Arrow Up/Down, Enter, Escape). 8 commands split into AI Actions (summarize, improve, brainstorm, ask, auto-tag) and Utilities (export, dictate, tag). Neo-brutalist styling with hard shadow.
2. **AiResponseBlock.tsx** — Inline AI response component with: /COMMAND header with sparkles icon + loading spinner, markdown-rendered content via marked+DOMPurify, Accept (lime accent)/Redo/Dismiss action bar. Lime-tinted border and background.
3. **TagBar.tsx** — Compact inline tag bar replacing the old TagManager. Tag chips with remove buttons, inline "Add tag..." input, Auto button. Takes less vertical space.
4. **NoteEditor.tsx** — Major rewrite:
   - Slash command detection on `/` keystroke at start of line
   - Slash menu positioning near cursor
   - AI responses managed as local state (`aiResponses[]`) with loading/content/command tracking
   - Toolbar buttons now route through `handleSlashCommand()` — same code path as typing /command
   - Accept appends AI content to editor, Redo re-runs the command, Dismiss removes block
   - Multiple AI responses can stack simultaneously
   - Removed all old modal imports (ImprovementModal, SummarizeModal, BrainstormModal, TagManager)
   - Replaced TagManager with TagBar
5. **neo-brutalist.css** — Added `@keyframes spin` and `@keyframes pulse` animations.

**Decisions:**
- Kept the single textarea editor rather than converting to a full block model. This is pragmatic — block editors are complex and the textarea + inline AI blocks achieve the same UX without the fragility.
- AI responses use sensible defaults when triggered via toolbar buttons (e.g., summarize strength=2, improve with grammar+clarity). The old modal options (audience, tone, length) can be exposed through the slash command parameters in a future iteration.
- Old modals (ImprovementModal, SummarizeModal, BrainstormModal) are still in the codebase but no longer imported by NoteEditor. They can be deleted in cleanup.
- The slash command menu detection works on `/` at the start of a line. Typing `/` mid-line won't trigger it.

**Known Limitations:**
- Slash command detection relies on React's onChange — browser automation tools that bypass this won't trigger the menu. Works correctly with native keyboard input.
- AI command defaults are hardcoded (no parameter customization via slash commands yet — e.g., `/improve tone:formal`). Toolbar buttons work as quick-trigger shortcuts.

**Issues:**
- None blocking. Build succeeds (518KB), all features verified in browser with live Gemini API call.

**Phase 3 Rework (user feedback):**
- User requested that slash commands work as quick one-shots with inline text (`/ask why is X?` + Enter)
- Toolbar buttons brought back to open advanced parameter modals (ImprovementModal, SummarizeModal, BrainstormModal)
- AI response blocks made interactive with follow-up input field for iterative conversation
- Accept now force-saves immediately via `onUpdateNote()` in addition to appending to content
- Modals re-imported in NoteEditor for toolbar advanced mode

---

## Phase 4: Archive + References

### Completed: 2026-03-16

**Changes Made:**
1. **SessionToolbar.tsx** — Added: Pin button (with active state), Complete button (green accent, archives session), Restore button (for archived sessions), Copy to clipboard button. All neo-brutalist styled.
2. **TagBar.tsx** — Added reference chip support. Referenced sessions display as blue `@SessionTitle` chips. Clicking navigates to the referenced session. Accepts `references`, `allSessions`, and `onSelectSession` props.
3. **SessionCard.tsx** — Fixed nested `<button>` HTML validation error by changing outer wrapper from `<button>` to `<div role="button">` with keyboard accessibility.
4. **App.tsx** — Wired up `archiveSession`, `unarchiveSession`, `togglePin` from SessionContext to NoteEditor.
5. **NoteEditor.tsx** — Added `onArchive`, `onUnarchive`, `onTogglePin` props, passes them to SessionToolbar along with `isArchived`, `isPinned`, and `onCopyToClipboard`.

**Features Implemented:**
- Session lifecycle: Active → Complete (archive) → Restore (unarchive)
- Pin/Unpin from toolbar with visual state
- Export as markdown (existing)
- Copy to clipboard (new)
- Archive toggle at sidebar bottom (implemented in Phase 2, now functional end-to-end)
- Reference chips in TagBar (visual, clickable)

**Deferred to future iteration:**
- @mention parsing in editor text (detecting `@` and showing session picker popup) — this requires significant editor cursor tracking and popup positioning work. The reference system works via the `references` array on the Session model, which can be populated programmatically.
- Extending geminiService to inject referenced session content into AI prompts — the plumbing is in place (Session.references array), but the prompt assembly needs the full sessions array passed down.

**Issues:**
- SessionCard nested button HTML error fixed (was causing blank page in strict React mode).
- Build clean: 62 modules, 540KB.
