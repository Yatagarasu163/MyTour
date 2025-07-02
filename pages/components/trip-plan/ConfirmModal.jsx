'use client';

export default function ConfirmModal({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading
}) {
    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onCancel}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body text-start">
                        <p>{message}</p>
                    </div>

                    {/* Modal Footer Buttons */}
                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            {cancelText}
                        </button>

                        <button
                            className="btn btn-warning"
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : confirmText}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
