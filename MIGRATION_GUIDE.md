# 📚 DAW Bookstore - Project Structure & Migration Guide

## ✅ Project Reorganization Complete! 

Dự án đã được refactor từ cấu trúc **duplicate projects** sang **unified monorepo** với **module-based architecture**.

---

## 📁 New Structure Overview

```
src/
├── App.tsx                    ⭐ Main routing hub (nhập/xuất tất cả routes)
├── main.tsx
├── types.ts                   (shared types)
│
├── contexts/
│   └── AuthContext.tsx        (root-level auth - shared)
│
├── components/
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   └── ... (other shared components)
│
├── services/
│   ├── api.ts                 (unified API client)
│   ├── bookService.ts         (book API calls)
│   └── categoryService.ts     (category API calls)
│
├── shared/                     📦 Code dùng chung giữa các module
│   ├── components/            (buttons, cards, forms, etc)
│   ├── contexts/              (other shared contexts)
│   ├── services/              (utility services)
│   ├── types/                 (type definitions)
│   └── index.ts
│
├── kiet/                       👤 KIET Module - Catalog/Browsing
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   └── BookDetail.tsx
│   ├── components/            (reusable components for Kiet)
│   ├── services/              (Kiet-specific services)
│   └── index.ts
│
├── linh/                       👤 LINH Module - Authentication
│   ├── pages/
│   │   ├── LoginPage.jsx      (TODO: Extract)
│   │   ├── SignupPage.jsx     (TODO: Extract)
│   │   ├── ProfilePage.jsx    (TODO: Extract)
│   │   ├── VerifyPage.jsx     (TODO: Extract)
│   │   └── RegisterSuccess.jsx (TODO: Extract)
│   ├── components/            (TODO: Extract)
│   │   └── AuthForm.jsx
│   ├── contexts/
│   │   └── AuthContext.js     ✅ Prepared
│   ├── services/
│   │   └── userService.js     ✅ Prepared
│   └── index.ts
│
└── hoang/                      👤 HOANG Module - Cart & Admin
    ├── pages/
    │   ├── cart/              (TODO: Extract)
    │   │   ├── Cart.jsx
    │   │   └── CartSidebar.jsx
    │   ├── admin/             (TODO: Extract)
    │   │   ├── AdminDashboard.jsx
    │   │   └── books/, categories/, users/, invoices/
    │   ├── Checkout.jsx       (TODO: Extract)
    │   └── Invoice.jsx        (TODO: Extract)
    ├── components/            (TODO: Extract)
    │   ├── cart/
    │   ├── layouts/
    │   └── PrivateRoute.jsx
    ├── contexts/
    │   ├── CartContext.jsx    ✅ Prepared
    │   └── AuthContext.jsx    ✅ Prepared
    ├── services/
    │   ├── bookService.js     ✅ Prepared
    │   └── categoryService.js ✅ Prepared
    └── index.ts
```

---

## 🔄 Migration Status

### ✅ COMPLETED
- [x] Directory structure created for all 3 modules (kiet, linh, hoang)
- [x] Contexts extracted: CartContext, AuthContext (both modules)
- [x] Services extracted: bookService, categoryService, userService
- [x] App.tsx updated with full routing skeleton
- [x] package.json consolidated with all dependencies
- [x] Module index files created (kiet/index.ts, linh/index.ts, hoang/index.ts)

### 🔨 TODO - Next Steps

#### **LINH's Module (Auth)**
```bash
# 1. Move pages from src/linh/DAW_BOOKSTORE_FE-dev/src/pages/* 
#    to src/linh/pages/
- src/linh/DAW_BOOKSTORE_FE-dev/src/pages/LoginPage.jsx
- src/linh/DAW_BOOKSTORE_FE-dev/src/pages/SignupPage.jsx
- src/linh/DAW_BOOKSTORE_FE-dev/src/pages/ProfilePage.jsx
- src/linh/DAW_BOOKSTORE_FE-dev/src/pages/VerifyPage.jsx
- src/linh/DAW_BOOKSTORE_FE-dev/src/pages/RegisterSuccess.jsx

# 2. Move components
- src/linh/DAW_BOOKSTORE_FE-dev/src/components/AuthForm.jsx → src/linh/components/

# 3. Move/copy config
- src/linh/DAW_BOOKSTORE_FE-dev/src/config/axiosClient.js → src/linh/config/

# 4. Update imports in all Linh files:
#    OLD: '../services/userService'
#    NEW: '../services/userService'
#    OLD: '../config/axiosClient'
#    NEW: '../config/axiosClient'
```

