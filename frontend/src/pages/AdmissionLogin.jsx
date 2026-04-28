import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, ArrowRight, UserCheck } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api';

const AdmissionLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        application_no: '',
        password: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/login`, formData);
            localStorage.setItem('admission_token', res.token || res.data.token);
            navigate('/admission-dashboard');
        } catch (err) {
            alert('Login failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6 text-left">
            <div className="bg-white rounded-[60px] shadow-2xl shadow-indigo-100 max-w-sm w-full p-16 border border-slate-50 relative overflow-hidden group">
                
                <div className="absolute top-0 right-0 p-8 scale-150 rotate-12 opacity-5 scale-in rotate-in duration-1000">
                    <GraduationCap size={120} className="text-indigo-600" />
                </div>

                <div className="relative z-10">
                    <div className="mb-14">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-100 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                             <UserCheck size={32} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight uppercase italic mb-3">Student <br/> Login</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Access your profile with your application ID.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Application ID</label>
                             <input 
                                type="text"
                                required
                                value={formData.application_no}
                                onChange={(e) => setFormData({...formData, application_no: e.target.value})}
                                placeholder="APPXXXXXXXXXX"
                                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-3xl outline-none font-black text-sm tracking-widest text-slate-600 transition-all placeholder:text-slate-300 placeholder:tracking-normal"
                             />
                        </div>

                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                             <div className="relative">
                                <input 
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Enter your password"
                                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-3xl outline-none font-bold text-sm text-slate-600 transition-all placeholder:text-slate-300"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400">
                                     <Lock size={18} />
                                </div>
                             </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[.25em] text-xs shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4"
                        >
                            {loading ? "Authenticating..." : "Login to Dashboard"}
                            <ArrowRight size={18} />
                        </button>

                        <div className="pt-8 text-center border-t border-slate-100 mt-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">New admission seeker?</p>
                            <button 
                                onClick={() => navigate('/admission-form')}
                                className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest"
                            > 
                                Back to Form
                            </button>
                        </div>
                    </form>
                </div>

                <div className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] bg-slate-50 rounded-full blur-[80px] -z-0"></div>
            </div>
        </div>
    );
};

export default AdmissionLogin;
