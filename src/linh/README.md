# 🔐 LINH Module - Authentication & User Management

## 📖 Responsibility
- User registration (signup)
- Email verification
- User login (email/password)
- Google OAuth authentication
- User profile management
- Session management

## 📁 Structure
```
linh/
├── pages/
│   ├── LoginPage.jsx         (TODO: Move from DAW_BOOKSTORE_FE-dev)
│   ├── SignupPage.jsx        (TODO: Move from DAW_BOOKSTORE_FE-dev)
│   ├── ProfilePage.jsx       (TODO: Move from DAW_BOOKSTORE_FE-dev)
│   ├── VerifyPage.jsx        (TODO: Move from DAW_BOOKSTORE_FE-dev)
│   └── RegisterSuccess.jsx   (TODO: Move from DAW_BOOKSTORE_FE-dev)
├── components/
│   └── AuthForm.jsx          (TODO: Move from DAW_BOOKSTORE_FE-dev)
├── contexts/
│   └── AuthContext.js        ✅ Ready
├── services/
│   └── userService.js        ✅ Ready
├── config/
│   └── axiosClient.js        (TODO: Copy from DAW_BOOKSTORE_FE-dev)
└── index.ts
```

## 🔗 Routes
- `/login` - User login page
- `/signup` - User registration page
- `/verify/:userId` - Email verification page
- `/register-success` - Registration success page
- `/profile` - User profile page

## 📦 Using AuthContext
```tsx
import { useAuth } from '../linh';

export function MyComponent() {
  const { user, login, loginWithGoogle, logout, updateUserInfo, loading } = useAuth();

  // Check if logged in
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return <div>Welcome {user.email}</div>;
}
```

## 🔐 Using UserService
```tsx
import userService from '../services/userService';

// Register new user
const result = await userService.register({ email, password, username });

// Login with email/password
const result = await userService.login({ email, password });

// Login with Google
const result = await userService.loginWithGoogle(idToken);

// Verify email
const result = await userService.verifyEmail(userId);

// Update user profile
const result = await userService.updateUser(userId, formData);

// Change password
const result = await userService.changePassword(userId, oldPassword, newPassword);
```

## 🔑 API Integration
The module uses `axiosClient.js` to communicate with backend:
```
POST   /users/register          - Register new account
POST   /users/login             - Login with email/password
POST   /users/login/google      - Login with Google OAuth
GET    /users/verify/:userId    - Verify email
PUT    /users/update/:userId    - Update profile + avatar
PUT    /users/changepassword    - Change password
DELETE /users/delete/:userId    - Delete account (admin only)
```

## 📝 Migration Steps
1. Copy all pages from `src/linh/DAW_BOOKSTORE_FE-dev/src/pages/` to `src/linh/pages/`
2. Copy `AuthForm.jsx` to `src/linh/components/`
3. Copy `axiosClient.js` to `src/linh/config/`
4. Update all import paths in moved files
5. Uncomment routes in App.tsx
6. Test authentication flow

## 🎨 Components to Create/Update
- [ ] LoginForm - Email/password login
- [ ] SignupForm - Registration form
- [ ] GoogleLoginButton - Google OAuth button
- [ ] ProfileForm - Edit user profile
- [ ] VerificationCode - Email verification input

## ✅ Status
- ✅ AuthContext prepared
- ✅ UserService prepared
- ⏳ Pages need to be moved
- ⏳ Components need to be moved
- ⏳ Routes need to be uncommented

## 🚀 How to Complete
1. Move files as listed above
2. Fix import paths
3. Uncomment auth routes in App.tsx
4. Test complete auth flow
5. Integrate with rest of app

## 📝 Notes
- Use `.js` or `.jsx` for components (follow existing style)
- Keep authentication logic in context, UI in components
- Always protect routes that need authentication
- Handle loading states properly
