import { useState } from "react";
import { API_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create a preview if it's a video file
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!file) {
      setError("Please select a video file");
      setLoading(false);
      return;
    }

    if (!user) {
      setError("You must be logged in to upload videos");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("uploadedBy", user.email);
    formData.append("userEmail", user.email);

    try {
      const res = await fetch(`${API_URL}/videos/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/");
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: 'calc(100vh - 56px)',
      backgroundColor: '#f9f9f9',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '800px'
      }}>
        <h2 style={{ 
          marginBottom: '24px', 
          color: '#030303',
          fontSize: '24px',
          fontWeight: '500'
        }}>
          Upload Video
        </h2>
        
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* File Upload Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#030303'
              }}>
                Video File
              </label>
              
              <div style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                {/* File Input */}
                <div style={{
                  flex: '1',
                  minWidth: '300px'
                }}>
                  <div style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      required
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" style={{ color: '#606060', marginBottom: '12px' }}>
                      <path d="M6.5 7.5a.5.5 0 0 0-1 0v2.793L4.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L7.5 10.293V7.5z"/>
                      <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                    </svg>
                    <p style={{ color: '#606060', margin: '8px 0' }}>
                      {file ? file.name : 'Click to select a video file'}
                    </p>
                    <p style={{ color: '#909090', fontSize: '14px' }}>
                      MP4, AVI, MOV, or other video formats
                    </p>
                  </div>
                </div>
                
                {/* Video Preview */}
                {previewUrl && (
                  <div style={{
                    flex: '1',
                    minWidth: '300px'
                  }}>
                    <label style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#030303',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Preview
                    </label>
                    <video 
                      src={previewUrl} 
                      controls 
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        backgroundColor: '#000'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Title Input */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#030303'
              }}>
                Title
              </label>
              <input
                type="text"
                placeholder="Add a title that describes your video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            {/* Description Input */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#030303'
              }}>
                Description
              </label>
              <textarea
                placeholder="Tell viewers about your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
            
            {/* Tags Input */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#030303'
              }}>
                Tags
              </label>
              <input
                type="text"
                placeholder="Add tags separated by commas (e.g., tech, tutorial, react)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            {/* Submit Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              borderTop: '1px solid #e5e5e5',
              paddingTop: '24px'
            }}>
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  padding: '10px 20px',
                  color: '#065fd4',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#065fd4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}