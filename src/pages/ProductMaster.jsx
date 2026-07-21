    import { useEffect, useMemo, useState } from "react";
    import API from "../services/api";
    import ProductPopup from "./ProductPopup";
    import "./common.css";

    function ProductMaster() {
        const [products, setProducts] = useState([]);
        const [search, setSearch] = useState("");
        const [popupOpen, setPopupOpen] = useState(false);
        const [selectedCategory, setSelectedCategory] = useState("");
        const [selectedModel, setSelectedModel] = useState("");
        const [boqDetails, setBoqDetails] = useState([]);
        const [totalCost, setTotalCost] = useState(0);
        const [selectedPlanQty, setSelectedPlanQty] = useState(0);
        const [selectedCost, setSelectedCost] = useState(0);
        const [plans, setPlans] = useState([]);

        const normalize = (value) => {
            return value
            ?.toString()
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace("choke","chokes");};
            const getPlanQty = (category, model) => {
                let qty = 0;
                plans.forEach(plan => {
                    const planCategory = normalize(
                        plan.category);
            const planModel = normalize(plan.model);
            const productCategory = normalize(category);
            const productModel = normalize(model);
            console.log("COMPARE:",planCategory,productCategory,planModel,productModel);
            if(planCategory === productCategory &&planModel === productModel){
                qty += Number(
                plan.planQty ||
                plan.totalPlan ||
                plan.outwardTotalPlan ||
                plan.inwardTotalPlan ||
                0 );}});
            return qty;};
        const fetchProducts = async () => {
            try {
                const res = await API.get("/products");
                console.log(res.data);
                setProducts(res.data);} 
                catch (err) {
                    console.error(err);alert("Unable to load Products");}};
        const loadPlans = async () => {
            try {
                const res = await API.get("/plans");
                console.log("PLAN DATA:", res.data);
                setPlans(res.data || []);} 
                catch(error){console.error("PLAN LOAD ERROR:", error);}};

        // eslint-disable-next-line react-hooks/set-state-in-effect
        useEffect(() => {fetchProducts();loadPlans();}, []);
        const filteredProducts = useMemo(() => {
            if (!search) return products;
            return products.filter((product) =>
                Object.values(product).some((value) =>
                    String(value).toLowerCase().includes(search.toLowerCase())));
            }, [products, search]);
        const openPopup = async (product) => {
            try {
                const res = await API.get(
                    `/products/${encodeURIComponent(product.category)}/${encodeURIComponent(product.model)}`);
                setSelectedCategory(product.category);
                setSelectedModel(product.model);
                setSelectedPlanQty(getPlanQty(product.category,product.model));
                setSelectedCost(product.cost || 0);
                let total = 0;
                const details = res.data.map((item) => {
                    const cost = Number(item.cost ?? item.qty * item.price);
                    total += cost;
                    return {...item,cost,};});
                setBoqDetails(details);
                setTotalCost(total);
                setPopupOpen(true);
                } 
                catch (err) {
                console.error(err);
                alert("Unable to load BOQ");
                }};        
            const closePopup = () => {
                setPopupOpen(false);
                setBoqDetails([]);
                setSelectedCategory("");
                setSelectedModel("");
                setSelectedPlanQty(0);
                setSelectedCost(0);
                setTotalCost(0);};
            const getDispatchQty = (product) => {
                return Number(product.dispatchQty || 0);};
            const getPendingDispatch = (product) => {
                const planQty = getPlanQty(product.category,product.model);
                const dispatchQty = getDispatchQty(product);
                return planQty - dispatchQty;};
            const getPendingProduction = (product) => {
                const pendingDispatch = getPendingDispatch(product);
                const finishedQty = Number(product.finishedQty || 0);
                return pendingDispatch - finishedQty;};
                
return (
    <div className="stock-page">
        <h2>Product Master</h2>
        <div className="top-bar">
            <input type="text"className="search-input" placeholder="🔍 Search Category / Model..."value={search}
            onChange={(e) => setSearch(e.target.value)}/>
        </div>
            <div className="table-container">
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Category</th>
                            <th>Model</th>
                            <th>Total Cost</th>
                            <th>Plan</th>
                            <th>Dispatch</th>
                            <th>Copper WIP</th>
                            <th>Assembly WIP</th>
                            <th>Finished</th>
                            <th>Pending Dispatch</th>
                            <th>Pending Production</th>
                        </tr>
                    </thead>
                    <tbody>{filteredProducts.map((product, index) => (
                        <tr key={index}onClick={() => openPopup(product)}style={{ cursor: "pointer" }}>
                            <td>{index + 1}</td>
                            <td>{product.category}</td>
                            <td>{product.model}</td>
                            <td>{product.cost?.toFixed(2)}</td>
                            <td>{getPlanQty(product.category,product.model)}</td>
                            <td>{getDispatchQty(product)}</td>
                            <td>{product.copperWip}</td>
                            <td>{product.assemblyWip}</td>
                            <td>{product.finishedQty}</td>
                            <td>{getPendingDispatch(product)}</td>
                            <td>{getPendingProduction(product)}</td>
                        </tr>))}
                    </tbody>
                </table>
            </div>

        <ProductPopup
        open={popupOpen}
        onClose={closePopup}
        category={selectedCategory}
        model={selectedModel}
        details={boqDetails}
        total={totalCost}
        planQty={selectedPlanQty}
        productCost={selectedCost}/>
    </div>);}

    export default ProductMaster;