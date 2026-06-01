import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { Button, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function SearchBar({ onSearch }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="tp-search-container">
      <form onSubmit={handleSearchSubmit} className="tp-search-input-box">
        <input
          type="text"
          className="tp-search-input"
          placeholder="Search promotions, users, posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      
      {/* Blue search icon button */}
      <Button className="tp-search-btn" onClick={handleSearchSubmit}>
        <SearchIcon style={{ fontSize: 20 }} />
      </Button>

      {/* Dark mode moon toggle */}
      <IconButton className="tp-dark-toggle-btn">
        <NightsStayIcon style={{ fontSize: 20 }} />
      </IconButton>

      {/* Profile avatar shortcut */}
      <div className="tp-small-avatar">
        {user ? getInitials(user.username) : 'P'}
      </div>
    </div>
  );
}