#### **HOANG's Module (Cart & Admin)**
```bash
# 1. Move pages from src/hoang/DAW_BOOKSTORE_FE/src/pages/*
#    to src/hoang/pages/
- src/hoang/DAW_BOOKSTORE_FE/src/pages/admin/* → src/hoang/pages/admin/
- src/hoang/DAW_BOOKSTORE_FE/src/pages/cart/* → src/hoang/pages/cart/
- src/hoang/DAW_BOOKSTORE_FE/src/pages/Checkout.jsx
- src/hoang/DAW_BOOKSTORE_FE/src/pages/Invoice.jsx
- src/hoang/DAW_BOOKSTORE_FE/src/pages/Auth/*
- src/hoang/DAW_BOOKSTORE_FE/src/pages/Profile/*

# 2. Move components
- src/hoang/DAW_BOOKSTORE_FE/src/components/cart/* → src/hoang/components/cart/
- src/hoang/DAW_BOOKSTORE_FE/src/components/PrivateRoute.jsx → src/hoang/components/

# 3. Move layouts
- src/hoang/DAW_BOOKSTORE_FE/src/layouts/* → src/hoang/components/layouts/

# 4. Move data mocks
- src/hoang/DAW_BOOKSTORE_FE/src/data/mockData.js → src/hoang/data/

# 5. Update imports:
#    OLD: "../data/mockData"
#    NEW: "../data/mockData"
```

#### **KIET's Module (Catalog)**
```bash
# Pages already in right place (src/pages/Kiet/*)
# Just need to move to src/kiet/pages/ and update imports:
- src/pages/Kiet/Home.tsx → src/kiet/pages/Home.tsx
- src/pages/Kiet/Search.tsx → src/kiet/pages/Search.tsx
- src/pages/Kiet/BookDetail.tsx → src/kiet/pages/BookDetail.tsx

# Update imports in these files:
#    OLD: '../../services/bookService'
#    NEW: '../../services/bookService'
```

---

## 🚀 How to Continue Development

### Setup Development Environment
```bash
# 1. Install dependencies (only root package.json now!)
npm install

# 2. Start dev server
npm run dev

# 3. Application runs at: http://localhost:5173
```

### Adding New Routes to App.tsx
```tsx
// In App.tsx, uncomment the imports and routes as modules get completed

// Example for Linh's module:
import LoginPage from './linh/pages/LoginPage';
import SignupPage from './linh/pages/SignupPage';

<Routes>
  {/* Linh's Routes - Auth */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  // ... more routes
</Routes>
```

### Module Development Guidelines

#### ✅ DO:
- Keep each module **independent** - Kiet, Linh, Hoang
- **Share code** via `src/shared/` folder
- Use **module index files** (index.ts) for clean exports
- Update imports after moving files
- Keep styles in component folders

#### ❌ DON'T:
- Import from other module's pages directly
- Create duplicate utilities in multiple modules
- Leave old project folders (hoang/DAW_BOOKSTORE_FE, linh/DAW_BOOKSTORE_FE-dev)
- Mix TypeScript (.tsx) and JavaScript (.jsx) without reason

### Import Patterns

**Within a module (recommended):**
```tsx
// src/kiet/pages/Home.tsx
import { Home } from '../kiet'; // via module index
// or
import BookDetail from '../kiet/pages/BookDetail';
```

**From shared resources:**
```tsx
// Any module
import { Button, Card } from '../shared/components';
import { api } from '../shared/services';
import type { Book } from '../shared/types';
```

**Between modules (discourage but if needed):**
```tsx
// src/kiet/pages/Home.tsx importing from Linh
import { useAuth } from '../linh'; // via module index
```

---

## 📝 File Migration Checklist

