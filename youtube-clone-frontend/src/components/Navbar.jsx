import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px',
      height: '56px',
      backgroundColor: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid #e5e5e5'
    }}>
      {/* Left section - Logo and navigation */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none',
          color: 'inherit'
        }}>
          <div style={{ color: '#FF0000', marginRight: '4px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-8 12V9l4.5 3L11 15z" />
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#030303' }}>YouTube</span>
        </Link>
      </div>

      {/* Center section - Search bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        flex: '0 1 728px',
        maxWidth: '600px',
        margin: '0 20px'
      }}>
        <input 
          type="text" 
          placeholder="Search" 
          style={{
            flex: 1,
            height: '40px',
            padding: '0 12px',
            border: '1px solid #ccc',
            borderRight: 'none',
            borderRadius: '2px 0 0 2px',
            fontSize: '16px'
          }}
        />
        <button style={{
          height: '40px',
          width: '64px',
          border: '1px solid #ccc',
          backgroundColor: '#f8f8f8',
          borderRadius: '0 2px 2px 0',
          cursor: 'pointer'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </div>

      {/* Right section - User actions */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <>
            {/* Upload Button */}
            <Link to="/upload" style={{ 
              marginRight: '16px',
              textDecoration: 'none',
              color: 'inherit'
            }} title="Upload Video">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ color: '#606060' }}>
                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
              </svg>
            </Link>

            {/* My Videos Button - NEW */}
            <Link to="/my-videos" style={{ 
              marginRight: '16px',
              textDecoration: 'none',
              color: 'inherit'
            }} title="My Videos">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ color: '#606060' }}>
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
              </svg>
            </Link>
            
            {/* Logout Button */}
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              marginRight: '12px'
            }}
            onClick={handleLogout}
            title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                <path d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
              </svg>
            </button>
            
            {/* User Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#065fd4',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              marginRight: '12px',
              padding: '8px 16px',
              color: '#065fd4',
              border: '1px solid #065fd4',
              borderRadius: '20px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Login
            </Link>
            <Link to="/register" style={{
              padding: '8px 16px',
              backgroundColor: '#065fd4',
              color: 'white',
              border: '1px solid #065fd4',
              borderRadius: '20px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;