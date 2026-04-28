import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../config';
import { Plus, Search, Filter, MoreVertical, Calendar, Type } from 'lucide-react';

const ExamManagement = () => {
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]); // Added subjects state
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExamId, setCurrentExamId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Midterm',
        class_id: '',
        subject_id: '', // Added subject_id
        section_id: '1',
        start_date: '',
        end_date: '',
        description: ''
    });

    const institutionId = localStorage.getItem('sqool_institution_id') || 1;

    useEffect(() => {
        fetchExams();
        fetchClasses();
        fetchSubjects(); // Fetch subjects on mount
    }, [institutionId]);

    const fetchExams = async () => {
        try {
            const res = await axios.get(`${API_BASE}/exams?institution_id=${institutionId}`);
            setExams(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${API_BASE}/academic/classes?institution_id=${institutionId}`);
            setClasses(res.data);
            if (res.data.length > 0 && !formData.class_id) {
                setFormData(prev => ({ ...prev, class_id: res.data[0].id }));
            }
        } catch (err) {
            console.error('Error fetching classes:', err);
        }
    };

    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${API_BASE}/academic/subjects?institution_id=${institutionId}`);
            setSubjects(res.data);
            if (res.data.length > 0 && !formData.subject_id) {
                setFormData(prev => ({ ...prev, subject_id: res.data[0].id, name: res.data[0].name }));
            }
        } catch (err) {
            console.error('Error fetching subjects:', err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${API_BASE}/exams/${currentExamId}`, formData);
            } else {
                await axios.post(`${API_BASE}/exams`, { 
                    ...formData, 
                    institution_id: institutionId 
                });
            }
            setShowModal(false);
            resetForm();
            fetchExams();
        } catch (err) {
            console.error('Error saving exam:', err);
            const errorMsg = err.response?.data?.error || err.message || "An unexpected error occurred while saving the exam.";
            alert(`Error: ${errorMsg}`);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'Midterm',
            class_id: classes.length > 0 ? classes[0].id : '',
            subject_id: '',
            section_id: '1',
            start_date: '',
            end_date: '',
            description: ''
        });
        setIsEditing(false);
        setCurrentExamId(null);
    };

    const handleEdit = (exam) => {
        setFormData({
            name: exam.name,
            type: exam.type,
            class_id: exam.class_id ? exam.class_id.toString() : '',
            subject_id: exam.subject_id ? exam.subject_id.toString() : '',
            section_id: exam.section_id ? exam.section_id.toString() : '1',
            start_date: exam.start_date ? new Date(exam.start_date).toISOString().split('T')[0] : '',
            end_date: exam.end_date ? new Date(exam.end_date).toISOString().split('T')[0] : '',
            description: exam.description || ''
        });
        setIsEditing(true);
        setCurrentExamId(exam.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
            try {
                await axios.delete(`${API_BASE}/exams/${id}`);
                fetchExams();
            } catch (err) {
                console.error('Error deleting exam:', err);
                alert("Error deleting exam");
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-[#1e3a8a] tracking-tight">Exam Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Configure and oversee institutional examination cycles.</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-[#1e3a8a] text-white px-6 py-3 rounded-2xl flex items-center gap-2.5 font-bold shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Schedule New Session
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-50/50 border border-[#FDE68A] overflow-hidden">
                <div className="p-6 border-b border-[#FEF3C7] bg-[#FFFBF0]/50 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#FDE68A] rounded-xl focus:ring-2 focus:ring-[#F59E0B] outline-none text-sm font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 hover:bg-[#FEF3C7] rounded-xl text-slate-500 transition-colors"><Filter size={20} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FEF3C7]/30">
                                <th className="px-8 py-5 text-[0.7rem] font-black text-[#D97706] uppercase tracking-[0.1em]">Session Details</th>
                                <th className="px-8 py-5 text-[0.7rem] font-black text-[#D97706] uppercase tracking-[0.1em]">Classification</th>
                                <th className="px-8 py-5 text-[0.7rem] font-black text-[#D97706] uppercase tracking-[0.1em]">Group</th>
                                <th className="px-8 py-5 text-[0.7rem] font-black text-[#D97706] uppercase tracking-[0.1em]">Timeline</th>
                                <th className="px-8 py-5 text-[0.7rem] font-black text-[#D97706] uppercase tracking-[0.1em] text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FEF3C7]">
                            {exams.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium">
                                        No exam sessions found. Start by scheduling a new one.
                                    </td>
                                </tr>
                            )}
                            {exams.map(exam => (
                                <tr key={exam.id} className="hover:bg-[#FFFBF0]/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-[#1e3a8a] text-lg leading-tight">{exam.subject_name || exam.name}</div>
                                        <div className="text-sm text-slate-400 mt-1 font-medium">{exam.description || 'General Academic Session'}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 text-[0.7rem] font-black rounded-full uppercase tracking-wider ${exam.type === 'Final' ? 'bg-indigo-100 text-[#1e3a8a]' :
                                                exam.type === 'Midterm' ? 'bg-orange-100 text-[#D97706]' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {exam.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 font-bold text-slate-700">
                                            <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                                            {exam.classes?.name || 'Academic Core'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                <Calendar size={14} className="text-[#F59E0B]" />
                                                {new Date(exam.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                {exam.is_rescheduled && (
                                                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] rounded-full uppercase font-black tracking-widest border border-orange-200">
                                                        Rescheduled
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#F59E0B]/30 w-full" />
                                            </div>
                                            <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-tighter">
                                                Ends {new Date(exam.end_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right relative">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(exam)}
                                                className="p-2 hover:bg-[#FEF3C7] rounded-lg text-[#D97706] transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-wider"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(exam.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-wider"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl border border-white relative overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Decorative background */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFFBF0] rounded-full -mr-20 -mt-20 z-0" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-[#1e3a8a] tracking-tight">{isEditing ? 'Edit Exam' : 'Schedule Exam'}</h2>
                                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
                                        {isEditing ? 'Update examination details' : 'Configure Examination details'}
                                    </p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">&times;</button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Subject</label>
                                    <div className="relative">
                                        <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none text-sm font-bold shadow-inner text-slate-700 appearance-none"
                                            value={formData.subject_id.toString()}
                                            onChange={e => {
                                                const sub = subjects.find(s => s.id.toString() === e.target.value);
                                                setFormData({ ...formData, subject_id: e.target.value, name: sub?.name || '' });
                                            }}
                                        >
                                            <option value="">Choose a subject</option>
                                            {subjects.map(sub => (
                                                <option key={sub.id} value={sub.id.toString()}>{sub.name} ({sub.code})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Exam Type</label>
                                        <select
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none text-sm font-bold shadow-inner text-slate-700 appearance-none"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option>Unit Test</option>
                                            <option>Midterm</option>
                                            <option>Final</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Class</label>
                                        <select
                                            required
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none text-sm font-bold shadow-inner text-slate-700 appearance-none"
                                            value={formData.class_id}
                                            onChange={e => setFormData({ ...formData, class_id: e.target.value })}
                                        >
                                            {classes.map(cls => (
                                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-[60%] -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Filter size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            <input
                                                type="date" required
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none text-sm font-bold shadow-inner appearance-none cursor-pointer text-slate-700"
                                                style={{ colorScheme: 'light' }}
                                                value={formData.start_date}
                                                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            <input
                                                type="date" required
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none text-sm font-bold shadow-inner appearance-none cursor-pointer text-slate-700"
                                                style={{ colorScheme: 'light' }}
                                                value={formData.end_date}
                                                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Session Description</label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none text-sm font-bold placeholder:text-slate-300 shadow-inner text-slate-700 min-h-[100px] resize-none"
                                        placeholder="Add important notes or instructions for the exam session..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                    <button type="submit" className="flex-[2] py-4 bg-[#1e3a8a] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">
                                        {isEditing ? 'Update Exam' : 'Initialize Exam'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamManagement;
