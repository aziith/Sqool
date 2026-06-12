import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, Award, FileBadge, Medal, Plus, Search, Filter, 
    Download, ChevronRight, Share2, UploadCloud, UserCircle2, CheckCircle2 
} from 'lucide-react';

export default function AwardsPage() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('hall_of_fame'); // hall_of_fame, leaderboard
    const [showAwardModal, setShowAwardModal] = useState(false);

    const userRole = localStorage.getItem('sqool_user_role') || 'STUDENT';
    const canManage = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);

    // Mock Data
    const stats = {
        totalAwards: 124,
        studentsAwarded: 86,
        thisYear: 32,
        topClass: 'Grade 10-A'
    };

    const awards = [
        { 
            id: 'AWD-001', student: 'Arya Sharma', class: 'Grade-10 A', 
            title: 'Student of the Year', category: 'Academic', date: 'Mar 2026',
            desc: 'Outstanding consistent academic performance.',
            img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
            hasCertificate: true 
        },
        { 
            id: 'AWD-002', student: 'Rohan Gupta', class: 'Grade-9 B', 
            title: 'Gold Medalist - 100m Sprint', category: 'Sports', date: 'Feb 2026',
            desc: 'Inter-School Athletics Championship.',
            img: 'https://images.unsplash.com/photo-1506869640319-fea1a2753fe0?w=400&q=80',
            hasCertificate: true 
        },
        { 
            id: 'AWD-003', student: 'Kavya Singh', class: 'Grade-11 C', 
            title: 'Best Debater', category: 'Cultural', date: 'Jan 2026',
            desc: 'National Level English Debate Winner.',
            img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80',
            hasCertificate: false 
        },
        { 
            id: 'AWD-004', student: 'Ishaan Verma', class: 'Grade-10 A', 
            title: 'Science Wiz', category: 'Academic', date: 'Dec 2025',
            desc: 'Winner of State Science Exhibition.',
            img: 'https://images.unsplash.com/photo-1555952517-2e8af66092b3?w=400&q=80',
            hasCertificate: true 
        }
    ];

    const leaderboard = [
        { rank: 1, name: 'Arya Sharma', points: 450, awards: 5, class: '10-A' },
        { rank: 2, name: 'Ishaan Verma', points: 380, awards: 4, class: '10-A' },
        { rank: 3, name: 'Rohan Gupta', points: 320, awards: 3, class: '9-B' },
        { rank: 4, name: 'Neha Reddy', points: 290, awards: 3, class: '12-Sci' },
        { rank: 5, name: 'Kavya Singh', points: 250, awards: 2, class: '11-C' }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const getBadgeStyle = (category) => {
        switch(category) {
            case 'Academic': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Sports': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'Cultural': return 'bg-purple-50 text-purple-600 border-purple-200';
            default: return 'bg-amber-50 text-amber-600 border-amber-200';
        }
    };

    if (loading) return <AwardsSkeletonLoader />;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#FFFFFF] min-h-screen font-['Inter'] flex flex-col">
            
            {/* Header section */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-[#FDEE8A] shadow-sm shrink-0"
            >
                <div className="flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-gradient-to-tr from-[#fbbf24] to-[#f59e0b] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform duration-500 relative">
                        {/* Trophy Icon Animation */}
                        <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>
                            <Trophy size={28} />
                        </motion.div>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity animate-ping"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Hall of Fame</h1>
                        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">Student Achievements & Prestige</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex gap-2">
                        {['hall_of_fame', 'leaderboard'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all capitalize ${
                                    activeTab === tab 
                                    ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200' 
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {tab.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>
                    {canManage && (
                        <button 
                            onClick={() => setShowAwardModal(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#fbbf24] to-[#d97706] hover:from-[#f59e0b] hover:to-[#b45309] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-200 transition-all hover:scale-[1.02]"
                        >
                            <Plus size={18} /> Add Award
                        </button>
                    )}
                </div>
            </motion.header>

            {/* Quick Stats Grid */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
                <StatCard title="Total Awards" value={stats.totalAwards} icon={<Award size={22} />} color="amber" />
                <StatCard title="Students Honored" value={stats.studentsAwarded} icon={<UserCircle2 size={22} />} color="emerald" />
                <StatCard title="Awards This Year" value={stats.thisYear} icon={<Medal size={22} />} color="blue" />
                <StatCard title="Top Preforming Class" value={stats.topClass} icon={<Trophy size={22} />} color="purple" isText />
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === 'hall_of_fame' && (
                    <motion.div key="fame" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-6 flex-1">
                        
                        {/* Search & Filters */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-amber-100 shadow-sm">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" placeholder="Search by student name or award..." className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-400/20" />
                            </div>
                            <div className="flex gap-2">
                                <select className="bg-white border border-slate-100 text-slate-600 text-sm font-bold py-3 px-4 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400/20">
                                    <option>All Categories</option><option>Academic</option><option>Sports</option><option>Cultural</option>
                                </select>
                                <select className="bg-white border border-slate-100 text-slate-600 text-sm font-bold py-3 px-4 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400/20">
                                    <option>2026</option><option>2025</option><option>2024</option>
                                </select>
                            </div>
                        </div>

                        {/* Award Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {awards.map((awd, idx) => (
                                <motion.div 
                                    key={awd.id} variants={itemVariants}
                                    whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
                                    className="bg-white rounded-[2rem] border border-amber-50 shadow-sm hover:shadow-xl hover:shadow-amber-100 transition-all duration-300 overflow-hidden flex flex-col group relative"
                                >
                                    {/* Gold Gradient Decorative Top */}
                                    <div className="h-1.5 w-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500"></div>
                                    
                                    <div className="p-6 pb-0 mb-4 flex justify-between items-start">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner border-2 border-white ring-2 ring-amber-50 relative group-hover:ring-amber-200 transition-all">
                                            <img src={awd.img} alt={awd.student} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border ${getBadgeStyle(awd.category)} backdrop-blur-sm`}>
                                            {awd.category}
                                        </div>
                                    </div>

                                    <div className="px-6 flex-1">
                                        <h3 className="text-xl font-black text-slate-800 leading-tight mb-1">{awd.title}</h3>
                                        <p className="text-sm font-bold text-slate-500 mb-0.5">{awd.student}</p>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{awd.class} • {awd.date}</p>
                                        <p className="text-xs font-medium text-slate-500 mt-4 line-clamp-2">{awd.desc}</p>
                                    </div>

                                    <div className="mt-6 p-4 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center group-hover:bg-amber-50 transition-colors">
                                        {awd.hasCertificate ? (
                                            <button className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors">
                                                <FileBadge size={14}/> Download Cert
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                <CheckCircle2 size={14}/> Verified
                                            </span>
                                        )}
                                        <button className="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-white inset-ring">
                                            <Share2 size={14}/>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Leaderboard View */}
                {activeTab === 'leaderboard' && (
                    <motion.div key="leaderboard" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="max-w-4xl mx-auto space-y-6 w-full pb-8">
                        <div className="text-center py-6">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Top Scholars</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Overall Points Leaderboard</p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-amber-100 shadow-xl overflow-hidden">
                            <div className="bg-amber-50/50 px-8 py-5 border-b border-amber-100 flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-amber-800">
                                <div className="flex-1">Rank / Student</div>
                                <div className="text-right w-32 hidden sm:block">Class</div>
                                <div className="text-right w-32 hidden sm:block">Awards</div>
                                <div className="text-right w-32">Total Pts</div>
                            </div>
                            
                            <div className="divide-y divide-slate-50">
                                {leaderboard.map((student, i) => (
                                    <motion.div 
                                        key={student.rank} variants={itemVariants}
                                        className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-default"
                                    >
                                        <div className="flex-1 flex items-center gap-4">
                                            <div className="relative">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                                                    student.rank === 1 ? 'bg-gradient-to-tr from-yellow-300 to-amber-500 text-white shadow-lg shadow-amber-200' :
                                                    student.rank === 2 ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-white' :
                                                    student.rank === 3 ? 'bg-gradient-to-tr from-orange-300 to-orange-500 text-white' :
                                                    'bg-slate-100 text-slate-400'
                                                }`}>
                                                    {student.rank}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-base">{student.name}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 sm:hidden">{student.class} • {student.awards} Awards</p>
                                            </div>
                                        </div>
                                        <div className="text-right w-32 font-bold text-slate-500 text-sm hidden sm:block">{student.class}</div>
                                        <div className="text-right w-32 font-black text-slate-600 hidden sm:block">
                                            <span className="bg-slate-100 px-3 py-1 rounded-lg">{student.awards}</span>
                                        </div>
                                        <div className="text-right w-32 text-lg font-black text-amber-600">
                                            {student.points}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Modal (For Admins) */}
            <AnimatePresence>
                {showAwardModal && canManage && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-amber-100 bg-amber-50/30 flex justify-between items-center shrink-0">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Trophy size={20} className="text-amber-500"/> Confer Award</h2>
                                    <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">Assign accomplishment officially</p>
                                </div>
                                <button onClick={() => setShowAwardModal(false)} className="p-2 bg-white hover:bg-slate-100 rounded-full text-slate-500 transition-colors shadow-sm"><X size={20}/></button>
                            </div>
                            
                            <div className="p-8 overflow-y-auto w-full space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Award Title</label>
                                        <input type="text" placeholder="e.g. Science Fair Regional Winner" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign To Student</label>
                                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20">
                                            <option>Select Student (Search...)</option>
                                            <option>Arya Sharma (10-A)</option><option>Rahul Verma (9-B)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20">
                                            <option>Academic</option><option>Sports</option><option>Cultural</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Description</label>
                                        <textarea rows="3" placeholder="Describe the accomplishment..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"></textarea>
                                    </div>
                                    
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Certificate Attachment (Optional)</label>
                                        <label className="border-2 border-dashed border-slate-200 rounded-2xl bg-white p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                            <input type="file" className="hidden" accept=".pdf,image/*" />
                                            <UploadCloud size={24} className="text-amber-500 mb-2" />
                                            <h3 className="text-sm font-bold text-slate-700">Upload PDF or Image</h3>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest max-w-[200px]">Or system will auto-generate one</p>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="pt-4 flex gap-3 border-t border-slate-100">
                                    <button onClick={() => setShowAwardModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black uppercase tracking-wider text-[10px] rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                                    <button onClick={() => setShowAwardModal(false)} className="flex-[2] py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black uppercase tracking-wider text-[10px] rounded-2xl shadow-lg shadow-amber-200 hover:opacity-90 transition-opacity">Submit to Hall of Fame</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper Components
function StatCard({ title, value, icon, color, isText }) {
    return (
        <motion.div 
            whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }} 
            className={`p-6 rounded-[2rem] border bg-white border-slate-100 text-slate-800 shadow-sm transition-all flex flex-col`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center shadow-inner`}>
                    {icon}
                </div>
            </div>
            <div>
                <h2 className={`${isText ? 'text-2xl' : 'text-3xl'} font-black tracking-tighter text-slate-800`}>{value}</h2>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-slate-400`}>{title}</p>
            </div>
        </motion.div>
    );
}

function AwardsSkeletonLoader() {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#FFFFFF]">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 mb-8">
                <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl animate-pulse"></div>
                    <div><div className="w-40 h-6 bg-slate-200 rounded-md animate-pulse mb-2"></div><div className="w-24 h-3 bg-slate-200 rounded-md animate-pulse"></div></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1,2,3,4].map(i => <div key={i} className="bg-white h-32 rounded-[2rem] border border-slate-100 animate-pulse"></div>)}
            </div>
        </div>
    );
}
