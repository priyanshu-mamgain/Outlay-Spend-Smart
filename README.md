# Outlay

### Simple Spending. Smarter Insights.

Outlay is a full-stack personal expense management application built to make everyday expense tracking simple, organized, and insightful.

It combines a React-based frontend with a FastAPI backend, PostgreSQL database, and Supabase authentication to provide secure, user-specific expense management.

---

## ✨ Features

- 🔐 Secure user authentication with Supabase
- 👤 User-specific expense data
- ➕ Add expenses with title, amount, category, and date
- ✏️ Edit existing expenses
- 🗑️ Delete expenses
- 🔎 Filter expenses by category
- 📊 Expense summaries and category breakdowns
- 📈 Visual spending insights with Recharts
- 💾 Persistent database storage
- ⚡ Responsive interface
- 🛡️ JWT-based API authentication
- 🔒 Environment variables for sensitive configuration

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React

### Backend

- FastAPI
- Python
- SQLAlchemy
- PyJWT

### Database & Authentication

- PostgreSQL
- Supabase
- Supabase Authentication

### Tools

- Git
- GitHub
- VS Code

---

## 🏗️ Architecture

```text
React Frontend
      │
      │ JWT Authentication
      ▼
FastAPI Backend
      │
      │ SQLAlchemy
      ▼
PostgreSQL / Supabase