import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PushPinIcon from '@mui/icons-material/PushPin';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

export default function PostCard({ post, onLike, onComment }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [following, setFollowing] = useState(false);

  // Check if current user liked this post
  const isLiked = user && post.likes.some(like => like.user === user.id);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please register or log in to like posts!');
      return;
    }
    if (onLike) {
      onLike(post._id);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const handleFollowClick = (e) => {
    e.stopPropagation();
    setFollowing(!following);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  // Compile list of usernames who liked for tooltip display
  const getLikesTooltip = () => {
    if (post.likes.length === 0) return 'No likes yet';
    return 'Liked by: ' + post.likes.map(like => like.username).join(', ');
  };

  // Parse text body to search for bold titles (first line can be treated as header to match the screenshot!)
  const renderPostText = () => {
    const lines = post.text.split('\n');
    if (lines.length > 1 && lines[0].length < 50) {
      return (
        <>
          <div className="tp-post-title-text">{lines[0]}</div>
          <div className="tp-post-body-text">{lines.slice(1).join('\n')}</div>
        </>
      );
    }
    return <div className="tp-post-body-text">{post.text}</div>;
  };

  return (
    <div className="tp-post-card">
      {/* Absolute Pinned Icon at Top Right */}
      <div className="tp-pin-icon">
        <PushPinIcon style={{ fontSize: 13, transform: 'rotate(45deg)' }} />
      </div>

      <div className="tp-post-card-header">
        <div className="tp-post-author-info">
          {/* Avatar frame */}
          <div className="tp-post-avatar">
            <span style={{ 
              display: 'flex', 
              width: '100%', 
              height: '100%', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#ffe8b5',
              color: '#997300',
              fontFamily: 'Outfit',
              fontWeight: 700,
              fontSize: '16px'
            }}>
              {getInitials(post.username)}
            </span>
          </div>

          <div className="tp-post-author-meta">
            <div className="tp-post-author-names">
              <span className="tp-post-author-name">{post.username}</span>
              <span className="tp-post-author-username">@{post.username.toLowerCase().replace(/\s/g, '')}👑</span>
            </div>
            <span className="tp-post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <div className="tp-post-header-actions">
          {/* Post & Earn Gold badge */}
          <div className="tp-post-earn-badge">
            Post & Earn
          </div>

          {/* Interactive Follow button */}
          <Button
            className="tp-follow-btn"
            variant={following ? "outlined" : "contained"}
            color="primary"
            size="small"
            onClick={handleFollowClick}
          >
            {following ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>

      {/* Render text with titles parsed */}
      <div className="tp-post-content">
        {renderPostText()}
      </div>

      {/* Post Image display */}
      {post.image && (
        <div className="tp-post-image-box">
          <img src={post.image} alt="Post Attachment" className="tp-post-image" />
        </div>
      )}

      {/* Social Actions (Like, Comment) */}
      <div className="tp-post-actions">
        {/* Like Button with Tooltip for Hover likes list */}
        <Tooltip title={getLikesTooltip()} arrow placement="top">
          <button 
            className={`tp-post-action-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLikeClick}
          >
            {isLiked ? (
              <FavoriteIcon style={{ fontSize: 18 }} />
            ) : (
              <FavoriteBorderIcon style={{ fontSize: 18 }} />
            )}
            <span>{post.likes.length} Like{post.likes.length !== 1 ? 's' : ''}</span>
          </button>
        </Tooltip>

        <button 
          className="tp-post-action-btn"
          onClick={handleCommentClick}
        >
          <ChatBubbleOutlineIcon style={{ fontSize: 18 }} />
          <span>{post.comments.length} Comment{post.comments.length !== 1 ? 's' : ''}</span>
        </button>
      </div>

      {/* Comment section collapsible */}
      {showComments && (
        <CommentSection
          comments={post.comments}
          onAddComment={(commentText) => onComment(post._id, commentText)}
        />
      )}
    </div>
  );
}
