import DayCard from "./DayCard";

export default function GeneratedItinerary({ itinerary }) {
    return (
        <>
            <div className="d-flex flex-column gap-4">
                {itinerary?.map((day, index) => (
                    <DayCard key={index} day={day} />
                ))}
            </div>
        </>
    );
}
