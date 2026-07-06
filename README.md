# My Albums

Welcome to the My Albums web application!

The application is a clean personal music catalog tracker featuring:
- **React Router Navigation:** Manages client-side routing with nested layout wrappers, parameter-driven category grids, single-album profile views, and fallback 404 routing.
- **TanStack Query Synchronization:** Coordinates asynchronous data fetching, localized caching, and automated mutations with cache invalidation rules to trigger instant list refetches.
- **JSON Server Mock Database:** Runs a local RESTful API server powered by `db.json` and `db.seed.json` templates to store tracking logs, ratings, and notes.
- **Theme Mode Customization:** Incorporates a dark/light theme switch that integrates seamlessly with Tailwind utility styles and persists user preferences in `localStorage`.
- **Interactive Reviews:** Supports status tracking (want, active, done, dropped), live star ratings (with hover indicators), and customizable review notes with auto-saving textareas.

It is built using React, Vite, TypeScript, and Tailwind CSS (powered by TanStack Query for state sync, React Router for client-side view management, and json-server for local database storage).
