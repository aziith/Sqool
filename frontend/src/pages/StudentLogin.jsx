import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { BackgroundEffects, MagneticButton } from '../components/Animations';

export default function StudentLogin() {
    const [applicationNo, setApplicationNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5002/api/student/login', {
                applicationNo,
                password
            });

            const { token, user, isFirstLogin } = res.data;

            localStorage.setItem('sqool_user_id', user.id);
            localStorage.setItem('sqool_user_role', user.role);
            localStorage.setItem('sqool_user_name', user.name);
            localStorage.setItem('sqool_token', token);

            if (isFirstLogin) {
                navigate('/change-password');
            } else {
                navigate('/dashboard/student');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FA] relative overflow-hidden flex items-center justify-center p-4 md:p-6 font-['Inter']">
            {/* Smooth Animated Background using existing Animations component */}
            <BackgroundEffects />
            
            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[1100px] min-h-[700px] bg-white rounded-[2.5rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-white backdrop-blur-md"
            >
                {/* LEFT PANE - Marketing Brand */}
                <div className="w-full md:w-[45%] p-10 md:p-14 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-[#E2ECFA] to-[#F1F5FB] relative overflow-hidden">
                    {/* Abstract overlapping light glare effects matching mockup */}
                    <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-white/60 blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-white/40 blur-[60px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <Link to="/" className="inline-block hover:scale-105 transition-transform">
                            <span className="text-2xl lg:text-3xl font-black tracking-tighter text-blue-600 italic">Sqool</span>
                        </Link>
                        
                        <h1 className="text-[2.75rem] lg:text-6xl font-extrabold text-slate-800 leading-[1.05] tracking-tight mt-16 mb-6">
                            The future of <br/>
                            <span className="text-blue-600">learning</span> moves<br/>
                            with you.
                        </h1>
                        
                        <p className="text-slate-500 text-base lg:text-lg leading-relaxed max-w-sm font-medium">
                            Access your courses, track your progress, and join the next generation of digital scholars in a space built for focus.
                        </p>
                    </div>
                    
                    {/* Academy Life Social Proof Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="relative z-10 mt-12 bg-white/80 backdrop-blur-md rounded-[1.5rem] p-4 flex items-center gap-4 max-w-[280px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-white"
                    >
                        <div className="w-12 h-12 bg-slate-900 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm flex items-center justify-center">
                            {/* Realistic placeholder avatar to match mockup */}
                            <img src="https://i.pravatar.cc/150?img=11" alt="Student" className="w-full h-full object-cover opacity-90" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Academy Life</h4>
                            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Join 2,400+ active students today</p>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT PANE - Auth Form */}
                <div className="w-full md:w-[55%] p-10 md:p-16 lg:p-20 flex flex-col justify-center bg-white relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">Welcome back</h2>
                    <p className="text-slate-500 font-medium mt-2 mb-10 text-sm lg:text-base">Please enter your student credentials</p>
                    
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold text-center">
                                {error}
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2 ml-1">
                                Email or Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                                    <span className="font-black text-lg">@</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-full bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold shadow-sm"
                                    placeholder="Application No (e.g. JPS2026...)"
                                    value={applicationNo}
                                    onChange={(e) => setApplicationNo(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2 px-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                    Password
                                </label>
                                <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors bg-transparent border-none outline-none">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative mb-2 group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                                    <Key size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-full bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold tracking-widest text-lg shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] font-semibold text-slate-400 mt-1 ml-2">First time? Use first 4 letters of name + Birth Year (YYYY)</p>
                        </div>

                        <MagneticButton
                            type="submit"
                            disabled={loading}
                            className="w-full py-4.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] transition-all disabled:opacity-50 mt-4 active:scale-[0.98] border border-blue-500 h-[56px]"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </MagneticButton>
                    </form>

                    <div className="mt-8 flex items-center gap-4 px-2">
                        <div className="h-px bg-slate-100 flex-1"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                        <div className="h-px bg-slate-100 flex-1"></div>
                    </div>

                    <MagneticButton type="button" className="mt-8 w-full py-4 px-4 bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-800 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-sm h-[56px]">
                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.01 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Sign in with Google
                    </MagneticButton>

                    <div className="mt-10 lg:mt-14 text-center text-xs font-semibold text-slate-500">
                        Don't have an account? <Link to="/dashboard/admission" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">Apply Now</Link>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                        <Link to="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
