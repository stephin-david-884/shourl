# Shourl — URL Shortener

Shourl is a full-stack URL shortening application that allows authenticated users to create, manage, and share shortened URLs.

The project is built with a clean, scalable architecture using **React, Redux Toolkit, Express, TypeScript, MongoDB, and JWT-based authentication**.

## 🌐 Live Application

**Frontend:**
https://shourl-three.vercel.app

**Backend API:**
https://shourl.onrender.com

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Access and refresh token authentication
* HTTP-only authentication cookies
* Refresh token rotation
* Password hashing with bcrypt
* Get current authenticated user
* Logout
* Protected routes

### URL Shortening

* Create shortened URLs
* Automatically generate unique short codes
* View all URLs created by the authenticated user
* Copy shortened URLs
* Open shortened URLs
* Delete URLs
* Ownership validation before deletion
* Public URL redirection
* URL input validation

### User Experience

* Responsive React interface
* Dashboard for creating shortened URLs
* My URLs page
* Loading states
* Error handling
* Empty states
* Copy-to-clipboard functionality
* Protected user routes
* Persistent authentication using cookies

---

## Architecture

The backend follows **Clean Architecture** principles with separation of concerns between the domain, application, infrastructure, and interface layers.

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Redux Toolkit      │
                    │      + Hooks         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Axios API Layer   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express REST API   │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │ Controllers │  │  Use Cases  │  │ Middleware  │
       └──────┬──────┘  └──────┬──────┘  └─────────────┘
              │                │
              │                ▼
              │        ┌─────────────┐
              │        │   Domain    │
              │        │   Entities  │
              │        └──────┬──────┘
              │               │
              │               ▼
              │        ┌─────────────┐
              └───────►│ Repositories│
                       └──────┬──────┘
                              │
                              ▼
                       ┌─────────────┐
                       │  MongoDB    │
                       └─────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Redux Toolkit
* React Redux
* React Router
* Axios

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Zod
* Nanoid
* Cookie Parser

### Development

* ESLint
* Prettier
* TypeScript
* Git & GitHub

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

---

##  Project Structure

```text
Shourl/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── types/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── application/
│   │   │   ├── constants/
│   │   │   ├── dtos/
│   │   │   ├── interfaces/
│   │   │   ├── mappers/
│   │   │   └── usecases/
│   │   │
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── errors/
│   │   │   └── repositories/
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── config/
│   │   │   ├── database/
│   │   │   ├── di/
│   │   │   ├── repositories/
│   │   │   └── services/
│   │   │
│   │   ├── interfaces/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   └── validators/
│   │   │
│   │   └── server.ts
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

##  Application Flow

### Creating a Short URL

```text
User
  │
  ▼
Enter Original URL
  │
  ▼
Fronte
```
