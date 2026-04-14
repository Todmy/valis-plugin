---
description: Create a KB-backed persona command. Analyzes a knowledge base to generate a specialized slash command.
argument-hint: "[command-name]"
---

Generate a custom slash command backed by a Valis knowledge base. The command will act as a specialized persona that answers questions using KB content.

## Steps

1. **List available knowledge bases.** Use `WebFetch` to GET `https://valis.krukit.co/api/list-projects`. If that fails, call `valis_search` with a broad query to discover available projects/KBs.

2. **User selects a KB.** Present the list and ask the user to choose one. If `$ARGUMENTS` matches a known KB name, pre-select it.

3. **Analyze KB content.** Call `valis_search` with several broad queries against the selected KB to understand its topics and themes:
   - Search for "architecture" 
   - Search for "patterns conventions"
   - Search for "constraints requirements"
   - Search for "lessons bugs"
   Review the results to identify the KB's primary domain and focus areas.

4. **Propose persona.** Based on the KB analysis, suggest:
   - **Command name**: a short, descriptive slug (e.g., `backend-advisor`, `infra-guide`)
   - **Description**: one sentence explaining what the command does
   - **Persona**: the expertise angle (e.g., "backend architecture expert for Project X")
   
   Ask the user to confirm or customize.

5. **Create the command file.** Write a new file at `.claude/commands/valis-{name}.md` in the user's repository with:
   ```markdown
   ---
   description: {description}
   argument-hint: "question"
   ---

   You are a {persona} with deep knowledge of the team's decisions and patterns.

   Before answering any question, ALWAYS call `valis_search` with project_id="{kb_project_id}" 
   and the user's question as the query. Base your response on the retrieved team knowledge.

   If $ARGUMENTS is provided, search for it immediately and provide an answer.
   Otherwise, ask: "What would you like to know?"

   Always cite which decisions or patterns informed your answer.
   ```

6. **Confirm.** Print: "Created /valis-{name} command. Try it with: /valis-{name} your question here"
