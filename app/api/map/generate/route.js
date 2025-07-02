import callGemini from "../../../../lib/gemini";

export async function POST(req) {
  const { places } = await req.json();

  if (!places || !Array.isArray(places)) {
    return Response.json({ error: "Missing or invalid 'places' array" }, { status: 400 });
  }

  const prompt =
    `Given this list of Malaysian tourist places:
    ${places.map((p, i) => `Day ${Math.floor(i/5)+1}: ${p}`).join("\n")}

    Return JSON like:
    [
        {
            "day_number": 1,
            "place": "Kek Lok Si Temple",
            "latitude": 5.4014,
            "longitude": 100.2963
        }
    ]
    `;

  try {
    const result = await callGemini(prompt);
    return Response.json(result);
  } catch (e) {
    console.error("Gemini error:", e);
    return Response.json({ error: "Failed to get coordinates" }, { status: 500 });
  }
}
