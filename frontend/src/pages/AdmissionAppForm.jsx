import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Phone, Calendar, ArrowRight, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api';

const AdmissionAppForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        dob: ''
    });

    const courses = [
        "Computer Science & Engineering",
        "Electronics & Communication",
        "Mechanical Engineering",
        "Business Administration",
        "Data Science",
        "Cyber Security"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/admissions`, formData);
            // Redirect to payment page with application details
            navigate('/admission-payment', { state: { student: res.data } });
        } catch (err) {
            alert('Submission failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl shadow-indigo-100 overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Illustration & Info */}
                <div className="md:w-1/3 bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <GraduationCap size={48} className="mb-8" />
                        <h1 className="text-4xl font-black leading-tight mb-4 uppercase tracking-tighter">Start Your Journey</h1>
                        <p className="text-indigo-100 text-sm font-bold opacity-80 uppercase tracking-widest leading-loose">
                            Begin your professional career with world-class education and exposure.
                        </p>
                    </div>
                    
                    <div className="relative z-10 pt-12 space-y-6">
                        {[
                            "Fast Registration", 
                            "Secure Payments", 
                            "Direct Admission"
                        ].map(f => (
                            <div key={f} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                                    <CheckCircle size={14} className="text-white" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest">{f}</span>
                            </div>
                        ))}
                    </div>

                    {/* Decorative abstract elements */}
                    <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-20%] w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-2/3 p-12 lg:p-16">
                    <div className="mb-10 text-right">
                         <h2 className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Step 01 / Admission</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <User size={14} className="text-indigo-500" /> Full Name
                                </label>
                                <input 
                                    type="text" required placeholder="Johnathan Doe"
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Mail size={14} className="text-indigo-500" /> Email Address
                                </label>
                                <input 
                                    type="email" required placeholder="john@example.com"
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Phone size={14} className="text-indigo-500" /> Phone Number
                                </label>
                                <input 
                                    type="tel" required placeholder="+91 XXXXX XXXXX"
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Calendar size={14} className="text-indigo-500" /> Date of Birth
                                </label>
                                <input 
                                    type="date" required 
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <GraduationCap size={14} className="text-indigo-500" /> Selected Course
                            </label>
                            <select 
                                required
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm cursor-pointer appearance-none"
                                value={formData.course}
                                onChange={(e) => setFormData({...formData, course: e.target.value})}
                            >
                                <option value="">Choose your specialization...</option>
                                {courses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" disabled={loading}
                                className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[.2em] text-xs shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {loading ? "Processing Submission..." : "Continue to Payment"}
                                <ArrowRight size={18} />
                            </button>
                            <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Already registered? <span onClick={() => navigate('/admission-login')} className="text-indigo-600 cursor-pointer hover:underline">Login here</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdmissionAppForm;
