# TaskPlanet Full-Stack Community Social Post Clone

Welcome to the **TaskPlanet Mini Social Post Application**! This project is a premium full-stack clone inspired by the community-driven Social page in the TaskPlanet mobile app. It allows users to register accounts, share posts (text, images, or both), scroll a public feed with sorting filters, follow authors, and interact through real-time likes and comments.

---

## 🌟 Key Features & Innovations

1. **Pixel-Perfect TaskPlanet Aesthetics:** Faithful replication of the TaskPlanet Social Feed UI (points/cash badges `50 ★` / `₹0.00`, toggle pills, horizontal sorting pills, yellow-bordered card feeds, active navigation squircles, and floating action button).
2. **Zero-Config Database Fallback:** The backend connects to your MongoDB cloud or local database. If a database is not running or defined, **it automatically spins up an in-memory database** using `mongodb-memory-server`! The app works out of the box with zero setup.
3. **Canvas Image Compression:** When users upload images, a custom utility dynamically compresses them using a hidden Canvas in the browser. This converts heavy camera uploads into highly compressed base64 strings, ensuring lightning-fast uploads and minimal database storage.
4. **Denormalized Database Design (2 Collections):** Strictly adheres to the requirement of using exactly **two MongoDB collections**:
   - `users` (handles credentials, signup rewards, points, and wallet balances).
   - `posts` (handles posts, with nested arrays for fast, atomic updates to `likes` and `comments`).
5. **Real-time UX with Optimistic feel:** Social likes and comment feeds update instantly in the React state without causing full-page reloads.

---

## 🛠️ Technology Stack

- **Frontend:** React (Vite Scaffolder) + React Router + Material UI (MUI) + Custom CSS. *(TailwindCSS was strictly avoided as per assignment rules)*.
- **Backend:** Node.js + Express.js + Mongoose ORM.
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs password hashing.
- **Database:** MongoDB (Atlas, Local, or In-Memory fallback).

---

## 📂 Project Architecture

```
mini-social-app/
├── backend/
│   ├── models/
│   │   ├── User.js          # User Collection (email, password, points, balance)
│   │   └── Post.js          # Post Collection (text, base64 image, likes, comments)
│   ├── middleware/
│   │   └── auth.js          # JWT Verification Middleware
│   ├── server.js            # Server entry, routes, and auto-seeding logic
│   └── package.json
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx # Global Auth state & custom Axios client
    │   ├── components/
    │   │   ├── Header.jsx       # Top points & wallet header bar
    │   │   ├── SearchBar.jsx    # Search input with dark moon icons
    │   │   ├── FilterPills.jsx  # Horizontal scrollable feed sorting
    │   │   ├── CreatePostCard.jsx # Dynamic composer with Canvas compression
    │   │   ├── PostCard.jsx     # Card feed, likes tooltips & follow toggles
    │   │   ├── CommentSection.jsx # Sub-feed comments drawer
    │   │   └── BottomNav.jsx    # Signature blue navigation bar
    │   ├── pages/
    │   │   ├── Feed.jsx         # Social feed orchestrator
    │   │   ├── Profile.jsx      # Earned metrics & personal posts lists
    │   │   ├── Login.jsx        # Credentials card
    │   │   └── Signup.jsx       # Creation card
    │   ├── App.jsx              # Main routing tree
    │   ├── main.jsx             # Entry mount
    │   ├── index.css            # Typography & variables
    │   └── App.css              # Custom styled sheets
    ├── index.html
    └── package.json
```

---

## ⚡ API Endpoint Catalog

### Authentication (`/api/auth`)
- `POST /signup` - Register username, email, and password. Awards **50 ★ points** as a signup bonus! Returns JWT.
- `POST /login` - Log in with registered email and password. Returns JWT.
- `GET /me` - Returns active user stats (points, wallet balance) using Authorization JWT.

### Social Posts (`/api/posts`)
- `GET /` - Fetch feed posts.
  - Query parameters:
    - `?sort=likes` - Sorts feed by total likes descending.
    - `?sort=comments` - Sorts feed by total comments descending.
- `POST /` - Submit a new post (text, image, or both). Awards **5 ★ points** to the author!
- `POST /:id/like` - Toggles like on a post. Saves username and ID of the liker.
- `POST /:id/comment` - Adds a comment to a post. Saves comment content, username, and timestamp.

---

## 🚀 Setup & Launch Instructions

### Prerequisites
- **Node.js** (v16+) and **npm** installed.

### 1. Running the Backend Server
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Set up environment variables (Optional - if blank, in-memory MongoDB kicks in!):
   Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri_here
   JWT_SECRET=any_secret_passphrase
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *The server will start on port 5000 and auto-seed sample posts if the DB is empty.*

### 2. Running the Frontend React App
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 🌍 Cloud Deployment Guides

### Backend (Render)
1. Commit the `backend` folder to a GitHub repository.
2. Log into [Render](https://render.com) and create a new **Web Service**.
3. Link your GitHub repository and specify the **Root Directory** as `backend`.
4. Configure values:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. In **Environment**, define `MONGODB_URI` and `JWT_SECRET`.

### Frontend (Vercel / Netlify)
1. Log into [Vercel](https://vercel.com) and link your GitHub.
2. Create a new project, select the repository, and set **Root Directory** as `frontend`.
3. In **Environment Variables**, define `VITE_API_URL` to point to your deployed Render backend (e.g. `https://your-service.onrender.com/api`).
4. Click **Deploy**!
