import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", icon: "🏠", label: "Home" },
    { path: "/upload", icon: "⬆️", label: "Upload" },
    { path: "/my-videos", icon: "📹", label: "My Videos" },
    { 
      path: user ? "/profile" : "/login", 
      icon: user ? "👤" : "🔑", 
      label: user ? "Profile" : "Login" 
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenuClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>VideoHub</h2>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path} className="menu-item">
            <a 
              href={item.path} 
              className={`menu-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={(e) => handleMenuClick(e, item.path)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      
      {user && (
        <div className="user-section">
          <div className="user-avatar">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <p className="user-name">{user.email}</p>
            <p className="user-status">Online</p>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Sidebar;