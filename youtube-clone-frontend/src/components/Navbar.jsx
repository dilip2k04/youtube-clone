import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ margin: "0 10px", color: "#fff" }}>Home</Link>
      {user ? (
        <>
          <Link to="/upload" style={{ margin: "0 10px", color: "#fff" }}>Upload</Link>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ margin: "0 10px", color: "#fff" }}>Login</Link>
          <Link to="/register" style={{ margin: "0 10px", color: "#fff" }}>Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
