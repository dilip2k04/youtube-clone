import { useEffect, useState } from "react";
import { API_URL } from "../utils/api";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./MyVideos.css";

function MyVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      setError("Please login to view your videos");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/videos/user/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load videos");
        setLoading(false);
      });
  }, [user]);

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/videos/${videoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setVideos(videos.filter(video => video.id !== videoId && video._id !== videoId));
        alert("Video deleted successfully");
      } else {
        const data = await res.json();
        setError(data.error || "Delete failed");
      }
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Loading your videos...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-required">
        <div className="login-content">
          <h2>Please login to manage your videos</h2>
          <p>Sign in to view and manage your uploaded content</p>
          <Link to="/login" className="login-button">
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-videos-container">
      <Sidebar user={user} />
      
      <main className="my-videos-content">
        <div className="content-header">
          <div className="header-top">
            <h1>My Videos</h1>
            <span className="video-count">{videos.length} video{videos.length !== 1 ? 's' : ''}</span>
          </div>
          <p>Manage and track your uploaded content</p>
          
          <Link to="/upload" className="upload-cta-button">
            <span className="upload-icon">⬆️</span>
            Upload New Video
          </Link>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {videos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No videos uploaded yet</h3>
            <p>Start sharing your content with the world!</p>
            <Link to="/upload" className="upload-cta-button primary">
              <span className="upload-icon">⬆️</span>
              Upload Your First Video
            </Link>
          </div>
        ) : (
          <div className="videos-grid">
            {videos.map((video) => (
              <div key={video._id || video.id} className="video-card">
                <div className="video-thumbnail">
                  <video muted>
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                  <div className="video-overlay">
                    <div className="play-button">▶</div>
                  </div>
                  <div className="video-badge">
                    {video.likes ? video.likes.length : 0} ❤️
                  </div>
                </div>
                
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-description">{video.description}</p>
                  
                  <div className="video-meta">
                    <div className="meta-item">
                      <span className="meta-label">Uploaded</span>
                      <span className="meta-value">
                        {new Date(video.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Likes</span>
                      <span className="meta-value">
                        {video.likes ? video.likes.length : 0}
                      </span>
                    </div>
                  </div>

                  <div className="video-actions">
                    <Link 
                      to={`/edit/${video._id || video.id}`}
                      className="action-button edit-button"
                    >
                      <span className="button-icon">✏️</span>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(video._id || video.id)}
                      className="action-button delete-button"
                    >
                      <span className="button-icon">🗑️</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyVideos;