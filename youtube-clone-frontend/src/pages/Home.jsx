import { useEffect, useState } from "react";
import { API_URL } from "../utils/api";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    
    // Fetch videos
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

  const playVideo = (video) => {
    setPlayingVideo(video);
  };

  const closeVideo = () => {
    setPlayingVideo(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #ff0000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginRight: '15px'
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Video Player Modal */}
      {playingVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}
        onClick={closeVideo}>
          <div style={{
            width: '80%',
            maxWidth: '800px',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10
            }}>
              <button style={{
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={closeVideo}>
                ✕
              </button>
            </div>
            <video 
              controls 
              autoPlay 
              style={{ width: '100%', display: 'block' }}
            >
              <source src={playingVideo.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div style={{ padding: '16px' }}>
              <h3 style={{ marginBottom: '8px' }}>{playingVideo.title}</h3>
              <p style={{ color: '#606060', marginBottom: '8px' }}>{playingVideo.description}</p>
              <p style={{ color: '#606060', fontSize: '14px' }}>
                <b>Uploaded By:</b> {playingVideo.uploadedBy || playingVideo.userEmail}
              </p>
              <div style={{ marginTop: '8px' }}>
                {(playingVideo.tags || []).map((tag, index) => (
                  <span key={index} style={{
                    fontSize: '12px',
                    backgroundColor: '#f2f2f2',
                    color: '#606060',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    marginRight: '4px',
                    display: 'inline-block'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: 'flex', paddingTop: '56px' }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px',
          backgroundColor: 'white',
          padding: '12px 0',
          height: 'calc(100vh - 56px)',
          position: 'fixed',
          top: '56px',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 24px',
            cursor: 'pointer',
            backgroundColor: '#e5e5e5'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '24px' }}>
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
              <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"/>
            </svg>
            <span style={{ fontSize: '14px' }}>Home</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 24px',
            cursor: 'pointer'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '24px' }}>
                            <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
            </svg>
            <span style={{ fontSize: '14px' }}>Trending</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 24px',
            cursor: 'pointer'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '24px' }}>
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
            </svg>
            <span style={{ fontSize: '14px' }}>Subscriptions</span>
          </div>
          
          <div style={{ borderTop: '1px solid #e5e5e5', margin: '12px 0' }}></div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 24px',
            cursor: 'pointer'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '24px' }}>
              <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
              <path d="M4 6.5h8v1H4v-1zm0 2h8v1H4v-1zm0 2h8v1H4v-1z"/>
            </svg>
            <span style={{ fontSize: '14px' }}>Library</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 24px',
            cursor: 'pointer'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '24px' }}>
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
            </svg>
            <span style={{ fontSize: '14px' }}>History</span>
          </div>
        </aside>

        {/* Videos Container */}
        <main style={{ flex: 1, padding: '24px', marginLeft: '240px' }}>
          
          <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Recommended Videos</h2>
          
          {videos.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50vh',
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16" style={{ color: '#e5e5e5', marginBottom: '16px' }}>
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
              </svg>
              <p style={{ color: '#606060', marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>No videos available</p>
              <p style={{ color: '#909090', fontSize: '14px' }}>Upload a video to get started.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {videos.map((video) => (
                <div key={video.id || video._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => playVideo(video)}>
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#f2f2f2' }}>
                    <img 
                      src={video.thumbnail || `https://picsum.photos/seed/${video.id}/300/200`} 
                      alt={video.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '2px 4px',
                      borderRadius: '2px',
                      fontSize: '12px'
                    }}>
                      10:25
                    </div>
                  </div>
                  
                  {/* Video info */}
                  <div style={{ padding: '12px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4',
                      maxHeight: '2.8em'
                    }}>{video.title}</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      {/* Channel avatar */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#065fd4',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '500',
                        flexShrink: 0,
                        marginRight: '12px'
                      }}>
                        {video.uploadedBy ? video.uploadedBy.charAt(0).toUpperCase() : video.userEmail ? video.userEmail.charAt(0).toUpperCase() : 'U'}
                      </div>
                      
                      {/* Video details */}
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: '14px',
                          color: '#606060',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{video.uploadedBy || video.userEmail}</p>
                        <div style={{ fontSize: '14px', color: '#606060' }}>
                          <span>245K views</span>
                          <span style={{ margin: '0 4px' }}>•</span>
                          <span>2 days ago</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div style={{ marginTop: '8px' }}>
                      {(video.tags || []).map((tag, index) => (
                        <span key={index} style={{
                          fontSize: '12px',
                          backgroundColor: '#f2f2f2',
                          color: '#606060',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          marginRight: '4px',
                          display: 'inline-block',
                          marginBottom: '4px'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;