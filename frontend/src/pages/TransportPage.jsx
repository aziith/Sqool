import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bus, Users, Map, Navigation, MapPin, Search, Plus, Filter,
    MoreVertical, Navigation2, Clock, AlertCircle, FileText, ChevronRight
} from 'lucide-react';

export default function TransportPage() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, vehicles, routes, students
    const [showAssignModal, setShowAssignModal] = useState(false);

    const userRole = localStorage.getItem('sqool_user_role') || 'STUDENT';
    const canManage = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);
    const canViewLimited = ['TEACHER', 'ADMIN', 'SUPER_ADMIN'].includes(userRole);

    // Mock Data
    const stats = {
        totalVehicles: 12,
        studentsUsing: 540,
        activeRoutes: 8,
        runningBuses: 6
    };

    const vehicles = [
        { id: 'BUS-01', driver: 'Ramesh Singh', route: 'Route A - City Center', capacity: '40/50', status: 'Running', lat: 28.6139, lng: 77.2090 },
        { id: 'BUS-02', driver: 'Suresh Kumar', route: 'Route B - West End', capacity: '45/50', status: 'Running', lat: 28.6250, lng: 77.2200 },
        { id: 'BUS-03', driver: 'Amit Patel', route: 'Route C - North Hills', capacity: '12/40', status: 'Delayed', lat: 28.6400, lng: 77.2100 },
        { id: 'BUS-04', driver: 'Vikash Yadav', route: 'Route D - South Park', capacity: '0/50', status: 'Stopped', lat: 28.6100, lng: 77.1900 },
    ];

    const routes = [
        {
            id: 'RT-A', name: 'City Center Express',
            stops: ['School Campus', 'Central Plaza', 'Metro Station A', 'City Center'],
            distance: '12 km', duration: '45 mins'
        },
        {
            id: 'RT-B', name: 'West End Loop',
            stops: ['School Campus', 'West Gate', 'Shopping Mall', 'Residential Blocks'],
            distance: '18 km', duration: '55 mins'
        }
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

    if (loading) return <TransportSkeletonLoader />;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#FFFFFF] min-h-screen font-['Inter']">

            {/* Header section */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-[#FDEE8A] shadow-sm"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <Bus size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Transport Fleet</h1>
                        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">Live Tracking & Logistics</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {['dashboard', 'vehicles', 'routes'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all capitalize ${activeTab === tab
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </motion.header>

            <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                    <motion.div key="dashboard" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-8">

                        {/* 1. TOP DASHBOARD (Stats Cards) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Vehicles" value={stats.totalVehicles} icon={<Bus size={20} />} color="blue" />
                            <StatCard title="Students Assigned" value={stats.studentsUsing} icon={<Users size={20} />} color="indigo" />
                            <StatCard title="Active Routes" value={stats.activeRoutes} icon={<Map size={20} />} color="violet" />
                            <StatCard title="Running Buses" value={stats.runningBuses} icon={<Navigation2 size={20} />} color="emerald" isActive={true} />
                        </div>

                        {/* Middle Section: Map & Lists */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* 2. LIVE MAP (Mock Implementation) */}
                            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative min-h-[400px]">
                                <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative"></div>
                                    <span className="font-black text-sm text-slate-800 tracking-tight">Live GPS Tracking</span>
                                </div>
                                <div className="absolute top-6 right-6 z-10">
                                    <button className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg text-slate-600 hover:text-emerald-600 transition-colors">
                                        <Filter size={18} />
                                    </button>
                                </div>

                                {/* Mock Map Background (Grid Pattern) */}
                                <div className="flex-1 bg-[#EEF2F6] relative overflow-hidden flex items-center justify-center map-bg-pattern">
                                    {/* Mock Map Image / Vector representation */}
                                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTM5LjUgMzkuNUMzOS41IDM5LjUgMzkuNSAzOS41IDM5LjUgMzkuNVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+Cjwvc3ZnPg==')]"></div>

                                    {/* Animated Bus Markers */}
                                    <MapMarker top="30%" left="40%" delay="0s" status="Running" label="BUS-01" />
                                    <MapMarker top="60%" left="70%" delay="2s" status="Running" label="BUS-02" />
                                    <MapMarker top="45%" left="20%" delay="1s" status="Delayed" label="BUS-03" />
                                </div>
                                <div className="bg-white border-t border-slate-100 p-4">
                                    <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-500">
                                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Running</span>
                                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Delayed</span>
                                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Stopped</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Sidebar / Quick Actions & Alerts */}
                            <motion.div variants={itemVariants} className="space-y-6">

                                {/* Admin Actions */}
                                {canManage && (
                                    <div className="bg-emerald-600 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                        <h3 className="font-black text-lg mb-4 relative z-10">Fleet Management</h3>
                                        <div className="space-y-2 relative z-10">
                                            <button className="w-full bg-white text-emerald-700 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-50 transition-colors flex justify-center items-center gap-2">
                                                <Plus size={16} /> Add Vehicle
                                            </button>
                                            <button onClick={() => setShowAssignModal(true)} className="w-full bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-colors">
                                                Assign Students
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Status / Notifications */}
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <AlertCircle size={18} className="text-amber-500" />
                                        <h3 className="font-black text-slate-800">Live Alerts</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <AlertItem type="warning" time="Just now" text="BUS-03 delayed by 15 mins due to traffic." />
                                        <AlertItem type="info" time="10 mins ago" text="BUS-01 arrived safely at School Campus." />
                                    </div>
                                </div>

                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* 3. VEHICLE MANAGEMENT VIEW */}
                {activeTab === 'vehicles' && (
                    <motion.div key="vehicles" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-800">Vehicle Directory</h2>
                            <div className="flex gap-2">
                                <Search className="text-slate-400 m-2" size={20} />
                                {canManage && <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition">Add Bus</button>}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="p-4 pl-6">Bus No</th>
                                        <th className="p-4">Driver</th>
                                        <th className="p-4">Route</th>
                                        <th className="p-4">Capacity</th>
                                        <th className="p-4">Status</th>
                                        {canManage && <th className="p-4 text-right pr-6">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map(bus => (
                                        <tr key={bus.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-4 pl-6 font-black text-slate-700 text-sm">{bus.id}</td>
                                            <td className="p-4 text-sm font-semibold text-slate-600">{bus.driver}</td>
                                            <td className="p-4 text-sm font-semibold text-slate-600">
                                                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-emerald-500" /> {bus.route}</span>
                                            </td>
                                            <td className="p-4 text-sm font-bold text-slate-500">{bus.capacity}</td>
                                            <td className="p-4">
                                                <StatusBadge status={bus.status} />
                                            </td>
                                            {canManage && (
                                                <td className="p-4 text-right pr-6">
                                                    <button className="text-slate-400 hover:text-emerald-600 p-1 transition"><MoreVertical size={16} /></button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* 5. ROUTE VIEW (Timeline Style) */}
                {activeTab === 'routes' && (
                    <motion.div key="routes" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {routes.map(rt => (
                            <div key={rt.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">{rt.id}</span>
                                        <h3 className="text-xl font-black text-slate-800 mt-2">{rt.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-700">{rt.distance}</div>
                                        <div className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-1"><Clock size={12} /> {rt.duration}</div>
                                    </div>
                                </div>

                                {/* Timeline UI */}
                                <div className="relative pl-4 space-y-6 mt-8 before:absolute before:inset-y-2 before:left-5 before:w-0.5 before:bg-slate-100">
                                    {rt.stops.map((stop, i) => (
                                        <div key={i} className="relative flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${i === 0 || i === rt.stops.length - 1 ? 'bg-emerald-500 scale-125' : 'bg-slate-300'}`}></div>
                                            <span className={`text-sm font-bold ${i === 0 || i === rt.stops.length - 1 ? 'text-slate-800' : 'text-slate-500'}`}>{stop}</span>
                                        </div>
                                    ))}
                                </div>

                                {canManage && (
                                    <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                                        <button className="flex-1 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition">Edit Route</button>
                                        <button className="flex-[2] text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-900 py-2.5 rounded-xl transition">View on Map</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assignment Modal overlay snippet mock */}
            <AnimatePresence>
                {showAssignModal && canManage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
                            <button onClick={() => setShowAssignModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X size={18} /></button>
                            <h2 className="text-xl font-black mb-1 text-slate-800">Assign Transport</h2>
                            <p className="text-xs text-slate-400 font-bold mb-6">Link students to specific bus routes</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Student Search</label>
                                    <input type="text" placeholder="Type name or ID..." className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Select Route</label>
                                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">
                                        {routes.map(r => <option key={r.id}>{r.id} - {r.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pickup Point</label>
                                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">
                                        <option>Central Plaza</option>
                                        <option>Metro Station A</option>
                                    </select>
                                </div>
                                <button onClick={() => setShowAssignModal(false)} className="w-full mt-4 bg-emerald-600 text-white font-black uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:bg-emerald-700 transition">Confirm Assignment</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper Components
function StatCard({ title, value, icon, color, isActive }) {
    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
            className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${isActive ? `bg-${color}-600 border-${color}-600 text-white shadow-xl shadow-${color}-500/20` : 'bg-white border-slate-100 text-slate-800 shadow-sm'
                }`}
        >
            <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isActive ? `text-${color}-200` : 'text-slate-400'}`}>{title}</p>
                <h2 className="text-3xl font-black tracking-tighter">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${isActive ? 'bg-white/20 text-white' : `bg-${color}-50 text-${color}-600`
                }`}>
                {icon}
            </div>
        </motion.div>
    );
}

function StatusBadge({ status }) {
    const configs = {
        'Running': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
        'Delayed': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
        'Stopped': { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500' },
    };
    const c = configs[status] || configs['Stopped'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} text-[10px] font-black uppercase tracking-wider rounded-md`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'Running' ? 'animate-pulse' : ''}`}></span>
            {status}
        </span>
    );
}

function AlertItem({ type, time, text }) {
    const isWarn = type === 'warning';
    return (
        <div className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${isWarn ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
            <div>
                <p className="text-xs font-bold text-slate-700 leading-snug">{text}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{time}</p>
            </div>
        </div>
    );
}

function MapMarker({ top, left, delay, status, label }) {
    const isRunning = status === 'Running';
    const color = isRunning ? 'bg-emerald-500' : status === 'Delayed' ? 'bg-amber-500' : 'bg-rose-500';
    return (
        <motion.div
            className="absolute flex flex-col items-center group cursor-pointer"
            style={{ top, left }}
            animate={isRunning ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: delay }}
        >
            <div className={`bg-white text-slate-800 text-[9px] font-black px-2 py-0.5 rounded shadow-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100`}>
                {label}
            </div>
            <div className={`w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border-2 ${isRunning ? 'border-emerald-500' : 'border-slate-300'} z-10 relative overflow-hidden`}>
                <div className={`absolute inset-0 ${color} opacity-10`}></div>
                <Navigation2 size={14} className={`${isRunning ? 'text-emerald-600' : 'text-slate-400'} ${isRunning ? 'rotate-45' : ''}`} />
            </div>
            {isRunning && (
                <div className={`absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${color} animate-ping opacity-50 z-0`}></div>
            )}
        </motion.div>
    );
}

function TransportSkeletonLoader() {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#FFFFFF]">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 mb-8">
                <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-200 rounded-2xl animate-pulse"></div>
                    <div><div className="w-40 h-6 bg-slate-200 rounded-md animate-pulse mb-2"></div><div className="w-24 h-3 bg-slate-200 rounded-md animate-pulse"></div></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map(i => <div key={i} className="bg-white h-28 rounded-[2rem] border border-slate-100 animate-pulse"></div>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white h-[400px] rounded-[2rem] border border-slate-100 animate-pulse"></div>
                <div className="bg-white h-[400px] rounded-[2rem] border border-slate-100 animate-pulse"></div>
            </div>
        </div>
    );
}
