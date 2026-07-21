import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!employeeCode || !password) {
      alert("Please enter Employee Code and Password.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        employeeCode,
        password,
      });

      const { token, role, employeeCode: empCode, username, fullName } =
        response.data;

      // Save user details
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("employeeCode", empCode);
      localStorage.setItem("username", username);
      localStorage.setItem("fullName", fullName);

      switch (role) {
        case "ADMIN":
          navigate("/admin");
          break;

        case "MANAGER":
          navigate("/manager");
          break;

        case "SUPERVISOR":
          navigate("/supervisor");
          break;

        case "WORKER":
          navigate("/worker");
          break;

        case "LOADER":
          navigate("/loader");
          break;

        default:
          alert("Invalid user role.");
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data || "Login failed.");
      } else {
        alert("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>ELMAG ERP</h1>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Employee ID"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;