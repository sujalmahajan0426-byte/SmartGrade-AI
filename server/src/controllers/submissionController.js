import { createSubmission, updateSubmission } from '../services/submissionService.js';
import { getAssignmentById } from '../services/assignmentService.js';
import { sendResponse, sendError } from '../utils/responseHelper.js';
// We will implement the AI helper next
import { gradeWithGemini } from '../services/aiService.js';

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, studentId, studentAnswer } = req.body;

        // 1. Fetch assignment details for context
        const assignment = await getAssignmentById(assignmentId);
        if (!assignment) {
            return sendError(res, 404, 'Assignment not found', 'ASSIGNMENT_NOT_FOUND');
        }

        // 2. Create pending submission
        let submission = await createSubmission({
            assignmentId,
            studentId,
            studentAnswer,
            status: 'PENDING',
        });

        // 3. Call AI Grading Service
        try {
            const gradingResult = await gradeWithGemini({
                subject: assignment.subject,
                question: assignment.question,
                studentAnswer: studentAnswer,
            });

            // 4. Update submission with results
            submission = await updateSubmission(submission.id, {
                score: gradingResult.score,
                grade: gradingResult.grade,
                percentage: gradingResult.percentage,
                strengths: gradingResult.strengths,
                weaknesses: gradingResult.weaknesses,
                feedback: gradingResult.feedback,
                tips: gradingResult.tips,
                topics: gradingResult.topics,
                encouragement: gradingResult.encouragement,
                status: gradingResult.error === 'ILLEGIBLE_HANDWRITING' ? 'NEEDS_MANUAL_REVIEW' : 'GRADED',
                error: gradingResult.error,
            });

            return sendResponse(res, 201, submission);
        } catch (aiError) {
            console.error('AI Grading failed:', aiError);
            // Even if AI fails, we keep the submission as PENDING or mark as error
            return sendResponse(res, 201, submission, { message: 'Submission saved but AI grading failed. Teacher will review manually.', code: 'AI_GRADING_FAILED' });
        }
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};
