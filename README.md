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
- React Router v6 (routing)
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
git clone https://github.com/yourusername/job-board.git
cd job-board
```

2. Set up the server

```
cd server
npm install
```

3. Create a .env file in the server folder

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the backend

```
npm run dev
```

5. Set up the client

```
cd ../client
npm install
npm run dev
```

6. Open http://localhost:5173 in your browser

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
- GET /api/jobs - Get all jobs (with filters)
- GET /api/jobs/:id - Get single job
- POST /api/jobs - Create a job (company only)
- PUT /api/jobs/:id - Update a job (company only)
- DELETE /api/jobs/:id - Delete a job (company only)

### Applications
- POST /api/applications/:jobId - Apply for a job
- GET /api/applications/me - Get my applications
- GET /api/applications/job/:jobId - Get applications for a job (company only)
- PUT /api/applications/:id - Update application status (company only)
