# Spec: OpenClaw Computer-like UI (single-user)

## 0. Goals

Build a small “Computer-like” experience:

- A dedicated UI to create tasks and watch progress
- A simple orchestration layer that routes work to “cheap vs deep vs coder” workers (implemented as runner policies)
- Execution happens in a Docker sandbox on the host (runner controlled by OpenClaw)
- AWS deploy is supported with **AssumeRole** and an **approval gate**

Non-goals:

- Multi-tenant SaaS, subscriptions, or complex billing
- Huge connector ecosystem

## 1. User model

- Single-user (the repo owner)
- Auth can be simple (optional password, or behind VPN, or Cloudflare Access)
- Audit trail still recorded for approvals/actions

## 2. Core entities

### Task
A user-submitted intent.

Fields (conceptual):

- `id` (uuid)
- `title` (optional)
- `prompt` (string)
- `mode` (enum): `auto | cheap | deep | coder`
- `status` (enum): `queued | planning | running | needs_approval | succeeded | failed | cancelled`
- `created_at`, `updated_at`
- `runner_hint` (json, optional): project path, repo URL, environment, etc.

### TaskEvent
Append-only event log.

- `id` (uuid)
- `task_id`
- `ts`
- `type` (enum): `status | log | plan | step | artifact | error | cost_estimate`
- `payload` (json)

### Approval
For dangerous operations.

- `id` (uuid)
- `task_id`
- `action` (enum): `terraform_apply | deploy_stg | deploy_prod | run_migrations | other`
- `status` (enum): `requested | approved | rejected`
- `requested_at`, `resolved_at`
- `note` (string, optional)

## 3. Approval gates

Rules:

- Runner may perform read-only actions automatically (build/test/plan)
- Runner must stop at gates and request approval for:
  - `terraform apply`
  - deploying to prod
  - DB migrations
  - any action not on an allowlist

UI shows:

- summary of the requested action
- plan diff/impact summary
- rollback note
- Approve / Reject buttons

## 4. Runner model (OpenClaw)

### Responsibilities

- Poll queued tasks from API
- For each task:
  - produce a plan
  - execute steps in Docker sandbox
  - emit TaskEvents (logs/steps/artifacts)
  - request approvals when needed

### “Auto routing” policy

MVP routing:

- `cheap`: summarize / enumerate / quick research; short outputs
- `deep`: decision-making, trade-offs, final conclusion
- `coder`: code generation, refactors, PoC implementation

Implementation approach:

- Router prompt (rule-based first) decides which worker to run.
- Workers can be spawned as OpenClaw sub-agents with different models.

### Sandbox

Execution should happen inside Docker containers:

- Workdir mounted as a volume (task workspace)
- Network constraints optional (future)
- Command allowlist enforced by runner

## 5. API (proposed)

### Create task

`POST /api/computer/tasks`

Body:

```json
{
  "title": "Deploy frontend to dev",
  "prompt": "Build and deploy the UI to dev",
  "mode": "auto",
  "runnerHint": {
    "projectPath": "repos/myapp",
    "env": "dev"
  }
}
```

### List tasks

`GET /api/computer/tasks?status=queued|running|...`

### Get task

`GET /api/computer/tasks/:id`

### Stream logs (option A)

- `GET /api/computer/tasks/:id/events?after=<cursor>`

### Request approval

`POST /api/computer/tasks/:id/approvals`

### Resolve approval

`POST /api/computer/approvals/:id/resolve`

```json
{ "status": "approved", "note": "OK to apply" }
```

## 6. Artifacts & logs

- TaskEvents store **metadata** in Postgres
- Actual log bodies may be stored as:
  - filesystem (`./data/logs/<taskId>.log`) for local, or
  - S3 in future

Artifacts may include:

- build output links
- terraform plan output
- deployment URL

## 7. AWS integration

- Use AssumeRole (no static keys)
- Separate roles for `dev/stg/prod`
- Policy is least privilege; deployment actions only for required services

## 8. Implementation milestones

### M0: Docs + scaffolding
- repo + docs
- docker-compose with Postgres

### M1: UI/API minimal
- create task
- list tasks
- show task detail

### M2: Runner loop
- poll queued tasks
- write events/logs
- approval gating

### M3: AWS deploy scenario
- sample pipeline (build/test/plan/apply/deploy)

