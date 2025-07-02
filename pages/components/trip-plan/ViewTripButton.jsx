'use client';
import { useRouter } from 'next/navigation';

export default function ViewTripButton({ plan_id }) {
    const router = useRouter();

    return (
        <button
            className="btn btn-outline-primary"
            onClick={() => router.push(`/trip-plan/view-trip/${plan_id}`)}
        >
            View Trip
        </button>
    );
}
