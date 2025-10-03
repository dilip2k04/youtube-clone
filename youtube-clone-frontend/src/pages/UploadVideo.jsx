import { useState, useEffect } from "react";
import { API_URL } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./UploadVideo.css";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { videoId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (videoId) {
      setIsEditMode(true);
      fetch(`${API_URL}/videos/${videoId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch video");
          }
          return res.json();
        })
        .then((data) => {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setTags(data.tags ? data.tags.join(",") : "");
          setPreviewUrl(data.videoUrl || "");
        })
        .catch((err) => {
          setError("Failed to fetch video: " + err.message);
        });
    }
  }, [videoId, user, navigate]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type.startsWith("video/")) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setError("Please select a valid video file");
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("video/")) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setError("");
      } else {
        setError("Please select a valid video file");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in to upload videos");
      setLoading(false);
      return;
    }

    try {
      let res;
      
      if (isEditMode) {
        // Update existing video (metadata only)
        res = await fetch(`${API_URL}/videos/${videoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            title, 
            description, 
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag) 
          }),
        });
      } else {
        // Upload new video
        if (!file) {
          setError("Please select a video file");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
        formData.append("uploadedBy", user.email);

        res = await fetch(`${API_URL}/videos/upload`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      
      if (res.ok) {
        navigate("/my-videos");
      } else {
        setError(data.error || "Operation failed");
      }
    } catch (err) {
      setError("Operation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/videos/${videoId}`, { 
        method: "DELETE" 
      });
      
      if (res.ok) {
        navigate("/my-videos");
      } else {
        const data = await res.json();
        setError(data.error || "Delete failed");
      }
    } catch (err) {
      setError("Delete failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="upload-container">
      <Sidebar user={user} />
      
      <main className="upload-content">
        <div className="upload-header">
          <h1>{isEditMode ? "Edit Video" : "Upload Video"}</h1>
          <p>
            {isEditMode 
              ? "Update your video details and metadata" 
              : "Share your content with the world"
            }
          </p>
        </div>

        <div className="upload-card">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="upload-form">
            {!isEditMode && (
              <div className="file-upload-section">
                <label className="section-label">Video File *</label>
                <div 
                  className={`file-drop-zone ${dragActive ? 'active' : ''} ${previewUrl ? 'has-preview' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {!previewUrl ? (
                    <>
                      <div className="upload-icon">📁</div>
                      <div className="upload-text">
                        <p>Drag and drop your video file here</p>
                        <p className="upload-subtext">or click to browse</p>
                      </div>
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleFileChange}
                        className="file-input"
                        required
                      />
                    </>
                  ) : (
                    <div className="file-preview">
                      <div className="preview-icon">✅</div>
                      <p className="file-name">{file?.name || "Video file selected"}</p>
                      <button 
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl("");
                        }}
                        className="change-file-button"
                      >
                        Change File
                      </button>
                    </div>
                  )}
                </div>
                <small className="helper-text">
                  Supported formats: MP4, MOV, AVI, WebM • Max size: 100MB
                </small>
              </div>
            )}

            {previewUrl && (
              <div className="preview-section">
                <label className="section-label">Video Preview</label>
                <div className="video-preview">
                  <video 
                    src={previewUrl} 
                    controls 
                    className="preview-video"
                  />
                </div>
              </div>
            )}

            <div className="form-section">
              <label className="section-label">Title *</label>
              <input 
                type="text" 
                value={title} 
                placeholder="Enter an engaging title for your video" 
                required 
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-section">
              <label className="section-label">Description *</label>
              <textarea 
                value={description} 
                placeholder="Describe your video content..." 
                rows={4} 
                required 
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
              />
              <div className="char-count">
                {description.length}/500 characters
              </div>
            </div>

            <div className="form-section">
              <label className="section-label">Tags</label>
              <input 
                type="text" 
                value={tags} 
                placeholder="gaming, tutorial, comedy, vlog (separate with commas)" 
                onChange={(e) => setTags(e.target.value)}
                className="form-input"
              />
              <small className="helper-text">
                Add relevant tags to help viewers discover your content
              </small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={loading}
                className={`submit-button ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    {isEditMode ? "Updating..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <span className="button-icon">
                      {isEditMode ? "💾" : "⬆️"}
                    </span>
                    {isEditMode ? "Update Video" : "Upload Video"}
                  </>
                )}
              </button>
              
              {isEditMode && (
                <button 
                  type="button" 
                  disabled={loading}
                  onClick={handleDelete}
                  className="delete-button"
                >
                  <span className="button-icon">🗑️</span>
                  Delete Video
                </button>
              )}
            </div>

            <div className="back-section">
              <button 
                type="button"
                onClick={() => navigate("/my-videos")}
                className="back-button"
              >
                ← Back to My Videos
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}