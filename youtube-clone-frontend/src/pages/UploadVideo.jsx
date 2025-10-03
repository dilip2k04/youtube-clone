import { useState, useEffect } from "react";
import { API_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function UploadVideo({ videoId }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (videoId) {
      fetch(`${API_URL}/videos/${videoId}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setDescription(data.description);
          setTags(data.tags.join(","));
          setPreviewUrl(data.videoUrl);
        })
        .catch((err) => setError("Failed to fetch video: " + err.message));
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
      if (videoId && !file) {
        // Update metadata only
        res = await fetch(`${API_URL}/videos/${videoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, tags }),
        });
      } else {
        // Upload new video
        const formData = new FormData();
        if (file) formData.append("file", file);
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
      if (res.ok) navigate("/");
      else setError(data.error || "Operation failed");
    } catch (err) {
      setError("Operation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this video?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/videos/${videoId}`, { method: "DELETE" });
      if (res.ok) navigate("/");
      else {
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
    <div style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "800px", width: "100%", backgroundColor: "white", padding: "32px", borderRadius: "8px" }}>
        <h2>{videoId ? "Edit Video" : "Upload Video"}</h2>
        {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label>Video File</label>
            <input type="file" accept="video/*" onChange={handleFileChange} />
          </div>

          {previewUrl && <video src={previewUrl} controls width="100%" style={{ maxHeight: "300px", borderRadius: "8px" }} />}

          <input type="text" value={title} placeholder="Title" required onChange={(e) => setTitle(e.target.value)} />
          <textarea value={description} placeholder="Description" rows={4} required onChange={(e) => setDescription(e.target.value)} />
          <input type="text" value={tags} placeholder="Tags (comma separated)" onChange={(e) => setTags(e.target.value)} />

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading}>{loading ? "Processing..." : videoId ? "Update Video" : "Upload Video"}</button>
            {videoId && <button type="button" disabled={loading} onClick={handleDelete}>Delete Video</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
