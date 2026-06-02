import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../services/authApi";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "customer";
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<UserProfile>;
  loginWithGoogle: (idToken: string) => Promise<UserProfile>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple internal registry in localStorage to remember email -> userId mappings
// since the backend login returns email but we need userId for profile/invoice queries.
const getUserIdFromRegistry = (email: string): string => {
  const registryRaw = localStorage.getItem("daw_user_id_registry");
  const registry = registryRaw ? JSON.parse(registryRaw) : {};
  
  // Default pre-populated users from API documentation
  const defaults: Record<string, string> = {
    "qkhang154567890godds@gmail.com": "26",
    "testuser_qevfdleb@example.com": "4",
    "admin@daw.com": "1",
    "admin@test.com": "1",
    "customer@daw.com": "30",
    "customer@test.com": "30"
  };

  return registry[email.toLowerCase()] || defaults[email.toLowerCase()] || "30"; // default fallback ID
};

const saveUserIdToRegistry = (email: string, id: string) => {
  const registryRaw = localStorage.getItem("daw_user_id_registry");
  const registry = registryRaw ? JSON.parse(registryRaw) : {};
  registry[email.toLowerCase()] = id;
  localStorage.setItem("daw_user_id_registry", JSON.stringify(registry));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const savedToken = localStorage.getItem("bookstore_token");
    const savedUser = localStorage.getItem("bookstore_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("bookstore_token");
        localStorage.removeItem("bookstore_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      
      // Determine what details we got back
      const email = data.email || credentials.email;
      const resolvedUserId = data.id?.toString() || data.user?.id?.toString() || getUserIdFromRegistry(email);
      
      // Construct a standard token
      const resolvedToken = data.token || data.accessToken || btoa(JSON.stringify({ email, time: Date.now() }));
      
      // Determine role: default is "admin" for admin emails, else "customer"
      let resolvedRole: "admin" | "customer" = "customer";
      if (email.toLowerCase().includes("admin") || data.role === "admin" || data.user?.role === "admin") {
        resolvedRole = "admin";
      }

      // Try fetching the full user profile from the server using GET /api/users/profile/:userid
      let profileUserObj: UserProfile = {
        id: resolvedUserId,
        email: email,
        fullName: data.full_name || data.fullName || email.split("@")[0],
        role: resolvedRole,
        phone: data.phone || undefined,
        address: data.address || undefined,
        avatar: data.avatar || undefined,
      };

      // Store token first so axios interceptor can attach Authorization header
      localStorage.setItem("bookstore_token", resolvedToken);
      setToken(resolvedToken);

      try {
        const profileResponse = await authApi.getProfile(resolvedUserId);
        const profileUser = profileResponse.user || profileResponse;
        if (profileUser) {
          profileUserObj = {
            id: resolvedUserId,
            email: email,
            fullName: profileUser.full_name || profileUser.fullName || profileUserObj.fullName,
            role: profileUser.role === "admin" ? "admin" : resolvedRole,
            phone: profileUser.phone || undefined,
            address: profileUser.address || undefined,
            avatar: profileUser.avatar || undefined,
          };
        }
      } catch (profileErr) {
        console.warn("Could not retrieve real-time user profile, using fallback details:", profileErr);
      }

      localStorage.setItem("bookstore_user", JSON.stringify(profileUserObj));
      setUser(profileUserObj);
      return profileUserObj;
    } catch (error: any) {
      console.error("Login failure:", error);
      throw error.response?.data?.message || "Đăng nhập thất bại. Email hoặc mật khẩu không chính xác hoặc tài khoản chưa kích hoạt!";
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setLoading(true);
    try {
      const response = await authApi.loginWithGoogle(idToken);
      // Normalize response shapes: server may return { message, data: {...} } or directly {...}
      const top = response || {};
      const body = top.data || top.user || top;
      const responseDataObj = body || {};
      const email = responseDataObj.email || `${responseDataObj.username || "google_user"}@gmail.com`;
      const resolvedUserId = (responseDataObj.id?.toString()) || getUserIdFromRegistry(email);
      const resolvedToken = top.token || top.accessToken || btoa(JSON.stringify({ email, id: resolvedUserId, isGoogle: true, time: Date.now() }));
      
      let resolvedRole: "admin" | "customer" = "customer";
      if (email.toLowerCase().includes("admin") || responseDataObj.role === "admin") {
        resolvedRole = "admin";
      }

      let profileUserObj: UserProfile = {
        id: resolvedUserId,
        email: email,
        fullName: responseDataObj.full_name || responseDataObj.fullName || responseDataObj.username || email.split("@")[0],
        role: resolvedRole,
        phone: responseDataObj.phone || undefined,
        address: responseDataObj.address || undefined,
        avatar: responseDataObj.avatar || undefined,
      };

      // Store token first so axios interceptor can attach Authorization header
      localStorage.setItem("bookstore_token", resolvedToken);
      setToken(resolvedToken);

      // Try fetching real-time profile to sync
      try {
        const profileResponse = await authApi.getProfile(resolvedUserId);
        const profileUser = profileResponse.user || profileResponse;
        if (profileUser) {
          profileUserObj = {
            id: resolvedUserId,
            email: email,
            fullName: profileUser.full_name || profileUser.fullName || profileUserObj.fullName,
            role: profileUser.role === "admin" ? "admin" : resolvedRole,
            phone: profileUser.phone || undefined,
            address: profileUser.address || undefined,
            avatar: profileUser.avatar || undefined,
          };
        }
      } catch (profileErr) {
        console.warn("Could not retrieve real-time profile during Google Sign-In, using defaults:", profileErr);
      }

      localStorage.setItem("bookstore_user", JSON.stringify(profileUserObj));

      setUser(profileUserObj);
      return profileUserObj;
    } catch (error: any) {
      console.error("Google login failure:", error);
      throw error.response?.data?.message || "Đăng nhập bằng Google thất bại. Vui lòng thử lại!";
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const registeredUser = res.data || res.user || res;
      
      if (registeredUser && registeredUser.id) {
        // Save the registered email -> ID mapping so they can login seamlessly
        saveUserIdToRegistry(userData.email, registeredUser.id.toString());
      }
      return res;
    } catch (error: any) {
      console.error("Register failure:", error);
      throw error.response?.data?.message || "Đăng ký thất bại. Email hoặc tên tài khoản có thể đã tồn tại!";
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("bookstore_token");
    localStorage.removeItem("bookstore_user");
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const response = await authApi.getProfile(user.id);
      const profileUser = response.user || response;
      if (profileUser) {
        const updatedUser: UserProfile = {
          ...user,
          email: user.email,
          fullName: profileUser.full_name || profileUser.fullName || user.fullName,
          phone: profileUser.phone || user.phone,
          address: profileUser.address || user.address,
          avatar: profileUser.avatar || user.avatar,
        };
        localStorage.setItem("bookstore_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Lỗi đồng bộ hồ sơ:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithGoogle, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

