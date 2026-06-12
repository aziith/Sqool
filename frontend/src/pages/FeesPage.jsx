import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CreditCard, DollarSign, Wallet, AlertOctagon,
    Plus, Search, Filter, FileText, CheckCircle2,
    Clock, Smartphone, ArrowUpRight, TrendingUp,
    DownloadCloud, Receipt
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FeesPage() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, defaulters, my_fees
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    // Auth & RBAC
    const userRole = localStorage.getItem('sqool_user_role') || 'STUDENT';
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);
    const isTeacher = ['TEACHER'].includes(userRole);
    const isStudent = ['STUDENT'].includes(userRole);
    const canManage = isAdmin;

    // Mock Stats
    const stats = {
        totalCollection: '₹14,50,000',
        pendingFees: '₹2,34,500',
        thisMonth: '₹4,12,000',
        overdueCount: 45
    };

    // Chart Data Mock
    const chartData = [
        { name: 'Apr', collection: 400000 },
        { name: 'May', collection: 300000 },
        { name: 'Jun', collection: 550000 },
        { name: 'Jul', collection: 200000 },
    ];

    // Mock Fee Table
    const studentFees = [
        { id: 'ADM-001', name: 'Ayush Sharma', class: 'Grade-10 A', total: 45000, paid: 45000, due: 0, status: 'Paid', dueDate: '15 Jul 2026' },
        { id: 'ADM-002', name: 'Rohan Gupta', class: 'Grade-9 B', total: 40000, paid: 20000, due: 20000, status: 'Partial', dueDate: '10 Aug 2026' },
        { id: 'ADM-003', name: 'Kiran Patel', class: 'Grade-11 C', total: 55000, paid: 0, due: 55000, status: 'Pending', dueDate: '05 Jul 2026' }, // Overdue
        { id: 'ADM-004', name: 'Sanya Mirza', class: 'Grade-8 A', total: 35000, paid: 35000, due: 0, status: 'Paid', dueDate: '15 Jul 2026' },
    ];

    useEffect(() => {
        // default tab for student
        if (isStudent) setActiveTab('my_fees');
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [isStudent]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return <FeesSkeletonLoader />;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#FFFFFF] min-h-screen font-['Inter']">
            {/* Header section */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-[#FDEE8A] shadow-sm"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                        <CreditCard size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Finance / Fees</h1>
                        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">
                            {isStudent ? 'My Payment Portal' : 'Revenue & Accounts Collection'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isStudent && (
                        <>
                            <TabBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Dashboard" />
                            <TabBtn active={activeTab === 'defaulters'} onClick={() => setActiveTab('defaulters')} label="Defaulters" />
                        </>
                    )}
                    {canManage && (
                        <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>
                    )}
                    {canManage ? (
                        <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                        >
                            <Plus size={18} /> Collect Fee
                        </button>
                    ) : isStudent ? (
                        <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-wider text-[11px] shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                        >
                            <Smartphone size={16} /> Pay Online Now
                        </button>
                    ) : null}
                </div>
            </motion.header>

            <AnimatePresence mode="wait">
                {/* ADMIN/TEACHER MAIN DASHBOARD */}
                {activeTab === 'dashboard' && !isStudent && (
                    <motion.div key="dashboard" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-8">
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Collection" value={stats.totalCollection} icon={<DollarSign size={20} />} color="emerald" isActive={true} />
                            <StatCard title="Pending Fees" value={stats.pendingFees} icon={<Wallet size={20} />} color="amber" />
                            <StatCard title="This Month" value={stats.thisMonth} icon={<TrendingUp size={20} />} color="sky" />
                            <StatCard title="Overdue Students" value={stats.overdueCount} icon={<AlertOctagon size={20} />} color="rose" />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Trend Graph */}
                            <motion.div variants={itemVariants} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 xl:col-span-1">
                                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><TrendingUp size={18}/> Revenue Chart</h3>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}/>
                                            <Area type="monotone" dataKey="collection" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorColl)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            {/* Main List */}
                            <motion.div variants={itemVariants} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden xl:col-span-2 flex flex-col">
                                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
                                    <h3 className="text-lg font-black text-slate-800">Fee Registry</h3>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input type="text" placeholder="Search student..." className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold w-full md:w-64 outline-none focus:border-sky-300" />
                                        </div>
                                        <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-100"><Filter size={18}/></button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <th className="p-4 pl-6">Student</th>
                                                <th className="p-4">Total Fee</th>
                                                <th className="p-4">Paid</th>
                                                <th className="p-4">Due</th>
                                                <th className="p-4">Progress</th>
                                                <th className="p-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentFees.map(fee => (
                                                <tr key={fee.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                    <td className="p-4 pl-6">
                                                        <div className="font-bold text-slate-800 text-sm">{fee.name}</div>
                                                        <div className="text-[10px] uppercase font-black text-slate-400 mt-1 tracking-wider">{fee.class} | {fee.id}</div>
                                                    </td>
                                                    <td className="p-4 text-sm font-black text-slate-600">₹{fee.total}</td>
                                                    <td className="p-4 text-sm font-black text-emerald-600">₹{fee.paid}</td>
                                                    <td className="p-4 text-sm font-black text-rose-500">₹{fee.due}</td>
                                                    <td className="p-4 w-32">
                                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${fee.status === 'Paid' ? 'bg-emerald-500' : fee.status === 'Partial' ? 'bg-amber-400' : 'bg-transparent'}`} style={{ width: `${(fee.paid/fee.total)*100}%` }}></div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4"><StatusBadge status={fee.status} isOverdue={new Date(fee.dueDate) < new Date() && fee.status !== 'Paid'} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* DEFAULTERS TAB */}
                {activeTab === 'defaulters' && !isStudent && (
                    <motion.div key="defaulters" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="max-w-4xl mx-auto space-y-6 flex-1 w-full pb-8">
                        <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-8 text-center relative overflow-hidden">
                            <AlertOctagon size={80} className="absolute -top-4 -right-4 text-rose-200/50 rotate-12" />
                            <h2 className="text-2xl font-black text-rose-800 relative z-10">Overdue Action Center</h2>
                            <p className="text-xs font-bold text-rose-600/70 uppercase tracking-widest mt-2 relative z-10">Attention Required: Auto-SMS triggers setup</p>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            {studentFees.filter(f => f.status === 'Pending' || new Date(f.dueDate) < new Date()).map((fee, i) => (
                                <div key={i} className="p-6 border-b border-slate-50 flex items-center justify-between hover:bg-rose-50/20 transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-black animate-pulse">
                                            <AlertOctagon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{fee.name}</h3>
                                            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{fee.class}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-rose-600">₹{fee.due}</div>
                                        <div className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-wider">Due: {fee.dueDate}</div>
                                    </div>
                                    {canManage && (
                                        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-rose-600 transition-colors">
                                            Send Reminder
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STUDENT MY FEES VIEW */}
                {(activeTab === 'my_fees' || isStudent) && (
                    <motion.div key="my_fees" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="max-w-4xl mx-auto space-y-6 flex-1 w-full pb-8">
                        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <h2 className="text-sm font-black text-sky-200 uppercase tracking-widest mb-2 relative z-10">Total Outstanding Balance</h2>
                            <div className="text-5xl font-black tracking-tighter mb-8 relative z-10">₹20,000</div>
                            <div className="flex gap-4 relative z-10">
                                <button onClick={() => setShowPaymentModal(true)} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-slate-50 transition flex items-center gap-2">
                                    <CreditCard size={18} /> Pay With Gateway
                                </button>
                                <button className="bg-indigo-700/50 border border-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2">
                                    <DownloadCloud size={18} /> Download Summary
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-slate-800 ml-2 mt-8 mb-4">Fee Breakdown</h3>
                        <div className="space-y-4">
                            <StudentFeeCard title="Term 1 Tuition" amount="₹20,000" status="Paid" date="Paid on 10 Apr" />
                            <StudentFeeCard title="Term 2 Tuition" amount="₹20,000" status="Pending" date="Due by 10 Aug" />
                            <StudentFeeCard title="Annual Transport" amount="₹5,000" status="Paid" date="Paid on 12 Apr" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ACTION MODAL */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                        {isStudent ? 'Online Payment Gateway' : 'Collect Fee'}
                                    </h2>
                                </div>
                                <button onClick={() => setShowPaymentModal(false)} className="p-2 bg-white hover:bg-slate-100 rounded-full text-slate-500 transition-colors shadow-sm"><X size={20}/></button>
                            </div>
                            
                            <div className="p-8 space-y-5">
                                {isStudent ? (
                                    <>
                                        <div className="bg-sky-50 border border-sky-100 p-6 rounded-2xl text-center">
                                            <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">Paying Amount</p>
                                            <div className="text-3xl font-black text-sky-700">₹20,000</div>
                                        </div>
                                        <div className="space-y-3">
                                            <button className="w-full border-2 border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-500 hover:bg-slate-50 transition-all font-bold text-slate-700 text-left">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="w-8 h-8 object-contain" alt="UPI" /> Pay via UPI / QR
                                            </button>
                                            <button className="w-full border-2 border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-500 hover:bg-slate-50 transition-all font-bold text-slate-700 text-left">
                                                <CreditCard className="text-slate-400 w-8" /> Credit / Debit Card
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student / Registration No</label>
                                            <input type="text" placeholder="Search..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount Collecting</label>
                                            <input type="number" placeholder="₹ Amount" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-lg" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Mode</label>
                                                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600">
                                                    <option>Cash</option><option>Online/UPI</option><option>Bank Transfer</option><option>Cheque</option>
                                                </select>
                                            </div>
                                            <div className="flex items-end pb-1">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100" />
                                                    <span className="text-xs font-black uppercase text-slate-600">Auto Generate Receipt</span>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                <div className="pt-4 flex gap-3">
                                    <button onClick={() => setShowPaymentModal(false)} className="flex-[2] w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-wider text-[11px] rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                                        {isStudent ? 'Proceed to Payment Gateway' : 'Confirm & Collect'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

// Helpers
const TabBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all capitalize ${active ? 'bg-sky-100 text-sky-700 border border-sky-200 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
        {label}
    </button>
);

const StatCard = ({ title, value, icon, color, isActive }) => (
    <motion.div whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }} className={`p-6 rounded-[2rem] border transition-all flex flex-col ${isActive ? `bg-${color}-600 border-${color}-600 text-white shadow-xl shadow-${color}-500/20` : 'bg-white border-slate-100 text-slate-800 shadow-sm'}`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${isActive ? 'bg-white/20 text-white' : `bg-${color}-50 text-${color}-600`}`}>
                {icon}
            </div>
        </div>
        <div>
            <h2 className="text-3xl font-black tracking-tighter">{value}</h2>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{title}</p>
        </div>
    </motion.div>
);

const StudentFeeCard = ({ title, amount, status, date }) => {
    const isPaid = status === 'Paid';
    return (
        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black shadow-inner ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <Receipt size={20} />
                </div>
                <div>
                    <h4 className="font-black text-slate-800">{title}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{date}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xl font-black text-slate-700">{amount}</div>
                <div className={`text-[10px] uppercase font-black tracking-wider mt-1 ${isPaid ? 'text-emerald-500' : 'text-rose-500'}`}>{status}</div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status, isOverdue }) => {
    if (isOverdue) return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-wider rounded-md"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>OVERDUE</span>;
    const configs = {
        'Paid': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' },
        'Pending': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-500' },
        'Partial': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' },
    };
    const c = configs[status] || configs['Pending'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} border ${c.border} text-[10px] font-black uppercase tracking-wider rounded-md`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>{status}
        </span>
    );
};

function FeesSkeletonLoader() {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#FFFFFF]">
            <div className="h-28 bg-white border border-slate-100 rounded-[2.5rem] mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[1,2,3,4].map(i => <div key={i} className="bg-white h-32 rounded-[2rem] border border-slate-100 animate-pulse"></div>)}
            </div>
        </div>
    );
}
