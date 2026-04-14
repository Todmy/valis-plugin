---
description: Search team knowledge base for decisions, patterns, and constraints.
argument-hint: "search query"
---

Search the Valis knowledge base.

## Steps

1. Use `$ARGUMENTS` as the query. If empty, ask: "What are you looking for?"

2. Call `valis_search` with the query.

3. For each result show:
   ```
   [{type}] {summary}
   Score: {relevance_score}
   {description, first 200 chars}
   ---
   ```

4. If no results: suggest broader terms or different search angles (technology name, module, problem domain).
