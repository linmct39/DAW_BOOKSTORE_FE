# ✅ Developer Checklists - File Migration Tasks

## 👤 KIET - Catalog Module
**Estimated Time: 30 minutes**  
**Difficulty: ⭐ EASY**

### Pre-Migration
- [ ] Read `src/kiet/README.md`
- [ ] Understand module structure
- [ ] Backup current code (git commit)

### File Migration
- [ ] Move `src/pages/Kiet/Home.tsx` → `src/kiet/pages/Home.tsx`
- [ ] Move `src/pages/Kiet/Search.tsx` → `src/kiet/pages/Search.tsx`
- [ ] Move `src/pages/Kiet/BookDetail.tsx` → `src/kiet/pages/BookDetail.tsx`

### Import Updates
- [ ] Check imports in Home.tsx - should already be correct
- [ ] Check imports in Search.tsx - should already be correct
- [ ] Check imports in BookDetail.tsx - should already be correct

### Testing
- [ ] Start dev server: `npm run dev`
- [ ] Test route `/` - Home page loads
- [ ] Test route `/search` - Search page loads
- [ ] Test route `/books/1` - BookDetail loads
- [ ] Check browser console for errors - should be none

### Cleanup
- [ ] Delete old folder: `src/pages/`
- [ ] Commit changes: `git commit -m "feat: migrate Kiet catalog module"`
- [ ] Push to repo: `git push`

### Verification
- [ ] All 3 pages showing correctly
- [ ] No import errors
- [ ] No styling issues
- [ ] Ready for integration with other modules

✅ **Status When Complete:** KIET MODULE DONE

---

## 👤 LINH - Authentication Module
**Estimated Time: 2-3 hours**  
**Difficulty: ⭐⭐ MEDIUM**

### Pre-Migration
- [ ] Read `src/linh/README.md`
- [ ] Read `MIGRATION_GUIDE.md` - Linh section
- [ ] Understand module structure
- [ ] Backup current code (git commit)

### Step 1: Copy Pages
```bash
# Copy these files from old location to new
```
- [ ] Copy `src/linh/DAW_BOOKSTORE_FE-dev/src/pages/LoginPage.jsx` → `src/linh/pages/`
- [ ] Copy `src/linh/DAW_BOOKSTORE_FE-dev/src/pages/SignupPage.jsx` → `src/linh/pages/`
- [ ] Copy `src/linh/DAW_BOOKSTORE_FE-dev/src/pages/ProfilePage.jsx` → `src/linh/pages/`
- [ ] Copy `src/linh/DAW_BOOKSTORE_FE-dev/src/pages/VerifyPage.jsx` → `src/linh/pages/`
- [ ] Copy `src/linh/DAW_BOOKSTORE_FE-dev/src/pages/RegisterSuccess.jsx` → `src/linh/pages/`

### Step 2: Copy Components
- [ ] Copy `src/linh/DAW_BOOKSTORE_FE-dev/src/components/AuthForm.jsx` → `src/linh/components/`

### Step 3: Copy Config
- [ ] Copy `src/linh/DAW_BOOKSTORE_FE-dev/src/config/axiosClient.js` → `src/linh/config/`

### Step 4: Update Imports (Check each file)
- [ ] LoginPage.jsx - Fix import paths
- [ ] SignupPage.jsx - Fix import paths
- [ ] ProfilePage.jsx - Fix import paths
- [ ] VerifyPage.jsx - Fix import paths
- [ ] RegisterSuccess.jsx - Fix import paths
- [ ] AuthForm.jsx - Fix import paths
- [ ] axiosClient.js - Fix import paths if any

**Common import changes:**
```
OLD: import userService from '../services/userService'
NEW: import userService from '../services/userService'

OLD: import axiosClient from '../config/axiosClient'
NEW: import axiosClient from '../config/axiosClient'

OLD: import { AuthProvider, useAuth } from '../context/AuthContext'
NEW: import { AuthProvider, useAuth } from '../contexts/AuthContext'
```

### Step 5: Setup Routes
- [ ] Open `src/App.tsx`
- [ ] Find comment: `// Linh's Routes - Auth`
- [ ] Uncomment all Linh routes (5 routes)
- [ ] Add proper imports at top of App.tsx for all 5 pages

