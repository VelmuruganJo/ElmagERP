import { useState, useEffect } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./common.css";

function BOQMaster() {
    const [records, setRecords] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [model, setModel] = useState("");
    const [stage, setStage] = useState("");
    const [materialCode, setMaterialCode] = useState("");
    const [materialName, setMaterialName] = useState("");
    const [qtyPerUnit, setQtyPerUnit] = useState("");
    const [unit, setUnit] = useState("Kg");
    const [remarks, setRemarks] = useState("");
    const [plant, setPlant] = useState("");
    const [price, setPrice] = useState("");
    const [modelFilter, setModelFilter] = useState("");
    const [file, setFile] = useState(null);
    const calculatedCost = ((parseFloat(qtyPerUnit) || 0) * (parseFloat(price) || 0)).toFixed(2);

    const modelGroups = [...new Set(records.map(r => r.category))].map(category => ({category,models: [...new Set(
        records.filter(r => r.category === category).map(r => r.model))]}));
        
    useEffect(() => {let data = [...records];

        if (search !== "") {data = data.filter(r =>Object.values(r).some(v =>
            String(v).toLowerCase().includes(search.toLowerCase())));}
        if (modelFilter !== "") {data = data.filter(r =>r.model === modelFilter);}
        
    setFiltered(data);}, [search, modelFilter, records]);
    
    const loadBOQ = async () => {
        try{
            const res = await API.get("/boq");
            setRecords(res.data);
            setFiltered(res.data);}
            catch(err){
            console.log(err);
            alert("Failed to Load BOQ");}};
    
    useEffect(()=>{loadBOQ();},[]);

    useEffect(()=>{if(search===""){setFiltered(records);}
    else{
        const data = records.filter(r=>Object.values(r).some(v=>
            String(v).toLowerCase().includes(search.toLowerCase())));
            setFiltered(data);}}
            ,[search,records]);
        const handleSubmit = async(e)=>{e.preventDefault();
        const data = {
            category,
            model,
            stage,
            plant,
            materialCode,
            materialName,
            qtyPerUnit,
            unit,
            price,
            cost: Number(calculatedCost),
            remarks};
        try{
            if(editId){await API.put(`/boq/${editId}`,data);}
            else{await API.post("/boq",data);}
            loadBOQ();
            resetForm();}
            catch(err){console.log(err);
                alert("Save Failed");}};

    const editBOQ=(r)=>{
        setEditId(r.id);
        setShowForm(true);
        setCategory(r.category);
        setModel(r.model);
        setStage(r.stage);
        setMaterialCode(r.materialCode);
        setMaterialName(r.materialName);
        setQtyPerUnit(r.qtyPerUnit);
        setUnit(r.unit);
        setRemarks(r.remarks);
        setPlant(r.plant);
        setPrice(r.price);};

    const deleteBOQ = async(id)=>{
        if(!window.confirm("Delete this BOQ?"))
            return;
        try{await API.delete(`/boq/${id}`);
        loadBOQ();}
        catch(err){alert("Delete Failed");}};

    const resetForm=()=>{
        setEditId(null);
        setCategory("");
        setModel("");
        setStage("");
        setMaterialCode("");
        setMaterialName("");
        setQtyPerUnit("");
        setUnit("Kg");
        setRemarks("");
        setShowForm(false);
        setPlant("");
        setPrice("");};

    const handleCSVUpload = () => {
        if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {

    const workbook = XLSX.read(evt.target.result, { type: "binary" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    const formatted = rows.map((r) => ({
        category: (r["CATEGORY"] || "").trim(),
        model: (r["MODEL"] || "").trim(),
        stage: (r["STAGE"] || "").trim(),
        plant: (r["PLANT"] || "").trim(),
        materialCode: (r["PART CODE"] || "").trim(),
        materialName: (r["PART NAME"] || "").trim(),
        qtyPerUnit: Number(r["QTY / UNIT"] || 0),
        unit: (r["UOM"] || "").trim(),
        price: Number(r["PRICE"] || 0),
        cost:Number(r["QTY / UNIT"] || 0) * Number(r["PRICE"] || 0),
        remarks: (r["REMARKS"] || "").trim()}));

        console.log(formatted);
        await API.post("/boq/upload", formatted);
        loadBOQ();
        console.log("Rows from CSV:", rows);
        console.log("Formatted data:", formatted);};
        reader.readAsBinaryString(file);};

    const exportToExcel = () => {
    const excelData = records.map((r, index) => ({
        "Sl No": index + 1,
        Category: r.category,
        Model: r.model,
        Stage: r.stage,
        Plant: r.plant,
        "Material Code": r.materialCode,
        "Material Name": r.materialName,
        "Qty Per Unit": r.qtyPerUnit,
        Unit: r.unit,
        Price: r.price,
        Cost: r.cost,
        Remarks: r.remarks}));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BOQ");
    const excelBuffer = XLSX.write(workbook, {bookType: "xlsx",type: "array"});
    const file = new Blob([excelBuffer],
        {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        saveAs(file, "BOQ_Master.xlsx");};

return (
<div className="stock-page">
    <h2>BOQ Master</h2>
        <div className="top-bar">
            <button className="stock-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Close Form" : "+ Add BOQ"}</button>
            <input className="search-input" placeholder="Search..." value={search}onChange={(e) => setSearch(e.target.value)}/>\
            <select className="filter-select" value={modelFilter} onChange={(e) => setModelFilter(e.target.value)}>
                <option value="">All Models</option>
                {modelGroups.map(group => (
                    <optgroup key={group.category}label={group.category}>
                {group.models.map(model => (
                    <option key={model} value={model}>{model}</option>))}
                    </optgroup>))}
            </select>
            <div className="csv-top-upload">
                <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])}/>
                <button type="button" className="btn-save" onClick={handleCSVUpload} disabled={!file}>Upload CSV</button>
            </div>
            <button className="btn-export" onClick={exportToExcel}>Export Excel</button>
        </div>

        {showForm && (
            <form className="stock-form" onSubmit={handleSubmit}>
                <select className="form-input" value={category}onChange={(e) => setCategory(e.target.value)}required>
                    <option value="">Select Category</option>
                    <option>Transformer</option>
                    <option>Chokes</option>
                    <option>Emergency Brake Actuator</option>
                </select>
                <input className="form-input" placeholder="Model" value={model}onChange={(e) => setModel(e.target.value)}required/>
                <select className="form-input"value={stage} onChange={(e) => setStage(e.target.value)}required >
                    <option value="">Select Stage</option>
                    <option>COPPER</option>
                    <option>ASSEMBLY</option>
                    <option>PACKING</option>
                </select>
                <select className="form-input"value={plant}onChange={(e)=>setPlant(e.target.value)}required>
                    <option value="">Select Plant</option>
                    <option>Both</option>
                    <option>Nagpur</option>
                    <option>Poonamallee</option>
                </select>
                <input className="form-input" placeholder="Material Code"value={materialCode}
                onChange={(e) => setMaterialCode(e.target.value)}required/>
                <input className="form-input" placeholder="Material Name" value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}required/>
                <input className="form-input" type="number" step="0.001" placeholder="Qty Per Unit" value={qtyPerUnit}
                    onChange={(e) => setQtyPerUnit(e.target.value)} required/>
                <select className="form-input" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option>Kg</option>
                    <option>Nos</option>
                    <option>Meter</option>
                    <option>Feet</option>
                </select>
                <input className="form-input" type="number" step="0.01" placeholder="Price" value={price}
                onChange={(e)=>setPrice(e.target.value)}required/>
                <input className="form-input" value={calculatedCost}readOnly/>
                <input className="form-input" placeholder="Remarks"value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}/>
                <button className="btn-save">{editId ? "Update BOQ" : "Save BOQ"}</button>
                <button type="button" className="btn-cancel"onClick={resetForm} >Cancel</button>
            </form>)}
        
        <div className="table-container">
            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Sl No</th>
                        <th>Category</th>
                        <th>Model</th>
                        <th>Stage</th>
                        <th>Plant</th>
                        <th>Material Code</th>
                        <th>Material Name</th>
                        <th>Qty / Unit</th>
                        <th>Price</th>
                        <th>Cost</th>
                        <th>Unit</th>
                        <th>Remarks</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>{filtered.length > 0 ? (filtered.map((r, i) => (
                    <tr key={r.id} onClick={() => editBOQ(r)}>
                        <td>{i + 1}</td>
                        <td>{r.category}</td>
                        <td>{r.model}</td>
                        <td><span className={r.stage === "COPPER"
                                ? "stage-badge stage-copper"
                                : r.stage === "ASSEMBLY"
                                ? "stage-badge stage-assembly"
                                : "stage-badge stage-packing"}>{r.stage}</span></td>
                        <td>{r.plant}</td>
                        <td>{r.materialCode}</td>
                        <td className="materialn">{r.materialName}</td>
                        <td>{r.qtyPerUnit}</td>
                        <td>₹ {Number(r.price).toFixed(2)}</td>
                        <td>₹ {Number(r.cost).toFixed(2)}</td>
                        <td>{r.unit}</td>
                        <td>{r.remarks}</td>
                        <td><button className="btn-delete" onClick={() => deleteBOQ(r.id)}> Delete </button></td>
                    </tr>))) : (
                        
                    <tr>
                        <td colSpan="14">No BOQ Found</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>);
}
export default BOQMaster;