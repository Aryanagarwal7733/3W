import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  // Get first letter of username for circular initials avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="tp-header">
      <div className="tp-header-title">Social</div>
      
      <div className="tp-header-right">
        {/* Points Star Badge */}
        <div className="tp-badge-points">
          <span>{user ? user.points : 50}</span>
          <StarIcon className="tp-star-icon" />
        </div>

        {/* Cash Balance Badge */}
        <div className="tp-badge-balance">
          ₹{user ? user.balance.toFixed(2) : '0.00'}
        </div>

        {/* Notification Bell */}
        <div className="tp-header-icon-btn">
          <NotificationsIcon style={{ fontSize: 20 }} />
        </div>

        {/* Dark Mode Icon */}
        <div className="tp-header-icon-btn">
          <NightsStayIcon style={{ fontSize: 20 }} />
        </div>

        {/* Active User Avatar */}
        <div className="tp-header-avatar">
          {user ? getInitials(user.username) : 'P'}
        </div>
      </div>
    </header>
  );
}
