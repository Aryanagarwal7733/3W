import React, { useState, useRef } from 'react';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function CreatePostCard({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeToggle, setActiveToggle] = useState('all'); // 'all' or 'promotions'
  const fileInputRef = useRef(null);

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  // Helper to compress image and convert to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create Canvas to compress image
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas back to compressed base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality jpeg
        setImage(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    setLoading(true);
    try {
      if (onPostCreated) {
        await onPostCreated(text, image);
      }
      setText('');
      setImage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error submitting post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tp-create-post-card">
      <div className="tp-create-post-header">
        <div className="tp-create-post-title">Create Post</div>
        
        {/* All Posts vs Promotions segment pill */}
        <div className="tp-toggle-pill">
          <div 
            className={`tp-toggle-option ${activeToggle === 'all' ? 'active' : ''}`}
            onClick={() => setActiveToggle('all')}
          >
            All Posts
          </div>
          <div 
            className={`tp-toggle-option ${activeToggle === 'promotions' ? 'active' : ''}`}
            onClick={() => setActiveToggle('promotions')}
          >
            Promotions
          </div>
        </div>
      </div>

      <form onSubmit={handlePostSubmit}>
        <div className="tp-textarea-wrapper">
          <textarea
            className="tp-textarea"
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          
          {/* File input for images (hidden) */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* Selected Image Preview Panel */}
        {image && (
          <div className="tp-image-preview-container">
            <img src={image} alt="Upload preview" />
            <IconButton className="tp-remove-img-btn" onClick={handleRemoveImage}>
              <CloseIcon style={{ fontSize: 16 }} />
            </IconButton>
          </div>
        )}

        <div className="tp-create-post-footer">
          <div className="tp-attachment-icons">
            {/* Camera action icon */}
            <div className="tp-attach-btn" onClick={handleCameraClick} title="Add Image">
              <CameraAltOutlinedIcon style={{ fontSize: 22 }} />
            </div>

            {/* Emoji placeholder */}
            <div className="tp-attach-btn" onClick={() => alert('Emoji picker is a placeholder!')} title="Add Emoji">
              <SentimentSatisfiedAltOutlinedIcon style={{ fontSize: 22 }} />
            </div>

            {/* Formatting list icon placeholder */}
            <div className="tp-attach-btn" onClick={() => alert('Formatting list option is a placeholder!')} title="Formatting Options">
              <ListOutlinedIcon style={{ fontSize: 22 }} />
            </div>

            {/* Promote icon placeholder */}
            <div className="tp-promote-badge" onClick={() => alert('Promotional booster is a placeholder!')}>
              <CampaignOutlinedIcon style={{ fontSize: 22 }} />
              <span>Promote</span>
            </div>
          </div>

          <Button
            type="submit"
            className="tp-post-submit-btn"
            variant="contained"
            endIcon={<SendIcon style={{ fontSize: 14 }} />}
            disabled={(!text.trim() && !image) || loading}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
