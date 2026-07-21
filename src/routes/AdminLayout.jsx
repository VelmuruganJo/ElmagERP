import { Outlet } from "react-router-dom";
import Header from "../pages/Header";
import Sidebar from "../pages/Sidebar";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <>
      <Header />

      <div className="layout">

        <Sidebar />

        <main className="main-content">
          <Outlet />
        </main>

      </div>
    </>
  );
}

export default AdminLayout;