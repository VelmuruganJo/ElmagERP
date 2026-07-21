import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import CopperDetailPopup from "./CopperDetailPopup";
import "./common.css";

function CopperValidation() {

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
            .replace("choke", "chokes");};
    const getPlanQty = (category, model) => {
        let qty = 0;
        plans.forEach(plan => {
            if (normalize(plan.category) === normalize(category) &&
                normalize(plan.model) === normalize(model)) {
                    qty += Number(
                        plan.planQty ??
                        plan.totalPlan ??
                        plan.outwardTotalPlan ??
                        plan.inwardTotalPlan ??
                        0);}});
            return qty;};
    const getPendingProduction = (row) => {
        const product = products.find(p =>
                normalize(p.category) === normalize(row.category) &&
                normalize(p.model) === normalize(row.model));
        if (!product) return 0;
        const planQty = getPlanQty(product.category,product.model);
        const dispatchQty = Number(product.dispatchQty || 0);
        const finishedQty = Number(product.finishedQty || 0);
        return planQty - dispatchQty - finishedQty;};
const displayData = useMemo(() => {

    return data.map(row => {

        const pendingQty = getPendingProduction(row);

        const overallStatus =
            row.details && row.details.length > 0
                ? row.details.every(d => d.status === "AVAILABLE")
                    ? "AVAILABLE"
                    : "SHORTAGE"
                : row.status || "";

        return {

            ...row,

            pendingQty,

            calculatedQty:
                row.calculatedQty ?? pendingQty,

            status: overallStatus

        };

    });

}, [data, products, plans]);

useEffect(() => {
    loadAll();
}, []);

const loadAll = async () => {
    try {

        const [productRes, planRes, copperRes] = await Promise.all([
            API.get("/products"),
            API.get("/plans"),
            API.get("/copper-validation")
        ]);

        const productsData = productRes.data || [];
        const plansData = planRes.data || [];
        const copperData = copperRes.data || [];

        setProducts(productsData);
        setPlans(plansData);

        // Calculate Pending Qty first
        const rows = copperData.map(row => {

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
                pendingQty,
                calculatedQty: pendingQty
            };

        });

        // Auto calculate using Pending Qty
        const res = await API.post(
            "/copper-validation/calculate",
            rows.map(r => ({
    ...r,
    pendingProduction: Number(r.pendingQty || 0),
    calculatedQty: Number(r.pendingQty || 0)
}))
        );

        setData(res.data || []);

    }
    catch (err) {
        console.log(err);
    }
};



    const changeUrgentQty=(index,value)=>{

        const updated=[...data];

        updated[index].urgentQty =
            value === "" ? null : Number(value);


        setData(updated);


        const enable = updated.some(
            row =>
                row.urgentQty !== null &&
                row.urgentQty > 0
        );


        setCanCalculate(enable);

    };



const calculateCopper = async () => {

    try {

        const payload = displayData.map(row => {

            const productionQty =
                row.urgentQty && Number(row.urgentQty) > 0
                    ? Number(row.urgentQty)
                    : Number(row.pendingQty);

            return {
    ...row,
    pendingProduction: Number(row.pendingQty),
    calculatedQty: productionQty,
    urgentQty: row.urgentQty
};
        });

        const res = await API.post(
            "/copper-validation/calculate",
            payload
        );

        const newData = res.data || [];

setData(newData);

if (selected) {
    const updatedSelected = newData.find(
        r =>
            r.category === selected.category &&
            r.model === selected.model
    );

    if (updatedSelected) {
        setSelected(updatedSelected);
    }
}

setCanCalculate(false);

    } catch (error) {
        console.log(error);
    }
};



    const openDetails = (row) => {

    const latest = displayData.find(
        r =>
            r.category === row.category &&
            r.model === row.model
    );

    setSelected(latest);

    setPopupOpen(true);
};


    const closePopup=()=>{

        setPopupOpen(false);

        setSelected(null);

    };
    console.log("Display Data", displayData);


    return (

        <div className="stock-page">

            <h2>Copper Stock Validation</h2>


            <button
    className="calculate-btn"
    onClick={() => calculateCopper(false)}
    disabled={!canCalculate}
>
    Calculate Copper
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
                    displayData.map((row,index)=>(

                        <tr key={row.id || index}>

                            <td>{index+1}</td>

                            <td>{row.category}</td>

                            <td>
                                <b>{row.model}</b>
                            </td>


                            <td>{row.pendingQty}</td>


                            <td>

                                <input
                                    type="number"
                                    value={row.urgentQty ?? ""}
                                    className="copperinput"
                                    onChange={
    e =>
    changeUrgentQty(
        data.findIndex(
            item => item.model === row.model &&
                    item.category === row.category
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
                                    onClick={()=>openDetails(row)}
                                >
                                    Details
                                </button>

                            </td>

                        </tr>

                    ))
                }

                </tbody>


            </table>


            <CopperDetailPopup
                open={popupOpen}
                onClose={closePopup}
                data={selected}
            />


        </div>

    );

}


export default CopperValidation;