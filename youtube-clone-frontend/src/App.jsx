import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UploadVideo from "./pages/UploadVideo";
import MyVideos from './pages/MyVideo';
import Profile from "./pages/Profile";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/edit/:videoId" element={<UploadVideo />} />
          <Route path="/my-videos" element={<MyVideos />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;