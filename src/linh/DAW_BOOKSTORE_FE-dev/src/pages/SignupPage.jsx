import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import userService from '../services/userService';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                full_name: formData.full_name,
            };
            await userService.register(payload);
            navigate('/register-success');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    // Icons (same as LoginPage)
    const EyeOpenIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
    const EyeCloseIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Đăng Ký</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input name="full_name" placeholder="Họ và tên" value={formData.full_name} onChange={handleChange} required style={styles.input} />
                    <input name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleChange} required style={styles.input} />
                    <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />

                    <div style={styles.passwordWrapper}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                        <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
            </span>
                    </div>

                    <div style={styles.passwordWrapper}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirm_password"
                            placeholder="Xác nhận mật khẩu"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              {showConfirmPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
            </span>
                    </div>

                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" disabled={isLoading} style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? '⏳ Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </form>

                <div style={styles.toggle}>
                    <p>Đã có tài khoản? <Link to="/login" style={styles.link}>Đăng nhập ngay</Link></p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px',
    },
    card: {
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px 28px',
        boxShadow: '0 20px 35px rgba(0,0,0,0.1)',
    },
    title: {
        color: '#003366',
        textAlign: 'center',
        marginBottom: '28px',
        fontSize: '26px',
        fontWeight: '600',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '15px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    passwordWrapper: {
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#666',
    },
    button: {
        backgroundColor: '#003366',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '8px',
    },
    error: {
        color: '#d32f2f',
        fontSize: '13px',
        textAlign: 'center',
    },
    toggle: {
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '14px',
    },
    link: {
        color: '#003366',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default SignupPage;