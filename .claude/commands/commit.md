# /commit

Pre-commit checklist:
1. Run `pnpm typecheck` — must be zero errors
2. If schema/socket/component/hook changed — update `knowledge_graph.md`
3. Stage only related files
4. Commit message format: `type(scope): description`
