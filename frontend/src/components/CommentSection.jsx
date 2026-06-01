import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ comments, onAddComment }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onAddComment(commentText);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="tp-comments-container" onClick={(e) => e.stopPropagation()}>
      {/* Comments List */}
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id || Math.random()} className="tp-comment-item">
            <div className="tp-comment-header">
              <span className="tp-comment-author">@{comment.username}</span>
              <span className="tp-comment-date">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="tp-comment-text">{comment.text}</p>
          </div>
        ))
      ) : (
        <div style={{ fontSize: '12px', color: '#adb5bd', textAlign: 'center', padding: '6px 0' }}>
          No comments yet. Be the first to comment!
        </div>
      )}

      {/* Add Comment Box */}
      {user ? (
        <form onSubmit={handleSubmit} className="tp-comment-input-box">
          <input
            type="text"
            className="tp-comment-input"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={submitting}
          />
          <IconButton type="submit" className="tp-comment-send-btn" disabled={!commentText.trim() || submitting}>
            <SendIcon style={{ fontSize: 18 }} />
          </IconButton>
        </form>
      ) : (
        <div style={{ fontSize: '11px', color: '#6c757d', textAlign: 'center', padding: '4px 0' }}>
          Please log in to leave a comment.
        </div>
      )}
    </div>
  );
}
