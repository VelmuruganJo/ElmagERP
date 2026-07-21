import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");

  // Load pending items
  const loadData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8082/api/manager/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Approve
  const approve = async (id) => {
    await axios.put(
      `http://localhost:8082/api/manager/approve/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    loadData();
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeCode");

    navigate("/");
  };

  // Reject
  const reject = async (id) => {
    await axios.put(
      `http://localhost:8082/api/manager/reject/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    loadData();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manager Dashboard</h2>
      <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Material</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.materialName}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.supplierName}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => approve(item.id)}>
                  Approve
                </button>
                <button onClick={() => reject(item.id)}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};

export default ManagerDashboard;