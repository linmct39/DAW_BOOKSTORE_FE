import { authApiInstance } from "./api";

export const userApi = {
  getUsers: async (search?: string) => {
    // If a search query is passed, use the search endpoint from Row 9: /users/search?search="..."
    if (search && search.trim() !== "") {
      const response = await authApiInstance.get(`users/search`, {
        params: { search: search }
      });
      // The search API returns { data: [...] } as shown in Row 9
      return response.data?.data || response.data || [];
    }
    
    // Otherwise, fetch all users from Row 4: /users
    const response = await authApiInstance.get("users");
    // Some endpoints wrap in user list, let's handle array directly
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  createUser: async (userData: any) => {
    // Treat creation as a register request: POST /users/register
    const response = await authApiInstance.post("users/register", {
      username: userData.username || userData.email?.split("@")[0] || "member",
      email: userData.email,
      password: userData.password || "123456789",
      full_name: userData.fullName || userData.full_name || userData.username || "DAW Customer"
    });
    return response.data?.data || response.data;
  },

  updateUser: async (id: string | number, userData: any) => {
    // Row 5: PUT /users/update/:userid
    const response = await authApiInstance.put(`users/update/${id}`, {
      username: userData.username,
      email: userData.email,
      full_name: userData.fullName || userData.full_name,
      phone: userData.phone,
      address: userData.address
    });
    return response.data;
  },

  deleteUser: async (id: string | number) => {
    // Row 8: DELETE /users/delete/:userid
    const response = await authApiInstance.delete(`users/delete/${id}`);
    return response.data;
  },
};

