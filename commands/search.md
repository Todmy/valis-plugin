---
description: Search team knowledge base for existing decisions, patterns, and constraints.
argument-hint: "search query"
---

Search the Valis knowledge base for decisions, patterns, constraints, and lessons.

## Steps

1. **Get query.** Use `$ARGUMENTS` as the search query. If empty, ask: "What are you looking for?"

2. **Search.** Call `valis_search` with the query text.

3. **Display results.** For each result, show:
   ```
   [{type}] {summary}
   Status: {status}  |  Score: {relevance_score}
   {description snippet, first 200 chars}
   ---
   ```

4. **Handle empty results.** If no results are found:
   - Suggest broadening the query with different terms
   - Offer alternative search angles (e.g., "Try searching for the technology name, module, or problem domain instead")

5. **Offer follow-up.** After displaying results, mention: "Use /valis:store to add a new decision, or refine your search with different terms."
