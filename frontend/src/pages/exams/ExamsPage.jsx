import React, { useState } from 'react';
import ExamsDashboard from './ExamsDashboard';
import ExamManagement from './ExamManagement';
import { BarChart3, Settings, ClipboardList, TrendingUp } from 'lucide-react';

const ExamsPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const userRole = localStorage.getItem('sqool_user_role') || 'STUDENT';
    const canManage = ['ADMIN', 'SUPER_ADMIN', 'TEACHER'].includes(userRole);

    return (
        <div className="flex flex-col h-full" style={{ background: '#FFFBF0' }}>
            {/* Tabs Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 pt-6 border-b border-[#FDE68A] shadow-sm">
                <div className="flex items-end gap-10">
                    <TabButton 
                        active={activeTab === 'dashboard'} 
                        onClick={() => setActiveTab('dashboard')} 
                        icon={<TrendingUp size={19}/>} 
                        label="Analytics" 
                    />
                    {canManage && (
                        <>
                            <TabButton 
                                active={activeTab === 'manage'} 
                                onClick={() => setActiveTab('manage')} 
                                icon={<Settings size={19}/>} 
                                label="Management" 
                            />
                            <TabButton 
                                active={activeTab === 'marks'} 
                                onClick={() => setActiveTab('marks')} 
                                icon={<ClipboardList size={19}/>} 
                                label="Records" 
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-2">
                <main className="max-w-7xl mx-auto w-full">
                    {activeTab === 'dashboard' && <ExamsDashboard />}
                    {activeTab === 'manage' && <ExamManagement />}
                    {activeTab === 'marks' && (
                        <div className="p-12 text-center max-w-2xl mx-auto mt-20 bg-white rounded-3xl border border-[#FDE68A] shadow-xl">
                            <div className="w-20 h-20 bg-[#FEF3C7] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#D97706]">
                                <BarChart3 size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-[#1e3a8a] mb-2">Mark Entry System</h2>
                            <p className="text-[#475569] leading-relaxed">Select an exam, subject, and section to securely input student performance data.</p>
                            <button className="mt-8 bg-[#1e3a8a] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">
                                Launch Entry Tool
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2.5 pb-4 px-2 text-[0.8125rem] font-bold transition-all relative group ${
            active ? 'text-[#1e3a8a]' : 'text-slate-400 hover:text-[#1e3a8a]'
        }`}
    >
        <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:translate-y-[-2px]'}`}>
            {icon}
        </span>
        <span className="tracking-wide uppercase font-black">{label}</span>
        {active && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e3a8a] rounded-t-full shadow-[0_-2px_8px_rgba(30,58,138,0.3)] animate-in fade-in slide-in-from-bottom-1" />
        )}
    </button>
);

export default ExamsPage;
