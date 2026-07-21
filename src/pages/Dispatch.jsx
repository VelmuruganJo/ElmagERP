import { useState, useEffect } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./common.css";

function Dispatch() {

    // ===========================
    // FORM
    // ===========================

    const [form, setForm] = useState({
        date: new Date().toISOString().split("T")[0],
        category: "",
        model: "",
        customer: "",
        qty: "",
        remarks: ""
    });

    // ===========================
    // TABLE DATA
    // ===========================

    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);

    // ===========================
    // DROPDOWNS
    // ===========================

    const [categories, setCategories] = useState([]);
    const [models, setModels] = useState([]);

    // ===========================
    // UI
    // ===========================

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    // ===========================
    // LOAD DISPATCH RECORDS
    // ===========================

    const loadDispatch = async () => {

        try {

            const res = await API.get("/dispatch");

            const data = res.data || [];

            data.sort((a, b) => b.id - a.id);

            setRecords(data);
            setFilteredRecords(data);

        } catch (err) {

            console.error(err);

        }

    };

    // ===========================
    // LOAD CATEGORY LIST
    // ===========================

    const loadCategories = async () => {

        try {

            const res = await API.get("/products/categories");

            setCategories(res.data || []);

        } catch (err) {

            console.error(err);

        }

    };

    // ===========================
    // LOAD MODEL LIST
    // ===========================

    const loadModels = async (category) => {

        if (!category) {

            setModels([]);
            return;

        }

        try {

            const res = await API.get("/products/models", {
                params: {
                    category: category
                }
            });

            setModels(res.data || []);

        } catch (err) {

            console.error(err);

        }

    };

    // ===========================
    // PAGE LOAD
    // ===========================

    useEffect(() => {

        loadDispatch();
        loadCategories();

    }, []);

    // ===========================
    // CATEGORY CHANGE
    // ===========================

    useEffect(() => {

        if (form.category !== "") {

            loadModels(form.category);

        }

    }, [form.category]);

    // ===========================
    // SEARCH
    // ===========================

    const handleSearch = (value) => {

        setSearch(value);

        if (value.trim() === "") {

            setFilteredRecords(records);

            return;

        }

        const filtered = records.filter((r) =>

            Object.values(r).some((v) =>

                String(v ?? "")
                    .toLowerCase()
                    .includes(value.toLowerCase())

            )

        );

        setFilteredRecords(filtered);

    };

        // ===========================
    // SAVE / UPDATE
    // ===========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editId) {

                await API.put(`/dispatch/${editId}`, form);

            } else {

                await API.post("/dispatch", form);

            }

            resetForm();

            loadDispatch();

        } catch (err) {

    console.error(err);

    if (err.response && err.response.data) {
        alert(err.response.data);
    } else {
        alert("Unable to save dispatch.");
    }

}

    };

    // ===========================
    // RESET FORM
    // ===========================

    const resetForm = () => {

        setForm({
            date: new Date().toISOString().split("T")[0],
            category: "",
            model: "",
            customer: "",
            qty: "",
            remarks: ""
        });

        setModels([]);

        setEditId(null);

        setShowForm(false);

    };

    // ===========================
    // EDIT
    // ===========================

    const editDispatch = async (record) => {

        setEditId(record.id);

        setShowForm(true);

        // Load models for selected category
        await loadModels(record.category);

        setForm({

            date: record.date || "",

            category: record.category || "",

            model: record.model || "",

            customer: record.customer || "",

            qty: record.qty || "",

            remarks: record.remarks || ""

        });

    };

    // ===========================
    // DELETE
    // ===========================

    const deleteDispatch = async (id, e) => {

        e.stopPropagation();

        if (!window.confirm("Delete this dispatch record?")) {
            return;
        }

        try {

            await API.delete(`/dispatch/${id}`);

            loadDispatch();

        } catch (err) {

            console.error(err);

            alert("Delete failed.");

        }

    };

    // ===========================
    // EXPORT TO EXCEL
    // ===========================

    const exportToExcel = () => {

        const data = filteredRecords.map((r, index) => ({

            "Sl No": index + 1,

            "Date": r.date,

            "Category": r.category,

            "Model": r.model,

            "Customer": r.customer,

            "Qty": r.qty,

            "Remarks": r.remarks

        }));

        const ws = XLSX.utils.json_to_sheet(data);

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Dispatch");

        const buffer = XLSX.write(wb, {

            bookType: "xlsx",

            type: "array"

        });

        saveAs(
            new Blob([buffer]),
            "Dispatch.xlsx"
        );

    };

        return (
        <div className="stock-page">

            <h2>Dispatch</h2>

            <div className="top-bar">

                <button
                    className="stock-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Close Form" : "Add Dispatch"}
                </button>

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />

                <button
                    className="btn-export"
                    onClick={exportToExcel}
                >
                    Export Excel
                </button>

            </div>

            {showForm && (

                <form
                    className="stock-form"
                    onSubmit={handleSubmit}
                >

                    {/* Date */}

                    <input
                        type="date"
                        className="form-input"
                        value={form.date}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                date: e.target.value
                            })
                        }
                        required
                    />

                    {/* Category */}

                    <select
                        className="form-input"
                        value={form.category}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                category: e.target.value,
                                model: ""
                            })
                        }
                        required
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map((c, index) => (
                            <option
                                key={index}
                                value={c}
                            >
                                {c}
                            </option>
                        ))}

                    </select>

                    {/* Model */}

                    <select
                        className="form-input"
                        value={form.model}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                model: e.target.value
                            })
                        }
                        required
                    >
                        <option value="">
                            Select Model
                        </option>

                        {models.map((m, index) => (
                            <option
                                key={index}
                                value={m}
                            >
                                {m}
                            </option>
                        ))}

                    </select>

                    {/* Customer */}

                    <input
                        type="text"
                        className="form-input"
                        placeholder="Customer"
                        value={form.customer}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                customer: e.target.value
                            })
                        }
                        required
                    />

                    {/* Qty */}

                    <input
                        type="number"
                        className="form-input"
                        placeholder="Qty"
                        min="1"
                        value={form.qty}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                qty: e.target.value
                            })
                        }
                        required
                    />

                    {/* Remarks */}

                    <input
                        type="text"
                        className="form-input"
                        placeholder="Remarks"
                        value={form.remarks}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                remarks: e.target.value
                            })
                        }
                    />

                    <button
                        type="submit"
                        className="btn-save"
                    >
                        {editId ? "Update" : "Save"}
                    </button>

                </form>

            )}

            <div className="table-container">

                <table className="stock-table">

                    <thead>

                        <tr>

                            <th>Sl No</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Model</th>
                            <th>Customer</th>
                            <th>Qty</th>
                            <th>Remarks</th>
                            <th>Delete</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredRecords.length > 0 ? (

                            filteredRecords.map((r, index) => (

                                <tr
                                    key={r.id}
                                    onClick={() => editDispatch(r)}
                                >

                                    <td>{index + 1}</td>

                                    <td>{r.date}</td>

                                    <td>{r.category}</td>

                                    <td>{r.model}</td>

                                    <td>{r.customer}</td>

                                    <td>{r.qty}</td>

                                    <td>{r.remarks}</td>

                                    <td>

                                        <button
                                            className="btn-cancel"
                                            onClick={(e) =>
                                                deleteDispatch(r.id, e)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td colSpan="8">
                                    No Dispatch Records Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );

}

export default Dispatch;