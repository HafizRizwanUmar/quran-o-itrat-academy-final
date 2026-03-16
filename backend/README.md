# Quran O Itrat Academy — Backend API

Node.js + Express + MongoDB REST API with email notifications.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI and SMTP credentials

# 3. Seed database with admin user
npm run seed

# 4. Start development server
npm run dev

# 5. API is available at
http://localhost:5000/api/health
```

## Email Notifications

When a **contact form** or **admission form** is submitted:

1. **Admin notification** → sent to `ADMIN_EMAIL` with full details + link to admin panel
2. **Auto-reply** → sent to the submitter confirming receipt

To enable emails, configure your SMTP settings in `.env`. The server will start fine without them — it just logs a warning and skips email sending.

### Gmail Setup (Easiest)
1. Enable 2FA on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate a password for "Mail"
4. Set `SMTP_USER` = your Gmail and `SMTP_PASS` = the 16-char app password

## API Endpoints

### Public
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/courses` | List all active courses |
| GET | `/api/courses/:id` | Get single course |
| GET | `/api/library` | List library materials |
| GET | `/api/library/:id/download` | Download library file |
| GET | `/api/study-materials` | List study materials |
| GET | `/api/study-materials/:id/download` | Download study file |
| GET | `/api/articles` | List articles |
| POST | `/api/contact` | Submit contact form + sends emails |
| POST | `/api/admission` | Submit admission form + sends emails |

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current user |

### Admin (requires JWT Bearer token)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/courses` | Create course (multipart/form-data, `image` field) |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Soft-delete course |
| GET/POST/DELETE | `/api/library` | Manage library materials |
| GET/POST/DELETE | `/api/study-materials` | Manage study materials |
| GET/POST/PUT/DELETE | `/api/articles` | Manage articles |
| GET | `/api/contact` | List contact forms |
| PUT | `/api/contact/:id/status` | Update status (new/read/resolved) |
| GET | `/api/admission` | List admissions |
| PUT | `/api/admission/:id/status` | Update status (pending/complete/incomplete) |
| GET | `/api/admin/dashboard/stats` | Dashboard statistics |
| GET | `/api/admin/recent-activity` | Recent activity feed |

## Course Image Upload

Send `multipart/form-data` with an `image` field:

```js
const fd = new FormData();
fd.append('title', 'My Course');
fd.append('image', fileInput.files[0]); // JPEG/PNG, max 5MB
await fetch('/api/courses', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
```

The response will include an `image` field with the path: `/uploads/courses/image-xxxx.jpg`

To display the image in the frontend:
```js
const imageUrl = `${SERVER_BASE_URL}${course.image}`; // e.g. http://localhost:5000/uploads/courses/...
```

## Environment Variables

See `.env.example` for full documentation of all variables.

## Project Structure

```
├── config/          Database connection
├── controllers/     Route handlers (business logic)
├── middleware/      Auth, error handling
├── models/          Mongoose schemas
├── routes/          Express routers
├── scripts/         Database seed script
├── uploads/         Uploaded files (gitignored)
│   ├── courses/     Course images
│   ├── library/     Library files
│   └── study-materials/  Study material files
├── utils/
│   └── mailer.js    Email notification service
├── .env.example     Environment template
└── server.js        Application entry point
```
