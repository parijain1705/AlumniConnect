# 🎓 AlumniConnect - MERN Alumni Management Portal

A modern, responsive, demo-ready **Alumni Management Portal** built with the **MERN Stack** (MongoDB, Express, React, Node.js). It offers a rich public directory, role-based administration, interactive data visualization, full CRUD operations, and quick-search filters.

---

## 🚀 Key Features

- **Public Alumni Directory**:
  - Grid card view and interactive table view toggle.
  - Multi-criteria real-time search across names, companies, roles, and skills.
  - Filter by Department (CSE, IT, ECE, Mechanical, Civil, MBA), Graduation Year, City, and Mentorship status.
  - Server-side pagination with custom limits.
- **Analytics Dashboard**:
  - Stat cards for Total Alumni, Active Mentors, Departments, and Global Locations.
  - Interactive Recharts visualizations:
    - *Alumni by Department* (Donut / Pie Chart)
    - *Graduation Year Trends (2012–2024)* (Area Chart)
    - *Top 5 Hiring Companies* (Bar Chart)
- **Alumni Profile Detail Page**:
  - Comprehensive view featuring bio, contact info (email, phone), career status, skills badges, and LinkedIn profile link.
  - Native share link button.
- **Admin Management & Security**:
  - Secure JWT-based authentication (`POST /api/auth/login`).
  - Protected endpoints for creating (`POST`), editing (`PUT`), and removing (`DELETE`) alumni records.
  - Modern Add/Edit Alumni form with input validation and instant random avatar generator.
  - Deletion confirmation dialog with safeguard warnings.
  - One-click demo credentials autofill for live presentation demonstrations.
- **Polished UI/UX**:
  - Tailwind CSS styling with clean gradients, cards, and micro-interactions.
  - Skeleton loaders for cards, tables, and charts during async fetches.
  - Toast notifications powered by `react-hot-toast`.

---

## 🏗️ Project Structure

```
mernproject/
├── package.json              # Root workspace convenience runner
├── README.md                 # Setup & run documentation
├── server/                   # Express + Node.js + Mongoose REST API
│   ├── config/
│   │   └── db.js             # MongoDB connection logic
│   ├── middleware/
│   │   ├── auth.js           # JWT verification middleware
│   │   └── errorHandler.js   # Centralized error handler
│   ├── models/
│   │   ├── Admin.js          # Admin schema with bcrypt hashing
│   │   └── Alumni.js         # Alumni schema with indexing & validations
│   ├── routes/
│   │   ├── auth.js           # /api/auth routes (login, me)
│   │   └── alumni.js         # /api/alumni CRUD, stats & filters
│   ├── seed.js               # Database seeding script (24 realistic profiles + Admin)
│   ├── server.js             # Express app entrypoint
│   ├── package.json
│   ├── .env.example
│   └── .env
└── client/                   # React + Vite + Tailwind CSS Frontend
    ├── src/
    │   ├── components/
    │   │   ├── AlumniCard.jsx
    │   │   ├── AlumniTable.jsx
    │   │   ├── DeleteModal.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── SkeletonLoader.jsx
    │   │   └── StatCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── AlumniDetail.jsx
    │   │   ├── AlumniDirectory.jsx
    │   │   ├── AlumniForm.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Login.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    ├── .env.example
    └── .env
```

---

## 🛠️ Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas connection string.

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/alumni_portal
JWT_SECRET=super_secret_alumni_jwt_key_2026
CLIENT_URL=http://localhost:5173
```
> *To connect to MongoDB Atlas, replace `MONGO_URI` with your Atlas URI (`mongodb+srv://<username>:<password>@cluster.mongodb.net/alumni_portal`).*

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏁 Step-by-Step Setup & Run

### 1. Install Dependencies
In the root directory, install dependencies for both client and server:
```bash
npm run install:all
```
*(Or navigate into each folder and run `npm install`)*

### 2. Seed Database
Seed the database with the administrator account and 24 realistic alumni entries:
```bash
npm run seed
```
*(Or inside `/server`: `npm run seed`)*

Expected output:
```
Connecting to MongoDB at: mongodb://127.0.0.1:27017/alumni_portal
Clearing existing Alumni and Admin collections...
Creating Admin user: admin@alumni.com ...
Seeding 24 realistic alumni records...
✅ Seeding completed successfully!
- Admin account: admin@alumni.com (Password: Admin@123)
- Alumni records inserted: 24
- Mentors available: 10
```

### 3. Start Application

You can start both server and client together from the root folder:
```bash
npm run dev
```

Or run them in separate terminals:
**Terminal 1 (Backend Server):**
```bash
cd server
npm start
# Server runs at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

Now open **http://localhost:5173** in your web browser!

---

## 🔑 Demo Admin Credentials

For presenting or testing administrative actions (Add, Edit, Delete):
- **Email**: `admin@alumni.com`
- **Password**: `Admin@123`

*(Tip: The Login page includes an **"Autofill Demo Login"** button for quick 1-click authentication during demos)*

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login (returns JWT token)
- `GET /api/auth/me` - Verify current admin session (Protected)

### Alumni
- `GET /api/alumni` - Query alumni (supports `search`, `year`, `department`, `city`, `isMentor`, `page`, `limit`)
- `GET /api/alumni/stats` - Aggregate metrics for charts and stat cards
- `GET /api/alumni/filter-options` - Unique departments, years, and cities for UI filters
- `GET /api/alumni/:id` - Fetch single profile details
- `POST /api/alumni` - Create new alumni profile (**Protected**)
- `PUT /api/alumni/:id` - Update existing profile (**Protected**)
- `DELETE /api/alumni/:id` - Delete profile (**Protected**)

