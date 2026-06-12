import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, BookmarkCheck, Clock, Users, Search, Plus, MoreVertical, Library, BookOpen } from 'lucide-react';

export default function LibraryDashboard() {
    const [loading, setLoading] = useState(true);

    // Mock data for initial states
    const stats = {
        totalBooks: 4520,
        issued: 842,
        overdue: 45,
        activeStudents: 1205
    };

    const recentlyIssued = [
        { id: 1, book: "The Pragmatic Programmer", student: "Aryan Sharma", date: "Today, 10:00 AM", status: "Active" },
        { id: 2, book: "Introduction to Algorithms", student: "Neha Gupta", date: "Today, 09:15 AM", status: "Active" },
        { id: 3, book: "Physics Concept Vol 1", student: "Rahul Verma", date: "Yesterday", status: "Active" }
    ];

    const overdueList = [
        { id: 101, book: "Organic Chemistry", student: "Vikas Kumar", due: "2 days ago", fine: "₹40" },
        { id: 102, book: "Design Patterns", student: "Sneha Patel", due: "4 days ago", fine: "₹80" }
    ];

    useEffect(() => {
        // Simulate network fetch
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return <LibrarySkeletonLoader />;
    }

    return (
        <motion.div 
            className="p-8 max-w-7xl mx-auto space-y-8 bg-[#FFFFFF] min-h-screen font-['Inter']"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header section */}
            <motion.header variants={itemVariants} className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                        <Library size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Library Management</h1>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Central Resource Hub</p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search books, authors..." 
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
                        <Plus size={18} />
                        <span className="text-sm">Add Book</span>
                    </button>
                </div>
            </motion.header>

            {/* Quick Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Books" value={stats.totalBooks} icon={<Book size={20} />} color="blue" />
                <StatCard title="Issued Books" value={stats.issued} icon={<BookmarkCheck size={20} />} color="emerald" />
                <StatCard title="Overdue" value={stats.overdue} icon={<Clock size={20} />} color="rose" />
                <StatCard title="Active Students" value={stats.activeStudents} icon={<Users size={20} />} color="indigo" />
            </motion.div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Left Column (Lists) */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
                    
                    {/* Recently Issued Books */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Recently Issued</h2>
                            <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {recentlyIssued.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                            <BookOpen size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-800">{item.book}</h3>
                                            <p className="text-xs font-semibold text-slate-500 mt-0.5">Issued to: <span className="text-slate-700">{item.student}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-1">{item.status}</span>
                                        <span className="text-[10px] font-semibold text-slate-400">{item.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Book Management Actions (Empty State Style) */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                        <div className="relative z-10 w-2/3">
                            <h2 className="text-2xl font-black mb-2 tracking-tight">Expand the Library</h2>
                            <p className="text-blue-100 text-sm font-medium mb-6 leading-relaxed">Add new books to the catalog via barcode scanner or fast-entry forms. Update ISBN numbers instantly.</p>
                            <div className="flex gap-3">
                                <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-slate-50 transition-colors">Scan Barcode</button>
                                <button className="bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-inner hover:bg-blue-800 border border-blue-500 transition-colors">Manual Entry</button>
                            </div>
                        </div>
                        <div className="relative z-10 hidden md:block">
                            <Library size={80} className="text-white/20" />
                        </div>
                    </div>
                </motion.div>

                {/* Right Column (Sidebar Lists) */}
                <motion.div variants={itemVariants} className="space-y-8">
                    
                    {/* Overdue List */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-rose-900 pointer-events-none">
                            <Clock size={120} />
                        </div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className="text-lg font-black text-rose-600 uppercase tracking-tight">Overdue Books <span className="ml-1 bg-rose-100 text-rose-700 font-black text-xs px-2 py-0.5 rounded-md">{stats.overdue}</span></h2>
                        </div>
                        <div className="space-y-4 relative z-10">
                            {overdueList.map(item => (
                                <div key={item.id} className="p-4 border border-rose-100 bg-rose-50/30 rounded-2xl">
                                    <h3 className="text-sm font-bold text-slate-800 truncate mb-1">{item.book}</h3>
                                    <div className="flex justify-between items-end mt-2">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500">{item.student}</p>
                                            <p className="text-[10px] font-bold text-rose-500 mt-0.5">Due: {item.due}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-slate-800">{item.fine}</span>
                                            <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Fine</p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors">Notify Student</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Readers */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Top Readers</h2>
                            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                        </div>
                        <div className="space-y-4">
                            {['Arjun Singh', 'Rhea Mehta', 'Kavya Rao'].map((name, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                        #{i+1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-700">{name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400">{12 - i} books this month</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <motion.div 
            whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }} 
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all flex items-center justify-between"
        >
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center shadow-inner`}>
                {icon}
            </div>
        </motion.div>
    );
}

function LibrarySkeletonLoader() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#FFFFFF] min-h-screen">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl animate-pulse"></div>
                    <div>
                        <div className="w-48 h-6 bg-slate-200 rounded-md animate-pulse mb-2"></div>
                        <div className="w-32 h-3 bg-slate-200 rounded-md animate-pulse"></div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="w-64 h-10 bg-slate-100 rounded-xl animate-pulse"></div>
                    <div className="w-32 h-10 bg-blue-100 rounded-xl animate-pulse"></div>
                </div>
            </div>

            {/* Progress Bar Animation */}
            <div className="w-full max-w-md mx-auto mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>Loading Library Modules...</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-2/3 animate-[pulse_1s_ease-in-out_infinite]"></div>
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="w-20 h-3 bg-slate-200 rounded-md mb-3 animate-pulse"></div>
                            <div className="w-16 h-8 bg-slate-200 rounded-md animate-pulse"></div>
                        </div>
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 min-h-[300px]">
                        <div className="w-48 h-6 bg-slate-200 rounded-md mb-6 animate-pulse"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-full h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 min-h-[400px]">
                        <div className="w-32 h-6 bg-slate-200 rounded-md mb-6 animate-pulse"></div>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="w-full h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
