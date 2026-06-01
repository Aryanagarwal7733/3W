import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleTabClick = (tab, path) => {
    if (path) {
      navigate(path);
    } else {
      alert(`The "${tab}" page is a mock! This full-stack clone is focused on the Social Community feed page.`);
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'social';
    if (path === '/profile') return 'profile';
    return 'social';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="tp-bottom-nav">
      <div className="tp-nav-item" onClick={() => handleTabClick('Home', null)}>
        <HomeOutlinedIcon />
        <span>Home</span>
      </div>

      <div className="tp-nav-item" onClick={() => handleTabClick('Tasks', null)}>
        <AssignmentOutlinedIcon />
        <span>Tasks</span>
      </div>

      <div 
        className={`tp-nav-item ${activeTab === 'social' ? 'active' : ''}`} 
        onClick={() => handleTabClick('Social', '/')}
      >
        <LanguageIcon />
        <span>Social</span>
      </div>

      <div className="tp-nav-item" onClick={() => handleTabClick('Leader Board', null)}>
        <LeaderboardOutlinedIcon />
        <span>Leaderboard</span>
      </div>

      <div 
        className={`tp-nav-item ${activeTab === 'profile' ? 'active' : ''}`} 
        onClick={() => {
          if (user) {
            handleTabClick('Profile', '/profile');
          } else {
            handleTabClick('Profile', '/login');
          }
        }}
      >
        <ChatBubbleOutlineOutlinedIcon />
        <span>Profile</span>
      </div>
    </nav>
  );
}
