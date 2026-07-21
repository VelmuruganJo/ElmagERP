import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoaderDashboard = () => {

  const navigate = useNavigate();

  const [materialName, setMaterialName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      await api.post("/loader/inward", {
        materialName,
        quantity: Number(quantity),
        unit,
        supplierName,
        createdBy: localStorage.getItem("employeeCode")
      });

      alert("Material submitted successfully.");

      // Clear form
      setMaterialName("");
      setQuantity("");
      setUnit("");
      setSupplierName("");

    } catch (error) {

      console.error(error);

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Unable to connect to the server.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "500px" }}>

      <h2>Loader Dashboard</h2>

      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Material Name"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Supplier Name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer"
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </form>

    </div>
  );
};

export default LoaderDashboard;