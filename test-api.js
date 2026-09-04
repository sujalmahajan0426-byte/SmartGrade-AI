const apiKey = 'AIzaSyB41qQDwYgQKzGPm0hhIQNbj3QnPpJSy9A';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const prompt = `You are SmartGrade AI, an expert educational assessment system for Indian schools. Grade the following student answer and provide detailed personalized feedback.

Subject: Science
Question: What is a cell?
Student Answer: A cell is the basic building block of all living things.
Student Name: Test User

CRITICAL INSTRUCTION: If evaluating an uploaded handwritten image, check the legibility first. If the handwriting or image is too blurry, messy, or illegible to confidently read more than 80% of the words, YOU MUST STOP GRADING. Do not guess. Instead, return a special JSON response: {"error": "ILLEGIBLE_HANDWRITING", "score": null}.

Otherwise, provide your response in this exact JSON format (and DO NOT wrap in markdown code blocks like \`\`\`json):
{
"score": [number out of 100],
"grade": "[A+/A/B+/B/C/D]",
"percentage": [number],
"strengths": ["[array of 3 specific strengths in the answer]"],
"weaknesses": ["[array of 3 specific areas to improve]"],
"detailed_feedback": "[2-3 paragraph personalized feedback addressing the student by name]",
"improvement_tips": ["[array of 4 specific actionable tips]"],
"recommended_topics": ["[array of 3 topics to study next]"],
"encouragement_message": "[one motivating sentence for the student]",
"time_to_complete": "< 60 seconds"
}`;

async function testApi() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.dir(data, { depth: null });
        let textResponse = data.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        console.log("\nParsed JSON:", JSON.parse(textResponse));
    } catch (error) {
        console.error("Error:", error);
    }
}

testApi();
