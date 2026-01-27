# Frontend Architecture Overview

## Implementation Status

This document provides a high-level overview of the production-grade frontend implementation based on FRONTEND_SPECIFICATION.md.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   Pages     │  │  Layouts    │  │ Components  │  │   Guards    │           │
│  │ (App Router)│  │ (Sidebars,  │  │    (UI)     │  │  (Route     │           │
│  │             │  │  Headers)   │  │             │  │  Protection)│           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
└─────────┼────────────────┼────────────────┼────────────────┼───────────────────┘
          │                │                │                │
┌─────────┴────────────────┴────────────────┴────────────────┴───────────────────┐
│                               STATE LAYER                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  │   React Query       │  │    Auth Context     │  │    Toast Context        │ │
│  │   (Server State)    │  │    (User/Partner)   │  │    (Notifications)      │ │
│  │   - Caching         │  │    - Dual Auth      │  │    - Success/Error      │ │
│  │   - Background Sync │  │    - Permissions    │  │                         │ │
│  └──────────┬──────────┘  └──────────┬──────────┘  └─────────────────────────┘ │
└─────────────┼─────────────────────────┼────────────────────────────────────────┘
              │                         │
┌─────────────┴─────────────────────────┴────────────────────────────────────────┐
│                               API LAYER                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  │   Axios Client      │  │   API Services      │  │    Query Keys           │ │
│  │   - Interceptors    │  │   - auth.api.ts     │  │    - Centralized        │ │
│  │   - Token Refresh   │  │   - partner.api.ts  │  │    - Type-safe          │ │
│  │   - Error Handling  │  │   - admin.api.ts    │  │                         │ │
│  │                     │  │   - services.api.ts │  │                         │ │
│  └──────────┬──────────┘  └──────────┬──────────┘  └─────────────────────────┘ │
└─────────────┼─────────────────────────┼────────────────────────────────────────┘
              │                         │
              └───────────┬─────────────┘
                          │
              ┌───────────▼───────────┐
              │     Backend API       │
              │   /api/auth/*         │
              │   /api/admin/*        │
              │   /api/partner/*      │
              │   /api/services/*     │
              └───────────────────────┘
```

---

## 2. Folder Structure

```
frontend/src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Customer auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (pages)/                  # Public pages
│   │   └── services/
│   ├── admin/                    # Admin dashboard
│   ├── partner/                  # Partner portal
│   └── customer/                 # Customer portal
│
├── components/
│   ├── ui/                       # ✅ Reusable UI Components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Modal/
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Table/
│   │   ├── Toast/
│   │   ├── Skeleton/
│   │   ├── EmptyState/
│   │   ├── Pagination/
│   │   ├── Spinner/
│   │   └── index.ts              # Barrel export
│   │
│   ├── forms/                    # ✅ Dynamic Form Engine
│   │   └── DynamicForm/
│   │       ├── DynamicForm.tsx   # Main component
│   │       ├── FormContext.tsx   # Form state management
│   │       ├── FieldRenderers.tsx # 13 field types
│   │       ├── MediaFieldRenderers.tsx # image, gallery, location
│   │       ├── types.ts          # Form type definitions
│   │       └── index.ts
│   │
│   └── guards/                   # ✅ Route Protection
│       └── RouteGuards.tsx
│
├── context/
│   └── AuthContext.tsx           # ✅ Dual Auth (User + Partner)
│
├── hooks/                        # ✅ React Query Hooks
│   ├── useAuth.ts
│   ├── usePartner.ts
│   ├── useAdmin.ts
│   ├── useServices.ts
│   └── index.ts
│
├── layouts/                      # ✅ Layout Components
│   ├── PublicHeader/
│   ├── AdminSidebar/
│   ├── PartnerSidebar/
│   └── index.ts
│
├── lib/
│   ├── api/                      # ✅ API Layer
│   │   ├── client.ts             # Axios with interceptors
│   │   ├── queryKeys.ts          # Centralized query keys
│   │   └── services/
│   │       ├── auth.api.ts
│   │       ├── partner.api.ts
│   │       ├── admin.api.ts
│   │       └── services.api.ts
│   │
│   └── validations/              # ✅ Zod Schemas
│       └── schemas.ts
│
└── types/                        # ✅ TypeScript Types
    ├── index.ts                  # Domain entities
    └── api.ts                    # API request/response types
```

---

## 3. Routing Map

| Route | Component | Role | Description |
|-------|-----------|------|-------------|
| `/` | HomePage | Public | Landing page |
| `/services` | ServicesPage | Public | Service browsing |
| `/services/:serviceTypeKey` | ServiceTypePage | Public | Service type listing |
| `/partner/:partnerId` | PartnerProfilePage | Public | Partner detail page |
| `/login` | LoginPage | Public | Customer login |
| `/register` | RegisterPage | Public | Customer registration |
| `/partner/login` | PartnerLoginPage | Public | Partner login |
| `/partner/register` | PartnerRegisterPage | Public | Partner registration wizard |
| `/partner/dashboard` | PartnerDashboard | Partner (approved) | Partner stats |
| `/partner/items` | PartnerItems | Partner (approved) | Service items CRUD |
| `/partner/status` | PartnerStatus | Partner (pending) | Application status |
| `/partner/profile` | PartnerProfile | Partner | Profile management |
| `/admin/dashboard` | AdminDashboard | Admin | Admin overview |
| `/admin/service-types` | ServiceTypes | Admin | Service types CRUD |
| `/admin/partners` | Partners | Admin | Partner management |
| `/admin/service-items` | ServiceItems | Admin | Items management |
| `/admin/users` | Users | Admin | User management |

---

## 4. Auth Strategy

### Dual Authentication System

```typescript
// AuthContext supports both User and Partner authentication

interface AuthContextValue {
  // User (Customer) Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Partner Auth
  partner: Partner | null;
  isPartnerAuthenticated: boolean;
  partnerLogin: (email: string, password: string) => Promise<void>;
  partnerLogout: () => void;
  partnerPermissions: PartnerPermissions;
}
```

### Route Guards

```typescript
// Available Guards
<PublicRouteGuard />      // Redirects authenticated users
<UserRouteGuard />        // Requires authenticated customer
<AdminRouteGuard />       // Requires admin role
<PartnerRouteGuard        // Requires partner auth + valid state
  allowedStates={['approved']}
  redirectPath="/partner/status"
/>

// HOC versions
withUserAuth(Component)
withAdminAuth(Component)
withPartnerAuth(Component, options)
```

### Partner States & Permissions

| State | can_view_dashboard | can_manage_items | can_edit_profile |
|-------|-------------------|------------------|------------------|
| pending_otp | ❌ | ❌ | ❌ |
| pending_approval | ❌ | ❌ | ✅ |
| changes_required | ❌ | ❌ | ✅ |
| rejected | ❌ | ❌ | ❌ |
| approved | ✅ | ✅ | ✅ |
| suspended | ❌ | ❌ | ❌ |

---

## 5. Dynamic Form Engine

### Supported Field Types (18)

| Type | Renderer | Description |
|------|----------|-------------|
| `text` | TextFieldRenderer | Single-line text input |
| `textarea` | TextareaFieldRenderer | Multi-line text input |
| `number` | NumberFieldRenderer | Integer input |
| `decimal` | NumberFieldRenderer | Decimal number input |
| `boolean` | BooleanFieldRenderer | Checkbox/Switch/Radio |
| `select` | SelectFieldRenderer | Single select dropdown |
| `multiselect` | MultiSelectFieldRenderer | Multiple select |
| `date` | DateFieldRenderer | Date picker |
| `time` | TimeFieldRenderer | Time picker |
| `datetime` | DateTimeFieldRenderer | Date and time picker |
| `timeRange` | TimeRangeFieldRenderer | Start/end time range |
| `image` | ImageFieldRenderer | Single image upload |
| `gallery` | GalleryFieldRenderer | Multiple image upload |
| `location` | LocationFieldRenderer | Lat/lng with geolocation |
| `phone` | PhoneFieldRenderer | Phone number input |
| `email` | EmailFieldRenderer | Email input |
| `url` | UrlFieldRenderer | URL input |
| `rating` | RatingFieldRenderer | Star rating |
| `price` | PriceFieldRenderer | Price with currency |

### Usage Example

```tsx
import { DynamicForm, createFormConfigFromFields } from '@/components/forms/DynamicForm';

// Convert backend fields to form config
const config = createFormConfigFromFields(serviceType.requiredFields, {
  id: 'service-item-form',
  submitLabel: 'حفظ العنصر',
  columns: 2,
});

<DynamicForm
  config={config}
  initialValues={existingItem?.dynamicFields || {}}
  onSubmit={handleSubmit}
  loading={isSubmitting}
/>
```

---

## 6. API Layer

### Query Keys Structure

```typescript
const queryKeys = {
  auth: {
    user: () => ['auth', 'user'],
  },
  adminPartners: {
    all: () => ['admin', 'partners'],
    list: (params) => ['admin', 'partners', 'list', params],
    detail: (id) => ['admin', 'partners', id],
    stats: () => ['admin', 'partners', 'stats'],
  },
  partner: {
    current: () => ['partner', 'current'],
    items: {
      all: () => ['partner', 'items'],
      list: (params) => ['partner', 'items', 'list', params],
      detail: (id) => ['partner', 'items', id],
    },
  },
  // ... more
};
```

### React Query Hooks

```typescript
// Auth hooks
const { login, logout } = useUserLogin();
const { mutate: register } = useUserRegister();

// Partner hooks
const { data: items } = usePartnerItems(pagination);
const { mutate: createItem } = useCreatePartnerItem();
const { mutate: updateItem } = useUpdatePartnerItem();

// Admin hooks
const { data: partners } = useAdminPartners(filters);
const { mutate: approvePartner } = useApprovePartner();
const { mutate: rejectPartner } = useRejectPartner();

// Services hooks
const { data: serviceTypes } = useServiceTypes();
const { data: publicItems } = usePublicServiceItems(params);
```

---

## 7. UI Component Catalog

### Available Components

| Component | Variants | Props |
|-----------|----------|-------|
| **Button** | primary, secondary, outline, danger, success, ghost, link | size, loading, disabled, fullWidth |
| **Input** | default | label, error, helperText, leftIcon, rightIcon |
| **Textarea** | default | rows, resize |
| **Select** | single | options, searchable |
| **MultiSelect** | default | options, maxSelections |
| **Modal** | sm, md, lg, xl, full | closable, closeOnOverlay |
| **ConfirmModal** | danger, warning, success, info | confirmLabel, cancelLabel |
| **Badge** | primary, secondary, success, warning, danger, info | size |
| **StateBadge** | partner, item | state |
| **Card** | default, bordered, elevated, flat | padding, hoverable, clickable |
| **StatsCard** | default | icon, title, value, trend |
| **Table** | default | striped, hoverable, bordered, selectable |
| **Toast** | success, error, warning, info | duration, dismissible |
| **Skeleton** | text, circular, rectangular, rounded | animation |
| **EmptyState** | default, compact, inline | icon, title, description, action |
| **Pagination** | default | siblingCount, showFirstLast, showPrevNext |
| **Spinner** | xs, sm, md, lg, xl | color |

---

## 8. Backend Gaps Identified

Per FRONTEND_SPECIFICATION.md section 7, the following backend gaps were documented:

| Gap | Current Workaround |
|-----|-------------------|
| `GET /api/services/:partnerId` missing | Extract partner info from items response |
| Partner listing by ServiceType needs partner-level data | Group search results by partnerId |
| Missing `isFeatured` filter | Client-side filtering |

---

## 9. Implementation Progress

### Completed ✅
1. Architecture Design & Planning
2. TypeScript Configuration
3. API Layer Abstraction (Axios + services)
4. Type Definitions & Zod Schemas
5. React Query Hooks (50+ hooks)
6. Auth Context & Route Guards
7. Reusable UI Components (12 components)
8. Dynamic Form Engine (18 field types)
9. Layout Components (PublicHeader, AdminSidebar, PartnerSidebar)

### Remaining 📋
10. Partner Registration Flow (3-step wizard)
11. Partner Dashboard & Items
12. Admin Dashboard Module
13. Admin Service Types Module
14. Admin Partners Module
15. Public Pages & Search
16. Customer Auth Pages

---

## 10. Performance Optimization Notes

1. **Code Splitting**: Use `next/dynamic` for heavy components
2. **Image Optimization**: Use `next/image` for all images
3. **Query Caching**: React Query with 5-minute stale time
4. **Suspense Boundaries**: Wrap data-dependent components
5. **CSS Modules**: Scoped styles, no runtime overhead
6. **Bundle Analysis**: Monitor with `@next/bundle-analyzer`

---

*Document generated based on FRONTEND_SPECIFICATION.md implementation*
