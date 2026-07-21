import { useState, useEffect } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./common.css";

function Plan() {

    const months = [
        { value: 1, name: "January" },
        { value: 2, name: "February" },
        { value: 3, name: "March" },
        { value: 4, name: "April" },
        { value: 5, name: "May" },
        { value: 6, name: "June" },
        { value: 7, name: "July" },
        { value: 8, name: "August" },
        { value: 9, name: "September" },
        { value: 10, name: "October" },
        { value: 11, name: "November" },
        { value: 12, name: "December" }
    ];

    const currentDate = new Date();

    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [year, setYear] = useState(currentDate.getFullYear());

    const [plans, setPlans] = useState([]);

    const [message, setMessage] = useState("");

    const models = {
        Transformer: [
            "1200VA",
            "850VA",
            "800VA",
            "350VA",
            "180VA"
        ],

        Choke: [
            "42A",
            "30A",
            "22A",
            "16A",
            "12A",
            "10A"
        ],

        "Emergency Brake Actuator": [
            "EBA"
        ]
    };

    const plants = [
        "Plant 1",
        "Plant 2"
    ];

    const loadPlans = async () => {

        try {

            const res = await API.get(`/plans/${month}/${year}`);

            setPlans(res.data || []);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadPlans();

    }, [month, year]);

    const getQty = (plant, category, model) => {

        const row = plans.find(p =>
            p.plant === plant &&
            p.category === category &&
            p.model === model
        );

        return row ? row.planQty : "";

    };

    const changeQty = (plant, category, model, value) => {

        const qty = Number(value);

        setPlans(prev => {

            const temp = [...prev];

            const index = temp.findIndex(p =>
                p.plant === plant &&
                p.category === category &&
                p.model === model
            );

            if (index >= 0) {

                temp[index].planQty = qty;

                temp[index].balanceQty = qty;

            } else {

                temp.push({

                    planMonth: month,

                    planYear: year,

                    plant,

                    category,

                    model,

                    planQty: qty,

                    dispatchQty: 0,

                    balanceQty: qty,

                    status: "OPEN"

                });

            }

            return temp;

        });

    };

    const savePlans = async () => {

    try {

        for (const row of plans) {

            await API.post("/plans", row);

        }

        setMessage("Plan Saved Successfully");

        loadPlans();

    } catch (err) {

        console.log(err);

        setMessage("Save Failed");

    }

};

    const exportExcel = () => {

        const rows = plans.map((p, i) => ({

            SlNo: i + 1,

            Month: months.find(m => m.value === p.planMonth)?.name,

            Year: p.planYear,

            Plant: p.plant,

            Category: p.category,

            Model: p.model,

            PlanQty: p.planQty,

            DispatchQty: p.dispatchQty,

            BalanceQty: p.balanceQty,

            Status: p.status

        }));

        const ws = XLSX.utils.json_to_sheet(rows);

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Production Plan");

        const buffer = XLSX.write(wb, {

            type: "array",

            bookType: "xlsx"

        });

        saveAs(

            new Blob([buffer]),

            `ProductionPlan_${month}_${year}.xlsx`

        );

    };

    // DELETE PLAN
const deletePlan = async (id) => {

    if (!id) {

        alert("This record is not saved yet.");

        return;

    }

    if (!window.confirm("Delete this plan?")) {

        return;

    }

    try {

        await API.delete(`/plans/${id}`);

        alert("Plan Deleted Successfully");

        loadPlans();

    } catch (err) {

        console.log(err);

        alert("Delete Failed");

    }

};

    return (
<div className="stock-page">

    <h2>Production Plan</h2>

    {/* TOP BAR */}

    <div className="top-bar">

        <button
            className="stock-btn"
            onClick={savePlans}
        >
            Save Plan
        </button>

        <select
            className="form-input"
            value={month}
            onChange={(e)=>setMonth(Number(e.target.value))}
        >
            {
                months.map(m=>(
                    <option
                        key={m.value}
                        value={m.value}
                    >
                        {m.name}
                    </option>
                ))
            }
        </select>

        <select
            className="form-input"
            value={year}
            onChange={(e)=>setYear(Number(e.target.value))}
        >
            {
                Array.from(
                    {length:10},
                    (_,i)=>2025+i
                ).map(y=>(
                    <option
                        key={y}
                        value={y}
                    >
                        {y}
                    </option>
                ))
            }
        </select>

        <button
            className="btn-export"
            onClick={exportExcel}
        >
            Export Excel
        </button>

    </div>

    <p>{message}</p>

    <div className="table-container">

    <table className="stock-table">

        <thead>

        <tr>

            <th>Plant</th>

            <th>1200VA</th>
            <th>850VA</th>
            <th>800VA</th>
            <th>350VA</th>
            <th>180VA</th>

            <th>42A</th>
            <th>30A</th>
            <th>22A</th>
            <th>16A</th>
            <th>12A</th>
            <th>10A</th>

            <th>EBA</th>

        </tr>

        <tr>

            <th></th>

            <th colSpan="5">
                Transformer
            </th>

            <th colSpan="6">
                Choke
            </th>

            <th>
                Emergency Brake Actuator
            </th>

        </tr>

        </thead>

        <tbody>

        {
            plants.map(plant=>(

                <tr key={plant}>

                    <td>
                        <b>{plant}</b>
                    </td>

                    {
                        models.Transformer.map(model=>(

                            <td key={model}>

                                <input
                                    type="number"
                                    className="form-input"
                                    value={
                                        getQty(
                                            plant,
                                            "Transformer",
                                            model
                                        )
                                    }
                                    onChange={(e)=>

                                        changeQty(
                                            plant,
                                            "Transformer",
                                            model,
                                            e.target.value
                                        )

                                    }
                                />

                            </td>

                        ))
                    }

                    {
                        models.Choke.map(model=>(

                            <td key={model}>

                                <input
                                    type="number"
                                    className="form-input"
                                    value={
                                        getQty(
                                            plant,
                                            "Choke",
                                            model
                                        )
                                    }
                                    onChange={(e)=>

                                        changeQty(
                                            plant,
                                            "Choke",
                                            model,
                                            e.target.value
                                        )

                                    }
                                />

                            </td>

                        ))
                    }

                    {
                        models["Emergency Brake Actuator"].map(model=>(

                            <td key={model}>

                                <input
                                    type="number"
                                    className="form-input"
                                    value={
                                        getQty(
                                            plant,
                                            "Emergency Brake Actuator",
                                            model
                                        )
                                    }
                                    onChange={(e)=>

                                        changeQty(
                                            plant,
                                            "Emergency Brake Actuator",
                                            model,
                                            e.target.value
                                        )

                                    }
                                />

                            </td>

                        ))
                    }

                </tr>

            ))
        }

        </tbody>

    </table>

    </div>
        {/* ================= HISTORY TABLE ================= */}

    <h3 style={{ marginTop: "30px" }}>
        Plan History
    </h3>

    <div className="table-container">

        <table className="stock-table">

            <thead>

                <tr>

                    <th>Sl No</th>

                    <th>Month</th>

                    <th>Year</th>

                    <th>Plant</th>

                    <th>Category</th>

                    <th>Model</th>

                    <th>Plan Qty</th>

                    <th>Dispatch Qty</th>

                    <th>Balance Qty</th>

                    <th>Status</th>

                    <th>Delete</th>

                </tr>

            </thead>

            <tbody>

                {
                    plans.length > 0 ?

                    plans.map((row,index)=>(

                        <tr key={row.id || index}>

                            <td>
                                {index+1}
                            </td>

                            <td>
                                {
                                    months.find(
                                        m=>m.value===row.planMonth
                                    )?.name
                                }
                            </td>

                            <td>
                                {row.planYear}
                            </td>

                            <td>
                                {row.plant}
                            </td>

                            <td>
                                {row.category}
                            </td>

                            <td>
                                {row.model}
                            </td>

                            <td>
                                {row.planQty}
                            </td>

                            <td>
                                {row.dispatchQty}
                            </td>

                            <td>
                                {row.balanceQty}
                            </td>

                            <td>

                                <span
                                    style={{
                                        color:
                                        row.status==="OPEN"
                                        ? "green"
                                        : "red",

                                        fontWeight:"bold"
                                    }}
                                >
                                    {row.status}
                                </span>

                            </td>

                            <td>

                                <button

                                    className="btn-cancel"

                                    onClick={()=>deletePlan(row.id)}

                                >

                                    Delete

                                </button>

                            </td>

                        </tr>

                    ))

                    :

                    <tr>

                        <td colSpan="11">

                            No Plan Found

                        </td>

                    </tr>

                }

            </tbody>

        </table>

    </div>

    </div>

);

}

export default Plan;