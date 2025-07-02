'use client';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function MarkCompletedButton({ plan_id, onCompleted }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const markAsCompleted = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/trip-plan/markTripAsCompleted", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan_id }),
            });

            const data = await res.json();
            if (res.ok) {
                setShowConfirm(false);
                setShowSuccess(true);
                setCompleted(true);
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        // If trip is marked completed, trigger optional callback
        if (completed) {
            onCompleted?.();
        }
    };

    return (
        <>
            <button className="btn btn-warning" onClick={() => setShowConfirm(true)}>
                Mark as Completed
            </button>

            {/* Confirm Modal */}
            <ConfirmModal
                show={showConfirm}
                title="Confirm Completion"
                message="Are you sure you want to mark this trip as completed? This action cannot be undone."
                onConfirm={markAsCompleted}
                onCancel={() => setShowConfirm(false)}
                confirmText="Yes, Mark as Completed"
                cancelText="Cancel"
                loading={loading}
            />

            {/* Success Modal */}
            <ConfirmModal
                show={showSuccess}
                title="Success"
                message="Trip has been marked as completed!"
                onConfirm={handleSuccessClose}
                onCancel={handleSuccessClose}
                confirmText="Close"
                cancelText="Cancel"
            />
        </>
    );
}
