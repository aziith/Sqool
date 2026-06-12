import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Clock, CreditCard, Trophy, ClipboardList, FileText, Bell } from 'lucide-react';
import { FloatingCardWrapper, MagneticButton } from '../components/Animations';

const studentName = localStorage.getItem('sqool_user_name') || 'Student';
const userId = localStorage.getItem('sqool_user_id');

const summaryCards = [
    { label: 'Attendance', value: '89%', icon: ClipboardList, bg: '#DBEAFE', iconColor: '#1D4ED8', trend: 'Good' },
    { label: 'Exams', value: 'Upcoming', icon: Trophy, bg: '#FDF2F8', iconColor: '#9D174D', trend: 'Jan 28' },
    { label: 'Fees Due', value: '₹0', icon: CreditCard, bg: '#D1FAE5', iconColor: '#065F46', trend: 'Cleared' },
];

const notices = [
    { title: 'Annual Sports Day - Jan 25th', type: 'Event', color: '#FEF3C7', textColor: '#D97706' },
    { title: 'Unit Test 2 Syllabus Released', type: 'Academic', color: '#DBEAFE', textColor: '#1D4ED8' },
];

export default function StudentPanel() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDay, setCurrentDay] = useState('');

    useEffect(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];
        setCurrentDay(today);
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`http://localhost:5002/api/academic/timetable/student/${userId}`);
            setSchedule(res.data);
        } catch (err) {
            console.error('Error fetching timetable:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const todaySchedule = schedule.filter(s => s.day_of_week === currentDay);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">WELCOME BACK, {studentName.toUpperCase()}! 👋</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Class 10-A · Roll No: 24 · Academic Year 2023-24</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"><Bell size={20} /></button>
                    <MagneticButton className="px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 font-black text-xs uppercase tracking-widest transition-all">My Profile</MagneticButton>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Stats & Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {summaryCards.map((card, i) => (
                            <FloatingCardWrapper key={i} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 transition-transform group-hover:scale-150" style={{ background: card.iconColor }}></div>
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="p-3 rounded-2xl" style={{ background: card.bg, color: card.iconColor }}>
                                        <card.icon size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-50 text-slate-400 rounded-lg">{card.trend}</span>
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest relative z-10">{card.label}</p>
                                <h3 className="text-2xl font-black text-slate-800 mt-1 tracking-tighter relative z-10">{card.value}</h3>
                            </FloatingCardWrapper>
                        ))}
                    </div>

                    {/* Dynamic Timetable */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                                    <Clock size={20} />
                                </div>
                                <h2 className="text-lg font-black" style={{ color: '#0F172A' }}>Today's Timetable</h2>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#FEF3C7', color: '#D97706' }}>
                                {currentDay}
                            </span>
                        </div>
                        <div className="divide-y" style={{ '--tw-divide-color': '#FEF9EC' }}>
                            {loading ? (
                                <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Schedule...</div>
                            ) : todaySchedule.length > 0 ? (
                                todaySchedule.map((period) => (
                                    <div key={period.id} className="flex items-center gap-4 px-6 py-4 transition-colors"
                                        onMouseEnter={e => e.currentTarget.style.background = '#FFFFFF'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div className="w-1 h-12 rounded-full shrink-0" style={{ background: '#F59E0B' }}></div>
                                        <div className="flex-1 text-left">
                                            <p className="font-bold" style={{ color: '#0F172A' }}>{period.subjects?.name}</p>
                                            <p className="text-xs" style={{ color: '#94A3B8' }}>{period.users?.name || 'No Teacher'} · Room {period.room_number || 'TBD'}</p>
                                        </div>
                                        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                                            style={{ background: '#FEF3C7', color: '#D97706' }}>
                                            {formatTime(period.start_time)} - {formatTime(period.end_time)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">No classes scheduled for today</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Notices & Tasks */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BookOpen size={120} />
                        </div>
                        <h2 className="text-2xl font-black mb-6 relative z-10 italic tracking-tighter">ANNOUNCEMENTS</h2>
                        <div className="space-y-4 relative z-10">
                            {notices.map((notice, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 transition-all border border-white/5 backdrop-blur-md">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full" style={{ background: notice.textColor }}></span>
                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: notice.textColor }}>{notice.type}</span>
                                    </div>
                                    <p className="text-[13px] font-bold leading-tight">{notice.title}</p>
                                </div>
                            ))}
                        </div>
                        <MagneticButton className="w-full py-4 mt-6 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all border border-white/5">View All Notice</MagneticButton>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-slate-800 tracking-tighter">PENDING TASKS</h2>
                            <span className="w-6 h-6 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center text-[10px] font-black">2</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-indigo-200 transition-all">
                                <div className="w-5 h-5 rounded-md border-2 border-slate-300 mt-0.5 group-hover:border-indigo-500 transition-colors"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Submit Physics Lab Manual</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Due: Tomorrow, 10 AM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-indigo-200 transition-all">
                                <div className="w-5 h-5 rounded-md border-2 border-slate-300 mt-0.5 group-hover:border-indigo-500 transition-colors"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Maths Unit 3 Homework</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Due: Jan 24th</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
