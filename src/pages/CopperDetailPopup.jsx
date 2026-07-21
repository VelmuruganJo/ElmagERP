import "./ProductPopup.css";

function CopperDetailPopup({open,onClose,data}){
    if(!open)
    return null;
return(
    <div className="popup-overlay">
        <div className="popup-box">
            <div className="popup-header">
                <div><h2>{data?.category} - {data?.model}</h2>
                <div className="popup-info">
    <div>
        <b>Pending Production :</b> {data.pendingQty}
    </div>

    <div>
        <b>Production Qty :</b> {data.calculatedQty}
    </div>
</div>
                </div>
                <button className="popup-close"onClick={onClose}>✕</button>
            </div>
            <div className="popup-table-container">
                <table className="popup-table">
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Gauge</th>
                            <th>Qty / Unit</th>
                            <th>Production Qty</th>
                            <th>Required KG</th>
                            <th>Available KG</th>
                            <th>Balance KG</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>{data?.details?.map((item,index)=>(
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{item.materialName}</td>
                            <td>{item.qtyPerUnit}</td>
                            <td>{data.calculatedQty}</td>
                            <td>{item.requiredQty?.toFixed(3)}</td>
                            <td>{item.availableQty}</td>
                            <td><span className={item.balanceQty < 0?"negative":"positive"}>{item.balanceQty}</span></td>
                            <td><span className={item.status==="AVAILABLE"?"available":"shortage"}>{item.status}</span></td>
                        </tr>))}
                    </tbody>
                </table>
            </div>
            <div className="popup-footer">
                <button className="btn-cancel"onClick={onClose}>Close</button>
            </div>
        </div>
    </div>);}

export default CopperDetailPopup;