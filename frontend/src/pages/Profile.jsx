import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import BottomNav from '../components/BottomNav';
import { useAuth, api } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import StarIcon from '@mui/icons-material/Star';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Button, CircularProgress } from '@mui/material';

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      refreshUser();
      fetchMyPosts();
    }
    // eslint-disable-next-line
  }, [user, navigate]);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts');
      // Filter posts locally to only show user's own submissions
      const personalPosts = res.data.filter(post => post.user === user.id);
      setMyPosts(personalPosts);
    } catch (err) {
      console.error('Error fetching my posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      setMyPosts(myPosts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      setMyPosts(myPosts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Error commenting:', err);
      throw err;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const initials = user.username.charAt(0).toUpperCase();

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header />

      {/* User Stats Card */}
      <div style={{
        padding: '24px 16px',
        backgroundColor: '#ffffff',
        borderBottom: '8px solid #f1f3f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Large initial avatar */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f7b924 0%, #ff5722 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'Outfit',
          fontWeight: 800,
          fontSize: '32px',
          border: '3px solid #ffffff',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          {initials}
        </div>

        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '20px', marginTop: '12px', color: '#212529' }}>
          {user.username}
        </h2>
        <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 500, marginTop: '2px' }}>
          {user.email}
        </span>

        {/* Dashboard badging */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '20px' }}>
          {/* Points Container */}
          <div style={{
            flex: 1,
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '16px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <StarIcon style={{ color: '#f59e0b', fontSize: 28 }} />
            <div>
              <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>Points Earned</div>
              <div style={{ fontSize: '18px', color: '#78350f', fontWeight: 800 }}>{user.points} ★</div>
            </div>
          </div>

          {/* Wallet Container */}
          <div style={{
            flex: 1,
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AccountBalanceWalletIcon style={{ color: '#22c55e', fontSize: 28 }} />
            <div>
              <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>Wallet Cash</div>
              <div style={{ fontSize: '18px', color: '#166534', fontWeight: 800 }}>₹{user.balance.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Dynamic Log Out pill */}
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<LogoutIcon style={{ fontSize: 16 }} />}
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '20px',
            padding: '6px 20px'
          }}
        >
          Sign Out
        </Button>
      </div>

      {/* User's Own Posts Feed subheader */}
      <div style={{
        padding: '14px 16px 4px 16px',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Outfit',
        fontWeight: 700,
        fontSize: '15px',
        color: '#495057'
      }}>
        My Submissions ({myPosts.length})
      </div>

      {/* User's posts stream */}
      <div className="tp-feed-container" style={{ minHeight: '150px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 0' }}>
            <CircularProgress size={28} style={{ color: '#0066ff' }} />
          </div>
        ) : myPosts.length > 0 ? (
          myPosts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onLike={handleLike} 
              onComment={handleComment} 
            />
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 16px',
            color: '#adb5bd',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px dashed #e9ecef'
          }}>
            <p style={{ fontSize: '13px', fontWeight: 600 }}>You haven't posted anything yet.</p>
            <p style={{ fontSize: '11px', marginTop: '2px' }}>Navigate to the Social Feed to create your first post!</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
