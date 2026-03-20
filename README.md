# SwiftPoll

Create and share polls in seconds. 

<img src="docs/images/Screenshot%202026-03-15%20at%2023.16.21.png" width="100%">

<table>
  <tr>
    <td><img src="docs/images/Screenshot%202026-03-20%20at%2008.52.29.png" width="100%"></td>
    <td><img src="docs/images/Screenshot%202026-03-20%20at%2008.54.48.png" width="100%"></td>
  </tr>
</table>

---

## Features

- **Create polls instantly** — Build a poll with a title, description, and as many options as you need, then share it with a single link.
- **One vote per IP** — Protection ensures each person only votes once, keeping results fair without requiring accounts.
- **Live results** — Vote counts update in real time for everyone viewing the poll simultaneously, powered by WebSockets and Django Channels.
- **Public results** — Toggle whether results should be visible to voters after they cast their vote, with a live chart breakdown.
- **Scheduled polls** — Set a start and end date for your poll. It will automatically go live and close at the specified times.
- **Authentication** — Sign in with email/password or Google to manage your polls.
- **User dashboard** — Manage all your polls in one place — view responses, update poll settings, and track poll details.

---

## Technologies

| Layer              | Technology                         |
| :----------------- | :--------------------------------- |
| **Backend**        | Python, Django                     |
| **Real-time**      | Django Channels, WebSockets        |
| **Task Queue**     | Celery, Celery Beat                |
| **Broker/Cache**   | Redis                              |
| **Frontend**       | TypeScript, React, Inertia.js      |
| **Styling**        | Tailwind, Shadcn/ui                |
| **Database**       | PostgreSQL                         |
| **Email**          | Resend                             |

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 24+
- [uv](https://docs.astral.sh/uv/)
- pnpm
- Redis

### Installation

1. Clone the repository and navigate into the project directory.

2. Install Python dependencies:
   ```bash
   uv sync
   ```

3. Install frontend dependencies:
   ```bash
   pnpm install
   ```

4. Copy the environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```

5. Run migrations and start the development servers:
   ```bash
   uv run manage.py migrate
   uv run manage.py runserver
   ```
   ```bash
   pnpm dev
   ```

6. Ensure Redis is running. See the [Redis documentation](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) for installation and startup instructions.

7. Start the Celery worker (handles background tasks):
   ```bash
   uv run celery -A simple-poll worker -l info
   ```

8. Start the Celery Beat scheduler (handles scheduled poll activation/deactivation):
   ```bash
   uv run celery -A simple-poll beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
   ```

---

## License

MIT
