import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, GraduationCap, DollarSign, TrendingUp, Plus, 
    ArrowUpRight, ArrowDownRight, Bell, Calendar, CreditCard,
    CheckCircle2, ChevronRight, LayoutDashboard, Target
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, useMotionValue, useTransform } from "framer-motion";

// Correct API port
const API_BASE = 'http://localhost:5002/api/dashboard/admin';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        avgAttendance: '0%',
        revenue: 0,
        newAdmissions: 0,
        pendingFees: 0
    });
    const [attendanceData, setAttendanceData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const institutionId = localStorage.getItem('sqool_institution_id') || 1;
    const institutionName = localStorage.getItem('sqool_institution_name') || 'Campus Manager';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, trendRes, activityRes] = await Promise.all([
                    axios.get(`${API_BASE}/stats?institution_id=${institutionId}`),
                    axios.get(`${API_BASE}/attendance-trends?institution_id=${institutionId}`),
                    axios.get(`${API_BASE}/recent-activity?institution_id=${institutionId}`)
                ]);

                setStats(prev => ({ ...prev, ...statsRes.data }));
                setAttendanceData(trendRes.data);
                setRecentActivity(activityRes.data);
            } catch (err) {
                console.error("Dashboard fetching error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [institutionId]);

    return (
        <div className="p-8 space-y-10 bg-slate-50/30 min-h-screen text-left animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{institutionName}</h1>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Institutional Oversight Dashboard</p>
                    </div>
                </div>
                <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all relative">
                    <Bell size={20}/>
                    <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
            </header>

            {/* Top 4 Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={stats.totalStudents} icon={<GraduationCap size={18}/>} color="indigo" />
                <StatCard title="Active Teachers" value={stats.totalTeachers} icon={<Users size={18}/>} color="emerald" />
                <StatCard title="Today Attendance" value={stats.avgAttendance} icon={<CheckCircle2 size={18}/>} color="amber" />
                <StatCard title="Monthly Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<DollarSign size={18}/>} color="violet" />
            </div>

            {/* Attendance Chart - Full Width */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-indigo-900">
                    <TrendingUp size={200} />
                </div>
                <div className="flex justify-between items-center mb-10 relative z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Attendance Analysis</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Student presence trends for current week</p>
                    </div>
                    <div className="flex bg-slate-50 p-1.5 rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400">
                        <span className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg shadow-sm border border-slate-100">Student Wave</span>
                    </div>
                </div>
                
                <div className="h-72 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={attendanceData}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.05} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                                dy={15} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                                domain={[60, 100]} 
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }}
                                cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '5 5' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="studentAttendance" 
                                stroke="#4f46e5" 
                                strokeWidth={4} 
                                fillOpacity={1} 
                                fill="url(#chartGradient)" 
                                animationDuration={2000}
                                dot={{ r: 4, strokeWidth: 3, fill: '#fff', stroke: '#4f46e5' }}
                                activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section - 3 Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Today Summary */}
                <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black italic tracking-tighter mb-1 uppercase">Instant Intel</h3>
                        <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-8">Metrics recorded in last 24h</p>

                        <div className="space-y-6">
                            <SummaryItem label="Current Attendance" value={stats.avgAttendance} icon={<Target size={14}/>} />
                            <SummaryItem label="New Admissions" value={`+${stats.newAdmissions}`} icon={<Plus size={14}/>} />
                            <SummaryItem label="Outstanding Fees" value={`₹${stats.pendingFees.toLocaleString()}`} icon={<CreditCard size={14}/>} />
                        </div>
                    </div>
                </div>

                {/* 2. Quick Actions */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Fast Directives</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <ActionButton label="Add Student" icon={<GraduationCap size={18}/>} color="blue" />
                        <ActionButton label="Broadcast" icon={<Megaphone size={18} className="-rotate-12"/>} color="amber" />
                        <ActionButton label="Roll Call" icon={<Calendar size={18}/>} color="emerald" />
                        <ActionButton label="Collection" icon={<CreditCard size={18}/>} color="rose" />
                    </div>
                </div>

                {/* 3. Recent Activity */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-800 mb-1 uppercase tracking-tight">Live Stream</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">View All</button>
                    </div>
                    <div className="flex-1 space-y-6">
                        {recentActivity.length > 0 ? (
                            recentActivity.slice(0, 3).map((log, i) => (
                                <ActivityItem key={i} log={log} />
                            ))
                        ) : (
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center py-4 border-2 border-dashed border-slate-50 rounded-2xl">No Recent Data Streamed</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Sub-components
function FloatingCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-200, 200], [8, -8]);
  const rotateY = useTransform(x, [-200, 200], [-8, 8]);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ y: { duration: 4 + Math.random(), repeat: Infinity, ease: "easeInOut" } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
    <FloatingCard className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex items-center justify-between">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h2>
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-${color}-600 group-hover:text-white transition-all duration-500`}>
            {icon}
        </div>
    </FloatingCard>
);

const SummaryItem = ({ label, value, icon }) => (
    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-indigo-100 shadow-inner">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">{label}</span>
        </div>
        <span className="text-lg font-black">{value}</span>
    </div>
);

function ActionButton({ label, icon, color }) {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    return (
        <motion.button 
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPos({ x: (e.clientX - rect.left - rect.width / 2) * 0.2, y: (e.clientY - rect.top - rect.height / 2) * 0.2 });
            }}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            animate={{ x: pos.x, y: pos.y, scale: (pos.x !== 0 || pos.y !== 0) ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            className={`flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-3xl hover:bg-${color}-600 hover:text-white transition-all duration-300 group shadow-sm`}
        >
            <div className={`p-3 bg-white shadow-sm rounded-2xl group-hover:bg-white content-center text-slate-600 transition-transform`}>
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </motion.button>
    );
}

const ActivityItem = ({ log }) => (
    <div className="flex gap-4 group cursor-default">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
        <div>
            <p className="text-xs font-black text-slate-800 leading-tight">{log.action}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter truncate w-[180px]">{log.details}</p>
        </div>
    </div>
);

const Megaphone = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8 a3 3 0 1 1-5.8-1.6"/>
    </svg>
);
