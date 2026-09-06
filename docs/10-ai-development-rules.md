# AI Development Rules

## Before Coding

Always:

1. Read `docs/00-project-context.md`.
2. Read the relevant documentation.
3. Inspect the existing code.
4. Understand existing architecture before modifying it.

---

## Task Scope

Implement only the requested task.

Do not:

- implement unrelated features
- refactor unrelated files
- change architecture unnecessarily
- install unnecessary packages
- create duplicate functionality

---

## Before Large Changes

Explain:

1. What you understand
2. Files you will modify
3. Files you will create
4. Database impact
5. API impact
6. Security impact
7. Testing approach

---

## During Coding

Follow existing conventions.

Prefer:

- simple code
- feature-based organization
- separation of concerns
- reusable services
- backend validation
- consistent error handling

Avoid:

- premature abstraction
- giant files
- duplicate business logic
- unnecessary dependencies
- over-engineering

---

## After Coding

Report:

- Files created
- Files changed
- What was implemented
- Tests performed
- Known issues
- Assumptions
- Documentation requiring updates

---

## Conflict Handling

If requirements conflict with:

- existing code
- architecture
- database design
- API contracts
- security rules

do not silently choose a solution.

Explain the conflict first.

---

## Source of Truth

The project documentation and accepted Architecture Decision Records are the source of truth.

Do not invent requirements.