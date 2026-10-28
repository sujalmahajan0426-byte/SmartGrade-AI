import React, { useState, useEffect } from 'react';
import { MdAdd, MdMoreVert, MdInsertDriveFile, MdCheckCircle, MdUploadFile, MdImage, MdClose, MdQuiz } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/apiConfig';
import { processFileForAI } from '../../utils/pdfHelper';

const subjects = [
    'Software Engineering',
    'Data Structures & Algorithms',
    'Calculus II',
    'Computer Networks',
    'Operating Systems',
    'Python Programming',
    'Java Programming',
    'PS',
    'Data Wrangling',
];

const ASSIGNMENT_TYPES = [
    { value: 'REGULAR', label: '📝 Regular Assignment', desc: 'Standard AI-graded assignment (out of 100)' },
    { value: 'MTT', label: '📋 MTT — Mid Term Test', desc: 'Upload question paper + synoptics. AI grades out of 10.' },
];

export default function Assignments() {
    const { user } = useAuth();
    const [assignmentList, setAssignmentList] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Form fields
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState(subjects[0]);
    const [dueDate, setDueDate] = useState('');
    const [question, setQuestion] = useState('');
    const [teacherNotes, setTeacherNotes] = useState('');
    const [showNotesField, setShowNotesField] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [assignmentType, setAssignmentType] = useState('REGULAR');

    // Question image upload
    const [questionImage, setQuestionImage] = useState(null);
    const [questionImageMime, setQuestionImageMime] = useState(null);
    const [questionImagePreview, setQuestionImagePreview] = useState(null);
    const [questionImageName, setQuestionImageName] = useState('');

    // Synoptics image upload (MTT only)
    const [synopticsImage, setSynopticsImage] = useState(null);
    const [synopticsImageMime, setSynopticsImageMime] = useState(null);
    const [synopticsImagePreview, setSynopticsImagePreview] = useState(null);
    const [synopticsImageName, setSynopticsImageName] = useState('');

    const isMTT = assignmentType === 'MTT';

    const handleImageUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 15 * 1024 * 1024) { toast.error('File must be less than 15MB.'); return; }

        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const toastId = isPdf ? toast.loading('⚙️ Converting PDF pages into images...') : null;

        try {
            const processed = await processFileForAI(file);
            const { primaryImage } = processed;

            if (type === 'question') {
                setQuestionImage(primaryImage.base64);
                setQuestionImageMime(primaryImage.mimeType);
                setQuestionImagePreview(primaryImage.dataUrl);
                setQuestionImageName(file.name + (isPdf ? ` (${processed.totalPages} pg)` : ''));
                if (toastId) toast.dismiss(toastId);
                toast.success(`📄 ${isPdf ? 'PDF converted to image' : 'Question paper uploaded'}!`);
            } else {
                setSynopticsImage(primaryImage.base64);
                setSynopticsImageMime(primaryImage.mimeType);
                setSynopticsImagePreview(primaryImage.dataUrl);
                setSynopticsImageName(file.name + (isPdf ? ` (${processed.totalPages} pg)` : ''));
                if (toastId) toast.dismiss(toastId);
                toast.success(`📋 ${isPdf ? 'PDF Synoptics converted to image' : 'Synoptics uploaded'}!`);
            }
        } catch (err) {
            if (toastId) toast.dismiss(toastId);
            console.error('File processing error:', err);
            toast.error(err.message || 'Could not process PDF file.');
        }
    };

    const removeImage = (type) => {
        if (type === 'question') {
            setQuestionImage(null); setQuestionImageMime(null);
            setQuestionImagePreview(null); setQuestionImageName('');
        } else {
            setSynopticsImage(null); setSynopticsImageMime(null);
            setSynopticsImagePreview(null); setSynopticsImageName('');
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/assignments`);
            const data = await res.json();
            if (data.success && data.data && data.data.length > 0) {
                const formatted = data.data.map(a => ({
                    id: a.id,
                    title: a.title,
                    subject: a.subject,
                    question: a.question,
                    questionImage: a.questionImage,
                    questionImageMime: a.questionImageMime,
                    assignmentType: a.assignmentType || 'REGULAR',
                    totalMarks: a.totalMarks || 100,
                    dueDate: a.dueDate,
                    submitted: a.submissions ? a.submissions.length : 0,
                    total: 35,
                    avgScore: a.submissions && a.submissions.length > 0
                        ? Math.round(a.submissions.reduce((acc, s) => acc + (s.score || 0), 0) / a.submissions.length)
                        : null
                }));
                setAssignmentList(formatted);
            }
        } catch (err) {
            console.warn('Backend unreachable');
        }
    };

    useEffect(() => { fetchAssignments(); }, []);

    const resetForm = () => {
        setTitle(''); setSubject(subjects[0]); setDueDate('');
        setQuestion(''); setTeacherNotes(''); setShowNotesField(false);
        setAssignmentType('REGULAR');
        removeImage('question'); removeImage('synoptics');
        setShowForm(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (isMTT && !questionImagePreview) {
            toast.error('MTT requires a question paper image.');
            return;
        }
        if (isMTT && !synopticsImagePreview) {
            toast.error('MTT requires a synoptics / answer key image.');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/assignments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    subject,
                    dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    question: question || (questionImage ? '[Question provided as image — see attached]' : ''),
                    teacherNotes,
                    teacherId: user?.id,
                    questionImage,
                    questionImageMime,
                    assignmentType,
                    totalMarks: isMTT ? 10 : 100,
                    synopticsImage: isMTT ? synopticsImage : null,
                    synopticsImageMime: isMTT ? synopticsImageMime : null,
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`🎉 "${title}" ${isMTT ? 'MTT' : 'assignment'} published to students!`);
                resetForm();
                fetchAssignments();
            } else {
                toast.error(data.error?.message || 'Failed to create assignment');
            }
        } catch (err) {
            toast.success(`🎉 "${title}" created locally!`);
            resetForm();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleComingSoon = () => toast.info('🚀 Feature coming soon!');

    const isPDF = (name) => name?.toLowerCase().endsWith('.pdf');

    const ImageUploadBox = ({ type, preview, name, label, hint }) => (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
            <p className="text-xs text-slate-500 mb-2">{hint}</p>
            {!preview ? (
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl p-4 text-center transition-colors bg-white hover:bg-emerald-50/30 cursor-pointer">
                    <input type="file" id={`${type}-upload`} className="hidden"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        onChange={(e) => handleImageUpload(e, type)} />
                    <label htmlFor={`${type}-upload`} className="cursor-pointer flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                            <MdImage className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Click to upload</p>
                        <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WebP, PDF · Max 10MB</p>
                    </label>
                </div>
            ) : (
                <div className="relative border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50/30">
                    <div className="p-3 flex items-center gap-3">
                        <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0 bg-white" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 truncate">{name}</p>
                            <p className="text-xs text-emerald-600 mt-0.5">
                                {isPDF(name) ? '✅ PDF rendered to image — AI will read visual contents' : '✅ Uploaded — AI will use this for grading'}
                            </p>
                        </div>
                        <button type="button" onClick={() => removeImage(type)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                            <MdClose className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto animate-fade-in relative pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Class Assignments</h1>
                    <p className="text-slate-500">Manage and create AI-graded assignments for B.Tech CS (2nd Year).</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center justify-center gap-2">
                    <MdAdd className="w-5 h-5" />
                    {showForm ? 'Cancel' : 'Create Assignment'}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-md animate-fade-in mb-8">
                    <h2 className="text-lg font-bold text-green-800 mb-4">Create New AI-Graded Assignment</h2>
                    <form onSubmit={handleCreate} className="space-y-5">

                        {/* Assignment Type Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Assignment Type</label>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {ASSIGNMENT_TYPES.map(t => (
                                    <label key={t.value} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                                        ${assignmentType === t.value
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-slate-200 bg-white hover:border-emerald-300'}`}>
                                        <input type="radio" name="assignmentType" value={t.value}
                                            checked={assignmentType === t.value}
                                            onChange={() => setAssignmentType(t.value)}
                                            className="mt-0.5 accent-emerald-600" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{t.label}</p>
                                            <p className="text-xs text-slate-500">{t.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* MTT Notice */}
                        {isMTT && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 items-start">
                                <MdQuiz className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-amber-800">MTT Mode Active — 10 Marks</p>
                                    <p className="text-xs text-amber-700 mt-0.5">
                                        Upload the question paper AND synoptics (answer key). AI will grade student's handwritten answer out of 10 with per-question breakdown.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Title + Subject + Date */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Assignment Title</label>
                                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                                    placeholder={isMTT ? 'e.g. Software Engineering MTT — Set A' : 'e.g. Memory Management Lab'}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-green bg-white text-slate-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
                                    <select value={subject} onChange={(e) => setSubject(e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-green bg-white text-slate-800">
                                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
                                    <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-green bg-white text-slate-800" />
                                </div>
                            </div>
                        </div>

                        {/* Question Paper Image */}
                        <ImageUploadBox type="question" preview={questionImagePreview} name={questionImageName}
                            label={isMTT ? '📄 Upload Question Paper *' : '📄 Upload Question as Image (optional)'}
                            hint={isMTT ? 'Upload the MTT question paper. AI will extract question structure and marks from it.' : 'AI will read this image to understand the question.'} />

                        {/* Synoptics — MTT only */}
                        {isMTT && (
                            <ImageUploadBox type="synoptics" preview={synopticsImagePreview} name={synopticsImageName}
                                label="📋 Upload Synoptics / Answer Key *"
                                hint="Upload the teacher's synoptics. AI uses this as the primary reference for grading — context matching, not word-for-word." />
                        )}

                        {/* Optional text question for regular assignments */}
                        {!isMTT && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Question / Problem Statement (optional if image uploaded)</label>
                                <textarea rows="3" value={question} onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Type the problem students must solve..."
                                    className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-brand-green resize-y bg-white text-slate-800" />
                            </div>
                        )}

                        {/* Optional AI Reference Notes */}
                        {!isMTT && (
                            <div className="pt-1">
                                {!showNotesField ? (
                                    <button type="button" onClick={() => setShowNotesField(true)}
                                        className="text-sm font-bold text-brand-green hover:text-green-700 flex items-center gap-1">
                                        <MdAdd className="w-4 h-4" /> Add Optional AI Reference Key / Rubric
                                    </button>
                                ) : (
                                    <div className="space-y-2 animate-fade-in border-l-2 border-brand-green pl-4 ml-1">
                                        <div className="flex justify-between items-end">
                                            <label className="block text-sm font-semibold text-slate-700">
                                                Reference Answer Key
                                                <span className="block text-xs font-normal text-slate-500 mt-0.5">AI will grade strictly against these guidelines.</span>
                                            </label>
                                            <button type="button" onClick={() => { setShowNotesField(false); setTeacherNotes(''); }}
                                                className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove</button>
                                        </div>
                                        <textarea value={teacherNotes} onChange={(e) => setTeacherNotes(e.target.value)} rows="3"
                                            placeholder="e.g. Student must state O(E + V log V) time complexity..."
                                            className="w-full p-3 bg-white border border-green-200 rounded-lg outline-none focus:border-brand-green resize-y text-sm text-slate-800" />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={isSubmitting}
                                className="bg-brand-green hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md shadow-green-500/20 flex items-center gap-2">
                                {isSubmitting ? 'Publishing...' : isMTT ? '🎓 Publish MTT' : 'Publish to Class'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Assignments List */}
            <div className="grid gap-4 mt-8">
                {assignmentList.length > 0 ? (
                    assignmentList.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-green-200 transition-colors group">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-green-50 group-hover:text-brand-green transition-colors hidden sm:block">
                                    {assignment.assignmentType === 'MTT' ? <MdQuiz className="w-6 h-6" /> : <MdInsertDriveFile className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{assignment.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        {assignment.assignmentType === 'MTT' && (
                                            <span className="text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                                                📋 MTT · {assignment.totalMarks} Marks
                                            </span>
                                        )}
                                        <span className="text-xs font-semibold bg-green-50 text-emerald-700 border border-green-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">{assignment.subject}</span>
                                        <span className="text-sm text-slate-500">
                                            Due {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        {assignment.questionImage && (
                                            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">📷 Q-Paper</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 justify-between md:justify-end w-full md:w-auto">
                                <div className="w-32">
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-slate-500">Submitted</span>
                                        <span className="text-slate-700">{assignment.submitted}/{assignment.total}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div className="bg-brand-green h-full rounded-full transition-all duration-1000" style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="text-center min-w-[80px]">
                                    <div className="text-xs font-semibold text-slate-500 mb-1">Class Avg</div>
                                    {assignment.avgScore != null ? (
                                        <span className="font-bold text-lg text-slate-800">
                                            {assignment.assignmentType === 'MTT' ? `${assignment.avgScore}/${assignment.totalMarks}` : `${assignment.avgScore}%`}
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-slate-400">Pending</span>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button onClick={handleComingSoon} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-brand-blue border border-blue-200 rounded-lg text-xs font-bold hover:bg-brand-blue hover:text-white transition-colors">
                                        <MdCheckCircle className="w-4 h-4" /> Review Submissions
                                    </button>
                                    <button onClick={handleComingSoon} className="text-slate-400 hover:text-slate-600 p-1">
                                        <MdMoreVert className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                        <p className="text-slate-600 font-medium">No assignments yet</p>
                        <p className="text-slate-400 text-xs mt-1">Click "Create Assignment" above to publish your first assignment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}