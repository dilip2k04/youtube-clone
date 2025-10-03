import { useEffect, useState } from "react";
import { API_URL } from "../utils/api";

// ✅ Helper to show "time ago"
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
      setComments((data || []).reverse()); // newest first
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
      setComments((updated.comments || []).reverse()); // newest first
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', backgroundColor: '#f9f9f9'
      }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid #f3f3f3',
          borderTop: '3px solid #ff0000', borderRadius: '50%',
          animation: 'spin 1s linear infinite', marginRight: '15px'
        }}></div>
        <span>Loading videos...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
        <h3>Menu</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><a href="/">🏠 Home</a></li>
          <li><a href="/upload">⬆️ Upload</a></li>
          <li><a href="/my-videos">My Videos</a></li>
          <li><a href="/login">🔑 Login</a></li>
        </ul>
      </div>

      {/* Video Grid */}
      <div style={{ flex: 1, padding: "16px" }}>
        <h2>All Videos</h2>
        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px"
          }}>
            {videos.map((video) => (
              <div key={video._id || video.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  cursor: "pointer"
                }}
                onClick={() => playVideo(video)}
              >
                <video style={{ width: "100%", height: "150px", objectFit: "cover" }}>
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
                <div style={{ padding: "8px" }}>
                  <h4 style={{ margin: "4px 0" }}>{video.title}</h4>
                  <p style={{ margin: "2px 0", fontSize: "14px", color: "#606060" }}>
                    {video.uploadedBy}
                  </p>
                  <p style={{ margin: "2px 0", fontSize: "12px", color: "#909090" }}>
                    {timeAgo(video.uploadedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}
        onClick={closeVideo}>
          <div style={{
            width: '80%', maxWidth: '800px', backgroundColor: 'white',
            borderRadius: '8px', overflow: 'hidden', position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
              <button style={{
                background: 'rgba(0, 0, 0, 0.5)', color: 'white',
                border: 'none', borderRadius: '50%', width: '30px', height: '30px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onClick={closeVideo}>✕</button>
            </div>
            <video controls autoPlay style={{ width: '100%', display: 'block' }}>
              <source src={playingVideo.videoUrl} type="video/mp4" />
            </video>
            <div style={{ padding: '16px' }}>
              <h3>{playingVideo.title}</h3>
              <p style={{ color: '#606060' }}>{playingVideo.description}</p>
              <p style={{ color: '#606060', fontSize: '14px' }}>
                <b>Uploaded By:</b> {playingVideo.uploadedBy || playingVideo.userEmail} •{" "}
                {timeAgo(playingVideo.uploadedAt)}
              </p>

              {/* ✅ Like/Unlike Section */}
              <div style={{ margin: '12px 0' }}>
                <button onClick={handleLike} style={{ marginRight: '8px' }}>👍 Like</button>
                <button onClick={handleUnlike}>👎 Unlike</button>
                <span style={{ marginLeft: '12px' }}>
                  {playingVideo.likes ? playingVideo.likes.length : 0} likes
                </span>
              </div>

              {/* ✅ Comments Section */}
              <div style={{ marginTop: '16px' }}>
                <h4>Comments</h4>
                <div style={{ marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ width: '70%', padding: '6px', marginRight: '8px' }}
                  />
                  <button onClick={handleAddComment}>Post</button>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {comments.length === 0 ? (
                    <p style={{ color: '#909090' }}>No comments yet.</p>
                  ) : (
                    comments.map((c, idx) => (
                      <div key={idx} style={{ marginBottom: '8px' }}>
                        <b>{c.userId}:</b> {c.text}
                        <div style={{ fontSize: '12px', color: '#606060' }}>
                          {timeAgo(c.createdAt)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginTop: '8px' }}>
                {(playingVideo.tags || []).map((tag, index) => (
                  <span key={index} style={{
                    fontSize: '12px', backgroundColor: '#f2f2f2',
                    color: '#606060', padding: '4px 8px',
                    borderRadius: '12px', marginRight: '4px'
                  }}>#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
