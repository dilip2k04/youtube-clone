import { useEffect, useState } from "react";
import { API_URL } from "../utils/api";
import Sidebar from "../components/Sidebar";
import "./Home.css"

// ✅ Improved timeAgo helper with more precise calculations
function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    fetch(`${API_URL}/videos`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setVideos([]);
        setLoading(false);
      });
  }, []);

  const playVideo = async (video) => {
    setPlayingVideo(video);

    try {
      const res = await fetch(`${API_URL}/videos/${video.id || video._id}/comments`);
      const data = await res.json();
      setComments((data || []).reverse());
    } catch (err) {
      console.error("Failed to fetch comments", err);
      setComments([]);
    }
  };

  const closeVideo = () => {
    setPlayingVideo(null);
    setComments([]);
    setNewComment("");
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like videos");
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/videos/${playingVideo.id || playingVideo._id}/like?userId=${user.email}`,
        { method: "POST" }
      );
      const updated = await res.json();
      setPlayingVideo(updated);
    } catch (err) {
      console.error("Failed to like", err);
    }
  };

  const handleUnlike = async () => {
    if (!user) {
      alert("Please login to unlike videos");
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/videos/${playingVideo.id || playingVideo._id}/unlike?userId=${user.email}`,
        { method: "POST" }
      );
      const updated = await res.json();
      setPlayingVideo(updated);
    } catch (err) {
      console.error("Failed to unlike", err);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `${API_URL}/videos/${playingVideo.id || playingVideo._id}/comment?userId=${user.email}&text=${encodeURIComponent(newComment)}`,
        { method: "POST" }
      );
      const updated = await res.json();
      setPlayingVideo(updated);
      setComments((updated.comments || []).reverse());
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Loading videos...</span>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Sidebar Component */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h1>Discover Videos</h1>
          <p>Watch and share amazing content</p>
        </div>

        {videos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📹</div>
            <h3>No videos yet</h3>
            <p>Be the first to upload a video!</p>
            <a href="/upload" className="upload-cta">Upload Video</a>
          </div>
        ) : (
          <div className="video-grid">
            {videos.map((video) => (
              <div 
                key={video._id || video.id}
                className="video-card"
                onClick={() => playVideo(video)}
              >
                <div className="video-thumbnail">
                  <video muted>
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                  <div className="video-overlay">
                    <div className="play-button">▶</div>
                  </div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-uploader">{video.uploadedBy}</p>
                  <div className="video-meta">
                    <span className="video-date">{timeAgo(video.uploadedAt)}</span>
                    <span className="video-likes">
                      ❤️ {video.likes ? video.likes.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="modal-overlay" onClick={closeVideo}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeVideo}>✕</button>
            
            <div className="video-player-container">
              <video controls autoPlay className="video-player">
                <source src={playingVideo.videoUrl} type="video/mp4" />
              </video>
            </div>

            <div className="video-details">
              <div className="video-header">
                <h2>{playingVideo.title}</h2>
                <div className="video-stats">
                  <span className="views">👁️ 1.2K views</span>
                  <span className="upload-date">{timeAgo(playingVideo.uploadedAt)}</span>
                </div>
              </div>

              <p className="video-description">{playingVideo.description}</p>

              <div className="uploader-info">
                <div className="uploader-avatar">
                  {playingVideo.uploadedBy?.charAt(0).toUpperCase()}
                </div>
                <div className="uploader-details">
                  <p className="uploader-name">{playingVideo.uploadedBy || playingVideo.userEmail}</p>
                  <p className="uploader-subscribers">1K subscribers</p>
                </div>
              </div>

              {/* Like/Unlike Section */}
              <div className="engagement-section">
                <div className="like-buttons">
                  <button 
                    className={`like-btn ${playingVideo.likes?.includes(user?.email) ? 'active' : ''}`}
                    onClick={handleLike}
                  >
                    👍 Like
                  </button>
                  <button 
                    className="unlike-btn"
                    onClick={handleUnlike}
                  >
                    👎 Unlike
                  </button>
                  <span className="likes-count">
                    {playingVideo.likes ? playingVideo.likes.length : 0} likes
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="video-tags">
                {(playingVideo.tags || []).map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h3>Comments ({comments.length})</h3>
                
                <div className="comment-input-container">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="comment-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button 
                    className="comment-submit"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </button>
                </div>

                <div className="comments-list">
                  {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((c, idx) => (
                      <div key={idx} className="comment-item">
                        <div className="comment-header">
                          <div className="comment-avatar">
                            {c.userId?.charAt(0).toUpperCase()}
                          </div>
                          <div className="comment-user">{c.userId}</div>
                          <div className="comment-time">{timeAgo(c.createdAt)}</div>
                        </div>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;