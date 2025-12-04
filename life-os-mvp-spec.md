# Life OS — MVP Specification

## Overview

**Life OS** is a personal knowledge and prompt orchestration hub that helps users organize their life across major categories. It's tool-agnostic—rather than building another AI chat interface, it generates smart prompts that users copy into their preferred LLM (Claude, ChatGPT, Grok, etc.) and stores the synthesized outputs.

**Core Philosophy:**
- No API integrations, no subscriptions—use your existing LLM subscriptions in their native interfaces
- Local-first storage (localStorage for MVP)
- Mobile-first, clean, utilitarian design
- Focus on action: the app exists to help users *improve* their finances, health, habits—not just take notes

---

## Technical Stack

- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS
- **Storage:** localStorage (no backend for MVP)
- **Build:** Vite
- **No authentication required**

---

## Information Architecture

### Hierarchy
```
Category (top-level folder)
  └── Subcategory (subfolder)
        └── Entries (text content)
```

Two levels maximum. Simple and flat.

### Default Categories & Subcategories

**MVP ships with 3 polished categories** (others can be added by user):

#### 1. Health
- Exercise (strength, cardio, mobility)
- Nutrition (diet, meal planning, supplements)
- Sleep
- Mental Health (stress, mindfulness, therapy notes)

#### 2. Finance
- Budget & Spending
- Savings & Investments
- Debt
- Income & Career

#### 3. Personal Growth
- Reading & Learning
- Goals & Habits
- Relationships
- Projects & Hobbies

Users can:
- Add new categories
- Add new subcategories within any category
- Rename or delete categories/subcategories
- Reorder via drag-and-drop (nice-to-have for MVP)

---

## Entry Structure

Each entry is a simple text document with minimal metadata:

```typescript
interface Entry {
  id: string;
  title: string;
  content: string;
  subcategoryId: string;
  createdAt: Date;
  updatedAt: Date;
  label: EntryLabel;
}

type EntryLabel = 
  | 'note'           // User's own notes
  | 'synthesis'      // Gems from LLM conversations
  | 'plan'           // Action plans, routines, programs
  | 'assessment'     // Evaluations, current state analysis
```

Labels help users distinguish entry types at a glance without overcomplicating the system.

---

## Prompt System

### Prompt Types (per subcategory)

Each subcategory has 3 core prompt templates:

1. **Evaluation Prompt** — Assess current state
   - "Help me evaluate my current [area]..."
   - Includes context from recent entries

2. **Planning Prompt** — Create actionable plans
   - "Help me create a [plan/routine/strategy] for [area]..."
   - Includes relevant context + constraints

3. **Synthesis Prompt** — Extract gems from conversations
   - Generic, works across all categories
   - "Summarize the key insights, decisions, and action items from our conversation. Format as concise bullet points I can save for future reference."

### Context Injection

When generating a prompt:
- **Default behavior:** Automatically includes the 3 most recent entries from the current subcategory
- **Manual override:** User can toggle off auto-include or select specific entries
- **Format:** Context is clearly labeled in the prompt (e.g., "Here's my current context: [entries]")

### Prompt Examples

#### Health → Nutrition → Evaluation Prompt
```
I want you to help me evaluate my current nutrition and eating habits.

Here's my current context:
---
[Auto-injected: Recent entries from Nutrition subcategory]
---

Please analyze:
1. What's working well in my current approach?
2. What gaps or areas of concern do you see?
3. What questions should I be asking myself?

Be direct and specific. Ask me clarifying questions if needed before giving your assessment.
```

#### Health → Nutrition → Planning Prompt
```
I want you to help me create a practical nutrition plan.

Here's my current context:
---
[Auto-injected: Recent entries from Nutrition subcategory]
---

Please help me design a plan that:
1. Fits my lifestyle and preferences
2. Is sustainable (not overly restrictive)
3. Has clear, actionable guidelines

Start by asking me about my goals, restrictions, preferences, and typical schedule before creating the plan.
```

#### Universal Synthesis Prompt
```
Let's wrap up this conversation. Please provide a synthesis that includes:

1. **Key Insights** — The most important things we discussed or discovered
2. **Decisions Made** — Any conclusions or choices I've landed on
3. **Action Items** — Specific next steps with clear outcomes
4. **Open Questions** — Anything still unresolved to revisit later

Keep it concise and scannable. I'll be saving this for future reference.
```

---

## User Flows

### Flow 1: Browse & Navigate
1. Open app → See home view (folder grid or list)
2. Tap category → See subcategories
3. Tap subcategory → See list of entries + prompt buttons
4. Tap entry → Read/edit content

### Flow 2: Generate & Use Prompt
1. Navigate to subcategory (e.g., Health → Nutrition)
2. Tap "Evaluate" / "Plan" / "Synthesize" button
3. See generated prompt with auto-injected context
4. (Optional) Toggle context entries on/off
5. Tap "Copy" → Prompt copied to clipboard
6. Paste into Claude/ChatGPT/etc.

