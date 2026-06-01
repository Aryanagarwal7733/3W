import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, user, token, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Clear global auth errors when entering page
  useEffect(() => {
    clearError();
    if (token || user) {
      navigate('/');
    }
  }, [token, user, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please enter all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tp-auth-page">
      <div className="tp-auth-card">
        <div className="tp-auth-logo-box">
          <div className="tp-auth-logo">TP</div>
          <h1 className="tp-auth-title">TaskPlanet</h1>
          <p className="tp-auth-subtitle">Log in to view posts, like, comment, and earn rewards!</p>
        </div>

        {(localError || error) && (
          <div className="tp-auth-error" style={{ marginBottom: '16px' }}>
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="tp-auth-form">
          {/* Email */}
          <div className="tp-auth-input-wrapper">
            <label className="tp-auth-label">Email Address</label>
            <div className="tp-auth-input-box">
              <MailOutlineIcon />
              <input
                type="email"
                className="tp-auth-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="tp-auth-input-wrapper">
            <label className="tp-auth-label">Password</label>
            <div className="tp-auth-input-box">
              <LockOpenIcon />
              <input
                type="password"
                className="tp-auth-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="tp-auth-submit-btn"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} style={{ color: '#ffffff' }} /> : 'Log In'}
          </Button>
        </form>

        <div className="tp-auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="tp-auth-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
