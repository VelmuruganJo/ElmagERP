import { useNavigate } from "react-router-dom";

const WorkerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeCode");

    navigate("/");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>WORKER DASHBOARD</h1>
      <p>View Stock Only</p>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default WorkerDashboard;