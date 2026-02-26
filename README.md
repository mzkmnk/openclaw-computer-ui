# openclaw-computer-ui

A small, self-hostable “Computer-like” UI and job runner architecture built on top of **OpenClaw**.

Goal: get a Perplexity Computer-style experience (task list → plan → approvals → execution → artifacts) **without** a costly subscription, by orchestrating:

- a **web UI** (`/computer`)
- an **API** (`/api/computer`)
- a **runner** (OpenClaw on the host, executing inside Docker)
- a minimal **Postgres** DB for task metadata

This repo starts with docs + an MVP skeleton.

## What this is (MVP scope)

- Create tasks from a dedicated UI
- Store tasks/events/approvals in Postgres
- Stream/attach logs and artifacts
- “Approval gate” for dangerous actions (e.g. `terraform apply`, deploy)
- Runner polls queued tasks and executes inside Docker sandbox

## What this is not

- A multi-tenant SaaS
- A billing/subscription system
- A 400+ connector platform

## Architecture (high level)

- **UI**: `/computer` (Next.js assumed, but implementation can vary)
- **API**: `/api/computer/*`
- **DB**: Postgres (docker-compose)
- **Runner**: OpenClaw (host) → Docker (`docker compose`) → AWS (AssumeRole)

See:
- `docs/spec.md` for requirements and API/DB design

## Local dev (planned)

> The following commands will work once the app skeleton is implemented.

```bash
cp .env.example .env
docker compose up -d
# open http://localhost:3000/computer
```

## Deployment model (planned)

- Dev/Stg: automatic
- Prod: manual approval gate

Runner uses **AWS AssumeRole** (no long-lived access keys).

## License

TBD (default: all rights reserved until we decide).
