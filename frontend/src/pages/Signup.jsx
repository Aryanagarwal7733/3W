import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, user, token, error, clearError } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Clear errors when entering page
  useEffect(() => {
    clearError();
    if (token || user) {
      navigate('/');
    }
  }, [token, user, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!username || !email || !password) {
      setLocalError('Please enter all fields');
      return;
    }

    if (username.length < 3) {
      setLocalError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(username, email, password);
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
          <p className="tp-auth-subtitle">Create a community account to start earning points!</p>
        </div>

        {(localError || error) && (
          <div className="tp-auth-error" style={{ marginBottom: '16px' }}>
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="tp-auth-form">
          {/* Username */}
          <div className="tp-auth-input-wrapper">
            <label className="tp-auth-label">Username</label>
            <div className="tp-auth-input-box">
              <PersonOutlineIcon />
              <input
                type="text"
                className="tp-auth-input"
                placeholder="e.g. nitin3w"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="tp-auth-input-wrapper">
            <label className="tp-auth-label">Email Address</label>
            <div className="tp-auth-input-box">
              <MailOutlineIcon />
              <input
                type="email"
                className="tp-auth-input"
                placeholder="e.g. name@example.com"
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
                placeholder="Minimum 6 characters"
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
            {loading ? <CircularProgress size={24} style={{ color: '#ffffff' }} /> : 'Sign Up'}
          </Button>
        </form>

        <div className="tp-auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="tp-auth-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
