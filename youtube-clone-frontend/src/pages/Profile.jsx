import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    website: ""
  });
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalLikes: 0,
    totalViews: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
      return;
    }
    
    setUser(userData);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      bio: userData.bio || "",
      website: userData.website || ""
    });
    loadUserVideos(userData.email);
  }, [navigate]);

  const loadUserVideos = async (email) => {
    try {
      const response = await fetch(`${API_URL}/videos/user/${email}`);
      const userVideos = await response.json();
      setVideos(userVideos || []);
      
      // Calculate stats
      const totalLikes = userVideos.reduce((sum, video) => sum + (video.likes?.length || 0), 0);
      const totalViews = userVideos.reduce((sum, video) => sum + (video.views || 0), 0);
      
      setStats({
        totalVideos: userVideos.length,
        totalLikes,
        totalViews
      });
    } catch (error) {
      console.error("Failed to load user videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Update user data in localStorage
      const updatedUser = {
        ...user,
        ...formData
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      
      // Show success message
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      website: user?.website || ""
    });
    setEditMode(false);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="profile-container">
      <Sidebar user={user} />
      
      <main className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover">
            <div className="cover-gradient"></div>
          </div>
          
          <div className="profile-info">
            <div className="avatar-section">
              <div className="profile-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <button 
                className="edit-avatar-btn"
                title="Change avatar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            </div>
            
            <div className="profile-details">
              <div className="profile-main">
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="edit-name-input"
                    placeholder="Enter your name"
                  />
                ) : (
                  <h1 className="profile-name">
                    {user.name || "Anonymous User"}
                  </h1>
                )}
                
                <p className="profile-email">{user.email}</p>
                
                {editMode ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="edit-bio-input"
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                ) : (
                  <p className="profile-bio">
                    {user.bio || "No bio yet. Tell us about yourself!"}
                  </p>
                )}
                
                {editMode && (
                  <div className="website-input-section">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="edit-website-input"
                      placeholder="Your website URL"
                    />
                  </div>
                )}
                
                {!editMode && user.website && (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="profile-website"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    {user.website}
                  </a>
                )}
              </div>
              
              <div className="profile-actions">
                {editMode ? (
                  <div className="edit-actions">
                    <button 
                      className="save-btn"
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    className="edit-profile-btn"
                    onClick={() => setEditMode(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon videos">📹</div>
            <div className="stat-info">
              <div className="stat-number">{formatNumber(stats.totalVideos)}</div>
              <div className="stat-label">Videos</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon likes">❤️</div>
            <div className="stat-info">
              <div className="stat-number">{formatNumber(stats.totalLikes)}</div>
              <div className="stat-label">Likes</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon views">👁️</div>
            <div className="stat-info">
              <div className="stat-number">{formatNumber(stats.totalViews)}</div>
              <div className="stat-label">Views</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon subscribers">👥</div>
            <div className="stat-info">
              <div className="stat-number">1.2K</div>
              <div className="stat-label">Subscribers</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === "videos" ? "active" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            My Videos ({videos.length})
          </button>
          <button 
            className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="recent-activity">
                <h3>Recent Activity</h3>
                {videos.length > 0 ? (
                  <div className="activity-list">
                    {videos.slice(0, 5).map((video, index) => (
                      <div key={video._id || video.id} className="activity-item">
                        <div className="activity-icon">📹</div>
                        <div className="activity-details">
                          <p className="activity-text">
                            You uploaded "<strong>{video.title}</strong>"
                          </p>
                          <span className="activity-time">
                            {new Date(video.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-activity">
                    <p>No recent activity. Start by uploading your first video!</p>
                    <button 
                      className="upload-cta"
                      onClick={() => navigate("/upload")}
                    >
                      Upload Video
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div className="videos-tab">
              {videos.length > 0 ? (
                <div className="videos-grid">
                  {videos.map((video) => (
                    <div 
                      key={video._id || video.id} 
                      className="video-card"
                      onClick={() => navigate(`/video/${video._id || video.id}`)}
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
                        <h4 className="video-title">{video.title}</h4>
                        <p className="video-stats">
                          {video.likes?.length || 0} likes • {video.views || 0} views
                        </p>
                        <p className="video-date">
                          {new Date(video.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-videos">
                  <div className="empty-icon">🎬</div>
                  <h3>No videos uploaded yet</h3>
                  <p>Start sharing your content with the world!</p>
                  <button 
                    className="upload-cta"
                    onClick={() => navigate("/upload")}
                  >
                    Upload Your First Video
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="analytics-tab">
              <div className="analytics-placeholder">
                <div className="analytics-icon">📊</div>
                <h3>Analytics Coming Soon</h3>
                <p>We're working on detailed analytics to help you track your channel's performance.</p>
                <div className="analytics-stats">
                  <div className="analytics-stat">
                    <span className="stat-value">{stats.totalViews}</span>
                    <span className="stat-label">Total Views</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-value">{stats.totalLikes}</span>
                    <span className="stat-label">Total Likes</span>
                  </div>
                  <div className="analytics-stat">
                    <span className="stat-value">{stats.totalVideos}</span>
                    <span className="stat-label">Total Videos</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;