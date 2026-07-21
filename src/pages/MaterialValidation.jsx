import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import MaterialDetailPopup from "./MaterialDetailPopup";
import "./common.css";

function MaterialValidation() {

    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [plans, setPlans] = useState([]);

    const [popupOpen, setPopupOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const [canCalculate, setCanCalculate] = useState(false);

    const normalize = (value) => {
        return value
            ?.toString()
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace("choke", "chokes");
    };

    useEffect(() => {
        loadAll();
    }, []);

const loadAll = async () => {

    try {

        const [validationRes, productRes, planRes] =
            await Promise.all([
                API.get("/material-validation"),
                API.get("/products"),
                API.get("/plans")
            ]);

        const validationData = validationRes.data || [];
        const productsData = productRes.data || [];
        const plansData = planRes.data || [];

        setProducts(productsData);
        setPlans(plansData);

        // Calculate pending production for each row
        const rows = validationData.map(row => {

            const product = productsData.find(
                p =>
                    normalize(p.category) === normalize(row.category) &&
                    normalize(p.model) === normalize(row.model)
            );

            let pendingQty = 0;

            if (product) {

                let planQty = 0;

                plansData.forEach(plan => {

                    if (
                        normalize(plan.category) === normalize(product.category) &&
                        normalize(plan.model) === normalize(product.model)
                    ) {

                        planQty += Number(
                            plan.planQty ??
                            plan.totalPlan ??
                            plan.outwardTotalPlan ??
                            plan.inwardTotalPlan ??
                            0
                        );

                    }

                });

                pendingQty =
                    planQty -
                    Number(product.dispatchQty || 0) -
                    Number(product.finishedQty || 0);

            }

            return {

                ...row,

                pendingProduction: pendingQty,

                calculatedQty: pendingQty,

                urgentQty: null

            };

        });

        // Auto calculate using Pending Production
        const res = await API.post(
            "/material-validation/calculate",
            rows
        );

        setData(res.data || []);

    } catch (err) {

        console.log(err);

    }

};

    const getPlanQty = (category, model) => {

        let qty = 0;

        plans.forEach(plan => {

            if (
                normalize(plan.category) === normalize(category) &&
                normalize(plan.model) === normalize(model)
            ) {

                qty += Number(
                    plan.planQty ??
                    plan.totalPlan ??
                    plan.outwardTotalPlan ??
                    plan.inwardTotalPlan ??
                    0
                );

            }

        });

        return qty;
    };

    const getPendingProduction = (row) => {

        const product = products.find(
            p =>
                normalize(p.category) === normalize(row.category) &&
                normalize(p.model) === normalize(row.model)
        );

        if (!product) return 0;

        const planQty =
            getPlanQty(
                product.category,
                product.model
            );

        return (
            planQty -
            Number(product.dispatchQty || 0) -
            Number(product.finishedQty || 0)
        );

    };

    const displayData = useMemo(() => {

        return data.map(row => {

            const pendingQty =
                getPendingProduction(row);

            const overallStatus =
                row.details && row.details.length > 0
                    ? row.details.every(
                        d => d.status === "AVAILABLE"
                    )
                        ? "AVAILABLE"
                        : "SHORTAGE"
                    : row.status || "";

            return {

                ...row,

                pendingQty,

                calculatedQty:
    row.calculatedQty ??
    row.pendingProduction ??
    pendingQty,

                status: overallStatus

            };

        });

    }, [data, products, plans]);

    const changeUrgentQty = (index, value) => {

        const updated = [...data];

        updated[index].urgentQty =
            value === ""
                ? null
                : Number(value);

        setData(updated);

        const enable =
            updated.some(
                row =>
                    row.urgentQty !== null &&
                    row.urgentQty > 0
            );

        setCanCalculate(enable);

    };

    const calculateMaterial = async () => {

        try {

            const payload =
                displayData.map(row => {

                    const productionQty =
                        row.urgentQty &&
                        Number(row.urgentQty) > 0
                            ? Number(row.urgentQty)
                            : Number(row.pendingQty);

                    return {

                        ...row,

                        pendingProduction:
                            Number(row.pendingQty),

                        calculatedQty:
                            productionQty,

                        urgentQty:
                            row.urgentQty

                    };

                });

            const res =
                await API.post(
                    "/material-validation/calculate",
                    payload
                );

            const newData =
                res.data || [];

            setData(newData);

            if (selected) {

                const updatedSelected =
                    newData.find(
                        r =>
                            r.category === selected.category &&
                            r.model === selected.model
                    );

                if (updatedSelected) {
                    setSelected(updatedSelected);
                }

            }

            setCanCalculate(false);

        } catch (err) {

            console.log(err);

        }

    };

    const openDetails = (row) => {

        const latest =
            displayData.find(
                r =>
                    r.category === row.category &&
                    r.model === row.model
            );

        setSelected(latest);

        setPopupOpen(true);

    };

    const closePopup = () => {

        setPopupOpen(false);

        setSelected(null);

    };
        return (

        <div className="stock-page">

            <h2>Material Validation</h2>

            <button
                className="calculate-btn"
                onClick={calculateMaterial}
                disabled={!canCalculate}
            >
                Calculate Material
            </button>

            <table className="stock-table">

                <thead>

                    <tr>

                        <th>Sl No</th>
                        <th>Category</th>
                        <th>Model</th>
                        <th>Pending Production</th>
                        <th>Urgent Qty</th>
                        <th>Required Qty</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        displayData.map((row, index) => (

                            <tr key={row.id || index}>

                                <td>{index + 1}</td>

                                <td>{row.category}</td>

                                <td>
                                    <b>{row.model}</b>
                                </td>

                                <td>{row.pendingQty}</td>

                                <td>

                                    <input
                                        type="number"
                                        className="copperinput"
                                        value={row.urgentQty ?? ""}
                                        onChange={(e) =>
                                            changeUrgentQty(
                                                data.findIndex(
                                                    item =>
                                                        item.category === row.category &&
                                                        item.model === row.model
                                                ),
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>
                                    {row.calculatedQty}
                                </td>

                                <td>
                                    {row.status}
                                </td>

                                <td>

                                    <button
                                        onClick={() => openDetails(row)}
                                    >
                                        Details
                                    </button>

                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

            <MaterialDetailPopup
                open={popupOpen}
                onClose={closePopup}
                data={selected}
            />

        </div>

    );

}

export default MaterialValidation;