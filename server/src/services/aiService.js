import fetch from 'node-fetch';

/**
 * SmartGrade AI Grading Service
 * Primary: Google Gemini 3.5 Flash (supports unlimited images, native multi-page PDFs, 1M context)
 * Fallback: Groq Vision (qwen/qwen3.8-27b)
 */

async function gradeWithGeminiFlash({
    apiKey,
    subject,
    question,
    studentAnswer,
    allImages,
    assignmentType,
    maxScore,
    isMTT
}) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const promptText = `You are SmartGrade AI, an elite educational grading assistant for SVKM's NMIMS Mukesh Patel School of Technology Management & Engineering.

TASK:
Subject: ${subject}
Assignment Type: ${isMTT ? 'MTT (Mid-Term Test) — ' + maxScore + ' Marks Total' : 'Regular Assignment'}
Question / Topic: ${question || 'See attached Question Paper'}
Student Submitted Notes / Text: ${studentAnswer || '[Handwritten sheets attached]'}

${isMTT ? `
MID-TERM TEST (MTT) EVALUATION RULES:
1. Total marks: ${maxScore}
2. The teacher has provided a SYNOPTICS (reference solution/rubric). Use it as your PRIMARY guide.
3. Check for conceptual matching, technical terms, diagrams, and formulas. Do NOT require word-for-word memorization.
4. If an answer sheet covers multiple questions, grade each question/sub-question (e.g. Q1a, Q1b, Q2, etc.) based on the mark distribution in the question paper.
5. Provide a clear question-wise breakdown of marks awarded.
` : `
REGULAR ASSIGNMENT EVALUATION:
- Grade out of ${maxScore} (or percentage out of 100).
- Evaluate depth, technical accuracy, and completeness.
`}

CRITICAL GUARDRAIL:
If the handwriting is completely unreadable (>80% illegible or blurry), set "error": "ILLEGIBLE_HANDWRITING" and "score": null.

RESPOND ONLY WITH STRICT VALID JSON matching this structure:
{
  "score": <integer out of ${maxScore}>,
  "grade": "<A+|A|B+|B|C|D|F>",
  "percentage": <integer 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<area to improve 1>", "<area to improve 2>"],
  "feedback": "<2-3 paragraph thorough evaluation>",
  "detailed_feedback": "<same as feedback>",
  "tips": ["<actionable tip 1>", "<actionable tip 2>", "<actionable tip 3>"],
  "improvement_tips": ["<same as tips>"],
  "topics": ["<study topic 1>", "<study topic 2>"],
  "recommended_topics": ["<same as topics>"],
  "encouragement": "<inspiring closing note>",
  "encouragement_message": "<same as encouragement>",
  "knowledge_gaps": ["<gap 1>", "<gap 2>"],
  "weak_topics": ["<topic 1>", "<topic 2>"],
  "question_breakdown": ${isMTT ? `[{"question": "Q1a", "marks_awarded": 0, "marks_total": 0, "comment": ""}]` : 'null'},
  "learning_path": {
    "step1": "<concept to review>",
    "step2": "<practice problem>",
    "step3": "<mastery milestone>"
  },
  "emotion_tone": "Encouraging",
  "time_to_complete": "< 30 seconds",
  "error": null
}`;

    const parts = [{ text: promptText }];

    // Attach all images (question paper, synoptics, student sheets)
    for (const item of allImages) {
        if (item.label) {
            parts.push({ text: `=== ${item.label} ===` });
        }
        parts.push({
            inlineData: {
                mimeType: item.mimeType || 'image/jpeg',
                data: item.base64
            }
        });
    }

    console.log(`\n🤖 Calling Google Gemini 3.5 Flash...`);
    console.log(`   Images attached: ${allImages.length}`);
    console.log(`   Type: ${assignmentType} | Max marks: ${maxScore}`);

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: 'application/json'
            }
        })
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Gemini returned an empty response.');

    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
}

async function gradeWithGroqFallback({
    apiKey,
    subject,
    question,
    studentAnswer,
    allImages,
    assignmentType,
    maxScore,
    isMTT
}) {
    const URL = 'https://api.groq.com/openai/v1/chat/completions';
    const MODEL = 'qwen/qwen3.8-27b';

    const systemPrompt = `You are SmartGrade AI for SVKM's NMIMS university. Grade student submissions and respond ONLY with valid JSON. No markdown, no backticks.`;

    const gradingInstructions = `Subject: ${subject} | Type: ${isMTT ? 'MTT ' + maxScore + ' marks' : 'Regular'}
Question: ${(question || '').slice(0, 200)}
Student Answer: ${(studentAnswer || '[See attached images]').slice(0, 300)}
${isMTT ? `Grade out of ${maxScore} against the synoptics reference.` : `Grade out of 100.`}
If handwriting is >80% illegible set error: "ILLEGIBLE_HANDWRITING" and score: null.
Respond with JSON: {"score":<int>,"grade":"<A+/A/B+/B/C/D/F>","percentage":<int>,"strengths":["..."],"weaknesses":["..."],"feedback":"...","tips":["..."],"topics":["..."],"encouragement":"...","knowledge_gaps":["..."],"weak_topics":["..."]${isMTT ? ',"question_breakdown":[{"question":"Q1a","marks_awarded":0,"marks_total":0,"comment":""}]' : ''},"learning_path":{"step1":"...","step2":"...","step3":"..."},"error":null}`;

    const userContent = [{ type: 'text', text: gradingInstructions }];

    // Groq hard limit: max 3 images
    allImages.slice(0, 3).forEach((item, idx) => {
        userContent.push({ type: 'text', text: `--- ${item.label || 'Image ' + (idx + 1)} ---` });
        userContent.push({
            type: 'image_url',
            image_url: { url: `data:${item.mimeType || 'image/jpeg'};base64,${item.base64}` }
        });
    });

    console.log(`\n🤖 Calling Groq AI (${MODEL}) [Fallback]...`);

    const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent }
            ],
            temperature: 0.2,
            max_tokens: 3000,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
}

export const gradeWithAI = async ({
    subject,
    question,
    studentAnswer,
    base64Image = null,
    mimeType = null,
    studentImages = null,
    questionImage = null,
    questionImageMime = null,
    synopticsImage = null,
    synopticsImageMime = null,
    assignmentType = 'REGULAR',
    totalMarks = 100,
}) => {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const GROQ_KEY = process.env.GROQ_API_KEY;

    if (!GEMINI_KEY && !GROQ_KEY) {
        throw new Error('Neither GEMINI_API_KEY nor GROQ_API_KEY is configured in server .env.');
    }

    const isMTT = assignmentType === 'MTT';
    const maxScore = isMTT ? (totalMarks || 10) : 100;

    // Compile list of all images with clear labels
    const allImages = [];

    if (questionImage && (questionImageMime?.startsWith('image/') || !questionImageMime)) {
        allImages.push({
            label: 'Teacher Question Paper',
            mimeType: questionImageMime || 'image/jpeg',
            base64: questionImage
        });
    }

    if (synopticsImage && (synopticsImageMime?.startsWith('image/') || !synopticsImageMime)) {
        allImages.push({
            label: 'Teacher Synoptics / Official Rubric & Solutions',
            mimeType: synopticsImageMime || 'image/jpeg',
            base64: synopticsImage
        });
    }

    const studentList = Array.isArray(studentImages) && studentImages.length > 0
        ? studentImages
        : (base64Image ? [{ base64: base64Image, mimeType: mimeType || 'image/jpeg' }] : []);

    studentList.forEach((sImg, i) => {
        allImages.push({
            label: `Student Handwritten Answer (Page ${i + 1})`,
            mimeType: sImg.mimeType || 'image/jpeg',
            base64: sImg.base64
        });
    });

    let result = null;

    // 1. Try Google Gemini Flash first
    if (GEMINI_KEY) {
        try {
            result = await gradeWithGeminiFlash({
                apiKey: GEMINI_KEY,
                subject,
                question,
                studentAnswer,
                allImages,
                assignmentType,
                maxScore,
                isMTT
            });
            console.log('✅ Google Gemini 3.5 Flash grading successful!');
        } catch (geminiErr) {
            console.warn('⚠️ Gemini grading error:', geminiErr.message);
            if (!GROQ_KEY) throw geminiErr;
        }
    }

    // 2. If Gemini failed or was unavailable, fallback to Groq
    if (!result && GROQ_KEY) {
        result = await gradeWithGroqFallback({
            apiKey: GROQ_KEY,
            subject,
            question,
            studentAnswer,
            allImages,
            assignmentType,
            maxScore,
            isMTT
        });
        console.log('✅ Groq fallback grading successful!');
    }

    if (!result) {
        throw new Error('AI evaluation could not be completed.');
    }

    // Normalize field aliases
    result.feedback = result.feedback || result.detailed_feedback || 'Submission successfully graded.';
    result.detailed_feedback = result.detailed_feedback || result.feedback;
    result.tips = result.tips || result.improvement_tips || [];
    result.improvement_tips = result.improvement_tips || result.tips;
    result.topics = result.topics || result.recommended_topics || [];
    result.recommended_topics = result.recommended_topics || result.topics;
    result.encouragement = result.encouragement || result.encouragement_message || 'Keep learning and practicing!';
    result.encouragement_message = result.encouragement_message || result.encouragement;
    result.percentage = typeof result.percentage === 'number'
        ? result.percentage
        : Math.round(((result.score || 0) / maxScore) * 100);
    result.question_breakdown = result.question_breakdown || null;
    result.totalMarks = maxScore;
    result.assignmentType = assignmentType;

    return result;
};

export const gradeWithGemini = gradeWithAI;