### Flow 3: Save Synthesis
1. After LLM conversation, use synthesis prompt
2. Copy LLM's synthesis response
3. Return to Life OS
4. Tap "Quick Add" or navigate to subcategory
5. Paste content, add title, select label (synthesis)
6. Save

### Flow 4: Quick Capture
1. From any screen, tap floating "+" button
2. Enter title + content
3. Select category → subcategory
4. Select label
5. Save (or "Save & File Later" to inbox for organization)

---

## UI/UX Specifications

### Design Direction

**Aesthetic:** Clean, utilitarian, intentional. Think: premium productivity tool meets file manager. Not playful, not corporate—*focused*.

**Visual Language:**
- Monochromatic base (near-black or warm gray) with a single accent color
- Generous whitespace
- Folder/file iconography that feels tactile but modern
- Subtle depth through shadows, not gradients
- Typography: One distinctive sans-serif (not Inter/Roboto)

**Mobile-First Layout:**
- Bottom navigation for primary actions
- Thumb-friendly tap targets (min 44px)
- Swipe gestures for common actions (swipe to delete, etc.)

### Key Screens

#### 1. Home (Folder View)
- Grid of category "folders" with icons
- Toggle button: Grid ↔ List view
- Each folder shows: Name, icon, entry count
- Floating "+" button for quick capture

#### 2. Home (List View)
- Vertical list of categories
- Expandable to show subcategories inline
- Same toggle to switch back to grid

#### 3. Category View
- Header with category name + back button
- Grid or list of subcategories
- Each subcategory shows: Name, entry count

#### 4. Subcategory View
- Header with subcategory name + breadcrumb
- **Prompt Bar:** 3 buttons (Evaluate, Plan, Synthesize)
- Entry list below, sorted by most recent
- Each entry shows: Title, label badge, date
- Tap to open, swipe to delete

#### 5. Entry View
- Full-screen editor
- Title field (large)
- Label selector (chips: Note, Synthesis, Plan, Assessment)
- Content area (markdown support nice-to-have)
- Save / Delete buttons

#### 6. Prompt Preview Modal
- Shows generated prompt with context
- Checkboxes to toggle which entries are included
- "Copy to Clipboard" button (prominent)
- "Edit Prompt" option (collapses into editable text)

#### 7. Quick Capture Modal/Sheet
- Slides up from bottom
- Title input
- Content textarea
- Category → Subcategory picker
- Label selector
- Save button

#### 8. Onboarding (First Launch)
- Brief 3-step explanation:
  1. "This is your Life OS — organize what matters"
  2. "Generate smart prompts, use them in any AI"
  3. "Save the gems, build your knowledge base"
- Option to start with defaults or blank slate

---

## Smart Features

### Auto-Organization for Quick Capture
When using Quick Capture without selecting a category:
- Entry goes to "Inbox" (uncategorized)
- App suggests a category based on content keywords (lightweight, no LLM needed—just keyword matching)
- User confirms or changes before filing
- Inbox badge shows unfiled count

### Recent Activity
- Home screen can optionally show "Recent" section
- Last 5 entries across all categories
- Quick access to continue where you left off

### Search
- Global search across all entries
- Filters: by category, by label, by date range
- Results show entry preview with highlighted match

---

## Data Model

```typescript
interface Category {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  order: number;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  order: number;
  promptTemplates: PromptTemplates;
}

interface PromptTemplates {
  evaluation: string;
  planning: string;
  synthesis: string; // usually the universal one
}

interface Entry {
  id: string;
  title: string;
  content: string;
  subcategoryId: string | null; // null = inbox
  label: 'note' | 'synthesis' | 'plan' | 'assessment';
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

interface AppState {
  categories: Category[];
  entries: Entry[];
  settings: {
    viewMode: 'grid' | 'list';
    theme: 'light' | 'dark' | 'system';
  };
}
```

All data stored in localStorage as JSON.

---

## MVP Scope Boundaries

### In Scope (Build This)
- [x] Category/subcategory folder structure
- [x] CRUD for categories, subcategories, entries
- [x] Grid and list view toggle
- [x] 3 default categories with subcategories and prompt templates
- [x] Prompt generation with context injection
- [x] Copy-to-clipboard functionality
- [x] Quick capture with category filing
- [x] Entry labels (note, synthesis, plan, assessment)
- [x] Local storage persistence
- [x] Mobile-first responsive design
- [x] Basic search
- [x] Onboarding flow

### Out of Scope (Later)
- [ ] Cloud sync / authentication
- [ ] LLM API integration
- [ ] Markdown rendering
- [ ] Tags beyond labels
- [ ] Drag-and-drop reordering
- [ ] Export/import data
- [ ] Native iOS app
- [ ] Collaboration features
- [ ] Advanced analytics/insights

