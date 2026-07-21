import "./ProductPopup.css";

function ProductPopup({
    open,
    onClose,
    category,
    model,
    details,
    total,
    planQty,
    productCost
}) {

    if (!open) return null;

    return (

        <div className="popup-overlay">

            <div className="popup-box">

                <div className="popup-header">

    <div>
        <h2>{category} - {model}</h2>

        <div className="popup-info">
            <span><b>Plan Qty :</b> {planQty}</span>

            <span style={{marginLeft:"25px"}}>
                <b>Product Cost :</b> ₹ {Number(productCost).toLocaleString("en-IN")}
            </span>
        </div>
    </div>

    <button className="popup-close" onClick={onClose}>
        ✕
    </button>

</div>

                <div className="popup-table-container">

                    <table className="popup-table">

                        <thead>

                            <tr>

                                <th>Sl No</th>

                                <th>Stage</th>

                                <th>Material Code</th>

                                <th>Material Name</th>

                                <th>Qty</th>

                                <th>Price</th>

                                <th>Cost</th>

                            </tr>

                        </thead>

                        <tbody>
    {details.length > 0 ? (
        details.map((item, index) => (
            <tr key={index}>
                <td>{index + 1}</td>

                <td>
                    <span
                        className={
                            item.stage === "COPPER"
                                ? "stage-badge stage-copper"
                                : item.stage === "ASSEMBLY"
                                ? "stage-badge stage-assembly"
                                : "stage-badge stage-packing"
                        }
                    >
                        {item.stage}
                    </span>
                </td>

                <td>{item.materialCode}</td>
                <td>{item.materialName}</td>
                <td>{item.qty}</td>

                <td>
                    ₹ {Number(item.price).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                    })}
                </td>

                <td>
                    ₹ {Number(item.cost).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                    })}
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="7">No BOQ Available</td>
        </tr>
    )}
</tbody>
                        <tfoot>

                            <tr>

                                <td
                                    colSpan="6"
                                    style={{
                                        textAlign: "right",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Total Cost
                                </td>

                                <td
                                    style={{
                                        fontWeight: "bold",
                                        color: "green"
                                    }}
                                >
                                    ₹ {Number(total).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}
                                </td>

                            </tr>

                        </tfoot>

                    </table>

                </div>

                <div className="popup-footer">

                    <button
                        className="btn-cancel"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ProductPopup;