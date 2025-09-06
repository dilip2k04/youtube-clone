import { useState } from "react";
import { API_URL } from "../utils/api";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    if (!user) {
      alert("You must be logged in to upload videos");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("uploadedBy", user.email);

    try {
      const res = await fetch(`${API_URL}/videos/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Video uploaded successfully!");
        window.location.href = "/";
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} required /><br />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required /><br />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required /><br />
      <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} required /><br />
      <button type="submit">Upload</button>
    </form>
  );
}