---

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── folders/
│   │   ├── CategoryCard.tsx
│   │   ├── SubcategoryCard.tsx
│   │   ├── FolderGrid.tsx
│   │   └── FolderList.tsx
│   ├── entries/
│   │   ├── EntryCard.tsx
│   │   ├── EntryList.tsx
│   │   ├── EntryEditor.tsx
│   │   └── LabelBadge.tsx
│   ├── prompts/
│   │   ├── PromptBar.tsx
│   │   ├── PromptPreview.tsx
│   │   └── ContextSelector.tsx
│   ├── capture/
│   │   ├── QuickCaptureButton.tsx
│   │   └── QuickCaptureModal.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── SearchBar.tsx
├── pages/
│   ├── Home.tsx
│   ├── Category.tsx
│   ├── Subcategory.tsx
│   ├── Entry.tsx
│   └── Onboarding.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useCategories.ts
│   ├── useEntries.ts
│   └── usePrompts.ts
├── utils/
│   ├── storage.ts
│   ├── prompts.ts
│   ├── search.ts
│   └── defaults.ts (default categories + prompts)
├── types/
│   └── index.ts
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

---

## Default Prompt Templates

### Health → Exercise

**Evaluation:**
```
I want you to help me evaluate my current exercise routine and fitness level.

Here's my current context:
---
{{CONTEXT}}
---

Please analyze:
1. Is my current routine balanced (strength, cardio, mobility, recovery)?
2. Am I progressing toward my goals, or have I plateaued?
3. What signs of overtraining or undertraining do you see?
4. What's missing that could make a big difference?

Ask me clarifying questions about my goals, schedule, and how I'm feeling before giving your assessment.
```

**Planning:**
```
I want you to help me create or refine my exercise routine.

Here's my current context:
---
{{CONTEXT}}
---

Please help me design a routine that:
1. Aligns with my specific goals
2. Fits my available time and equipment
3. Balances intensity with recovery
4. Is sustainable long-term

Start by asking about my goals, experience level, schedule, equipment access, and any injuries or limitations.
```

### Health → Nutrition

**Evaluation:**
```
I want you to evaluate my current nutrition and eating habits.

Here's my current context:
---
{{CONTEXT}}
---

Please analyze:
1. What's working well in my current approach?
2. What nutritional gaps or concerns do you notice?
3. How well does my eating support my goals?
4. What habits might be holding me back?

Ask me about my goals, typical eating patterns, restrictions, and how I feel day-to-day before assessing.
```

**Planning:**
```
I want you to help me create a practical nutrition approach.

Here's my current context:
---
{{CONTEXT}}
---

Please help me design a plan that:
1. Supports my specific goals
2. Works with my food preferences and restrictions
3. Is realistic for my lifestyle and schedule
4. Doesn't require obsessive tracking

Start by asking about my goals, preferences, restrictions, cooking ability, and typical schedule.
```

### Finance → Budget & Spending

**Evaluation:**
```
I want you to help me evaluate my current financial situation and spending habits.

Here's my current context:
---
{{CONTEXT}}
---

Please analyze:
1. How healthy is my overall financial picture?
2. Where is money leaking unnecessarily?
3. Am I on track for my financial goals?
4. What risks or vulnerabilities do you see?

Ask me about my income, major expenses, goals, and concerns before giving your assessment.
```

**Planning:**
```
I want you to help me create a practical budget or spending plan.

Here's my current context:
---
{{CONTEXT}}
---

Please help me design a plan that:
1. Aligns with my actual priorities
2. Is realistic (not overly restrictive)
3. Builds toward my goals
4. Has clear guardrails without micromanaging every dollar

Start by asking about my income, fixed expenses, goals, and what financial security means to me.
```

### Universal Synthesis (all subcategories)
```
Let's wrap up this conversation. Please provide a clear synthesis:

**Key Insights**
- The most important things we discussed or I learned

**Decisions Made**
- Any conclusions or choices I've landed on

**Action Items**
- Specific next steps (be concrete)

**Open Questions**
- Anything unresolved to revisit later

Keep it concise and actionable. I'll save this for future reference.
```

---

## Implementation Notes

1. **Start with data layer** — Get localStorage working with the full data model first
2. **Build folder navigation** — Home → Category → Subcategory flow
3. **Add entry CRUD** — Create, read, update, delete entries
4. **Implement prompts** — Template system with context injection
5. **Add quick capture** — Floating button + modal
6. **Polish UI** — Animations, transitions, empty states
7. **Onboarding** — First-run experience

---

## Success Criteria

The MVP is successful if:
1. A user can navigate to any subcategory in 2 taps
2. Generating and copying a prompt takes under 5 seconds
3. Saving a synthesis from an external LLM takes under 10 seconds
4. Data persists across browser sessions
5. The app feels fast and responsive on mobile
6. The UI is clean enough that users aren't distracted from the *action* (improving their life)

---

*End of specification.*
