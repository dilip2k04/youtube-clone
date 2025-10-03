import { useEffect, useState } from "react";
import { API_URL } from "../utils/api";
import { Link } from "react-router-dom";

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
        // Remove from local state
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
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '50vh', backgroundColor: '#f9f9f9'
      }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid #f3f3f3',
          borderTop: '3px solid #ff0000', borderRadius: '50%',
          animation: 'spin 1s linear infinite', marginRight: '15px'
        }}></div>
        <span>Loading your videos...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <h2>Please login to manage your videos</h2>
        <Link to="/login" style={{
          padding: "10px 20px",
          backgroundColor: "#065fd4",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          marginTop: "16px",
          display: "inline-block"
        }}>
          Login
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', display: "flex" }}>
      {/* Sidebar */}
      <div style={{
        width: "200px",
        backgroundColor: "#fff",
        borderRight: "1px solid #ddd",
        padding: "16px",
        height: "100vh",
        position: "sticky",
        top: 0
      }}>
        <h3>Creator Studio</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><a href="/">🏠 Home</a></li>
          <li><a href="/upload">⬆️ Upload</a></li>
          <li><b>📹 My Videos</b></li>
          <li><a href="/login">🔑 Login</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "24px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2>My Videos ({videos.length})</h2>
          <Link to="/upload" style={{
            padding: "10px 20px",
            backgroundColor: "#065fd4",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "500"
          }}>
            Upload New Video
          </Link>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {videos.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "2px dashed #ddd"
          }}>
            <h3>No videos uploaded yet</h3>
            <p style={{ color: "#606060", marginBottom: "24px" }}>
              Start sharing your content with the world!
            </p>
            <Link to="/upload" style={{
              padding: "12px 24px",
              backgroundColor: "#065fd4",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500"
            }}>
              Upload Your First Video
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            {videos.map((video) => (
              <div key={video._id || video.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  overflow: "hidden"
                }}
              >
                <video style={{ width: "100%", height: "180px", objectFit: "cover" }}>
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
                <div style={{ padding: "16px" }}>
                  <h4 style={{ 
                    margin: "0 0 8px 0", 
                    fontSize: "16px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {video.title}
                  </h4>
                  <p style={{ 
                    margin: "0 0 8px 0", 
                    fontSize: "14px", 
                    color: "#606060",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {video.description}
                  </p>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px"
                  }}>
                    <span style={{ fontSize: "12px", color: "#909090" }}>
                      {new Date(video.uploadedAt).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: "12px", color: "#909090" }}>
                      {video.likes ? video.likes.length : 0} likes
                    </span>
                  </div>
                  <div style={{ 
                    display: "flex", 
                    gap: "8px",
                    marginTop: "12px"
                  }}>
                    <Link 
                      to={`/edit/${video._id || video.id}`}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        backgroundColor: "#f1f3f4",
                        color: "#030303",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontSize: "14px",
                        textAlign: "center",
                        border: "1px solid #dadce0"
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(video._id || video.id)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "14px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyVideos;