// API Keys (Demo ONLY - Do not use in production)
const STUDENT_API_KEY = 'AIzaSyBKIPRAoqcm6MtZ5IV9RgdhM2wyvGqCzuo';
const TEACHER_API_KEY = 'AIzaSyA_FloGytifQSwruHF7A7Twiwr6fc7xkyc';

export async function sendChatMessage(role, history, textMessage) {
    const apiKey = role === 'student' ? STUDENT_API_KEY : TEACHER_API_KEY;

    // If the teacher key isn't provided yet, return a mock response
    if (role === 'teacher' && !TEACHER_API_KEY) {
        return "I am the Teacher Assistant Bot! I'm waiting for my API key to be activated. Please provide it!";
    }

    if (role === 'parent') {
        return "Chat support is currently only available for Students and Teachers.";
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Define persona system instructions based on role
    const systemInstruction = role === 'student'
        ? "You are the SmartGrade AI Student Tutor. You are friendly, encouraging, and explain academic concepts simply using Indian examples. Never give the direct answer; always guide the student to learn it themselves. Keep answers under 3 paragraphs."
        : "You are the SmartGrade AI Teacher Coach. You assist teachers with lesson planning, grading rubrics, and handling at-risk students. Maintain a highly professional, efficient, and pedagogical tone. Keep answers under 3 paragraphs.";

    // Format history for Gemini model
    const formattedHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    // Add the new message
    formattedHistory.push({
        role: 'user',
        parts: [{ text: textMessage }]
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: formattedHistory
            })
        });

        if (!response.ok) {
            console.error("Chat API failed", response.status);
            return "Sorry, I'm having trouble connecting right now. Please try again later.";
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Oops! My brain got disconnected. Check your internet connection!";
    }
}
