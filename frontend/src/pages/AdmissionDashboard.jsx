import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Mail, Phone, Calendar, ArrowRight, UserCircle, LogOut } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api';

const AdmissionDashboard = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admission_token');
        if (!token) {
            navigate('/admission-login');
            return;
        }

        fetchProfile(token);
    }, [navigate]);

    const fetchProfile = async (token) => {
        try {
            const res = await axios.get(`${API_BASE}/student/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudent(res.data);
        } catch (err) {
            console.error(err);
            localStorage.removeItem('admission_token');
            navigate('/admission-login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admission_token');
        navigate('/admission-form');
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-left">
            <div className="bg-white p-12 rounded-[50px] shadow-2xl shadow-indigo-100 max-w-xl w-full border border-slate-50 text-center animate-pulse">
                <div className="w-24 h-24 bg-slate-100 rounded-[32px] mx-auto mb-8"></div>
                <div className="h-6 w-48 bg-slate-100 mx-auto mb-4 rounded-lg"></div>
                <div className="h-4 w-32 bg-slate-50 mx-auto rounded-lg"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-left">
            <div className="max-w-4xl w-full bg-white rounded-[60px] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-50 flex flex-col md:flex-row relative group">
                
                {/* Profile Header Side */}
                <div className="md:w-1/3 bg-[#0F172A] p-12 text-white flex flex-col justify-between relative overflow-hidden order-2 md:order-1">
                    <div className="relative z-10 space-y-12">
                        <div className="w-24 h-24 bg-indigo-600 p-0.5 rounded-[36px] shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                             <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[34px] flex items-center justify-center text-3xl font-black italic tracking-tighter uppercase">
                                 {student?.name?.charAt(0)}
                             </div>
                        </div>

                        <div className="space-y-2">
                             <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Welcome Back</h4>
                             <h1 className="text-4xl font-black tracking-tighter leading-tight uppercase italic">{student?.name}</h1>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{student?.email}</p>
                        </div>
                    </div>

                    <div className="relative z-10 pt-20">
                         <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-rose-500 hover:border-transparent transition-all font-black uppercase tracking-widest text-[10px] outline-none"
                         >
                            <LogOut size={16} /> Sign Out
                         </button>
                    </div>

                    {/* Background Decors */}
                    <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                </div>

                {/* Content Side */}
                <div className="md:w-2/3 p-16 space-y-12 order-1 md:order-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Dashboard Overview</h2>
                             <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase underline decoration-indigo-500 decoration-4 underline-offset-8">Admission Profile</h3>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-2xl border border-emerald-100 flex items-center gap-2 animate-in zoom-in-90 duration-700">
                             <ShieldCheck size={16} className="text-emerald-500" />
                             <span className="text-[10px] font-bold uppercase tracking-widest leading-loose">PAID / AUTHENTICATED</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-500">
                             <div className="p-3 bg-white w-fit rounded-2xl mb-6 shadow-sm"><GraduationCap size={20} className="text-indigo-600" /></div>
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Enrollment Course</h4>
                             <p className="text-sm font-black text-slate-800 tracking-tighter">{student?.course}</p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-500">
                             <div className="p-3 bg-white w-fit rounded-2xl mb-6 shadow-sm"><ShieldCheck size={20} className="text-slate-400" /></div>
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Application Identifier</h4>
                             <p className="text-sm font-black text-slate-800 tracking-widest">{student?.application_no}</p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-500">
                             <div className="p-3 bg-white w-fit rounded-2xl mb-6 shadow-sm"><Calendar size={20} className="text-indigo-400" /></div>
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Birth Record</h4>
                             <p className="text-sm font-black text-slate-800 tracking-tighter">{student?.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-500">
                             <div className="p-3 bg-white w-fit rounded-2xl mb-6 shadow-sm"><Phone size={20} className="text-emerald-400" /></div>
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Number</h4>
                             <p className="text-sm font-black text-slate-800 tracking-tighter">{student?.phone}</p>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Need registration support?</span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline cursor-pointer">Live Help</span>
                         </div>
                         <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] italic">Registered: {new Date(student?.created_at).toLocaleDateString()}</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdmissionDashboard;
