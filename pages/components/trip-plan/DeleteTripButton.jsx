'use client';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function DeleteTripButton({ plan_id, onDelete }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/trip-plan/deleteTripPlan?plan_id=${plan_id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete trip plan");
            }

            onDelete(plan_id);
        } catch (err) {
            alert(err.message);
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <>
            <button className="btn btn-outline-danger" onClick={() => setShowConfirm(true)}>
                Delete
            </button>

            <ConfirmModal
                show={showConfirm}
                title="Confirm Delete"
                message="Are you sure you want to delete this trip plan? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
