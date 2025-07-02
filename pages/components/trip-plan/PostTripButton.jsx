'use client';
import { useRouter } from 'next/navigation';

export default function PostTripButton({ plan_id, isPosted }) {
    const router = useRouter();

    return (
        <button
            // Button styling: gray if already posted, green if not
            className={`btn ${isPosted ? 'btn-secondary' : 'btn-success'}`}

            // On click: redirect to the post trip form if not already posted
            onClick={() => {
                if (!isPosted) router.push(`/trip-plan/post-trip/${plan_id}`);
            }}

            // Disable the button if the trip has already been posted
            disabled={isPosted}
        >
            {/* Button label depends on whether trip is already posted */}
            {isPosted ? 'Posted' : 'Post Trip'}
        </button>
    );
}
