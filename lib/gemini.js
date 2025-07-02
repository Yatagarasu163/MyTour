import axios from "axios";

export default async function callGemini(prompt) {
    try {
        const apiLink = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const testResult = await axios.post(apiLink, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const rawText = testResult.data.candidates.map(item => item.content.parts[0].text);
        const cleanedText = rawText.map(text => text.replace(/```json|```/g, '').trim());

        const parsedData = JSON.parse(cleanedText[0]);

        return parsedData;
        
    } catch (err) {
        console.error("Gemini call error:", err.stack);
        throw new Error("Failed to call Gemini API");
    }
}