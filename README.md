# SmartGrade AI 🎓
> **Multimodal AI-Assisted Assessment, Formative Feedback & Academic Retention Platform**  
> *Developed for Software Engineering (B.Tech Computer Science & Engineering)*  
> *Aligned with United Nations Sustainable Development Goal 4 (SDG 4: Quality Education)*

[![React](https://img.shields.io/badge/React-19.2-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.4-2D3748.svg?logo=prisma)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange.svg?logo=google)](https://ai.google.dev/)

---

## 📌 Complete Software Engineering Documentation
For full IEEE 830 Requirements Specification, 3-Tier Architectural Diagrams (Mermaid), Database ERD, Test Matrices, and Professor Presentation Scripts:  
👉 **See [SOFTWARE_ENGINEERING_DOCUMENTATION.md](./SOFTWARE_ENGINEERING_DOCUMENTATION.md)**

---

## 🚀 Key Features in Working Condition

### 1. 🤖 Multimodal AI Grading Engine
- **Text & Handwritten OCR:** Students can type answers directly in Markdown or upload scanned handwritten pages (PDF, JPG, PNG).
- **Legibility Guardrail:** Blurry or unreadable scans are automatically intercepted with a friendly retake prompt (`ILLEGIBLE_HANDWRITING`).
- **Rubric-Aligned Scoring:** Evaluates solutions against teacher rubrics, generating granular breakdowns: strengths, weaknesses, actionable tips, knowledge gaps, and an individualized 3-step learning path.

### 2. 📅 Lecture-Wise Attendance (80% Mandatory Rule)
- Dedicated attendance tracking for college courses: **Python Programming, Java Programming, Calculus II, Software Engineering, and Computer Networks**.
- Tracks **Lectures vs. Labs** with real-time percentage accounting.
- **Exam Eligibility Alert:** Automatic red alert banners and "At Risk" flags whenever attendance drops below the institution's mandatory **80% threshold**.

### 3. 👥 Tri-Stakeholder Ecosystem (RBAC)
- **Student Portal:** Assignment submissions, AI feedback history, interactive progress graphs (trend line, radar skill mastery), and gamified badge achievements.
- **Teacher Portal:** Assignment creation with custom rubrics, class analytics histograms, automated detection of academically at-risk students, and exportable reports.
- **Parent Portal:** Course-wise attendance monitoring, early debarment warnings, teacher feedback reviews, and direct faculty chat.

### 4. 🛡️ Dual-Mode Resilience Architecture
- Operates connected to live **PostgreSQL** via Prisma ORM.
- Includes **seamless offline fallback**: if the local database service is stopped, the client automatically degrades to built-in demo fixtures without breaking user flows or throwing 500 errors.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, React Router v7, Vite 7 |
| **Styling & Motion** | Tailwind CSS v4 (Pure Light Mode), Framer Motion |
| **Data Visualization** | Recharts (Area charts, Bar distributions, Radar charts) |
| **Backend API** | Node.js, Express 5, CORS, Dotenv |
| **Database & ORM** | PostgreSQL, Prisma ORM 7 |
| **AI Inference** | Google Gemini 2.5 Flash Vision Multimodal API |

---

## ⚡ Quick Start & Local Execution

### Prerequisites
- **Node.js** (v18.x or v20.x)
- **npm** (v9.x or v10.x)

### 1. Clone & Install
```bash
git clone https://github.com/sujalmahajan0426-byte/SmartGrade-AI.git
cd SmartGrade-AI

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Start Servers

**Terminal 1 (Frontend):**
```bash
npm run dev
# Running on http://localhost:5173
```

**Terminal 2 (Backend):**
```bash
cd server
npm start
# Running on http://localhost:5001
```

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access URL |
| :--- | :--- | :--- | :--- |
| **Student** | `student@demo.com` | `demo123` | `http://localhost:5173/student` |
| **Teacher** | `teacher@demo.com` | `demo123` | `http://localhost:5173/teacher` |
| **Parent** | `parent@demo.com` | `demo123` | `http://localhost:5173/parent` |

---

## 📂 Project Architecture Map

```
SmartGrade-AI/
├── SOFTWARE_ENGINEERING_DOCUMENTATION.md  # Complete SRS, SAD, ERD & Test Matrix
├── src/                                  # Presentation Tier (React 19)
│   ├── components/                       # Reusable UI Atoms & Layouts
│   ├── context/                          # AuthContext (Dual-Mode Session Engine)
│   ├── data/                             # College Curriculum & Mock Data Sets
│   ├── pages/                            # Portals: student/, teacher/, parent/
│   └── utils/                            # Gemini 2.5 Flash API & Chat Service
└── server/                               # Application Tier (Node/Express API)
    ├── prisma/                           # Schema definitions & migrations
    └── src/                              # Controllers, Routes, Services (MVC)
```

---

## 📄 License
Academic Software Engineering Project — Built for educational demonstration and evaluation.
