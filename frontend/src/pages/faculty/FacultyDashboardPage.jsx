import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, Clock, DollarSign, Calendar, Activity, GraduationCap, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

import FacultyOnboardingModal from '../../components/faculty/FacultyOnboardingModal';

const API_BASE = 'http://localhost:5002/api/faculty';

const dummyData = [
    { name: 'Mon', attendance: 95 },
    { name: 'Tue', attendance: 92 },
    { name: 'Wed', attendance: 98 },
    { name: 'Thu', attendance: 94 },
    { name: 'Fri', attendance: 90 },
];

const FacultyDashboardPage = () => {
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [stats, setStats] = useState({
        totalTeachers: 0,
        classesToday: 0,
        pendingSalaries: 0,
        attendancePercent: 0
    });

    const institutionId = localStorage.getItem('sqool_institution_id') || 1;

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_BASE}/analytics/dashboard?institution_id=${institutionId}`);
            setStats(res.data);
        } catch (err) {
            console.error("Error fetching faculty stats:", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [institutionId]);

    const statCards = [
        { title: 'Total Faculty', value: stats.totalTeachers, icon: Users, color: 'bg-indigo-50 text-indigo-700', link: '/dashboard/faculty/directory' },
        { title: 'Classes Today', value: stats.classesToday, icon: BookOpen, color: 'bg-emerald-50 text-emerald-700', link: '/dashboard/faculty/workload' },
        { title: 'Pending Salaries', value: stats.pendingSalaries, icon: DollarSign, color: 'bg-rose-50 text-rose-700', link: '/dashboard/faculty/payroll' },
        { title: 'Attendance Today', value: `${stats.attendancePercent}%`, icon: Activity, color: 'bg-amber-50 text-amber-700', link: '/dashboard/faculty/attendance' },
    ];

    return (
        <div className="p-6 space-y-8 animate-in fade-in zoom-in-95 duration-300 text-left w-full">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Faculty Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">Monitor teacher performance, workload, and payroll.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors">
                        Generate Report
                    </button>
                    <button 
                        onClick={() => setIsOnboardingOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all flex items-center gap-2"
                    >
                        <Users size={20} /> Onboard Teacher
                    </button>
                </div>
            </div>

            <FacultyOnboardingModal 
                isOpen={isOnboardingOpen} 
                onClose={() => setIsOnboardingOpen(false)} 
                onSuccess={() => {
                    fetchStats();
                }}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${s.color}`}>
                            <s.icon size={28} />
                        </div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{s.title}</p>
                        <div className="flex justify-between items-end mt-2">
                            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{s.value}</h3>
                            <Link to={s.link} className="text-slate-300 hover:text-indigo-600 transition-colors group-hover:translate-x-1 duration-300">
                                <ArrowRight size={24} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Quick Links row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Attendance Trends</h2>
                            <p className="text-sm text-slate-500">Weekly teacher attendance percentage</p>
                        </div>
                        <select className="bg-slate-50 border-none rounded-xl px-4 py-2 font-bold text-slate-700 outline-none">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dummyData}>
                                <defs>
                                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} domain={[60, 100]} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorAtt)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <GraduationCap size={120} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black mb-2 relative z-10">Faculty Portal</h2>
                        <p className="text-slate-400 font-medium mb-8 relative z-10">Manage your entire teaching staff from one unified interface.</p>

                        <div className="space-y-4 relative z-10">
                            <Link to="/dashboard/academic/assignments" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400"><BookOpen size={20} /></div>
                                    <span className="font-bold">Subject Assignments</span>
                                </div>
                                <ArrowRight size={16} className="text-slate-400" />
                            </Link>
                            <Link to="/dashboard/faculty/payroll" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400"><DollarSign size={20} /></div>
                                    <span className="font-bold">Process Salaries</span>
                                </div>
                                <ArrowRight size={16} className="text-slate-400" />
                            </Link>
                            <Link to="/dashboard/academic/timetable" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-500/20 p-2 rounded-xl text-amber-400"><Clock size={20} /></div>
                                    <span className="font-bold">Edit Timetables</span>
                                </div>
                                <ArrowRight size={16} className="text-slate-400" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboardPage;

