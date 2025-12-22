# My Portfolio - React Migration

This project has been migrated to a modern React stack using Vite, TypeScript, and Tailwind CSS.

## Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Legacy `server.js` integrated)
- **Tools:** ESLint, Prettier, Husky, Vitest, React Testing Library

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application
You need to run both the Backend (API) and Frontend (React) servers.

**Terminal 1 (Backend):**
```bash
node server.js
```
*Server runs on http://localhost:3000*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*Frontend runs on http://localhost:5173*

The frontend proxies API requests (`/api`) to the backend automatically.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Tests
```bash
npm test
```

## Features
- **Home Page:** Hero, About, Latest Blogs (Top 3), Contact Form.
- **All Blogs:** data-driven page (`/blogs`) fetching from MongoDB.
- **Admin Panel:** (`/admin`) for creating new blogs.
  - **Access Key:** `13822004`
- **Animations:** Particle background, Ripple effects, Smooth scrolling.

## Project Structure
- `src/components`: Reusable UI components (Navbar, Hero, etc.)
- `src/pages`: Page components (Home, AllBlogs, Admin)
- `src/types`: TypeScript interfaces
- `server.js`: Express API server
