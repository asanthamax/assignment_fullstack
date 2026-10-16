# assessment_app

FastAPI backend (SQLite) + Next.js frontend for browsing and claiming tickets.

## Run with Docker (recommended)

```bash
docker compose up --build
```

- UI: http://localhost:3000
- API: http://localhost:8000 (docs at `/docs`)

Data is stored in the `db-data` Docker volume. Reset it with `docker compose down -v`.
The frontend proxies `/api/*` to the backend, so no CORS setup is needed.

Add a ticket to try it out:

```bash
curl -X POST localhost:8000/v1/tickets/init_ticket -H 'content-type: application/json' \
  -d '{"title":"Hello","description":"First ticket","priority":"high","tags":"demo, test"}'
```

## Run locally

Backend (requires Python 3.14 and [uv](https://docs.astral.sh/uv/)):

```bash
uv run fastapi dev        # http://localhost:8000
```

Frontend (Node 22+):

```bash
cd frontend
npm install
npm run dev               # http://localhost:3000
```

Set `BACKEND_URL` (default `http://localhost:8000`) if the API runs elsewhere. In production builds it is
baked in at build time (`docker-compose.yaml` passes it as a build arg).

## Configuration

| Variable       | Default                              | Used by  |
| -------------- | ------------------------------------ | -------- |
| `DATABASE_URL` | `sqlite+aiosqlite:///./sql_app.db`   | backend  |
| `BACKEND_URL`  | `http://localhost:8000`              | frontend |

## API

- `POST  /v1/tickets/init_ticket` – create a ticket
- `GET   /v1/tickets/:current_page/:page_size?current_page=1&page_size=10` – paginated list
- `GET   /v1/tickets/row_count` – total tickets
- `PATCH /v1/tickets/assign_user` – `{ "ticket": 1, "user_email": "a@b.com" }`
