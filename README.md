# JobBoard - Full Stack MERN Application

A full stack job board application built with the MERN stack (MongoDB, Express, React, Node.js) where companies can post jobs and applicants can apply and track their application status.

## Live Demo

- Frontend: https://job-board-theta-jade-59.vercel.app
- Backend: https://job-board-server-my5v.onrender.com

> Note: The backend is hosted on Render's free tier and may take 30-60 seconds to wake up on the first request if it has been inactive.

## Features

### For Companies
- Register and login as a company
- Post job listings with title, description, location, salary, skills, and deadline
- View all applications received for each job
- Update application status (pending, reviewed, accepted, rejected)
- Delete job listings

### For Applicants
- Register and login as a job seeker
- Browse all job listings with filters (location, job type, skills)
- View detailed job information
- Apply for jobs
- Track application status in personal dashboard

## Tech Stack

### Frontend
- React.js (Vite)
- Redux Toolkit (state management)
- React Router v7 (routing)
- Axios (API calls)
- Plain CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account

### Installation

1. Clone the repository

```
git clone https://github.com/Penguin-2006/job-board.git
cd job-board
```

2. Set up the server

```
cd server
npm install
```

3. Create a .env file in the server folder (see `server/.env.example`)

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
```

4. Start the backend

```
npm run dev
```

5. Set up the client (in a second terminal)

```
cd client
npm install
npm run dev
```

`npm run dev` talks to your local server at `http://localhost:5000/api`. To use the live server instead, create `client/.env` containing `VITE_API_URL=https://job-board-server-my5v.onrender.com/api` (see `client/.env.example`).

6. Open http://localhost:5173 in your browser

### Running the tests

```
cd server
npm test
```

## Project Structure

```
job-board/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Navbar, JobCard, ProtectedRoute
│   │   ├── pages/          # Home, Jobs, Login, Register, Dashboards
│   │   ├── redux/          # Auth slice and store
│   │   └── utils/          # Axios instance
├── server/                 # Express backend
│   ├── config/             # Database connection
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose schemas
│   └── routes/             # API routes
```

## API Endpoints

### Auth
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user

### Jobs
- GET /api/jobs - Open jobs. Filters: `search`, `skills`, `location`, `jobType`. Add `page` and `limit` for pagination
- GET /api/jobs/mine - Jobs posted by the logged-in company, including expired ones (company only)
- GET /api/jobs/:id - Get single job
- POST /api/jobs - Create a job (company only)
- PUT /api/jobs/:id - Update a job (owner only)
- DELETE /api/jobs/:id - Delete a job (owner only)

### Applications
- POST /api/applications/:jobId - Apply for a job (applicant only)
- GET /api/applications/me - Get my applications (applicant only)
- GET /api/applications/check/:jobId - Have I applied to this job? (applicant only)
- DELETE /api/applications/:id - Withdraw an application (applicant only)
- GET /api/applications/received - All applications to my jobs (company only)
- GET /api/applications/job/:jobId - Applications for one job (company only)
- PUT /api/applications/:id - Update application status (company only)
