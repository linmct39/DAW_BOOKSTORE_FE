import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import userService from '../services/userService';

const VerifyPage = () => {
    const { userid } = useParams();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        userService.verifyEmail(userid)
            .then((res) => {
                setStatus('success');
                setMessage(res.data.message || 'Xác thực thành công!');
            })
            .catch((err) => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Liên kết không hợp lệ hoặc đã hết hạn');
            });
    }, [userid]);

    if (status === 'loading') return <div style={styles.container}>Đang xác thực...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Xác thực email</h2>
                <p style={status === 'success' ? styles.success : styles.error}>{message}</p>
                {status === 'success' && <Link to="/login" style={styles.link}>Đăng nhập ngay</Link>}
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px' },
    title: { color: '#003366' },
    success: { color: '#2e7d32' },
    error: { color: '#d32f2f' },
    link: { display: 'inline-block', marginTop: '20px', color: '#003366', textDecoration: 'none' },
};

export default VerifyPage;