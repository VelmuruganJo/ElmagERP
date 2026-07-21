import { useEffect, useState } from "react";
import API from "../services/api";
import "./Production.css";

function Production() {

    const [products, setProducts] = useState([]);
    const [history, setHistory] = useState([]);
    const [wip, setWip] = useState([]);

    const [form, setForm] = useState({
        category: "",
        model: "",
        stage: "COPPER",
        qty: "",
        reference: "",
        remarks: ""
    });

    // ==========================
    // LOAD ALL DATA
    // ==========================
    const loadData = async () => {
        try {

            const [productsRes, historyRes, wipRes] = await Promise.all([
                API.get("/products"),
                API.get("/production/history"),
                API.get("/production/wip")
            ]);

            setProducts(productsRes.data);
            setHistory(historyRes.data);
            setWip(wipRes.data);

        } catch (error) {

            console.log(error);

        }
    };

    // ==========================
    // INITIAL LOAD
    // ==========================
    useEffect(() => {

        loadData();

    }, []);

    // ==========================
    // FORM CHANGE
    // ==========================
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    // ==========================
    // SAVE PRODUCTION
    // ==========================
    const saveProduction = async () => {

        if (form.category === "") {

            alert("Select Category");
            return;

        }

        if (form.model === "") {

            alert("Select Model");
            return;

        }

        if (form.qty === "") {

            alert("Enter Production Qty");
            return;

        }

        try {

            await API.post(
                "/production/process",
                {
                    category: form.category,
                    model: form.model,
                    stage: form.stage,
                    qty: Number(form.qty),
                    reference: form.reference,
                    remarks: form.remarks
                }
            );

            alert("Production Saved Successfully");

            // Refresh history and WIP data
            await loadData();

            // Reset form
            setForm({
                category: "",
                model: "",
                stage: "COPPER",
                qty: "",
                reference: "",
                remarks: ""
            });

        } catch (error) {

            console.log(error);

            if (error.response) {

                alert(error.response.data);

            } else {

                alert("Server Error");

            }
        };
    };
    return (

<div className="production-page">

    <h2>Production Entry</h2>

    {/* ================= WIP CARDS ================= */}

    {/* <div className="wip-cards">

        <div className="card blue">

            <h4>Copper WIP</h4>

            <h2>
                {
                    wip
                        .filter(item => item.stage === "COPPER")
                        .reduce(
                            (total, item) => total + (item.availableQty || 0),
                            0
                        )
                }
            </h2>

        </div>

        <div className="card orange">

            <h4>Assembly WIP</h4>

            <h2>
                {
                    wip
                        .filter(item => item.stage === "ASSEMBLY")
                        .reduce(
                            (total, item) => total + (item.availableQty || 0),
                            0
                        )
                }
            </h2>

        </div>

        <div className="card green">

            <h4>Finished Goods</h4>

            <h2>
                {
                    wip
                        .filter(item => item.stage === "PACKING")
                        .reduce(
                            (total, item) => total + (item.availableQty || 0),
                            0
                        )
                }
            </h2>

        </div>

    </div> */}



    {/* ================= PRODUCTION FORM ================= */}

    <div className="production-form">

        <div>

            <label>Category</label>

            <select
                name="category"
                value={form.category}
                onChange={handleChange}
            >

                <option value="">
                    Select Category
                </option>

                {
                    [...new Set(products.map(p => p.category))]
                        .map(category => (

                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>

                        ))
                }

            </select>

        </div>



        <div>

            <label>Model</label>

            <select
                name="model"
                value={form.model}
                onChange={handleChange}
            >

                <option value="">
                    Select Model
                </option>

                {
                    products
                        .filter(
                            p => p.category === form.category
                        )
                        .map(product => (

                            <option
                                key={product.id}
                                value={product.model}
                            >
                                {product.model}
                            </option>

                        ))
                }

            </select>

        </div>



        <div>

            <label>Production Stage</label>

            <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
            >

                <option value="COPPER">
                    Copper Winding
                </option>

                <option value="ASSEMBLY">
                    Assembly Completed
                </option>

                <option value="PACKING">
                    Packing Completed
                </option>

            </select>

        </div>



        <div>

            <label>Production Qty</label>

            <input
                type="number"
                name="qty"
                value={form.qty}
                onChange={handleChange}
                placeholder="Enter Qty"
            />

        </div>



        <div>

            <label>Reference No</label>

            <input
                type="text"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="Production Reference"
            />

        </div>



        <div>

            <label>Remarks</label>

            <input
                type="text"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Remarks"
            />

        </div>



        <div className="full-width">

            <button
                className="save-btn"
                onClick={saveProduction}
            >
                Save Production
            </button>

        </div>

    </div>



    {/* ================= HISTORY TABLE ================= */}

        <div className="history-section">

        <h3>Production History</h3>

        <table>

            <thead>

                <tr>

                    <th>Date</th>

                    <th>Category</th>

                    <th>Model</th>

                    <th>Stage</th>

                    <th>Qty</th>

                    <th>Reference</th>

                </tr>

            </thead>

            <tbody>

                {
                    history.length === 0 ?

                        <tr>

                            <td colSpan="6">
                                No Production History Found
                            </td>

                        </tr>

                        :

                        history.map(row => (

                            <tr key={row.id}>

                                <td>
                                    {row.productionDate}
                                </td>

                                <td>
                                    {row.category}
                                </td>

                                <td>
                                    {row.model}
                                </td>

                                <td>

                                    {
                                        row.stage === "COPPER"
                                            ? "Copper Winding"
                                            : row.stage === "ASSEMBLY"
                                            ? "Assembly Completed"
                                            : row.stage === "PACKING"
                                            ? "Packing Completed"
                                            : row.stage
                                    }

                                </td>

                                <td>
                                    {row.qty}
                                </td>

                                <td>
                                    {row.referenceNo}
                                </td>

                            </tr>

                        ))
                }

            </tbody>

        </table>

    </div>

</div>

);

}

export default Production;