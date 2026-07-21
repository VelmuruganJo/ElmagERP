import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "./AdminLayout";

// Dashboards
import AdminDashboard from "../pages/AdminDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import SupervisorDashboard from "../pages/SupervisorDashboard";
import WorkerDashboard from "../pages/WorkerDashboard";
import LoaderDashboard from "../pages/LoaderDashboard";

// OTSIL Pages
import Materials from "../pages/Materials";
import Stock from "../pages/Stock";
import StockIn from "../pages/StockIn";
import StockOut from "../pages/StockOut";
import CopperMaster from "../pages/CopperMaster";
import Plan from "../pages/plan";
import BOQMaster from "../pages/BOQMaster";
import ProductMaster from "../pages/ProductMaster";
import Production from "../pages/Production";
import CopperValidation from "../pages/CopperValidation";
import Dispatch from "../pages/Dispatch";
import MaterialValidation from "../pages/MaterialValidation";



function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<AdminDashboard />} />

          {/* Dashboard Cards */}
          <Route path="copper-master" element={<CopperMaster />} />

          {/* OTSIL */}
          <Route path="materials" element={<Materials />} />
          <Route path="stock" element={<Stock />} />
          <Route path="stockin" element={<StockIn />} />
          <Route path="stockout" element={<StockOut />} />
          <Route path="plan" element={<Plan />} />
          <Route path="boq" element={<BOQMaster/>}/>
          <Route path="product" element={<ProductMaster/>}/>
          <Route path="production" element={<Production/>}/>


          <Route path="copper-validation" element={<CopperValidation />}/>
          <Route path="dispatch" element={<Dispatch />}/>
          <Route path="material-validation" element={<MaterialValidation/>}/>
        </Route>

        {/* ================= MANAGER ================= */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute role="MANAGER">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= SUPERVISOR ================= */}

        <Route
          path="/supervisor"
          element={
            <ProtectedRoute role="SUPERVISOR">
              <SupervisorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= LOADER ================= */}

        <Route
          path="/loader"
          element={
            <ProtectedRoute role="LOADER">
              <LoaderDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= WORKER ================= */}

        <Route
          path="/worker"
          element={
            <ProtectedRoute role="WORKER">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;