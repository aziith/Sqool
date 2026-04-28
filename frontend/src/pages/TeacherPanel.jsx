import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar as CalendarIcon, ClipboardList, Clock, ArrowUpRight, CheckCircle2, AlertCircle, FileText, Download, Filter, MessageSquare, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherPanel() {
    const navigate = useNavigate();
    const teacherName = localStorage.getItem('sqool_user_name') || 'Prof. Chen';
    
    // Abstracted Data for UI
    const metrics = [
        { title: 'TOTAL STUDENTS', value: '240', trend: '+4% from last term', trendUp: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'AVG. ATTENDANCE', value: '94.2%', trend: 'On track with goals', trendUp: true, icon: CalendarIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'PENDING GRADES', value: '15', trend: '3 due by tomorrow', trendUp: false, icon: ClipboardList, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const schedule = [
        { time: '09:30', period: 'CURRENT', title: 'Quantum Mechanics II', location: 'Lecture Hall B-104 • 42 Students', active: true },
        { time: '11:15', period: 'NEXT', title: 'Classical Thermodynamics', location: 'Virtual Classroom • 38 Students', active: false, action: 'Prepare Materials' },
        { time: '14:00', period: 'LATER', title: 'Departmental Meeting', location: 'Main Faculty Office', active: false, menu: true },
    ];

    const submissions = [
        { name: 'Alex Rivera', time: 'Submitted 2h ago', badge: 'URGENT', badgeColor: 'bg-amber-100 text-amber-700', title: 'Relativity Problem Set #4', desc: '"Here is my revised work on the time dilation calculations from Tuesday\'s..."', avatar: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Mia Thompson', time: 'Submitted 5h ago', badge: 'LATE', badgeColor: 'bg-rose-100 text-rose-700', title: 'Thermodynamics Lab Report', desc: 'Final results of the heat transfer experiment with attached data sheets.', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Jordan Wei', time: 'Submitted yesterday', badge: 'EXTRA CREDIT', badgeColor: 'bg-emerald-100 text-emerald-700', title: 'Optional Essay: Dark Matter', desc: 'Exploring the recent findings from the James Webb telescope in relation to dar...', avatar: 'https://i.pravatar.cc/150?img=8' },
    ];

    return (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 font-['Inter']" style={{ minHeight: '100vh' }}>
            
            {/* Top Blue Hero Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-[#1D4ED8] rounded-[2rem] p-10 overflow-hidden text-white shadow-xl shadow-blue-600/20"
            >
                {/* Decorative circles representing the abstract UI element in the image */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[40px] transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute right-32 top-10 w-48 h-48 border-[20px] border-blue-500/10 rounded-full"></div>
                
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-block px-3 py-1 bg-blue-500/40 border border-blue-400/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        Dashboard Overview
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                        Good morning, {teacherName.split(' ')[0]}
                    </h1>
                    <p className="text-blue-100 text-lg font-medium leading-relaxed">
                        Your advanced physics lecture starts in 45 minutes. You have 15 student submissions waiting for your expertise.
                    </p>
                </div>
            </motion.div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((m, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        key={m.title} 
                        className="bg-white rounded-[2rem] p-8 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100"
                    >
                        {/* Decorative top-right graphic */}
                        <div className={`absolute -right-6 -top-6 w-32 h-32 ${m.bg} rounded-full opacity-50`}></div>
                        
                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${m.bg} ${m.color} mb-6`}>
                            <m.icon size={22} />
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1">{m.title}</h3>
                        <div className="text-4xl font-black text-slate-800 mb-4">{m.value}</div>
                        <div className="flex items-center gap-1.5 text-sm font-bold">
                            {m.trendUp ? (
                                <ArrowUpRight size={16} className={m.title === 'TOTAL STUDENTS' ? 'text-emerald-500' : 'text-emerald-500'} />
                            ) : (
                                <Clock size={16} className="text-rose-500" />
                            )}
                            {m.title === 'AVG. ATTENDANCE' && <CheckCircle2 size={16} className="text-emerald-500" />}
                            
                            <span className={
                                m.title === 'TOTAL STUDENTS' ? 'text-emerald-600' : 
                                m.title === 'AVG. ATTENDANCE' ? 'text-emerald-600' : 
                                'text-rose-600'
                            }>{m.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Middle Configuration: Schedule & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Class Schedule Column */}
                <div className="col-span-2 space-y-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Class Schedule</h2>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-800">View Full Calendar</button>
                    </div>

                    <div className="space-y-4">
                        {schedule.map((item, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                key={i} 
                                className={`flex items-center p-5 rounded-[2rem] gap-6 transition-all ${
                                    item.active 
                                    ? 'bg-white border-l-4 border-l-blue-600 shadow-[0_8px_30px_rgba(0,0,0,0.06)]' 
                                    : 'bg-slate-50/80 border border-slate-100 shadow-sm'
                                }`}
                            >
                                <div className="text-center min-w-[70px]">
                                    <h4 className={`text-2xl font-black ${item.active ? 'text-blue-600' : 'text-slate-400'}`}>{item.time}</h4>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.active ? 'text-slate-400' : 'text-slate-300'}`}>{item.period}</p>
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold mb-1 ${item.active ? 'text-slate-900' : 'text-slate-700'}`}>{item.title}</h3>
                                    <p className="text-sm font-semibold text-slate-500">{item.location}</p>
                                </div>
                                
                                <div className="shrink-0 flex items-center justify-end min-w-[120px]">
                                    {item.active && (
                                        <div className="flex -space-x-3 relative right-2">
                                            {['8', '5', '11'].map((img, idx) => (
                                                <img key={idx} src={`https://i.pravatar.cc/100?img=${img}`} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                                            ))}
                                            <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">+39</div>
                                        </div>
                                    )}
                                    {item.action && (
                                        <button className="px-4 py-2 bg-slate-200/50 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-colors">
                                            {item.action}
                                        </button>
                                    )}
                                    {item.menu && (
                                        <button className="p-2 text-slate-400 hover:text-slate-600">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Performance Chart Column */}
                <div className="col-span-1 space-y-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Performance</h2>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-full">Weekly Trend</span>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] h-[280px] relative flex flex-col justify-end">
                        
                        {/* Float Average Stat */}
                        <div className="absolute top-8 right-8 text-right">
                            <span className="text-4xl font-black text-blue-600">88%</span>
                            <br/><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Average</span>
                        </div>

                        {/* Bar Chart Mockup matching UI */}
                        <div className="flex items-end justify-between w-full h-[160px] gap-3 mb-2">
                            {/* Mon */}
                            <div className="w-full bg-[#BAC4FF] rounded-t-xl h-[45%]"></div>
                            {/* Tue */}
                            <div className="w-full bg-[#BAC4FF] rounded-t-xl h-[70%]"></div>
                            {/* Wed (Active/Highest) */}
                            <div className="w-full bg-blue-600 rounded-t-xl h-[95%]"></div>
                            {/* Thu */}
                            <div className="w-full bg-[#BAC4FF] rounded-t-xl h-[55%]"></div>
                            {/* Fri */}
                            <div className="w-full bg-[#BAC4FF] rounded-t-xl h-[80%]"></div>
                        </div>

                        {/* Axis */}
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                        </div>

                        {/* Floating chat head */}
                        <button className="absolute bottom-12 -right-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform">
                            <MessageSquare size={20} className="fill-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Submissions Section */}
            <div className="pt-4 space-y-6">
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Recent Submissions</h2>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-full shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                            Filter by Class
                        </button>
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-full shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                            Download Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {submissions.map((sub, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            key={i} 
                            className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-3">
                                        <img src={sub.avatar} alt={sub.name} className="w-11 h-11 rounded-full object-cover shadow-sm bg-slate-100" />
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-[15px]">{sub.name}</h4>
                                            <p className="text-[11px] font-semibold text-slate-400">{sub.time}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${sub.badgeColor}`}>
                                        {sub.badge}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">{sub.title}</h3>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6 block min-h-[40px] line-clamp-2">
                                    {sub.desc}
                                </p>
                            </div>
                            
                            <button className="w-full py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2">
                                <FileText size={16} /> Grade Now
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}
