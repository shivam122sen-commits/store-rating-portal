# Store Rating Portal

A full-stack web application for managing and rating stores with role-based access control.

## Features

- **Role-Based Authentication**: System Administrator, Store Owner, and Normal User roles
- **Store Management**: Add, edit, and manage store information
- **Rating System**: Users can rate and review stores
- **Admin Dashboard**: System administrators can manage users and stores
- **Owner Dashboard**: Store owners can view and manage their stores
- **User Dashboard**: Regular users can browse and rate stores

## Tech Stack

### Frontend
- React 18
- Vite
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd "store rating portal"
```

### 2. Setup Database

Create a PostgreSQL database and run the schema:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE roxiler_db;

# Connect to the database
\c roxiler_db

# Run the schema file
\i backend/schema.sql
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your database credentials
# PORT=5001
# DATABASE_URL=postgresql://username:password@localhost:5432/roxiler_db
# JWT_SECRET=your_secret_key

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5001`

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# The .env file is already configured for local development
# VITE_API_URL=http://localhost:5001/api

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Default Admin Credentials

After running the schema, you should create an admin user or use the seeded admin:

- Email: `admin@example.com`
- Password: Check your schema.sql file for the default admin credentials

### User Roles

1. **System Administrator**
   - Manage all users
   - Approve store owners
   - View all stores and ratings

2. **Store Owner**
   - Add and manage own stores
   - View ratings for owned stores
   - Update store information

3. **Normal User**
   - Browse stores
   - Rate and review stores
   - Update own profile

## Project Structure

```
store rating portal/
├── backend/
│   ├── routes/
│   │   ├── auth.js       # Authentication routes
│   │   ├── admin.js      # Admin operations
│   │   ├── owner.js      # Store owner operations
│   │   └── store.js      # Store and rating operations
│   ├── middleware/
│   │   ├── auth.js       # JWT verification
│   │   └── validator.js  # Input validation
│   ├── db.js            # Database connection
│   ├── schema.sql       # Database schema
│   ├── server.js        # Express server
│   └── .env             # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx      # Main application component
│   │   ├── main.jsx     # Entry point
│   │   ├── App.css      # Component styles
│   │   └── index.css    # Global styles
│   ├── index.html       # HTML template
│   ├── vite.config.js   # Vite configuration
│   └── .env             # Frontend environment variables
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-password` - Update password

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stores` - Get all stores

### Stores
- `GET /api/stores` - Get all stores
- `POST /api/stores` - Create new store (Owner only)
- `PUT /api/stores/:id` - Update store (Owner only)
- `DELETE /api/stores/:id` - Delete store (Owner only)
- `POST /api/stores/:id/rate` - Rate a store (User only)

### Owner
- `GET /api/owner/stores` - Get owner's stores
- `GET /api/owner/stats` - Get owner statistics

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

### Backend

The backend runs in production mode with:

```bash
cd backend
npm start
```

Make sure to update the `.env.production` file in frontend with your production API URL.

## Troubleshooting

### Blank Screen Issue

If you see a blank screen:

1. Check browser console for errors (F12)
2. Verify backend is running on port 5001
3. Verify frontend .env has correct API URL
4. Clear browser cache and localStorage
5. Check that PostgreSQL database is running
6. Verify all npm dependencies are installed

### Common Issues

**CORS Errors**
- Update backend CORS configuration in `server.js`
- Ensure FRONTEND_URL env variable is set correctly

**Database Connection**
- Verify PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Ensure database schema is loaded

**Port Already in Use**
- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env

## License

MIT

## Author

Shivam Sen
