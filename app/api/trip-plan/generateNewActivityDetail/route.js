import callGemini from "../../../../lib/gemini";

function generatePrompt(placeUrl, previousPlace, nextPlace, start_time, end_time) {
    return `The tourist just visited: ${previousPlace}.
    If there is no previous place, set estimated_distance to 0km instead.
    Generate detailed travel info for the next place: ${placeUrl} on start time: ${start_time} to end time: ${end_time}.
    ${nextPlace ? `After this, they will visit: ${nextPlace}. Please also generate the estimated distance to it.` : ''}

    Include:
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
        ${nextPlace ? `"next_estimated_distance": "2"` : ""}
    }
    `;
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { placeUrl, previousPlace, nextPlace, start_time, end_time } = body;

        if (!placeUrl) {
            return Response.json({ error: "Missing place URL" }, { status: 400 });
        }

        const prompt = generatePrompt(placeUrl, previousPlace, nextPlace, start_time, end_time);
        const result = await callGemini(prompt);

        return Response.json({ activity: result }, { status: 200 });
    } catch (err) {
        console.error("Gemini error:", err);
        return Response.json({ error: "Failed to generate activity from URL." }, { status: 500 });
    }
}
