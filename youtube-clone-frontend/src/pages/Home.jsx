import { useEffect, useState } from "react";
import { API_URL } from "../utils/api";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/videos`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data || []); // handle empty response
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setVideos([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading videos...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Videos</h2>
      {videos.length === 0 ? (
        <p>No videos yet</p>
      ) : (
        videos.map((video) => (
          <div key={video.id || video._id} style={{ marginBottom: "20px" }}>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <video width="400" controls>
              <source src={video.videoUrl} type="video/mp4" />
            </video>
            <p><b>Uploaded By:</b> {video.uploadedBy || video.userEmail}</p>
            <p><b>Tags:</b> {(video.tags || []).join(", ")}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
