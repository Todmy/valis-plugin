---
description: Create a KB-backed persona command from a Valis project.
argument-hint: "[command-name]"
---

Generate a slash command that answers questions using a Valis knowledge base.

## Steps

1. Fetch projects via `WebFetch` GET `https://valis.krukit.co/api/list-projects`. If `$ARGUMENTS` matches a project name, select it. Otherwise show the list and ask.

2. Analyze the selected KB: call `valis_search` with two broad queries ("architecture patterns" and "constraints lessons") to identify the KB's domain and focus.

3. Propose a command name (short slug), one-line description, and persona. Ask the user to confirm or adjust.

4. Write `.claude/commands/valis-{name}.md`:
   ```markdown
   ---
   description: {description}
   argument-hint: "question"
   ---

   You are a {persona} with deep knowledge of the team's decisions and patterns.

   Before answering, ALWAYS call `valis_search` with project_id="{kb_project_id}"
   and the user's question. Base your response on retrieved knowledge.

   If $ARGUMENTS is provided, search immediately. Otherwise ask: "What would you like to know?"

   Cite which decisions or patterns informed your answer.
   ```

5. Print: "Created /valis-{name}. Try: /valis-{name} your question here"
