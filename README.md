# JobBoard - Full Stack MERN Application

A job board where companies post jobs and review applicants, and job seekers search, apply and track their applications. Built with MongoDB, Express, React and Node.js.

## Live Demo

- Frontend: https://job-board-theta-jade-59.vercel.app
- Backend: https://job-board-server-my5v.onrender.com

> The backend runs on Render's free tier and sleeps when idle. The first request after a quiet period can take 30-60 seconds. The app pings the server as soon as it loads and shows a "server is waking up" notice while you wait.

## Features

### For Companies
- Register and log in as a company
- Post, edit and delete job listings (title, description, location, salary, skills, job type, deadline)
- See every application received, grouped under the job it belongs to, with a link to the resume
- Change an application's status (pending, reviewed, accepted, rejected); the change shows instantly and is rolled back with a message if the server refuses it
- Expired jobs are marked "Closed" and can be reopened by giving them a new deadline

### For Applicants
- Register and log in as a job seeker
- Browse jobs with search, location, job type and skills filters, and pagination (12 per page)
- Filters live in the URL (`/jobs?skills=react&page=2`), so a search can be bookmarked, shared and survives the Back button
- Apply with a resume link; each job can be applied to once
- Track status in a personal dashboard and withdraw an application while it is still pending or reviewed

### Quality and safety
- Passwords hashed with bcrypt, never returned by the API (`select: false`)
- JWT authentication with a 7 day expiry; a 401 from the server logs the user out automatically
- Role checks on the server (a company can only touch its own jobs and their applications)
- `helmet` security headers, restricted CORS, and rate limiting (a stricter limit on login/register)
- Input validation on the server (lengths, email format, http/https resume links, at most 20 skills)
- Search input is escaped before it reaches a regular expression
- Honest error handling in the UI: a failed request shows an error with a "Try again" button instead of a misleading "no results" message; slow responses from an older search never overwrite a newer one

## Tech Stack

**Frontend:** React (Vite), Redux Toolkit, React Router v7, Axios, plain CSS, oxlint

**Backend:** Node.js, Express 5, MongoDB with Mongoose 9, JWT, bcryptjs, helmet, express-rate-limit, node:test

## Getting Started

### Prerequisites
- Node.js 20 or newer
- A MongoDB Atlas database (or a local MongoDB)

### 1. Server

```
cd server
npm install
cp .env.example .env     # then fill in the values
npm run dev
```

`server/.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
```

The server refuses to start if `MONGO_URI` or `JWT_SECRET` is missing. `CLIENT_URL` can hold several allowed origins separated by commas.

### 2. Client

```
cd client
npm install
cp .env.example .env     # optional: only needed to point at a different API
npm run dev
```

`client/.env` (optional)

```
VITE_API_URL=http://localhost:5000/api
```

If it is not set, the client uses `http://localhost:5000/api` in development and the deployed Render server in production.

Open http://localhost:5173.

### 3. Tests

```
cd server
npm test
```

Runs the unit tests for the deadline rule, the skill search and URL validation.

## How a few things work

**Deadlines (India time).** A company picks a date. It is stored as midnight UTC of that date, and the job stays open until the end of that day in India (IST, UTC+5:30). The server decides whether a job is closed (`isClosed`), so the browser's clock and timezone never matter. Closed jobs disappear from Browse and cannot be applied to.

**Skill search.** `skills=java` matches the skill "Java" but not "JavaScript". Matching is case-insensitive and whole-skill, so `c++`, `c#` and `node.js` work.

**Pagination.** `GET /api/jobs?page=2&limit=12` returns `{ jobs, total, page, pages }`. Without `page` the endpoint returns a plain array, so older clients keep working.

**Session.** The token and user are kept in `localStorage` so a refresh keeps you logged in. On load the app asks `/api/auth/me` whether the session is still valid.

## Project Structure

```
job-board/
├── client/
│   ├── public/             # favicon
│   └── src/
│       ├── components/     # Navbar, JobCard, JobForm, ApplicantRow, StatusBadge, ProtectedRoute, GuestRoute
│       ├── hooks/          # useSlowNotice (shows the "server is waking up" message)
│       ├── pages/          # Home, Jobs, JobDetail, Login, Register, dashboards, NotFound
│       ├── redux/          # auth slice and store
│       └── utils/          # axios instance, helpers (dates, salary, errors), job form helpers
└── server/
    ├── app.js              # Express app (middleware + routes), easy to test
    ├── index.js            # reads env, connects to the database, starts listening
    ├── config/             # database connection
    ├── controllers/        # route handlers
    ├── middleware/         # auth, role checks, error handling
    ├── models/             # User, Job, Application
    ├── routes/             # API routes
    ├── utils/              # deadline, search and URL helpers
    └── tests/              # unit tests
```

## API Endpoints

### Auth
- `POST /api/auth/register` - register (applicant or company)
- `POST /api/auth/login` - log in
- `GET /api/auth/me` - current user (requires token)

### Jobs
- `GET /api/jobs` - open jobs; filters `search`, `location`, `jobType`, `skills`; optional `page` and `limit`
- `GET /api/jobs/mine` - the logged-in company's own jobs, including closed ones (company)
- `GET /api/jobs/:id` - one job
- `POST /api/jobs` - create a job (company)
- `PUT /api/jobs/:id` - update your own job (company)
- `DELETE /api/jobs/:id` - delete your own job and its applications (company)

### Applications
- `POST /api/applications/:jobId` - apply with a resume link (applicant)
- `GET /api/applications/me` - my applications (applicant)
- `GET /api/applications/check/:jobId` - have I applied to this job? (applicant)
- `DELETE /api/applications/:id` - withdraw while pending or reviewed (applicant)
- `GET /api/applications/received` - every application to my jobs (company)
- `GET /api/applications/job/:jobId` - applications for one job (company)
- `PUT /api/applications/:id` - change an application's status (company)

## Design decisions and known limitations

These are deliberate trade-offs for a learning project, and what I would do next.

- **Companies are not verified.** Anyone can register as any company name. A real product would verify email domains or add admin approval.
- **The JWT is stored in `localStorage`.** It is simple and works across the Vercel and Render domains, but a script injected into the page could read it. The more secure option is an `httpOnly` cookie, which needs cookie and CSRF handling. Tokens cannot be revoked before they expire (7 days).
- **Resumes are links, not uploads.** Applicants paste a Drive or similar link. File uploads would need storage (S3 or Cloudinary) and virus scanning.
- **No email notifications.** Applicants must open the dashboard to see a status change.
- **Salary is shown as rupees per month** and has no currency field.
- **Free-tier hosting.** Render sleeps when idle, which is why the client pings the server on load and shows a waiting notice.