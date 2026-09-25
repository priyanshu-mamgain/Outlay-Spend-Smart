# Outlay — Personal Expense Management

> **Simple spending. Smarter insights.**

Outlay is a full-stack personal expense management application built to make everyday expense tracking simple, secure, and insightful.

Users can create an account, manage their expenses, categorize spending, and view summarized spending insights through a responsive dashboard.

---

## 🚀 Live Demo

**Frontend:**
https://outlay-spend-smart.netlify.app/

**Backend API:**
https://outlay-spend-smart.up.railway.app/

---

## ✨ Features

- 🔐 Secure email authentication with Supabase Auth
- 👤 User-specific expense data
- ➕ Add new expenses
- ✏️ Edit existing expenses
- 🗑️ Delete expenses
- 🏷️ Categorize expenses
- 🔎 Filter expenses by category
- 📊 Spending summaries and visual charts
- 📅 Monthly and overall spending totals
- 💾 Persistent database storage
- 🔒 JWT-based API authentication
- 🌐 Production deployment with Netlify and Railway
- 📱 Responsive dashboard interface

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- Supabase JavaScript Client

### Backend
- Python
- FastAPI
- SQLAlchemy
- PyJWT
- Uvicorn

### Database & Authentication
- Supabase PostgreSQL
- Supabase Authentication

### Deployment
- Netlify — Frontend
- Railway — Backend API
- Supabase — Database & Authentication

### Development Tools
- Git
- GitHub
- VS Code

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│             User             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     React + Vite Frontend    │
│           Netlify             │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│       FastAPI Backend        │
│           Railway              │
└──────────────┬───────────────┘
               │
               ├───────────────► Supabase Auth
               │
               ▼
┌──────────────────────────────┐
│     PostgreSQL Database      │
│           Supabase             │
└──────────────────────────────┘
```

---

## 🔐 Authentication & Security

Outlay uses Supabase Authentication for user authentication.

After login, the frontend receives an authentication token and sends it with API requests:

```
Authorization: Bearer <access_token>
```

The FastAPI backend verifies the JWT before allowing access to protected endpoints.

Every expense is associated with the authenticated user's ID. This ensures that users can only access and modify their own expenses.

---

## 📂 Project Structure

```
Outlay-Spend-Smart/
│
├── backend/
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── .gitignore
│
├── public/
│   └── favicon.png
│
├── src/
│   ├── auth/
│   │   └── Auth.jsx
│   │
│   ├── components/
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── ExpenseItem.jsx
│   │   ├── Filter.jsx
│   │   ├── Summary.jsx
│   │   └── Chart.jsx
│   │
│   ├── constants/
│   │   └── categories.js
│   │
│   ├── context/
│   │   ├── ExpenseContext.jsx
│   │   ├── ExpenseContextValue.js
│   │   └── UseExpenseContext.js
│   │
│   ├── hooks/
│   │   └── useExpenseStats.js
│   │
│   ├── lib/
│   │   └── supabase.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend

Create a `.env` file in the project root:

```
VITE_API_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### Backend

Create `backend/.env`:

```
SUPABASE_URL=your_supabase_project_url
DATABASE_URL=your_database_connection_string
```

> Never commit `.env` files or expose secret credentials in the repository.

---

## 💻 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/priyanshu-mamgain/Outlay-Spend-Smart.git
cd Outlay-Spend-Smart
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Start the frontend
```bash
npm run dev
```
The frontend will normally run at `http://localhost:5173`

### 4. Set up the backend

Navigate to the backend:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
python -m venv venv
```

Windows:
```bash
venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 5. Start FastAPI
```bash
uvicorn main:app --reload
```
The local API will run at `http://127.0.0.1:8000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| GET | `/expenses` | Get authenticated user's expenses |
| POST | `/expenses` | Create an expense |
| PUT | `/expenses/{id}` | Update an expense |
| DELETE | `/expenses/{id}` | Delete an expense |

Protected expense endpoints require a valid Supabase access token.

---

## 🏷️ Expense Categories

Outlay currently supports:

- 🍔 Food
- 🚗 Transport
- 🎬 Entertainment
- 🛍️ Shopping
- ⚡ Utilities
- ❤️ Health
- 🎓 Education
- 📦 Other

---

## 📊 Dashboard

The dashboard provides:

- Monthly spending total
- Overall spending total
- Category-wise spending breakdown
- Expense counts
- Expense history
- Category filtering
- Visual spending charts

---

## 🔄 Data Flow

```
User Login
    ↓
Supabase Authentication
    ↓
Access Token
    ↓
React Frontend
    ↓
FastAPI API Request
    ↓
JWT Verification
    ↓
Authenticated User ID
    ↓
PostgreSQL
    ↓
Expense Data
    ↓
React Dashboard
```

---

## 🌐 Deployment

### Frontend
The React application is deployed using **Netlify**.

### Backend
The FastAPI application is deployed using **Railway**.

Production API:
```
https://outlay-spend-smart.up.railway.app
```

### Database
PostgreSQL is hosted through **Supabase**. Authentication is also handled through Supabase.

---

## 🎯 Project Goals

Outlay was built to demonstrate practical full-stack development concepts including:

- React application architecture
- REST API development
- Authentication
- JWT verification
- Database integration
- CRUD operations
- User-specific data access
- API security
- Environment variable management
- Cloud deployment
- Frontend/backend integration

---

## 🔮 Future Improvements

- [ ] Budget management
- [ ] Advanced monthly analytics
- [ ] Search functionality
- [ ] CSV export
- [ ] Recurring expenses
- [ ] Custom categories
- [ ] Improved mobile experience
- [ ] User profile and settings
- [ ] More detailed financial insights

---

## 👨‍💻 Author

**Priyanshu Mamgain**
B.Sc. Computer Science, ITM Dehradun

- GitHub: [github.com/priyanshu-mamgain](https://github.com/priyanshu-mamgain)
- Portfolio: [priyanshu-mamgain.github.io/priyanshu-portfolio](https://priyanshu-mamgain.github.io/priyanshu-portfolio/)

---

## 📄 License

This project is intended for educational, learning and portfolio purposes.