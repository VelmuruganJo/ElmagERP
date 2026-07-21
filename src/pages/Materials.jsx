import { useState, useEffect } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./common.css";

function Materials() {
  const [form, setForm] = useState({
    materialCode: "",
    materialName: "",
    make: "",
    vendor: "",
    price: "",
    uom: "",
    minStock: ""
  });

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [editCode, setEditCode] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [csvFile, setCsvFile] =useState(null);
  const [typeFilter, setTypeFilter] = useState("All");

  const uploadCSV = async () => {
  if (!csvFile) {
    alert("Please select a CSV file.");
    return;
  }


  const formData = new FormData();
  formData.append("file", csvFile);

  try {
    await API.post("/materials/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("CSV Uploaded Successfully");

    setCsvFile(null);
    loadData();
  } catch (err) {
    console.error(err);
    alert("CSV Upload Failed");
  }
};

  // LOAD DATA
  const loadData = async () => {
    try {
      const res = await API.get("/materials");
      const data = res.data || [];

      const sorted = [...data].sort((a, b) =>
        (a.materialCode || "").localeCompare(b.materialCode || "")
      );

      setRecords(sorted);

let filtered = [...sorted];

if (typeFilter !== "All") {
  filtered = filtered.filter(
    (r) => (r.vendor || "").toLowerCase() === typeFilter.toLowerCase()
  );
}

if (search.trim() !== "") {
  filtered = filtered.filter((r) =>
    Object.values(r).some((val) =>
      String(val ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );
}

setFilteredRecords(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const applyFilters = (searchText, type) => {
  let filtered = [...records];

  if (type !== "All") {
    filtered = filtered.filter(
      (r) => (r.vendor || "").toLowerCase() === type.toLowerCase()
    );
  }

  if (searchText.trim() !== "") {
    filtered = filtered.filter((r) =>
      Object.values(r).some((val) =>
        String(val ?? "")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
  }

  setFilteredRecords(filtered);
};

  // SEARCH
 const handleSearch = (value) => {
  setSearch(value);
  applyFilters(value, typeFilter);
};
  const handleTypeFilter = (value) => {
  setTypeFilter(value);
  applyFilters(search, value);
};

  // EXPORT TO EXCEL
  const exportToExcel = () => {
    const data = filteredRecords.map((r, index) => ({
      "Sl No": index + 1,
      "Material Code": r.materialCode,
      "Material Name": r.materialName,
      Make: r.make,
      Vendor: r.vendor,
      UOM: r.uom,
      "Min Stock": r.minStock,
      Price: r.price
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Materials");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });

    saveAs(new Blob([buffer]), "Materials.xlsx");
  };

  // SAVE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editCode) {
        await API.put(`/materials/${editCode}`, form);
        setEditCode(null);
      } else {
        await API.post("/materials", form);
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error saving material.");
    }
  };

  // RESET
  const resetForm = () => {
    setForm({
      materialCode: "",
      materialName: "",
      make: "",
      vendor: "",
      price: "",
      uom: "",
      minStock: ""
    });

    setEditCode(null);
    setShowForm(false);
  };

  // EDIT
  const editMaterial = (material) => {
    setEditCode(material.materialCode);
    setShowForm(true);

    setForm({
      materialCode: material.materialCode || "",
      materialName: material.materialName || "",
      make: material.make || "",
      vendor: material.vendor || "",
      price: material.price || "",
      uom: material.uom || "",
      minStock: material.minStock || ""
    });
  };

  // DELETE
  const deleteMaterial = async (code, e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this material?")) {
      return;
    }

    try {
      await API.delete(`/materials/${code}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  return (
    <div className="stock-page">
      <h2>Material List</h2>

      <div className="top-bar">
        <button
          className="stock-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Material"}
        </button>

        <input
          type="text"
          placeholder="Search Material..."
          className="search-input"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <input className="csvbox"
  type="file"
  accept=".csv"
  onChange={(e) => setCsvFile(e.target.files[0])}
/>
<select
  className="search-input"
  value={typeFilter}
  onChange={(e) => handleTypeFilter(e.target.value)}
>
  <option value="All">All</option>
  <option value="Copper">Copper</option>
  <option value="Assembly">Assembly</option>
  <option value="Packing">Packing</option>
</select>

<button
  className="btn-save"
  onClick={uploadCSV}
>
  Upload CSV
</button>

        <button
          className="btn-export"
          onClick={exportToExcel}
        >
          Export Excel
        </button>
      </div>

      {showForm && (
        <form className="stock-form" onSubmit={handleSubmit}>
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type={
                key === "price" || key === "minStock"
                  ? "number"
                  : "text"
              }
              placeholder={key}
              className="form-input"
              value={form[key]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]: e.target.value
                })
              }
              required={
                key === "materialCode" ||
                key === "materialName" ||
                key === "price"
              }
            />
          ))}

          <button type="submit" className="btn-save">
            {editCode ? "Update" : "Save"}
          </button>
        </form>
      )}

      <div className="table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Material Code</th>
              <th>Material Name</th>
              <th>Make</th>
              <th>Type</th>
              <th>UOM</th>
              <th>Min Stock</th>
              <th>Price</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((r, index) => (
                <tr
                  key={r.materialCode}
                  onClick={() => editMaterial(r)}
                >
                  <td>{index + 1}</td>
                  <td>{r.materialCode}</td>
                  <td className="materialn">{r.materialName}</td>
                  <td>{r.make}</td>
                  <td>{r.vendor}</td>
                  <td>{r.uom}</td>
                  <td>{r.minStock}</td>
                  <td>
                    ₹ {Number(r.price || 0).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="btn-cancel"
                      onClick={(e) =>
                        deleteMaterial(r.materialCode, e)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">Material Not Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Materials;