### Step 6: Testing
- [ ] Start dev server: `npm run dev`
- [ ] Test route `/login` - LoginPage loads
- [ ] Test route `/signup` - SignupPage loads
- [ ] Test route `/verify/1` - VerifyPage loads
- [ ] Test route `/register-success` - RegisterSuccess loads
- [ ] Test route `/profile` - ProfilePage loads
- [ ] Check browser console - no errors
- [ ] Test form inputs work
- [ ] Test navigation between auth pages

### Step 7: Integration Testing
- [ ] Test with other modules loaded
- [ ] Check that auth context works
- [ ] Test that user data persists in localStorage
- [ ] Test logout clears data

### Cleanup
- [ ] Delete old project: `rm -rf src/linh/DAW_BOOKSTORE_FE-dev/`
- [ ] Commit changes: `git commit -m "feat: migrate Linh auth module"`
- [ ] Push to repo: `git push`

### Verification Checklist
- [ ] All 5 pages display correctly
- [ ] AuthForm component works
- [ ] No import errors in console
- [ ] No styling issues
- [ ] AuthContext is accessible from all pages
- [ ] userService is callable
- [ ] axiosClient has correct baseURL

✅ **Status When Complete:** LINH MODULE DONE

---

## 👤 HOANG - Cart & Admin Module
**Estimated Time: 3-4 hours**  
**Difficulty: ⭐⭐⭐ CHALLENGING**

### Pre-Migration
- [ ] Read `src/hoang/README.md`
- [ ] Read `MIGRATION_GUIDE.md` - Hoang section
- [ ] Understand module structure
- [ ] Backup current code (git commit)

### Step 1: Copy Pages Folder Structure
```bash
# Copy the entire pages folder with subfolders
```
- [ ] Copy entire `src/hoang/DAW_BOOKSTORE_FE/src/pages/admin/` → `src/hoang/pages/admin/`
- [ ] Copy entire `src/hoang/DAW_BOOKSTORE_FE/src/pages/cart/` → `src/hoang/pages/cart/`
- [ ] Copy `src/hoang/DAW_BOOKSTORE_FE/src/pages/Checkout.jsx` → `src/hoang/pages/`
- [ ] Copy `src/hoang/DAW_BOOKSTORE_FE/src/pages/Invoice.jsx` → `src/hoang/pages/`
- [ ] Copy Auth/ folder if exists (optional)
- [ ] Copy Profile/ folder if exists (optional)

### Step 2: Copy Components
- [ ] Copy `src/hoang/DAW_BOOKSTORE_FE/src/components/cart/` → `src/hoang/components/cart/`
- [ ] Copy `src/hoang/DAW_BOOKSTORE_FE/src/components/PrivateRoute.jsx` → `src/hoang/components/`

### Step 3: Copy Layouts
- [ ] Copy `src/hoang/DAW_BOOKSTORE_FE/src/layouts/AdminLayout.jsx` → `src/hoang/components/layouts/`
- [ ] Copy `src/hoang/DAW_BOOKSTORE_FE/src/layouts/AdminLayout.css` → `src/hoang/components/layouts/`
- [ ] Copy `src/hoang/DAW_BOOKSTORE_FE/src/layouts/MainLayout.jsx` → `src/hoang/components/layouts/`
- [ ] Copy `src/hoang/DAW_BOOKSTORE_FE/src/layouts/MainLayout.css` → `src/hoang/components/layouts/`

### Step 4: Copy Data
- [ ] Copy `src/hoang/DAW_BOOKSTORE_FE/src/data/mockData.js` → `src/hoang/data/`

### Step 5: Update Imports
Check all these file categories and fix import paths:

**Pages** (Update in all copied page files)
```
OLD: import { mockBooks } from "../data/mockData";
NEW: import { mockBooks } from "../data/mockData";

OLD: import { bookService } from "../services/bookService";
NEW: import { bookService } from "../services/bookService";
```

**Components** (Update in all copied component files)
```
OLD: import { CartContext, useCart } from "../context/CartContext";
NEW: import { useCart } from "../contexts/CartContext";

OLD: import { useAuth } from "../context/AuthContext";
NEW: import { useAuth } from "../contexts/AuthContext";
```

