import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import SupervisorDashboard from "./SupervisorDashboard";
import WorkerDashboard from "./WorkerDashboard";
import LoaderDashboard from "./LoaderDashboard";

const Dashboard = () => {

  const role = localStorage.getItem("role");

  switch (role) {

    case "ADMIN":
      return <AdminDashboard />;

    case "MANAGER":
      return <ManagerDashboard />;

    case "SUPERVISOR":
      return <SupervisorDashboard />;

    case "WORKER":
      return <WorkerDashboard />;

    case "LOADER":
      return <LoaderDashboard />;

    default:
      return <h2>Invalid Role</h2>;
  }
};

export default Dashboard;