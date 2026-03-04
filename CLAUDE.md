# AI Agent Constraints & Rules
- NEVER execute `git push` commands.
- NEVER perform database migrations (e.g., `supabase db push`, `prisma migrate`, `alembic upgrade`, `rails db:migrate`, `sqlx migrate` etc.).
- NEVER push database migrations to remote.
- NEVER run `git commit` without explicit user request.
- If database changes, code pushes, or function deployments are required, provide me with the exact commands in the chat so I can review and execute them manually.
- Always ask for explicit user confirmation before executing any terminal command that modifies the project state or remote resources (e.g., `pnpm install`, `pod install`, `expo prebuild`).

## Package Manager
- Always use `pnpm` for installing and managing dependencies. Never use `npm`, `yarn`, or `bun`.

## Dev Workflow
- Start: `pnpm start`
- iOS: `pnpm ios`
- Android: `pnpm android`
- Lint: `pnpm lint` (uses Biome)
- Type check: `pnpm check-types`
- FSD architecture check: `pnpm steiger`

## Code Conventions
- Follow feature-sliced design: `/entities`, `/widgets`, `/features`, `/app`, `/shared`
- Use Jotai atoms for state — no `useState` for shared state
- All user-facing strings must use i18next (`t('key')`)
- TypeScript strict mode — no `any`, no `// @ts-ignore`
- Linter/formatter is **Biome** — no ESLint, no Prettier

## Commit Message Format
- Follow Conventional Commits (`@commitlint/config-conventional`)
- Format: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`
- Example: `feat(chat): add message reactions`

## AI Behavior Rules
- Never leave `console.log` debug statements in code
- Never add placeholder or TODO code — implement fully or ask
- Do not add comments unless the logic is non-obvious
- Do not refactor code outside the scope of the requested task
- Always read a file before editing it

## Testing
- Run `pnpm check-types` after changes to verify types
- Run `pnpm lint` after changes to verify no lint errors
- Do not mark a task complete if type errors or lint errors exist