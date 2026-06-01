import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterPills from '../components/FilterPills';
import CreatePostCard from '../components/CreatePostCard';
import PostCard from '../components/PostCard';
import BottomNav from '../components/BottomNav';
import { useAuth, api } from '../context/AuthContext';
import { Button, CircularProgress, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';

export default function Feed() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const createPostRef = useRef(null);

  // Fetch posts from API
  const fetchPosts = async (filter = activeFilter) => {
    setLoading(true);
    try {
      // Mapping filter tabs to API sort query params
      let endpoint = '/posts';
      if (filter === 'likes') {
        endpoint += '?sort=likes';
      } else if (filter === 'comments') {
        endpoint += '?sort=comments';
      }

      const res = await api.get(endpoint);
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [activeFilter]);

  // Handle Search input filtering (local filter for extremely fast user feel!)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(post => 
        post.username.toLowerCase().includes(query) || 
        post.text.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Submit new post & refresh state instantly
  const handlePostCreated = async (text, image) => {
    try {
      const res = await api.post('/posts', { text, image });
      // Add new post directly to the top of our state array
      setPosts([res.data, ...posts]);
      
      // Refresh user to update their earned points (Backend gives 5 points!)
      refreshUser();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Like / Unlike handler with instant state update
  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      // Update specific post in our local state to reflect like instantly
      setPosts(posts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Comment submission handler with instant state update
  const handleComment = async (postId, text) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      // Update specific post comments list instantly in UI
      setPosts(posts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Error posting comment:', err);
      throw err;
    }
  };

  // Floating Action Button (FAB) scrolls user to composer card smoothly
  const handleFabClick = () => {
    if (createPostRef.current) {
      createPostRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (!user) {
      navigate('/login');
    }
  };

  return (
    <div className="app-container">
      {/* Top Header Section */}
      <Header />

      {/* Search Input Box */}
      <SearchBar onSearch={handleSearch} />

      {/* Main post creation widget */}
      <div ref={createPostRef}>
        {user ? (
          <CreatePostCard onPostCreated={handlePostCreated} />
        ) : (
          /* High-contrast encouragement banner for anonymous visitors */
          <div style={{
            padding: '24px 16px',
            textAlign: 'center',
            backgroundColor: '#f1f8ff',
            borderBottom: '8px solid #e9ecef',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#0052cc', fontSize: '16px' }}>
              Want to create posts and earn points?
            </h3>
            <p style={{ fontSize: '13px', color: '#495057', maxWidth: '300px' }}>
              Join the TaskPlanet community to post text, attach images, and interact with other active earners!
            </p>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              style={{ textTransform: 'none', fontWeight: 700, borderRadius: '20px', padding: '6px 20px' }}
            >
              Log In / Register
            </Button>
          </div>
        )}
      </div>

      {/* Filter Category Pills */}
      <FilterPills activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      {/* Scrollable Feed List */}
      <div className="tp-feed-container">
        {loading && posts.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <CircularProgress size={36} style={{ color: '#0066ff' }} />
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onLike={handleLike} 
              onComment={handleComment} 
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: '#6c757d' }}>
            <p style={{ fontSize: '14px', fontWeight: 500 }}>No posts match your active search/filter.</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Be the first to share an update!</p>
          </div>
        )}
      </div>

      {/* Floating Action Add Button */}
      <Fab className="tp-fab" onClick={handleFabClick} title="Create New Post">
        <AddIcon />
      </Fab>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
