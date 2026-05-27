import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const AuthForm = ({ onLogin, onRegister, onGoogleLogin }) => {

    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (isLogin) {

                await onLogin({
                    email: formData.email,
                    password: formData.password
                });

            } else {

                if (formData.password !== formData.confirm_password) {
                    alert("Mật khẩu không khớp");
                    return;
                }

                await onRegister({
                    username: formData.username,
                    full_name: formData.full_name,
                    email: formData.email,
                    password: formData.password
                });
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{ width: '350px', margin: '50px auto' }}>

            <h2>
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </h2>

            <form onSubmit={handleSubmit}>

                {!isLogin && (
                    <>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                        />

                        <br /><br />

                        <input
                            type="text"
                            name="full_name"
                            placeholder="Họ tên"
                            onChange={handleChange}
                        />

                        <br /><br />
                    </>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    onChange={handleChange}
                />

                <br /><br />

                {!isLogin && (
                    <>
                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Nhập lại mật khẩu"
                            onChange={handleChange}
                        />

                        <br /><br />
                    </>
                )}

                <button type="submit">
                    {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                </button>

            </form>

            <br />

            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin
                    ? 'Chuyển sang đăng ký'
                    : 'Chuyển sang đăng nhập'}
            </button>

            <br /><br />

            <GoogleLogin
                onSuccess={(res) => {
                    onGoogleLogin(res.credential);
                }}
                onError={() => {
                    alert("Google Login lỗi");
                }}
            />

        </div>
    );
};

export default AuthForm;