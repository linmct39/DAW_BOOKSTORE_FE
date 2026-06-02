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
    // Send both common field names to maximize compatibility with different backends
    const response = await authApiInstance.post("users/login/google", { idToken, id_token: idToken });
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
    // Try the token-authenticated generic profile endpoint first (/users/profile),
    // then fall back to id-specific route (/users/profile/:id) if needed.
    try {
      const resp = await authApiInstance.get(`users/profile`);
      return resp.data;
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 401) {
        // Try id-based route as a fallback
        const response = await authApiInstance.get(`users/profile/${userId}`);
        return response.data;
      }
      throw err;
    }
  },

  updateProfile: async (userId: string | number, profileData: any) => {
    // According to API spec, remote update endpoint is PUT /users/update/:userid using multipart form-data
    // Build a FormData if a file is present or when the API expects form-data.
    const urlUpdate = `users/update/${userId}`;
    // If caller already passed FormData, forward it directly
    let isFormData = false;
    if (typeof FormData !== "undefined" && profileData instanceof FormData) {
      isFormData = true;
    }

    // If profileData is a plain object, convert to FormData when any field looks like a file or to match API spec
    const hasFile = profileData && (profileData.avatar instanceof File || profileData.avatar?.name);
    const payload = isFormData ? profileData : (() => {
      if (hasFile) {
        const fd = new FormData();
        // map fields to API expected names
        if (profileData.username !== undefined) fd.append("username", profileData.username);
        if (profileData.email !== undefined) fd.append("email", profileData.email);
        if (profileData.full_name !== undefined) fd.append("full_name", profileData.full_name);
        if (profileData.fullName !== undefined) fd.append("full_name", profileData.fullName);
        if (profileData.phone !== undefined) fd.append("phone", profileData.phone);
        if (profileData.address !== undefined) fd.append("address", profileData.address);
        if (profileData.avatar !== undefined) fd.append("avatar", profileData.avatar);
        return fd;
      }
      // No file: send JSON payload
      return {
        username: profileData.username,
        email: profileData.email,
        full_name: profileData.full_name || profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
        password: profileData.password
      };
    })();

    try {
      if (isFormData || hasFile) {
        // For multipart, let axios set the header boundary by not forcing content-type
        const response = await authApiInstance.put(urlUpdate, payload as any, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
      } else {
        // JSON PUT to id-specific update endpoint
        const response = await authApiInstance.put(urlUpdate, payload);
        return response.data;
      }
    } catch (err: any) {
      // If remote update endpoint not present, fall back to earlier profile endpoints
      if (err?.response?.status === 404) {
        // Try token-authenticated generic profile endpoint
        try {
          const resp = await authApiInstance.put(`users/profile`, payload);
          return resp.data;
        } catch (e: any) {
          // Try id-based profile route
          const resp2 = await authApiInstance.put(`users/profile/${userId}`, payload);
          return resp2.data;
        }
      }
      throw err;
    }
  },

  changePassword: async (userId: string | number, passwordData: { oldPassword: string; newPassword: string }) => {
    // According to Row 7, endpoint is /users/changepassword/:userid
    const response = await authApiInstance.put(`users/changepassword/${userId}`, passwordData);
    return response.data;
  }
};

