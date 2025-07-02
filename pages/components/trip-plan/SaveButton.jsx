'use client';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function SaveButton({ onClick }) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onClick();
            setShowModal(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-end mt-4">
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
                Save Activity
            </button>

            <ConfirmModal
                show={showModal}
                title="Confirm Save"
                message="Are you sure you want to save changes to this activity? This will overwrite the existing details."
                onConfirm={handleConfirm}
                onCancel={() => setShowModal(false)}
                confirmText="Save"
                cancelText="Cancel"
                loading={loading}
            />
        </div>
    );
}
