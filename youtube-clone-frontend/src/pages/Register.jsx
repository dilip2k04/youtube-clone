import { useState } from "react";
import { API_URL } from "../utils/api";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        window.location.href = "/login";
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ padding: "20px" }}>
      <h2>Register</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required /><br />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
