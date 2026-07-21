import { useNavigate } from "react-router-dom";

const SupervisorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeCode");

    navigate("/");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>SUPERVISOR DASHBOARD</h1>
      <p>Inward & Outward Entry Only</p>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default SupervisorDashboard;