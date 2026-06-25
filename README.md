# MERN Auth Practice App

A simple MERN + TypeScript authentication application with:

- Register/login authentication
- Cookie-based JWT session
- Current-user session check
- Logout flow
- React frontend
- Express + MongoDB backend

## Structure

- `client` - React + Vite + TypeScript
- `server` - Express + TypeScript + MongoDB

## Run locally

1. Install dependencies:

```bash
npm run install:all
```

2. Create env files:

- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`

3. Start development:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Deployment notes

- Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` on the server
- Set `VITE_API_URL` on the client
- Build with:

```bash
npm run build
```
