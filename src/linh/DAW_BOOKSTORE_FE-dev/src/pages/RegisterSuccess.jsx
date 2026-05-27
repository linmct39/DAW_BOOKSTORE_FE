import React from 'react';
import { Link } from 'react-router-dom';

const RegisterSuccess = () => (
    <div style={styles.container}>
        <div style={styles.card}>
            <h2 style={styles.title}>✅ Đăng ký thành công!</h2>
            <p>Vui lòng kiểm tra email để kích hoạt tài khoản.</p>
            <Link to="/login" style={styles.link}>Đến trang đăng nhập</Link>
        </div>
    </div>
);

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center' },
    title: { color: '#003366' },
    link: { display: 'inline-block', marginTop: '20px', color: '#003366', textDecoration: 'none' },
};

export default RegisterSuccess;