**Components to Update** (List of files that likely need changes):
- [ ] All files in pages/admin/* - check imports
- [ ] All files in pages/cart/* - check imports
- [ ] Checkout.jsx - check imports
- [ ] Invoice.jsx - check imports
- [ ] components/PrivateRoute.jsx - check imports
- [ ] components/layouts/AdminLayout.jsx - check imports
- [ ] components/layouts/MainLayout.jsx - check imports

### Step 6: Setup Routes
- [ ] Open `src/App.tsx`
- [ ] Find comment: `// Hoang's Routes - Cart & Admin`
- [ ] Uncomment all Hoang routes
- [ ] Add proper imports at top of App.tsx

### Step 7: Testing - Cart Module
- [ ] Start dev server: `npm run dev`
- [ ] Test route `/cart` - Cart page loads
- [ ] Test route `/checkout` - Checkout page loads
- [ ] Test route `/invoice/1` - Invoice page loads
- [ ] Check browser console - no errors
- [ ] Test add to cart functionality
- [ ] Test remove from cart
- [ ] Test update quantity
- [ ] Test CartContext state management

### Step 8: Testing - Admin Module
- [ ] Test route `/admin` - Admin dashboard loads (might be protected)
- [ ] Test admin can see books list
- [ ] Test admin can see categories list
- [ ] Test admin can see users list
- [ ] Test admin can see invoices list
- [ ] Test CRUD forms work
- [ ] Check PrivateRoute protection works
- [ ] Check localStorage for cart data persists

### Step 9: Integration Testing
- [ ] Add item from catalog (Kiet's module) to cart
- [ ] Navigate to cart and verify item appears
- [ ] Proceed to checkout
- [ ] Generate invoice
- [ ] Admin can view new invoice
- [ ] No conflicts between modules
- [ ] Auth context works across modules
- [ ] CartContext independent from Auth

### Cleanup
- [ ] Delete old project: `rm -rf src/hoang/DAW_BOOKSTORE_FE/`
- [ ] Commit changes: `git commit -m "feat: migrate Hoang cart and admin modules"`
- [ ] Push to repo: `git push`

### Verification Checklist
- [ ] All admin pages load correctly
- [ ] All cart pages load correctly
- [ ] PrivateRoute component works
- [ ] Layouts are applied correctly
- [ ] mockData is available
- [ ] Services can be imported
- [ ] Contexts are accessible
- [ ] No import errors in console
- [ ] No styling issues
- [ ] Forms validation works
- [ ] localStorage operations work

✅ **Status When Complete:** HOANG MODULE DONE

---

## 🎯 Final Integration Checklist

**After All Modules Complete:**

### Full Application Testing
- [ ] Kiet module working
- [ ] Linh module working
- [ ] Hoang module working
- [ ] All routes accessible
- [ ] No console errors
- [ ] Navigation between modules works
- [ ] Shared contexts work across modules
- [ ] API services work correctly

### Build & Deploy
- [ ] Run: `npm run build` - builds without errors
- [ ] Run: `npm run preview` - preview build works
- [ ] Check dist/ folder created
- [ ] Ready to deploy to Vercel

### Documentation
- [ ] All README files updated
- [ ] Code comments added where needed
- [ ] Migration complete documented
- [ ] Team briefing ready

---

## 🏆 Team Completion Status

| Module | Lead | Status | Est. Time |
|--------|------|--------|-----------|
| Kiet - Catalog | Kiet | 🟢 Ready | 30 min |
| Linh - Auth | Linh | 🟡 Setup done | 2-3 hrs |
| Hoang - Cart & Admin | Hoang | 🟡 Setup done | 3-4 hrs |

**Total Time to Complete:** ~3-4 hours for full team

**Timeline Estimate:**
- Week 1: Each developer completes their module
- Week 2: Integration testing and bug fixes
- Week 2: Deploy to production

---

## 📞 Help & Support

- **Questions?** Check your module's README
- **Stuck on imports?** Read MIGRATION_GUIDE.md
- **Structure unclear?** Review STRUCTURE_SUMMARY.md
- **Need examples?** Look at already-completed Kiet module
- **Build errors?** Check browser DevTools for import issues

---

**Last Updated:** May 27, 2026  
**Status:** Ready for team to proceed  
**Next Step:** Each developer claims their tasks and begins!

🚀 **Let's ship this! Good luck, team!** 🎉
