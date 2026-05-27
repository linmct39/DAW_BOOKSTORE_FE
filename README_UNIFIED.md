# 📚 DAW Bookstore - Unified React Project

**Status:** Refactored ✅ | Ready for Module Integration ⏳

## 🎯 Project Overview

Ứng dụng **bán sách trực tuyến** (E-commerce) được phát triển bởi 3 thành viên:
- **Kiet** - Catalog & Book Browsing (Tìm kiếm, duyệt sách)
- **Linh** - Authentication & User Management (Đăng nhập, tài khoản người dùng)
- **Hoang** - Shopping Cart & Admin Dashboard (Giỏ hàng, quản lý admin)

## ✨ Features

### 📖 Catalog (Kiet)
- [x] Home page with book showcase
- [x] Search & filter functionality
- [x] Book detail page
- [x] Category filtering
- [ ] Integration with backend API

### 🔐 Authentication (Linh)
- [ ] Email/password login
- [ ] User registration
- [ ] Google OAuth authentication
- [ ] Email verification
- [ ] User profile management
- [ ] Session management

### 🛒 Shopping & Admin (Hoang)
- [ ] Shopping cart management
- [ ] Checkout flow
- [ ] Invoice generation
- [ ] Admin dashboard
- [ ] Book CRUD operations
- [ ] Category management
- [ ] User management
- [ ] Invoice history

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript/JavaScript
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **State Management:** Context API
- **HTTP Client:** Axios
- **UI Components:** Lucide React icons
- **Build Tool:** Vite
- **Backend:** Express.js + Firebase
- **Database:** Firestore

## 📁 Project Structure

```
daw-bookstore/
├── src/
│   ├── App.tsx                 ⭐ Main routing hub
│   ├── main.tsx
│   ├── types.ts
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx     (shared root auth)
│   │
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── bookService.ts
│   │   └── categoryService.ts
│   │
│   ├── shared/                 📦 Shared code
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── kiet/                   👤 Catalog Module
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── README.md
│   │
│   ├── linh/                   👤 Auth Module
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── README.md
│   │
│   └── hoang/                  👤 Cart & Admin Module
│       ├── pages/
│       ├── components/
│       ├── contexts/
│       ├── services/
│       └── README.md
│
├── api/
│   └── index.ts               (backend routes)
│
├── package.json               (unified - single node_modules)
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
│
├── MIGRATION_GUIDE.md         📖 How to migrate files
└── README.md                  (this file)
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd daw-bookstore
npm install
```

### 2. Setup Environment Variables
```bash
# Create .env file
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_PROJECT_ID=...
# (Copy from firebase-blueprint.json if needed)
```

### 3. Start Development Server
```bash
npm run dev
```

Application will be available at: **http://localhost:5173**

### 4. Build for Production
```bash
npm run build
npm run preview
```

## 📋 Migration Checklist

Each module needs to complete file migration:

### ✅ Kiet's Module (Catalog)
- [x] Directory structure created
- [x] Pages organized
- [ ] Update import paths
- [ ] Test all routes

### ⏳ Linh's Module (Auth)
- [x] Directory structure created
- [x] AuthContext prepared
- [x] UserService prepared
- [ ] Move pages from old project
- [ ] Move components
- [ ] Update import paths
- [ ] Add routes to App.tsx
- [ ] Test authentication

### ⏳ Hoang's Module (Cart & Admin)
- [x] Directory structure created
- [x] CartContext prepared
- [x] AuthContext prepared
- [x] Services prepared
- [ ] Move pages from old project
- [ ] Move components
- [ ] Update import paths
- [ ] Add routes to App.tsx
- [ ] Test cart and admin

**→ See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed steps**

## 🔗 API Routes

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (admin)
- `PUT /api/books/:id` - Update book (admin)
- `DELETE /api/books/:id` - Delete book (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Users (Auth)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login with email/password
- `POST /api/users/login/google` - Login with Google OAuth
- `GET /api/users/verify/:userId` - Verify email
- `PUT /api/users/update/:userId` - Update profile
- `PUT /api/users/changepassword` - Change password
- `DELETE /api/users/:userId` - Delete user (admin)

### Cart & Orders
- `POST /api/cart` - Add to cart
- `GET /api/cart/:userId` - Get user's cart
- `DELETE /api/cart/:itemId` - Remove from cart

### Invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - Get all invoices (admin)
- `GET /api/invoices/:id` - Get invoice details

## 🏗️ Architecture

### Module-Based Design
Each module is **independent** but can share:
- ✅ Common components via `src/shared/`
- ✅ API client via `src/services/`
- ✅ Type definitions via `src/types.ts`
- ✅ Contexts when needed

### Context API Usage
```tsx
// Root-level (for all users)
<AuthProvider>
  
  // Hoang's cart context (for shopping)
  <CartProvider>
    {/* Routes here can access both */}
  </CartProvider>
  
</AuthProvider>
```

### Service Layers
```
Component (UI)
    ↓
Context/Hooks (State Management)
    ↓
Services (Business Logic)
    ↓
API Client (HTTP Requests)
    ↓
Backend API
```

## 📚 Module Documentation

Each module has detailed documentation:

- **[src/kiet/README.md](./src/kiet/README.md)** - Catalog module
- **[src/linh/README.md](./src/linh/README.md)** - Auth module
- **[src/hoang/README.md](./src/hoang/README.md)** - Cart & Admin module

## 🔄 Development Workflow

### 1. Pick a Task
- See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for TODO items
- Or module's README for features to implement

### 2. Create/Move Files
```bash
# Create new component
src/<module>/components/MyComponent.jsx

# Move existing file
cp src/<old-project>/path/file.jsx src/<module>/path/file.jsx
```

### 3. Update Imports
- Check that relative paths are correct
- Import from module's `index.ts` when available
- Use shared components from `src/shared/`

### 4. Test Locally
```bash
npm run dev
# Test your changes at http://localhost:5173
```

### 5. Add Routes (if new page)
- Update `src/App.tsx`
- Add new route in appropriate section
- Test navigation

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build to check for errors
npm run build

# Clean build artifacts
npm run clean
```

## 🐛 Common Issues

### Import errors?
1. Check file extension matches (.tsx vs .jsx)
2. Verify relative path is correct
3. Check that file exists in new location
4. See module's README for import examples

### Routes not showing?
1. Check if page is imported in App.tsx
2. Verify route path spelling
3. Make sure component exports correctly
4. Check browser console for errors

### Styles not loading?
1. Check CSS file is imported
2. Verify Tailwind classes are correct
3. Check browser DevTools for CSS errors

## 📝 Coding Standards

- ✅ Use TypeScript in root project and Kiet's module
- ✅ Use JavaScript/JSX in Linh and Hoang's modules
- ✅ Keep components under 200 lines
- ✅ Extract reusable logic to services
- ✅ Use meaningful variable/function names
- ✅ Add comments for complex logic
- ✅ Handle loading and error states
- ✅ Validate user input

## 🚀 Deployment

```bash
# Build production bundle
npm run build

# Output directory: dist/

# Deploy to Vercel (already configured)
# Just push to main branch
```

## 📞 Support

- Check respective module README
- Review MIGRATION_GUIDE.md
- Check App.tsx for route examples
- Look at existing service files for patterns

## 📄 License

Private project for team use.

---

**Last Updated:** May 27, 2026  
**Total LOC:** ~3000+ (to be counted after migration)  
**Team:** Kiet, Linh, Hoang
