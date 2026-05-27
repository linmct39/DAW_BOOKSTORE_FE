import axiosClient from '../config/axiosClient';

const userService = {
    // Đăng ký tài khoản mới
    register: (data) => axiosClient.post('/users/register', data),

    // Đăng nhập email/password
    login: (credentials) => axiosClient.post('/users/login', credentials),

    // Đăng nhập bằng Google
    loginWithGoogle: (idToken) => axiosClient.post('/users/login/google', { idToken }),

    // Xác thực email
    verifyEmail: (userId) => axiosClient.get(`/users/verify/${userId}`),

    // Cập nhật thông tin + avatar
    updateUser: (userId, formData) =>
        axiosClient.put(`/users/update/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    // Đổi mật khẩu
    changePassword: (userId, oldPassword, newPassword) =>
        axiosClient.put(`/users/changepassword/${userId}`, { oldPassword, newPassword }),

    // Xóa tài khoản (chỉ admin)
    deleteUser: (userId) => axiosClient.delete(`/users/delete/${userId}`),
};

export default userService;
