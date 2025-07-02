import callGemini from "../../../../lib/gemini";

function generatePrompt(days, states, startTime, endTime) {
    return `Generate a ${days}-day travel itinerary for a tourist visiting ${states}, Malaysia.
    Each day should start at around ${startTime} and end by ${endTime}.
    Each day should include 4 to 5 recommended places.

    For each activity, provide:
    - start_time
    - end_time
    - place (name only)
    - description (less than 500 char)
    - tags (array, e.g. ["lunch", "halal", "affordable"])
    - estimated_distance (from previous place in km)
    - estimated_cost (range in RM, set to 0 if free)
    - booking_required (true or false)
    - accessible (true or false)
    - local_tip (less than 200 char)
    - note (less than 200 char)

    Respond in JSON format like:
    [
        {
            "days": 1,
            "states": "Selangor, Kuala Lumpur",
            "activities": [
                {
                    "start_time": "9:00 AM",
                    "end_time": "11:00 AM",
                    "place": "Batu Caves",
                    "description": "Explore the famous limestone caves and temple.",
                    "tags": ["nature", "temple", "free"],
                    "estimated_distance": "8",
                    "estimated_cost": "15-30",
                    "booking_required": false,
                    "accessible": true,
                    "local_tip": "Watch out for monkeys!",
                    "note": ""
                }
            ]
        }
    ]`;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { days, state, startTime, endTime } = body;

        let states = Array.isArray(state) ? state : state ? [state] : [];

        if (!days || states.length === 0) {
            return Response.json({ error: "Both days and states are required." }, { status: 400 });
        }

        const prompt = generatePrompt(days, states, startTime, endTime);
        const itinerary = await callGemini(prompt);

        return Response.json({ itinerary });
    } catch (error) {
        return Response.json({ error: "Error generating trip plan" }, { status: 500 });
    }
}