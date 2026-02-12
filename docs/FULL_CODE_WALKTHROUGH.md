# Full Code Walkthrough

This document explains what each file does and what each part of the code does.
Line references are grouped into small contiguous ranges for readability.

## Root

### `.gitignore`
- Ignores dependency folders, env files, and build artifacts so secrets and generated files are not committed.
- `node_modules/`: excludes installed packages.
- `.env`, `frontend/.env`, `backend/.env`: excludes environment secrets.
- `dist/`, `coverage/`: excludes compiled and test output.
- `.DS_Store`, `npm-debug.log*`: excludes OS/log noise.

### `README.md`
- Project overview and quick-start instructions.
- Explains folder purpose and local setup flow.
- Includes seeded admin credentials and run commands.

## Docs

### `docs/API.md`
- Documents API base URL and endpoints.
- Lists auth requirements for protected routes.
- Provides request/response intent for each route family.

## Backend

### `backend/package.json`
- Declares backend package metadata and scripts.
- `dev`: starts nodemon watcher.
- `start`: production start command.
- `seed`: seeds DB with admin + sample posts.
- `test`: runs Vitest suite.
- Dependencies:
  - runtime: express, mongoose, jwt, bcrypt, helmet, cors, rate-limit, dotenv, morgan.
  - dev: nodemon, vitest, supertest.

### `backend/.env.example`
- Template for required environment variables.
- `PORT`, `MONGODB_URI`, JWT settings, seeded admin credentials, and allowed client origin.

### `backend/vitest.config.js`
- Configures Vitest for Node environment.
- Includes test files from `tests/**/*.test.js`.

### `backend/tests/health.test.js`
- Imports `supertest`, `vitest`, and Express `app`.
- Sends `GET /api/health`.
- Asserts HTTP `200` and `body.ok === true`.

### `backend/src/server.js`
- Imports app and DB connector.
- Reads `PORT`.
- `start()`:
  - connects DB first,
  - starts HTTP server,
  - logs URL.
- Catches startup errors and exits with non-zero status.

### `backend/src/app.js`
- Creates Express app.
- Loads env via `dotenv.config()`.
- Applies middleware:
  - `helmet()` for security headers.
  - `cors(...)` for frontend origin.
  - `express.json(...)` for JSON bodies.
  - `morgan("dev")` for request logging.
  - `/api` rate limiter to reduce abuse.
- Defines `GET /api/health` status endpoint.
- Mounts route modules:
  - `/api/auth`
  - `/api/posts`
  - `/api/comments`
  - `/api/ratings`
- Adds 404 and global error handlers.
- Exports `app`.

### `backend/src/config/db.js`
- Imports mongoose.
- `connectDb()`:
  - reads `MONGODB_URI`.
  - throws if missing.
  - calls `mongoose.connect(uri)`.
  - logs success.

### `backend/src/models/User.js`
- Defines `userSchema` with:
  - `email` (required, unique, normalized)
  - `passwordHash` (required)
  - `role` (admin-only enum)
- Enables timestamps.
- Exports `User` model.

### `backend/src/models/Post.js`
- Defines `postSchema` with:
  - `title`, `slug`, `excerpt`, `content`, `tags`, `publishedAt`.
- `slug` is unique and indexed for lookup.
- Uses timestamps.
- Exports `Post` model.

### `backend/src/models/Comment.js`
- Defines comment shape with:
  - `post` reference,
  - `name`, optional `email`, `text`,
  - `approved` moderation flag.
- Indexes `post` for query speed.
- Uses timestamps.
- Exports `Comment` model.

### `backend/src/models/Rating.js`
- Defines rating shape with:
  - `post` reference,
  - `identifier` (per-user/ip marker),
  - `value` from 1..5.
- Unique compound index `{ post, identifier }` allows one rating per identifier per post.
- Exports `Rating` model.

### `backend/src/middlewares/auth.js`
- `requireAdmin` middleware:
  - reads bearer token from `Authorization` header,
  - rejects with `401` if token missing,
  - verifies token with `JWT_SECRET`,
  - attaches payload to `req.user`,
  - rejects with `401` on invalid/expired token.