### Linh's Module
- [ ] Create/move pages directory with all .jsx files
- [ ] Move AuthForm.jsx to components
- [ ] Copy axiosClient.js to config folder
- [ ] Update all import paths in moved files
- [ ] Test Login/Signup flows
- [ ] Add routes to App.tsx
- [ ] Test full auth flow

### Hoang's Module
- [ ] Create/move pages/admin directory with all components
- [ ] Create/move pages/cart directory
- [ ] Move Checkout.jsx and Invoice.jsx
- [ ] Move PrivateRoute.jsx to components
- [ ] Move layouts to components/layouts
- [ ] Copy mockData.js to data folder
- [ ] Update all import paths
- [ ] Test Cart functionality
- [ ] Test Admin dashboard
- [ ] Add routes to App.tsx

### Kiet's Module
- [ ] Move Home.tsx, Search.tsx, BookDetail.tsx to kiet/pages/
- [ ] Update import paths
- [ ] Test catalog pages
- [ ] Verify all routes work

---

## 🧹 Cleanup (After Migration Complete)

Once all files are moved and tested:

```bash
# Delete old project folders
rm -rf src/hoang/DAW_BOOKSTORE_FE/
rm -rf src/linh/DAW_BOOKSTORE_FE-dev/

# Delete duplicate pages folder (old structure)
rm -rf src/pages/

# Remove individual package.json files
rm src/hoang/DAW_BOOKSTORE_FE/package.json
rm src/linh/DAW_BOOKSTORE_FE-dev/package.json
```

---

## 🔗 API Integration

All modules should use the **shared API client** for consistency:

```tsx
// src/shared/services/api.ts
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api',
});

export default api;
```

Each module then uses this:
```tsx
// src/hoang/services/bookService.js
import api from '../../shared/services/api';

export const bookService = {
  getAll: () => api.get('/books'),
  // ...
};
```

---

## 📚 Context Management

### Root-level Context (shared by all)
```tsx
// src/contexts/AuthContext.tsx - For root-level auth state
```

### Module-level Contexts
```tsx
// src/hoang/contexts/CartContext.jsx - Cart state
// src/hoang/contexts/AuthContext.jsx - Admin auth state
// src/linh/contexts/AuthContext.js - User auth state
```

**In App.tsx:**
```tsx
<AuthProvider>  {/* Root auth */}
  <CartProvider>  {/* Hoang's cart context */}
    {/* All routes here can access both */}
  </CartProvider>
</AuthProvider>
```

---

## ✨ Features by Module

### 📖 KIET - Catalog Module
- Home page with featured books
- Search & filter by category
- Book details page
- Book browsing

### 🔐 LINH - Auth Module  
- User registration/signup
- Email verification
- Google OAuth login
- User login/logout
- User profile management
- Session management

### 🛒 HOANG - Cart & Admin Module
- Shopping cart management
- Checkout flow
- Invoice generation
- Admin dashboard
- CRUD for books
- CRUD for categories
- CRUD for users
- Admin auth (PrivateRoute)

---

## 🐛 Troubleshooting

### Import errors after moving files?
1. Check file extensions (.jsx vs .tsx)
2. Verify relative paths are correct
3. Update any `../` paths if folder depth changed
4. Check that service files are exporting correctly

### Module not appearing in routes?
1. Check if page is imported in App.tsx
2. Verify the import path is correct
3. Make sure route path is defined
4. Check for typos in component names

### Style/CSS not loading?
1. Ensure CSS files are imported in components
2. Check Tailwind is properly configured (already done)
3. Verify class names are correct

---

## 📞 Questions?

- Check the module's **index.ts** for exported items
- Look at **App.tsx** for routing pattern
- Review **service files** for API integration patterns
- Use **// TODO comments** in code for tracking work

---

## 🎯 Final Structure Benefits

✅ **One package.json** - Single dependency management  
✅ **One build** - Vite builds entire project at once  
✅ **Shared code** - DRY principle via `src/shared/`  
✅ **Clear ownership** - Each dev maintains own module  
✅ **Easy refactoring** - Move code between modules as needed  
✅ **Scalability** - Easy to add new modules later  
✅ **Testing** - Single test suite for entire app  
✅ **Deployment** - One unified build artifact  

---

**Last Updated:** May 27, 2026  
**Status:** In Progress - Awaiting file migrations by team members
