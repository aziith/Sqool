import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User, Users, GraduationCap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';
import schoolIllustration from '../assets/school_illustration.png';
import ParticleBackground from '../components/ParticleBackground';
import { API_BASE } from '../config';

const floatVariant = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
        },
    },
};

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [identifier, setIdentifier] = useState(''); 
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loginRole, setLoginRole] = useState('STUDENT');

    // Pre-select role based on URL
    useEffect(() => {
        if (location.pathname.includes('student')) setLoginRole('STUDENT');
        else if (location.pathname.includes('teacher')) setLoginRole('TEACHER');
        else if (location.pathname.includes('admin')) setLoginRole('ADMIN');
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            let endpoint = `${API_BASE}/auth/login`;
            let payload = { email: identifier, password };

            if (loginRole === 'STUDENT') {
                endpoint = `${API_BASE}/student/login`;
                payload = { applicationNo: identifier, password };
            }

            const { data } = await axios.post(endpoint, payload);
            
            localStorage.setItem('sqool_token', data.token);
            localStorage.setItem('sqool_user_id', data.user.id);
            localStorage.setItem('sqool_user_role', data.user.role || loginRole);
            localStorage.setItem('sqool_user_name', data.user.name);
            
            if (data.user.institution_id) {
                localStorage.setItem('sqool_institution_id', data.user.institution_id);
            }

            if (loginRole === 'ADMIN' || data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
                navigate('/dashboard/admin');
            } else if (loginRole === 'TEACHER' || data.user.role === 'TEACHER') {
                navigate('/dashboard/teacher');
            } else {
                if (data.isFirstLogin) navigate('/change-password');
                else navigate('/dashboard/student');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem',
        paddingTop: '0.75rem', paddingBottom: '0.75rem',
        border: '1.5px solid #E5E7EB', borderRadius: '0.75rem',
        background: '#F8FAFC', color: '#111827', fontSize: '0.875rem',
        fontWeight: '500', outline: 'none', transition: 'all 0.3s',
    };

    return (
        <div className="min-h-screen flex" style={{ background: '#FFFFFF' }}>
            {/* Left Panel - Yellow Theme from Register Page */}
            <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden p-12"
                style={{ background: 'linear-gradient(145deg, #FFF8DC 0%, #FDEAA8 50%, #FDD96E 100%)' }}>
                <ParticleBackground color="249, 199, 79" showLines={true} />
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-30 pointer-events-none" style={{ background: '#F9C74F', filter: 'blur(80px)', transform: 'translate(-30%,-30%)' }}></div>

                <div className="w-full flex justify-center flex-col items-center relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <img src={logoImg} alt="Sqool" className="w-12 h-12 object-contain drop-shadow-md" />
                        <span className="text-4xl font-black tracking-tighter" style={{ color: '#1e3a8a' }}>Sqool</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-5xl font-extrabold leading-tight" style={{ color: '#1e3a8a', fontFamily: 'Georgia, serif' }}>
                            Future<br /><span style={{ color: '#3b82f6' }}>Begins Here....</span>
                        </h2>
                        <p className="mt-4 text-base font-medium" style={{ color: '#1e40af' }}>One platform. Every student. Infinite possibilities.</p>
                    </div>

                    <div className="w-full">
                        <motion.img
                            src={schoolIllustration}
                            alt="School Bus"
                            className="w-full max-w-sm mx-auto object-contain drop-shadow-xl"
                            variants={floatVariant}
                            animate="animate"
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form (Role Selection Fixed) */}
            <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
                        <img src={logoImg} alt="Sqool" className="w-10 h-10 object-contain" />
                        <span className="text-3xl font-black tracking-tighter" style={{ color: '#1e3a8a' }}>Sqool</span>
                    </div>

                    <div className="mb-8">
                        <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1">Access your dashboard</p>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back! 👋</h1>
                    </div>

                    {/* Role Selection (Fix: Role Based Login) */}
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tighter mb-6 relative inline-block">
                            You're <span className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-600 rounded-full opacity-20"></span>
                        </h2>
                        <div className="flex items-center justify-center gap-8">
                            <RoleOption small active={loginRole === 'ADMIN'} onClick={() => setLoginRole('ADMIN')} icon={<ShieldCheck size={22} />} label="Admin" />
                            <RoleOption small active={loginRole === 'TEACHER'} onClick={() => setLoginRole('TEACHER')} icon={<Users size={22} />} label="Employee" />
                            <RoleOption small active={loginRole === 'STUDENT'} onClick={() => setLoginRole('STUDENT')} icon={<GraduationCap size={22} />} label="Student" />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-xl border flex items-center gap-2 text-sm animate-in slide-in-from-top-1"
                            style={{ background: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}>
                            <AlertCircle size={16} /><span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#374151' }}>
                                {loginRole === 'STUDENT' ? 'Application Number' : 'Email Address'}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2" size={18} style={{ color: '#9CA3AF' }} />
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    placeholder={loginRole === 'STUDENT' ? "e.g. APP-2026-101" : "you@school.edu"}
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = '#1e3a8a'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-semibold" style={{ color: '#374151' }}>Password</label>
                                <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">Forgot?</button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2" size={18} style={{ color: '#9CA3AF' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{ ...inputStyle, paddingRight: '3.5rem' }}
                                    onFocus={e => { e.target.style.borderColor = '#1e3a8a'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                                </div>
                                <span className="text-xs font-bold text-slate-500">Remember Me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 group transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                                boxShadow: '0 4px 15px rgba(30,58,138,0.25)',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.8 : 1,
                            }}
                        >
                            {isLoading ? 'Verifying...' : 'Sign In'}
                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="text-center text-sm mt-8" style={{ color: '#6B7280' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold hover:underline" style={{ color: '#3b82f6' }}>Apply Now</Link>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-indigo-600 transition-colors flex items-center gap-2">
                             Return home <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

const RoleOption = ({ active, onClick, icon, label, small }) => (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-2.5 group outline-none">
        <div className={`rounded-full flex items-center justify-center transition-all border-2 border-slate-100 ${
            small ? 'w-16 h-16' : 'w-20 h-20'
        } ${
            active 
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
            : 'bg-white text-slate-400 hover:border-indigo-400 group-hover:text-indigo-400 shadow-sm'
        }`}>
            {icon}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
            active ? 'text-indigo-900 border-b-2 border-indigo-900/20' : 'text-slate-400 group-hover:text-indigo-400'
        }`}>
            {label}
        </span>
    </button>
);
