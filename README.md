# Google Forms Lite Clone

A simplified Google Forms clone built as a monorepo.

## Tech Stack

- **Client:** React, TypeScript, Redux Toolkit, RTK Query, React Router
- **Server:** Node.js, Apollo Server, GraphQL (in-memory store)
- **Monorepo:** npm workspaces + concurrently

## Project Structure

```
google-forms-lite/
├── client/   # React app
├── server/   # GraphQL API
└── package.json
```

## Setup & Run

### Prerequisites

- Node.js v18+
- npm v8+

### Install dependencies

```bash
npm install
```

### Run both client and server

```bash
npm run dev
```

- Client: http://localhost:5173
- Server (GraphQL Playground): http://localhost:4000

## Features

- View all forms on homepage
- Create forms with TEXT, MULTIPLE_CHOICE, CHECKBOX, DATE questions
- Fill out and submit forms
- View responses per form
