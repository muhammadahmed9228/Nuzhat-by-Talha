# Nuzhat by Talha — Architecture Decision Records

This document records important architecture and technical decisions.

The purpose is to prevent the AI from repeatedly reconsidering already-approved decisions.

---

# Decision Status

Possible statuses:

- Proposed
- Accepted
- Rejected
- Superseded

---

# ADR Template

## ADR-001 — [Decision Title]

Status:

Proposed

Date:

YYYY-MM-DD

### Context

What problem or question are we solving?

### Decision

What was decided?

### Reason

Why was this decision chosen?

### Alternatives Considered

What alternatives were considered?

### Consequences

What are the positive and negative consequences?

### Related Documentation

- `docs/00-project-context.md`
- `docs/02-architecture.md`
- etc.

---

# Current Decisions

No additional architecture decisions have been finalized yet.

Important decisions should be added here as the project develops.

---

# Rules for AI Assistants

1. Do not silently override an accepted decision.
2. If a new requirement conflicts with an accepted decision, identify the conflict.
3. Explain why a decision may need to change.
4. Do not create an ADR for trivial implementation details.
5. Record decisions that materially affect:
   - database structure
   - authentication
   - authorization
   - API contracts
   - inventory
   - order lifecycle
   - image architecture
   - payment architecture
   - major folder architecture
   - external services
6. If an accepted decision is changed, mark the old decision as superseded rather than deleting history.