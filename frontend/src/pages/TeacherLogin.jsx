import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Users, BarChart3, AlertCircle } from 'lucide-react';
import axios from 'axios';
import logoImg from '../assets/logo.png';
import { API_BASE } from '../config';

export default function TeacherLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });

            // Store auth data
            localStorage.setItem('sqool_token', data.token);
            localStorage.setItem('sqool_user_id', data.user.id);
            localStorage.setItem('sqool_user_role', data.user.role);
            localStorage.setItem('sqool_user_name', data.user.name);
            localStorage.setItem('sqool_institution_id', data.user.institution_id);
            localStorage.setItem('sqool_institution_name', data.user.institution_name || data.user.name);
            localStorage.setItem('sqool_institution_logo', data.user.logo_url || '');

            // Allow teachers (or admins logging in through here)
            const role = data.user.role;
            if (role === 'TEACHER') {
                navigate('/dashboard/teacher');
            } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
                navigate('/dashboard/admin');
            } else {
                setError('Access denied: Educator account required.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-slate-800 font-['Inter']">
            {/* Left Panel - Blue Branding */}
            <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-blue-600 px-16 py-12">

                <Link to="/" className="relative z-10 flex items-center gap-3 mb-16">
                    <div className="bg-white p-2.5 rounded-full shadow-lg">
                        <img src={logoImg} alt="Sqool" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">Sqool Academy</span>
                </Link>

                <div className="relative z-10 max-w-xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-6"
                    >
                        Empower Every <br />
                        Student with AI.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-blue-100/90 text-xl font-medium leading-relaxed max-w-md"
                    >
                        Automate administrative tasks and focus on what matters most: teaching.
                    </motion.p>
                </div>

                {/* Abstract UI Mockup */}
                <div className="relative z-10 flex-1 mt-16 min-h-[400px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-10 left-0 w-[420px] bg-[#dbe6fd] rounded-[2rem] p-6 shadow-2xl z-20"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-blue-600 font-bold text-lg">Classroom Stats</h4>
                                <p className="text-slate-600 text-xs font-semibold">Real-time attendance & engagement</p>
                            </div>
                            <div className="bg-blue-600/10 p-2 rounded-xl text-blue-600">
                                <BarChart3 size={18} />
                            </div>
                        </div>
                        <div className="bg-slate-800 rounded-xl w-full h-[140px] p-4 flex items-end justify-between gap-2 overflow-hidden relative">
                            {/* Dummy Chart */}
                            {[40, 70, 50, 90, 80, 100, 60, 40].map((h, i) => (
                                <div key={i} className="w-full bg-slate-700 rounded-sm relative group overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-emerald-500/80 rounded-sm" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-[80px] left-[320px] bg-[#FDE274] rounded-[1.5rem] p-5 shadow-2xl z-10 w-[160px] text-center"
                    >
                        <div className="mx-auto w-10 h-10 flex items-center justify-center text-slate-800 mb-2">
                            <Zap size={28} className="fill-slate-800" />
                        </div>
                        <p className="font-bold text-sm text-slate-900 leading-tight">AI Grading<br />Active</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="absolute top-[220px] left-[260px] bg-[#F7F9FC] rounded-[2rem] p-6 shadow-2xl z-30 w-[180px] min-h-[220px] flex flex-col justify-end"
                    >
                        <div className="text-blue-600 mb-4"><Users size={24} /></div>
                        <h2 className="text-5xl font-black text-slate-900 mb-1">24</h2>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Students Active</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="absolute top-[320px] left-[80px] bg-[#E8EFFF] border-2 border-white rounded-[1.5rem] px-5 py-4 shadow-xl z-40 flex items-center gap-4 w-[340px] backdrop-blur-md"
                    >
                        <div className="bg-blue-200 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                            <AlertCircle size={14} className="fill-blue-600 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">3 Grade appeals ready for review</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 lg:max-w-xl flex items-center justify-center p-8 bg-[#FAFAFA]">
                <div className="w-full max-w-[420px]">
                    <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
                        <img src={logoImg} alt="Sqool" className="w-10 h-10 object-contain" />
                        <span className="text-3xl font-black tracking-tighter" style={{ color: '#1e3a8a' }}>Sqool</span>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-[2rem] font-bold text-slate-900 mb-3 tracking-tight">Welcome back, Educator</h1>
                        <p className="text-[15px] font-medium text-slate-500">Access your digital classroom and AI assistants.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold"
                                style={{ background: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}>
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-600">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-[1rem] border-none text-[15px] font-medium transition-all outline-none bg-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:shadow-[0_0_0_2px_rgba(37,99,235,1)_inset]"
                                    placeholder="name@academy.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[13px] font-bold text-slate-600">Password</label>
                                <button type="button" className="text-[12px] font-bold text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 rounded-[1rem] border-none text-[15px] font-medium transition-all outline-none bg-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:shadow-[0_0_0_2px_rgba(37,99,235,1)_inset]"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors outline-none focus:bg-slate-200"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 rounded-full font-bold text-white text-[15px] flex items-center justify-center gap-2 group transition-all bg-[length:200%_auto] hover:bg-right"
                            style={{
                                backgroundImage: isLoading ? 'none' : 'linear-gradient(to right, #2563EB 0%, #1D4ED8 51%, #2563EB 100%)',
                                backgroundColor: isLoading ? '#93C5FD' : 'transparent',
                                boxShadow: '0 8px 25px -5px rgba(37, 99, 235, 0.4)',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isLoading ? (
                                <span>Signing In...</span>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">OR CONTINUE WITH</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <button
                        className="w-full py-4 px-6 rounded-full font-bold text-slate-800 text-[15px] flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.01 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Sign in with Google
                    </button>

                    <div className="text-center text-[13px] font-medium text-slate-500 mt-12">
                        New to the Kinetic methodology? <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">Apply to Join</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
