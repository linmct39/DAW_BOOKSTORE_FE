import { authApiInstance } from "./api";

export const authApi = {
  login: async (credentials: any) => {
    // According to Row 3, the endpoint is /users/login
    const response = await authApiInstance.post("users/login", {
      email: credentials.email || credentials.username, // some logs may pass username as email or vice versa
      password: credentials.password
    });
    return response.data;
  },

  loginWithGoogle: async (idToken: string) => {
    // According to Row 6, the endpoint is /users/login/google
    const response = await authApiInstance.post("users/login/google", { idToken });
    return response.data;
  },

  register: async (userData: any) => {
    // According to Row 1, the endpoint is /users/register
    const response = await authApiInstance.post("users/register", {
      username: userData.username || userData.email?.split("@")[0] || "user",
      password: userData.password,
      email: userData.email,
      full_name: userData.fullName || userData.full_name || userData.username || "DAW Member",
    });
    return response.data;
  },

  verifyAccount: async (userId: string | number) => {
    // According to Row 2, the endpoint is /users/verify/:userid
    const response = await authApiInstance.get(`users/verify/${userId}`);
    return response.data;
  },

  getProfile: async (userId: string | number) => {
    // According to Row 10, the endpoint is /users/profile/:userid
    const response = await authApiInstance.get(`users/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (userId: string | number, profileData: any) => {
    // According to Row 5, the endpoint is /users/update/:userid
    // It says "Dùng form data, và chỉ lấy ảnh dạng jpg,png, jpeg"
    // Let's support both FormData and pure JSON for resilience
    let payload: any;
    if (profileData instanceof FormData) {
      payload = profileData;
    } else {
      payload = new FormData();
      payload.append("username", profileData.username || "");
      payload.append("email", profileData.email || "");
      payload.append("full_name", profileData.fullName || profileData.full_name || "");
      payload.append("phone", profileData.phone || "");
      payload.append("address", profileData.address || "");
      if (profileData.avatar) {
        payload.append("avatar", profileData.avatar);
      }
    }
    const response = await authApiInstance.put(`users/update/${userId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  changePassword: async (userId: string | number, passwordData: { oldPassword: string; newPassword: string }) => {
    // According to Row 7, endpoint is /users/changepassword/:userid
    const response = await authApiInstance.put(`users/changepassword/${userId}`, passwordData);
    return response.data;
  }
};

