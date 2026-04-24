# SmartSeason — Field Monitoring System

Built for the SmartSeason Technical Assessment, this system is a streamlined tool for managing agricultural progress across multiple fields during a growing season. It bridges the gap between high-level coordination and on-the-ground updates.

---

## 🚀 The Stack

- **Frontend**: React 19 (Vite), Tailwind CSS v4, Zustand (State Management), React Router v7.
- **Backend**: Node.js & Express.
- **Database**: MongoDB via Mongoose.
- **Security**: JWT via httpOnly cookies, password hashing with bcryptjs.

---

## 🔑 Demo Credentials

To test the role-based access control, use these accounts:

| Role  | Email              | Password   | Access Level |
|-------|--------------------|------------|--------------|
| Admin | admin@smartseason.dev | adminpass  | Full oversight |
| Agent | kamau@ssfms.dev     | agent123   | Assigned fields only |
| Agent | wanjiru@ssfms.dev   | agent123   | Assigned fields only |

---

## 🧠 Smart Logic: Field Health

The system features "Computed Status" logic. Instead of manual tagging, the system determines field health automatically whenever a stage is updated or an observation is logged:

- **Completed**: Triggered when the stage is set to `harvested`.
- **At Risk**: Triggered if a field hasn't been updated in **60+ days** or if an observation contains warning keywords (e.g., `pest`, `wilt`, `disease`, `dry`, `dead`).
- **Active**: The default state for all other fields in the Planted, Growing, or Ready stages.

---

## 🛠️ Design Decisions

- **Security First**: Used `httpOnly` cookies for JWT storage to mitigate XSS risks and added a `protect` + `adminProtect` middleware chain to strictly enforce access rights.
- **Reliable Data**: Logic for field scoping is handled at the query level—Agents literally cannot "see" fields not assigned to their ID in the database.
- **Dashboard Insights**: The Admin dashboard uses MongoDB aggregation to provide a real-time status breakdown (Total vs. At Risk vs. Completed), satisfying the requirement for useful system insights.
- **User Experience**: Implemented a searchable agent selector for Admins and a mobile-friendly "Quick Note" feature for agents working in the field.

---

## 💻 Setup & Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Jack17kdb/smartseason-field-monitoring-system.git
   cd smartseason-field-monitoring-system
   npm run build
   npm run start
