import fetch from 'node-fetch'; // Need to install if not present, but Node 18+ has global fetch
// However, since we are in Node environment, ensuring we have access or using library.

export const gradeWithGemini = async ({ subject, question, studentAnswer }) => {
    const API_KEY = process.env.AI_API_KEY || 'AIzaSyB41qQDwYgQKzGPm0hhIQNbj3QnPpJSy9A'; // Fallback to demo key
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `
    You are an expert academic grader for Indian schools.
    Subject: ${subject}
    Question: ${question}
    Student's Answer: ${studentAnswer}

    Instructions:
    1. Grade the answer based on accuracy, completeness, and clarity.
    2. If the answer is completely unreadable or illegible, set "error": "ILLEGIBLE_HANDWRITING".
    3. Return a JSON object EXACTLY in this format:
    {
      "score": number (0-100),
      "grade": string (A+, A, B, C, D, or F),
      "percentage": number,
      "strengths": string[],
      "weaknesses": string[],
      "feedback": string (detailed explanation),
      "tips": string[] (3-4 improvement tips),
      "topics": string[] (related topics to study),
      "encouragement": string (motivational closing),
      "error": null or "ILLEGIBLE_HANDWRITING"
    }
  `;

    const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" }
        })
    });

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);
};
