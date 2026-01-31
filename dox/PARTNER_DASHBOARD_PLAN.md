# Partner Dashboard Implementation Plan

Based on `Partner_Production_APIs_v2.postman_collection.json`, here is the breakdown of tasks to build the Partner Dashboard.

## Phase 1: Core Architecture & Authentication
**Objective:** Establish the secure foundation and entry points.

- [ ] **1.1 Route Structure & Layout**
    - Create `src/app/partner-portal` (or similar disconnected from main site layout).
    - Implement `layout.tsx` with Sidebar navigation and Header.
    - Implement Client-side simple active link logic.
- [ ] **1.2 Authentication Pages**
    - `src/app/partner-portal/auth/login/page.tsx`
    - `src/app/partner-portal/auth/forgot-password/page.tsx`
    - `src/app/partner-portal/auth/reset-password/page.tsx`
    - *Note: Registration is assumed to be the existing `partner` wizard, but we ensure redirection to login after.*
- [ ] **1.3 Auth Integration Hook**
    - Create `usePartnerAuth` hook (or Context).
    - Handle `POST /login`.
    - Handle Token storage (Cookies/LocalStorage) and `POST /refresh-token` logic.
    - Implement Route Protection (Middleware or Layout check).

## Phase 2: Dashboard Home & Profile
**Objective:** Allow partners to see their status and manage their business identity.

- [ ] **2.1 Dashboard Home / Status**
    - Page: `src/app/partner-portal/dashboard/page.tsx`
    - Fetch & Display Status: `GET /me/status` (Pending, Approved, Changes Required).
    - Fetch & Display Summary Stats: `GET /items/summary`.
- [ ] **2.2 Profile Management**
    - Page: `src/app/partner-portal/dashboard/profile/page.tsx`
    - Feed data from `GET /me/profile`.
    - Form to `PUT /me/profile`.
    - "Resubmit" action for partners in `changes_required` state.
- [ ] **2.3 Media Manager (Cloudinary)**
    - Component: `MediaGallery.client.tsx`.
    - Integration: `GET /me/media` (List), `GET /media/signature` (Upload), `POST /me/media` (Save).

## Phase 3: Service Items Management
**Objective:** The core business value - managing listings.

- [ ] **3.1 Items List**
    - Page: `src/app/partner-portal/dashboard/items/page.tsx`
    - Table displaying Items (`GET /items`).
    - Filters: State (Active/Draft), Sorting.
    - Pagination logic.
- [ ] **3.2 Item Editor (Dynamic Form)**
    - Page: `src/app/partner-portal/dashboard/items/create/page.tsx` & `[id]/page.tsx`.
    - Fetch Fields: `GET /items/fields` to render the correct form fields dynamically.
    - Language Toggles (Ar/En) for localized fields.
- [ ] **3.3 Item State Actions**
    - UI Actions: Publish, Unpublish, Archive.
    - Integration: `POST /items/:id/state`.

## Tech Stack Note
- **Styling:** CSS Modules (`style.module.css`).
- **Data Fetching:** Server Components for initial data (`page.jsx`), Client Components for mutations (`useSWR` or `React Query` suggested, or standard `fetch`).
- **Icons:** Lucide React or similar (consistent with current app).
