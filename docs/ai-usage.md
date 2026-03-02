# AI to use

## Use Cases on each models

Here is the breakdown of the best models for each specific development workflow:

### 🧠 The "Deep Thinkers" (Complex Logic & Architecture)

Use these when you're designing a database schema for **Supabase** or untangling a complex **Zustand** state management issue.

- **Claude Opus 4.6:** Currently the gold standard for reasoning. It has an "Adaptive Thinking" mode that makes it much less prone to the "laziness" seen in older models. If you have a massive bug that spans three different files, this is the one to pick.
- **GPT-5.3-Codex:** OpenAI’s latest specialized agentic model. It’s better than standard GPT-5 at "agentic" tasks—meaning it can actually "think" through terminal commands and multi-step deployment pipelines.

### 🛠️ The "Workhorses" (UI/UX & Frontend Speed)

Use these for building out **Tailwind** layouts or **Shadcn/UI** components in your Next.js projects.

- **Claude Sonnet 4.6:** This is the "sweet spot." It’s significantly faster than Opus but hits nearly the same benchmarks for coding. It is famously good at "vibe coding"—getting the CSS and UI layouts right on the first try.
- **Gemini 3 Flash (Preview):** The speed king. Use this for quick unit tests or explaining a specific snippet of code. Since it's usually the cheapest (or "0x" in some IDEs), it’s perfect for high-volume, simple tasks.

### 📁 The "Context Kings" (Big Repos & Refactoring)

Use these when you need the AI to "read" your entire project folder.

- **Gemini 3.1 Pro:** With its **1-million-token context window**, it can literally ingest your entire project and all its documentation. It leads in "abstract reasoning" (ARC-AGI-2), making it great for refactoring a whole module at once.
- **Raptor mini (Preview):** This is a specialized, fine-tuned model (likely based on GPT-5 mini) optimized specifically for **VS Code**. It’s surprisingly good at multi-file edits (e.g., "Change the API endpoint variable across the entire project").

### 📊 Quick Comparison Table

| Model                 | Best For...          | Key Strength                                        |
| --------------------- | -------------------- | --------------------------------------------------- |
| **Claude Opus 4.6**   | Logic & Architecture | Highest "IQ" and best instruction following.        |
| **Claude Sonnet 4.6** | Frontend & Speed     | Best price-to-performance; great UI sense.          |
| **Gemini 3.1 Pro**    | Large Codebases      | Massive 1M context; best for "reading" whole repos. |
| **GPT-5.3-Codex**     | Terminal & Agents    | Best at running commands and autonomous tasks.      |
| **Raptor mini**       | Inline Edits         | Fast, free/unlimited, and built for VS Code.        |

> **Pro-Tip for Salarium:** If you're working on the payroll formulas or technician split logic, stick with **Claude Opus 4.6**. For the dashboard UI and Tailwind styling, **Claude Sonnet 4.6** or **Gemini 3.1 Pro** will get you there faster.

**Would you like me to help you write a prompt for one of these models to refactor a specific part of your Salarium dashboard?**
