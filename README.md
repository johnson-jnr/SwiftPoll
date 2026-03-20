# SwiftPoll

Create and share polls in seconds. 

<img src="docs/images/Screenshot%202026-03-15%20at%2023.16.21.png" width="100%">

<table>
  <tr>
    <td><img src="docs/images/Screenshot%202026-03-20%20at%2008.07.04.png" width="100%"></td>
    <td><img src="docs/images/Screenshot%202026-03-20%20at%2008.34.19.png" width="100%"></td>
  </tr>
</table>

---

## Features

- **Create polls instantly** — Build a poll with a title, description, and as many options as you need, then share it with a single link.
- **One vote per IP** — Protection ensures each person only votes once, keeping results fair without requiring accounts.
- **Public results** — Toggle whether results should be visible to voters after they cast their vote and access result with a live chart breakdown.
- **User dashboard** — Sign in to manage all your polls in one place — view responses, toggle poll settings, and track activity over time.

---

## Technologies

| Layer          | Technology                       |
| :------------- | :----------------------          |
| **Backend**    | Python, Django                   |
| **Frontend**   | TypeScript, React, Inertia.js    |
| **Styling**    | Tailwind, Shadcn/ui              |
| **Database**   | PostgreSQL                       |
| **Email**      | Resend                           |

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 24+
- [uv](https://docs.astral.sh/uv/)
- pnpm

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

---

## License

MIT
