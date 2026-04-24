# SmartSeason — Field Monitoring System

[cite_start]Built for the SmartSeason Technical Assessment [cite: 1, 3][cite_start], this system is a streamlined tool for managing agricultural progress across multiple fields during a growing season[cite: 3]. [cite_start]It bridges the gap between high-level coordination and on-the-ground updates[cite: 12, 13].

---

## 🚀 The Stack

- **Frontend**: React 19 (Vite), Tailwind CSS v4, Zustand (State Management), React Router v7.
- **Backend**: Node.js & Express.
- **Database**: MongoDB via Mongoose.
- **Security**: JWT via httpOnly cookies, password hashing with bcryptjs.

---

## 🔑 Demo Credentials

[cite_start]To test the role-based access control[cite: 14], use these accounts:

| Role  | Email              | Password   | [cite_start]Access Level [cite: 11] |
|-------|--------------------|------------|--------------|
| Admin | admin@smartseason.dev | adminpass  | [cite_start]Full oversight [cite: 30] |
| Agent | kamau@ssfms.dev     | agent123   | [cite_start]Assigned fields only [cite: 27] |
| Agent | wanjiru@ssfms.dev   | agent123   | [cite_start]Assigned fields only [cite: 27] |

---

## 🧠 Smart Logic: Field Health

[cite_start]The system features "Computed Status" logic[cite: 40, 45]. [cite_start]Instead of manual tagging, the system determines field health automatically whenever a stage is updated or an observation is logged[cite: 45]:

- [cite_start]**Completed**: Triggered when the stage is set to `harvested`[cite: 38, 44].
- [cite_start]**At Risk**: Triggered if a field hasn't been updated in **60+ days** or if an observation contains warning keywords (e.g., `pest`, `wilt`, `disease`, `dry`, `dead`)[cite: 43, 45].
- [cite_start]**Active**: The default state for all other fields in the Planted, Growing, or Ready stages[cite: 42].

---

## 🛠️ Design Decisions

- [cite_start]**Security First**: Used `httpOnly` cookies for JWT storage to mitigate XSS risks and added a `protect` + `adminProtect` middleware chain to strictly enforce access rights[cite: 14].
- [cite_start]**Reliable Data**: Logic for field scoping is handled at the query level—Agents literally cannot "see" fields not assigned to their ID in the database[cite: 18, 49].
- [cite_start]**Dashboard Insights**: The Admin dashboard uses MongoDB aggregation to provide a real-time status breakdown (Total vs. At Risk vs. Completed), satisfying the requirement for useful system insights[cite: 48, 52, 53].
- [cite_start]**User Experience**: Implemented a searchable agent selector for Admins and a mobile-friendly "Quick Note" feature for agents working in the field[cite: 29, 76].

---

## 💻 Setup & Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Jack17kdb/smartseason-field-monitoring-system.git
   cd smartseason-field-monitoring-system
   npm run build
   npm run start
