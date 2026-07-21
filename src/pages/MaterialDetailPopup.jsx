import "./ProductPopup.css";

function MaterialDetailPopup({ open, onClose, data }) {

    if (!open || !data) return null;

    return (
        <div className="popup-overlay">
    <div className="popup-box">

        <div className="popup-header">
            <h3>{data.category} - {data.model}</h3>

            <button
                className="btn-cancel"
                onClick={onClose}
            >
                Close
            </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
            <b>Pending Production :</b> {data.pendingQty}
            <br />
            <b>Production Qty :</b> {data.calculatedQty}
        </div>

        <table className="stock-table">

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

            <tbody>

                {data.details?.length > 0 ? (

                    data.details.map((row, index) => (

                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.materialName}</td>
                            <td>{row.qtyPerUnit}</td>
                            <td>{data.calculatedQty}</td>
                            <td>{Number(row.requiredQty || 0).toFixed(3)}</td>
                            <td>{row.availableQty}</td>
                            <td>{Number(row.balanceQty || 0).toFixed(3)}</td>
                            <td>{row.status}</td>
                        </tr>

                    ))

                ) : (

                    <tr>
                        <td colSpan="8">
                            No Copper Details Found
                        </td>
                    </tr>

                )}

            </tbody>

        </table>

    </div>
</div>
    );
}

export default MaterialDetailPopup;