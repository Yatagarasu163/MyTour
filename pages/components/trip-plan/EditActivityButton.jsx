'use client';
import { useRouter } from 'next/navigation';

export default function EditActivityButton({ activity_id }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/trip-plan/edit-activity/${activity_id}`);
    };

    return (
        <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleClick}
        >
            Edit
        </button>
    );
}
