/**
 * LINH Module - Authentication & User Management
 * Contains: Login, Signup, Profile, Email Verification, Register Success pages
 * Handles: User authentication, registration, profile management, Google OAuth
 */

export { AuthProvider, useAuth } from './contexts/AuthContext';
export { default as userService } from './services/userService';

// Pages will be exported here once created
// export { default as LoginPage } from './pages/LoginPage';
// export { default as SignupPage } from './pages/SignupPage';
// export { default as ProfilePage } from './pages/ProfilePage';
// export { default as VerifyPage } from './pages/VerifyPage';
// export { default as RegisterSuccess } from './pages/RegisterSuccess';