### `backend/src/middlewares/errorHandler.js`
- `notFoundHandler` returns route-not-found `404` JSON.
- `errorHandler` logs error, picks `statusCode` (or `500`), returns JSON message.

### `backend/src/utils/validators.js`
- Exposes `isValidObjectId(value)` helper via mongoose utility.

### `backend/src/services/ratingService.js`
- `getAverageRating(postId)` runs aggregation:
  - matches ratings by `post`.
  - groups to compute average and count.
- Returns `{ average: 0, count: 0 }` if none.
- Rounds average to 2 decimals.

### `backend/src/controllers/authController.js`
- `signToken(user)` creates JWT with `sub`, `email`, `role`, and expiry.
- `login(req,res,next)`:
  - validates email/password input,
  - finds user by normalized email,
  - compares password against hash,
  - returns token and admin payload,
  - handles errors through `next(error)`.

### `backend/src/controllers/postController.js`
- Helper `toSlug(title)` normalizes title into URL-safe slug.
- Helper `postProjection(post)` augments post with average rating + count.
- `getPosts`: fetches all posts newest-first and enriches each with rating summary.
- `getPostBySlug`:
  - fetches post by slug,
  - returns `404` if not found,
  - fetches approved comments,
  - returns enriched post with comments.
- `createPost`:
  - validates required fields,
  - creates slug,
  - prevents duplicate slug,
  - inserts post and returns `201`.
- `updatePost`:
  - fetches by id,
  - returns `404` if missing,
  - handles optional title change + slug conflict check,
  - updates excerpt/content/tags when provided,
  - saves and returns updated post.
- `deletePost`:
  - deletes post by id,
  - returns `404` if missing,
  - cascades cleanup of comments + ratings for that post,
  - returns `204`.

### `backend/src/controllers/commentController.js`
- `createComment`:
  - validates `postId`, `name`, `text`,
  - validates ObjectId format,
  - creates comment as pending approval,
  - returns `201`.
- `getAllComments` (admin): returns all comments with populated post title/slug, newest-first.
- `approveComment` (admin): sets `approved: true`, returns `404` if not found.
- `deleteComment` (admin): deletes comment or returns `404`.

### `backend/src/controllers/ratingController.js`
- `upsertRating`:
  - validates `postId` and `value`.
  - enforces range 1..5.
  - derives identifier from request IP.
  - upserts rating (create/update one per identifier+post).
  - computes and returns updated average/count summary.

### `backend/src/routes/authRoutes.js`
- Creates router.
- Binds `POST /login` to auth controller.
- Exports router.

### `backend/src/routes/postRoutes.js`
- Public:
  - `GET /` list posts.
  - `GET /:slug` post details.
- Admin-protected:
  - `POST /` create post.
  - `PUT /:id` update post.
  - `DELETE /:id` delete post.

### `backend/src/routes/commentRoutes.js`
- Public: `POST /` create comment.
- Admin:
  - `GET /` list all comments.
  - `PATCH /:id/approve` approve.
  - `DELETE /:id` remove.

### `backend/src/routes/ratingRoutes.js`
- Public: `POST /` create/update rating.

### `backend/src/utils/seed.js`
- Loads env and DB.
- Defines sample posts array.
- Defines slug helper.
- `seed()`:
  - connects DB,
  - clears users/posts/comments/ratings,
  - hashes admin password,
  - creates admin user,
  - inserts sample posts with slugs,
  - logs success and closes DB.
- Catches errors, logs, closes DB, exits non-zero.

## Frontend

### `frontend/package.json`
- Declares React/Vite app metadata.
- Scripts:
  - `dev`: local dev server.
  - `build`: production bundle.
  - `preview`: preview built bundle.
- Dependencies: react, react-dom, react-router-dom, axios.
- Dev dependency: Vite + React plugin.

### `frontend/.env.example`
- `VITE_API_URL` points frontend API client to backend.

### `frontend/vite.config.js`
- Enables React plugin for Vite build and HMR.

### `frontend/index.html`
- Base HTML entry.
- Creates `#root` mount node.
- Loads `src/main.jsx` module.

### `frontend/src/main.jsx`
- Imports React/DOM/router.
- Imports app and auth provider.
- Imports global CSS.
- Renders tree:
  - `BrowserRouter`
  - `AuthProvider`
  - `App`

