# TaskFlow

A full-stack task/sprint tracker: Spring Boot (Java) REST API + JWT auth, and a
Next.js/TypeScript/Tailwind frontend with a drag-and-drop Kanban board.


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



