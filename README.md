# Full-Stack Multilingual PWA Calendar

A modern, full-stack progressive web application featuring a 2026-style calendar interface with multilingual support, event scheduling, and PWA capabilities.

## 🚀 Features

- **Modern Calendar Interface**: Daily and monthly views with 2026 UI trends
- **Event Management**: Full CRUD operations with color-coded events
- **Authentication**: Secure JWT-based authentication system
- **Multilingual Support**: English, Spanish, Portuguese, French, Italian
- **PWA Capabilities**: Installable app with offline support and push notifications
- **Real-time Sync**: Redux Toolkit for state management

## 🛠️ Tech Stack

### Frontend
- Next.js 16
- JavaScript (ES6+)
- TailwindCSS + shadcn UI
- React-Big-Calendar
- Redux Toolkit
- Axios
- next-i18next

### Backend
- Node.js + Express
- MongoDB (Atlas)
- JWT Authentication
- bcrypt
- express-validator

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your MongoDB connection string in `.env`

4. Run development servers:
```bash
# Frontend (Next.js)
npm run dev

# Backend (Express)
npm run server:dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend (REQUIRED in production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agenda?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Production (for Netlify deployment)
FRONTEND_URL=https://your-app.netlify.app
```

**Note:** `MONGODB_URI` is required in production. In development, if not set, the app will use in-memory MongoDB (data will be lost on restart).

## 📁 Project Structure

```
agenda/
├── app/                    # Next.js 16 app directory
│   ├── [locale]/          # i18n routes
│   ├── api/               # API routes (if needed)
│   └── layout.jsx
├── components/            # React components
│   ├── ui/               # shadcn components
│   ├── calendar/         # Calendar components
│   └── auth/             # Auth components
├── lib/                   # Utilities
│   ├── redux/            # Redux store & slices
│   ├── i18n/             # i18n configuration
│   └── utils/            # Helper functions
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── index.js          # Server entry
├── public/                # Static assets
│   ├── icons/            # PWA icons
│   └── manifest.json     # PWA manifest
└── styles/               # Global styles
```

## 🌐 Supported Languages

- English (en)
- Spanish (es)
- Portuguese (pt)
- French (fr)
- Italian (it)

## 📱 PWA Features

- Installable on desktop and mobile
- Offline support via service worker
- Push notifications for event reminders
- Background sync capabilities

## 🎨 UI Design

The application features a modern 2026-style interface with:
- Smooth animations
- Neumorphism and glassmorphism effects
- Rounded corners and soft shadows
- Minimalist layout

## 📝 License

MIT