### `frontend/src/App.jsx`
- Defines route table inside shared layout:
  - `/` -> Home
  - `/about` -> About
  - `/blog` -> Blog list
  - `/blog/:slug` -> Blog detail
  - `/admin/login` -> Login
  - `/admin` -> Protected dashboard
  - fallback `*` -> redirect home

### `frontend/src/hooks/useAuth.jsx`
- Creates `AuthContext`.
- Stores token in state initialized from `localStorage`.
- Exposes memoized auth API:
  - `isAuthenticated`
  - `login(token)` saves in state + localStorage
  - `logout()` clears both
- Provides `useAuth()` hook with safety check.

### `frontend/src/services/api.js`
- Creates shared axios client with `baseURL` from env.
- Exports `withAuth(token)` helper that returns Authorization headers.

### `frontend/src/components/Layout.jsx`
- Wraps page with shell structure.
- Renders `Navbar` and main container.

### `frontend/src/components/Navbar.jsx`
- Reads auth status.
- Always shows Home/About/Blog links.
- If authenticated: shows Admin + Logout button.
- Otherwise: shows Admin login link.

### `frontend/src/components/ProtectedRoute.jsx`
- Checks `isAuthenticated` from auth context.
- If true: renders children.
- If false: redirects to `/admin/login`.

### `frontend/src/components/PostCard.jsx`
- Displays one post summary card.
- Shows title, excerpt, publish date, average rating/count, tags, and detail link.

### `frontend/src/components/RatingStars.jsx`
- Renders 5 star buttons.
- Stars at or below selected value get `active` style.
- Calls `onSelect(n)` when clicked unless `readOnly`.

### `frontend/src/components/CommentList.jsx`
- If no comments: renders empty-state text.
- Else renders each approved comment with author, text, and timestamp.

### `frontend/src/components/CommentForm.jsx`
- Maintains local form state (`name`, `email`, `text`).
- On submit:
  - prevents default form submit,
  - calls parent `onSubmit(form)`,
  - resets fields.
- Uses `loading` prop to disable submit and show progress label.

### `frontend/src/pages/HomePage.jsx`
- Static landing page.
- Intro headline + short value statement.
- Two cards: featured project and contact.

### `frontend/src/pages/AboutPage.jsx`
- Static about page with profile summary.
- Skills card.
- Timeline + resume link card.

### `frontend/src/pages/BlogListPage.jsx`
- Local state: `posts`, `loading`, `error`.
- On mount, calls `GET /posts`.
- Handles loading and error UI.
- Maps posts into `PostCard` components.

### `frontend/src/pages/BlogDetailPage.jsx`
- Reads `slug` from route params.
- Local state: `post`, selected `rating`, comment loading, status message.
- `loadPost()` fetches `GET /posts/:slug`.
- On mount/slug change: loads post.
- `submitRating(value)` posts to `/ratings`, refreshes post summary.
- `submitComment(form)` posts to `/comments`, shows moderation message.
- Renders title/content/rating summary + interactive stars + comment list + comment form.

### `frontend/src/pages/AdminLoginPage.jsx`
- Local controlled fields: email/password + error.
- On submit:
  - calls `POST /auth/login`,
  - stores JWT via `login()`,
  - navigates to `/admin`.
- Shows error message on failed auth.

### `frontend/src/pages/AdminDashboardPage.jsx`
- Uses token from auth context.
- State:
  - posts list,
  - comments list,
  - create-post form,
  - status message.
- `load()` fetches posts + admin comments in parallel.
- `createPost()` sends admin `POST /posts` and refreshes.
- `removePost(id)` deletes post and refreshes.
- `approve(id)` approves pending comment and refreshes.
- `removeComment(id)` deletes comment and refreshes.
- Renders create form, post list, and comment moderation controls.

### `frontend/src/styles/global.css`
- Defines global base style and layout.
- Styles navbar, container, cards, forms, tags, stars, lists.
- Includes responsive rule for smaller screens.

## Notes
- If you want true literal one-line-by-one-line annotations for every single source line, I can generate a second document that lists each file with each exact line number and explanation one-by-one.
