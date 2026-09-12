# TaskFlow

A full-stack task/sprint tracker: Spring Boot (Java) REST API + JWT auth, and a
Next.js/TypeScript/Tailwind frontend with a drag-and-drop Kanban board.

Built to a deliberately **cut-down, 2-day scope** as a portfolio/CV project —
see "What's cut for scope" below before you show this to anyone technical.

## Stack

- **Backend:** Spring Boot 3.3, Spring Security (JWT, stateless), Spring Data JPA, PostgreSQL
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, @dnd-kit for drag-and-drop
- **Infra:** Docker, Docker Compose

## Running it

You need Docker and Docker Compose installed. From the project root:

```bash
docker compose up --build
```

This starts three containers: Postgres, the Spring Boot backend (port 8080),
and the Next.js frontend (port 3000).

Then open **http://localhost:3000** — you'll land on the login page.
Click "Register" to create an account, then you're on the board.

First build will take a few minutes (Maven has to download all backend
dependencies with no cache yet). Subsequent builds are faster.

## What's actually implemented

- Register / login with JWT (stateless, no sessions)
- Create tasks (title + optional description)
- Drag tasks between To Do / In Progress / Done — this calls the backend
  immediately and updates the DB (optimistic UI update, rolls back on failure)
- Delete tasks
- Tasks are scoped per-user — you only ever see your own tasks
- Full Docker Compose setup — one command runs the whole stack

## What's cut for scope (be upfront about these in an interview)

- **No refresh tokens** — the JWT is long-lived (24h) with no rotation. Fine
  for a demo, not fine for production.
- **No automated tests** — no unit or integration tests were written.
  If asked, be honest: this was a 2-day scoped build and testing was the
  first thing cut.
- **No role-based permissions** — every logged-in user has full access to
  their own tasks and nothing else; there's no admin/member distinction.
- **No cloud deployment** — this runs via Docker Compose only, not deployed
  anywhere public. There's no live demo link.
- **Token stored in localStorage**, not an httpOnly cookie — a deliberate
  simplicity/security trade-off worth being able to explain if asked.
- **No "Project" grouping** — tasks are flat per-user, no separate boards
  or projects.

## Still worth doing if you have any spare time before the interview

1. Actually run through the app yourself end to end: register, add a few
   tasks, drag them around, refresh the page and confirm they persist.
2. Read through `JwtAuthFilter.java` and `SecurityConfig.java` and be able
   to explain the request flow out loud without looking at the code —
   this is almost certainly the single most-asked question.
3. If you have an extra evening: add one thing you're missing that a real
   interviewer might probe — e.g. a `dueDate` field, or a simple loading
   skeleton on the board instead of a plain "Loading..." text.

## CV bullet (already used in your resume)

> Designed and built a full-stack task tracker end-to-end, pairing a Spring
> Boot (Java, Spring Security, JWT) REST API with a Next.js/TypeScript/Tailwind
> frontend to deliver drag-and-drop Kanban boards.
