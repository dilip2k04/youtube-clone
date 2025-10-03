import { useState, useEffect } from "react";
import { API_URL } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const { videoId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (videoId) {
      setIsEditMode(true);
      // Fetch video data for editing
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
  }, [videoId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in");
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
            tags 
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
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    
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

  return (
    <div style={{ padding: "24px", display: "flex", justifyContent: "center", minHeight: "calc(100vh - 56px)", backgroundColor: "#f9f9f9" }}>
      <div style={{ maxWidth: "800px", width: "100%", backgroundColor: "white", padding: "32px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "24px", color: "#030303" }}>
          {isEditMode ? "Edit Video" : "Upload Video"}
        </h2>
        
        {error && (
          <div style={{ 
            color: "#c62828", 
            backgroundColor: "#ffebee", 
            padding: "12px", 
            borderRadius: "4px", 
            marginBottom: "16px",
            border: "1px solid #f44336"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {!isEditMode && (
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#030303" }}>
                Video File *
              </label>
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleFileChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
                required={!isEditMode}
              />
              <small style={{ color: "#606060", fontSize: "12px" }}>
                Supported formats: MP4, MOV, AVI, etc.
              </small>
            </div>
          )}

          {previewUrl && (
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#030303" }}>
                Preview
              </label>
              <video 
                src={previewUrl} 
                controls 
                width="100%" 
                style={{ 
                  maxHeight: "300px", 
                  borderRadius: "8px",
                  border: "1px solid #ddd"
                }} 
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#030303" }}>
              Title *
            </label>
            <input 
              type="text" 
              value={title} 
              placeholder="Enter video title" 
              required 
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#030303" }}>
              Description *
            </label>
            <textarea 
              value={description} 
              placeholder="Enter video description" 
              rows={4} 
              required 
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#030303" }}>
              Tags
            </label>
            <input 
              type="text" 
              value={tags} 
              placeholder="Enter tags separated by commas (e.g., gaming, tutorial, fun)" 
              onChange={(e) => setTags(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
            <small style={{ color: "#606060", fontSize: "12px" }}>
              Separate multiple tags with commas
            </small>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 24px",
                backgroundColor: "#065fd4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading 
                ? (isEditMode ? "Updating..." : "Uploading...") 
                : (isEditMode ? "Update Video" : "Upload Video")
              }
            </button>
            
            {isEditMode && (
              <button 
                type="button" 
                disabled={loading}
                onClick={handleDelete}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1
                }}
              >
                Delete Video
              </button>
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <button 
              type="button"
              onClick={() => navigate("/my-videos")}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "#065fd4",
                border: "1px solid #065fd4",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              Back to My Videos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}