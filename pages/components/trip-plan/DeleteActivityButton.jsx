'use client';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function DeleteActivityButton({ activity_id, onDelete }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/trip-plan/deleteActivity?activity_id=${activity_id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete activity");
            }

            if (onDelete) onDelete(activity_id);
        } catch (err) {
            alert(err.message);
        } finally {
            setShowConfirmModal(false);
        }
    };

    return (
        <>
            <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => setShowConfirmModal(true)}
            >
                Delete Activity
            </button>

            <ConfirmModal
                show={showConfirmModal}
                title="Delete Activity"
                message="Are you sure you want to delete this activity?"
                confirmText="Yes, Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setShowConfirmModal(false)}
            />
        </>
    );
}
