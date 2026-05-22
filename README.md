## DEVPULSE

This repository contains my assignment work.

### About Me:

- I'm Md. Mehedi Hasan. I'm front-end developer & specialize in React.js, Next.js, JavaScript, TailwindCSS etc. I'm currently improving backend related technology.

---

### Live URL:

- [https://dev-pulse-ochre.vercel.app/](https://dev-pulse-ochre.vercel.app/)

---

### Features:

- User Authentication (Register / Login)
- JWT-based secure authentication
- Password hashing with bcrypt
- Create, Read, Update, Delete Issues
- Issue filtering & sorting support
- Protected routes using middleware
- Reporter info attached to each issue
- Modular and scalable architecture

---

### Tech stack:

- Node.js
- TypeScript
- express.js
- PostgreSQL with pg driver
- bcrypt
- jsonwebtoken
- dotenv
- tsup (build tool)

---

### API END POINT:

### Auth:

| Method | EndPoint         |
| ------ | ---------------- |
| POST   | /api/auth/signup |
| POST   | /api/auth/login  |

### Issues:

| Method | EndPoint                 |
| ------ | ------------------------ |
| POST   | /api/issues/             |
| GET    | /api/issues/?sort=newest |
| GET    | /api/issues/:id          |
| PATCH  | /api/issues/:id          |
| DELETE | /api/issues/:id          |

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone git@github.com:mehediweb01/DevPulse.git
cd DevPulse
npm install
```

### 2. Environment Variables (.env)

```bash
DATABASE_URL=your_postgres_connection_url
JWT_SECRET=your_secret_key
PORT=3000
```

### 3. Run development server

```bash
npm run dev
```

### 4. Build Project

```bash
npm run build

```

### 5. Run production server

```bash
npm start
```

---

### Database Schema Summary:

#### Users Table:

| Field      | Type                | Description              |
| ---------- | ------------------- | ------------------------ |
| id         | SERIAL              | Unique user ID           |
| name       | VARCHAR(150)        | User name                |
| email      | VARCHAR(100) UNIQUE | User email               |
| password   | TEXT                | Hashed password          |
| role       | VARCHAR(15)         | contributor / maintainer |
| created_at | TIMESTAMP           | Account created time     |
| updated_at | TIMESTAMP           | Account updated time     |

#### Issues Table:

| Field       | Type         | Description                   |
| ----------- | ------------ | ----------------------------- |
| id          | SERIAL       | Unique issue ID               |
| title       | VARCHAR(150) | issue title                   |
| description | TEXT         | issue description             |
| type        | VARCHAR(16)  | bug / feature_request         |
| status      | VARCHAR(14)  | open / in_progress / resolved |
| reporter_id | INT          | user id                       |
| created_at  | TIMESTAMP    | Account created time          |
| updated_at  | TIMESTAMP    | Account updated time          |

---

### Contact Me:

- Email: mehedihasan87456@gmail.com
- WhatsApp: +8801576794817
- [GitHub](https://github.com/mehediweb01)
- [LinkedIn](https://www.linkedin.com/in/mehediweb01/)

---

### Thank you

### Best Regards: <br/>

Md. Mehedi Hasan
