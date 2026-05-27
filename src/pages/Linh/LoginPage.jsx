import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import userService from '../../linh/services/userService';

const normalizeAuthPayload = (responseData) => {
    const payload = responseData?.data || responseData || {};

    const userData =
        payload.user ||
        payload.data ||
        payload.result ||
        payload.profile ||
        payload;

    const token =
        payload.token ||
        payload.access_token ||
        payload.accessToken ||
        responseData?.token ||
        responseData?.access_token ||
        responseData?.accessToken ||
        null;

    return { userData, token };
};

const buildAuthenticatedUser = (userData, fallbackEmail) => {
    const baseUser = userData && typeof userData === 'object' ? userData : {};

    return {
        ...baseUser,
        email: baseUser.email || fallbackEmail,
        role: baseUser.role || 'admin',
    };
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await userService.login({ email, password });
            const { userData, token } = normalizeAuthPayload(response.data);
            const adminUser = buildAuthenticatedUser(userData, email);

            if (!adminUser.email) {
                throw new Error('Phản hồi đăng nhập không hợp lệ');
            }

            if (token) {
                localStorage.setItem('access_token', token);
            }
            localStorage.setItem('user', JSON.stringify(adminUser));
            navigate('/profile');
        } catch (err) {
            console.error('[LoginPage] login failed', {
                message: err?.message,
                status: err?.response?.status,
                data: err?.response?.data,
            });
            setError(err?.response?.data?.message || err?.message || 'Đăng nhập thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const response = await userService.loginWithGoogle(credentialResponse.credential);
            const { userData, token } = normalizeAuthPayload(response.data);
            const adminUser = buildAuthenticatedUser(userData, userData?.email);

            if (!adminUser.email) {
                throw new Error('Phản hồi đăng nhập Google không hợp lệ');
            }

            if (token) {
                localStorage.setItem('access_token', token);
            }
            localStorage.setItem('user', JSON.stringify(adminUser));
            navigate('/profile');
        } catch (err) {
            console.error('[LoginPage] google login failed', {
                message: err?.message,
                status: err?.response?.status,
                data: err?.response?.data,
            });
            setError(err?.response?.data?.message || err?.message || 'Đăng nhập Google thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    // Icons
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
                <h2 style={styles.title}>Đăng Nhập</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <div style={styles.passwordWrapper}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
            </span>
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" disabled={isLoading} style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? '⏳ Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>

                <div style={styles.toggle}>
                    <p>Chưa có tài khoản? <Link to="/signup" style={styles.link}>Đăng ký ngay</Link></p>
                </div>

                <hr style={styles.divider} />

                <div style={styles.googleWrapper}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google login failed')}
                        text="signin_with"
                    />
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
        maxWidth: '420px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px 28px',
        boxShadow: '0 20px 35px rgba(0,0,0,0.1)',
        fontFamily: 'sans-serif',
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
        gap: '18px',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '15px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        outline: 'none',
        transition: 'all 0.2s',
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
        borderRadius: '10px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.2s',
        marginTop: '8px',
    },
    error: {
        color: '#d32f2f',
        fontSize: '13px',
        marginTop: '-8px',
        textAlign: 'center',
    },
    toggle: {
        textAlign: 'center',
        margin: '20px 0 16px',
        fontSize: '14px',
    },
    link: {
        color: '#003366',
        textDecoration: 'none',
        fontWeight: '500',
    },
    divider: {
        margin: '20px 0',
        border: '0.5px solid #e0e0e0',
    },
    googleWrapper: {
        display: 'flex',
        justifyContent: 'center',
    },
};

export default LoginPage;
