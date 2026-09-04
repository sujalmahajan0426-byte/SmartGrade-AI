export const parentStats = {
    avgScore: 76,
    weeklySubmissions: 3,
    improvement: 8,
    attendance: 92
};

export const childInfo = {
    name: 'Arjun Patel',
    class: 'B.Tech CS (2nd Year)',
    school: 'National Institute of Technology',
    rollNo: '2023CS045'
};

export const subjectPerformance = [
    { subject: 'Python Programming', score: 84, status: 'excellent' },
    { subject: 'Software Engineering', score: 79, status: 'good' },
    { subject: 'Java Programming', score: 71, status: 'average' },
    { subject: 'Computer Networks', score: 68, status: 'average' },
    { subject: 'Calculus II', score: 55, status: 'poor' }
];

export const progressTrend = [
    { date: 'Week 1', score: 68 },
    { date: 'Week 2', score: 70 },
    { date: 'Week 3', score: 75 },
    { date: 'Week 4', score: 76 }
];

export const notifications = [
    { id: 1, type: 'critical', text: '📉 Arjun scored below 50% in Calculus II Mid-Term', time: '3 days ago', read: false },
    { id: 2, type: 'success', text: '✅ Arjun\'s Python score improved by 15%!', time: '1 week ago', read: true },
    { id: 3, type: 'info', text: '📝 New project submitted: REST API Implementation', time: 'Yesterday', read: false },
    { id: 4, type: 'warning', text: '🚨 Professor flagged Arjun for low attendance in Calculus II', time: '2 days ago', read: true },
    { id: 5, type: 'info', text: '🏫 College tech fest dates announced for next month', time: 'Today', read: true }
];

export const recentFeedback = [
    { id: 'f1', subject: 'Calculus II', score: 48, date: '2025-03-20', title: 'Mid-Term Exam', summary: 'Arjun struggled with multiple integrals. Needs to practice partial differentiation.' },
    { id: 'f2', subject: 'Python Programming', score: 92, date: '2025-03-18', title: 'Data Analysis Lab', summary: 'Excellent understanding of Pandas and NumPy. Great analytical skills.' },
    { id: 'f3', subject: 'Software Engineering', score: 85, date: '2025-03-15', title: 'Agile Essay', summary: 'Good grasp of agile methodologies. Essay was well-structured.' }
];

// Lecture-wise attendance summary for subjects
export const attendanceSummary = [
    { subject: 'Python Programming', total: 40, present: 36 },
    { subject: 'Java Programming', total: 35, present: 28 },
    { subject: 'Calculus II', total: 45, present: 32 }, // Below 80%
    { subject: 'Software Engineering', total: 30, present: 28 },
    { subject: 'Computer Networks', total: 38, present: 33 },
];

const recentSubjects = ['Python Programming', 'Java Programming', 'Calculus II', 'Software Engineering', 'Computer Networks'];
export const attendanceTracker = Array.from({ length: 20 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(i / 3)); // roughly 3 lectures a day
    return {
        id: `lec-${i}`,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        subject: recentSubjects[i % 5],
        type: i % 4 === 0 ? 'Lab' : 'Lecture',
        status: Math.random() > 0.15 ? 'present' : 'absent'
    };
});

export const chatMessages = [
    { id: 1, sender: 'teacher', text: 'Hello Mr. Patel! Just checking in regarding Arjun\'s recent Calculus exam.', time: '10:30 AM' },
    { id: 2, sender: 'parent', text: 'Hi Prof. Sharma. Yes, I saw the notification. He seems to be struggling with integration.', time: '11:15 AM' },
    { id: 3, sender: 'teacher', text: 'Yes, exactly. I\'ve suggested some extra practice problems via the portal. Could you encourage him to attend the TA sessions?', time: '11:20 AM' }
];
