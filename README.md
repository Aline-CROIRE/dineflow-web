
# DINEFLOW Web Restaurant Management System

DINEFLOW Web is a responsive restaurant web application built with **React 18** and **styled-components**. It connects to a serverless **Django REST Framework** API on Vercel and a cloud **PostgreSQL** database on Neon.tech.

---

## Live Links

- **Live Web App**: [https://dineflow-web-gamma.vercel.app/](https://dineflow-web-gamma.vercel.app/)
- **API Documentation (Swagger)**: [https://dineflow-api.vercel.app/api/docs/](https://dineflow-api.vercel.app/api/docs/)
- **Backend API**: [https://dineflow-api.vercel.app/api/](https://dineflow-api.vercel.app/api/)

---

## Design System & Color Palette

Designed with an eye-friendly, warm bistro palette that eliminates harsh white glare:

| Swatch | Color Name | Hex Code | Role |
| :--- | :--- | :--- | :--- |
| **Espresso Black** | Deep Canvas | `#191515` | Low-glare dark background |
| **Dark Roast** | Surface Layer | `#241E1E` | Elevated card layers |
| **Mocha** | Gradient End | `#7B4B3A` | Button gradient base & borders |
| **Burnt Caramel** | Primary Accent | `#C97C5D` | Call-to-action buttons & badges |
| **Latte** | Warm Tan | `#E7C6A1` | Secondary typography & accents |
| **Vanilla** | Soft Cream | `#FFF0DC` | Primary readable text |

---

## Core Features

- **Authentication & Email Verification**: JWT sign-in, registration, and a 6-digit OTP inbox verification screen with auto-focus and paste support.
- **Menu Catalog**: Real-time category filtering, instant search, price sorting, and dish inspection modal formatted in Rwandan Francs (`RWF`).
- **Table Booking**: Real-time table reservations with seating capacity validation, location filtering, and schedule conflict prevention.
- **Dining Cart & Ordering**: Item adjustments, table assignment, and order submission.
- **Tamper-Proof Billing**: Multi-channel checkout (Card, Cash at Table, Mobile Money) with server-calculated totals, auto table release, and printable receipts.
- **Staff Operations Hub**: Live kitchen queue (PENDING ➔ PREPARING ➔ SERVED) with 10-second auto-sync, table floor setup, dish creation, and admin user administration.
- **Account Settings**: Profile updates and password rotation with visibility eye toggles.

---

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: `styled-components` (CSS-in-JS)
- **State Management**: React Context API (`AuthContext`, `CartContext`)
- **API Client**: Axios with JWT Bearer token interceptor
- **Icons**: `lucide-react`
- **Deployment**: Vercel Serverless (SPA Routing)

---

## Quick Setup & Run Locally

```powershell
# 1. Clone repository
git clone https://github.com/Aline-CROIRE/dineflow-web.git
cd dineflow-web

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

