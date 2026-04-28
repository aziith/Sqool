import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, Mail, Lock, Eye, EyeOff, User, Phone, ShieldCheck, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';
import logoImg from '../assets/logo.png';
import schoolIllustration from '../assets/school_illustration.png';
import { API_BASE } from '../config';

const STEPS = ['Campus Info', 'Admin Account', 'Verify OTP', 'Confirm'];

const floatVariant = {
    animate: {
        y: [0, -12, 0],
        transition: {
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
        },
    },
};

export default function RegisterCampus() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({ campusName: '', adminName: '', email: '', password: '', phone: '' });
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => { 
        setFormData({ ...formData, [e.target.name]: e.target.value }); 
        setError(null); 
    };

    const handleRequestOTP = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${API_BASE}/auth/request-otp`, { identifier: formData.email.trim() });
            if (res.data.otp) {
                // For development convenience, but normally this would be removed
                console.log('OTP:', res.data.otp);
            }
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.post(`${API_BASE}/auth/verify-otp`, { identifier: formData.email.trim(), otp: otp.trim() });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (step === 0) return setStep(1);
        if (step === 1) return handleRequestOTP();
        if (step === 2) return handleVerifyOTP();

        if (step === 3) {
            setIsLoading(true);
            setError(null);
            try {
                await axios.post(`${API_BASE}/auth/register`, formData);
                navigate('/login');
            } catch (err) {
                setError(err.response?.data?.error || 'Registration failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const inputStyle = {
        width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem',
        paddingTop: '0.85rem', paddingBottom: '0.85rem',
        border: '1.5px solid #E2E8F0', borderRadius: '0.85rem',
        background: '#F8FAFC', color: '#1E293B', fontSize: '0.9rem',
        fontWeight: '600', outline: 'none', transition: 'all 0.3s',
    };

    return (
        <div className="min-h-screen flex" style={{ background: '#FFFBF0' }}>
            
            {/* Left Side: Brand Panel */}
            <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden p-12"
                style={{ background: 'linear-gradient(145deg, #FFF8DC 0%, #FDEAA8 50%, #FDD96E 100%)' }}>
                <ParticleBackground color="249, 199, 79" showLines={true} />
                <div className="absolute top-0 left-0 w-80 h-80 bg-[#F9C74F]/20 rounded-full blur-[100px] -ml-20 -mt-20"></div>

                <div className="w-full flex justify-center flex-col items-center relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <img src={logoImg} alt="Sqool" className="w-14 h-14 object-contain drop-shadow-md" />
                        <span className="text-4xl font-black tracking-tighter" style={{ color: '#1e3a8a' }}>Sqool</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-6xl font-black leading-tight" style={{ color: '#1e3a8a', fontFamily: 'Georgia, serif' }}>
                            Join Our<br /><span style={{ color: '#3b82f6' }}>Growing Family!</span>
                        </h2>
                        <p className="mt-6 text-lg font-bold" style={{ color: '#1e40af' }}>Set up your campus in just a few steps.</p>
                    </div>

                    <div className="w-full">
                        <motion.img
                            src={schoolIllustration}
                            alt="Academy Registration"
                            className="w-full max-w-sm mx-auto object-contain drop-shadow-2xl"
                            variants={floatVariant}
                            animate="animate"
                        />
                    </div>

                    {/* Step Tracker (Visual Guide) */}
                    <div className="flex items-center gap-3 mt-12">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all border-2 ${
                                    i < step ? 'bg-blue-600 border-blue-600 text-white' : 
                                    i === step ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-lg' : 
                                    'bg-white/40 border-[#1e3a8a]/20 text-[#1e3a8a]'
                                }`}>
                                    {i < step ? <CheckCircle size={16} /> : i + 1}
                                </div>
                                {i < STEPS.length - 1 && <div className={`w-6 h-0.5 rounded-full ${i < step ? 'bg-blue-600' : 'bg-[#1e3a8a]/10'}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Form Content */}
            <div className="flex-1 lg:max-w-xl flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
                        <img src={logoImg} alt="Sqool" className="w-10 h-10 object-contain" />
                        <span className="text-3xl font-black tracking-tighter" style={{ color: '#1e3a8a' }}>Sqool</span>
                    </div>

                    {/* Form Intro */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">
                             Step {step + 1} of 4
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">
                            {step === 0 ? 'Campus Details 🏫' : step === 1 ? 'Admin Account 👤' : step === 2 ? 'Verify OTP 🛡️' : 'Ready to Launch! 🚀'}
                        </h1>
                        <p className="text-slate-500 font-bold mt-2">
                             {step === 0 ? "Tell us about your institution" : step === 1 ? "Create the primary administrator" : step === 2 ? "We've sent a code to your email" : "Review your details and join Sqool"}
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {error && (
                                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600 text-sm font-bold">
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}

                                {step === 0 && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Campus / School Name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="text" 
                                                name="campusName" 
                                                required 
                                                value={formData.campusName} 
                                                onChange={handleChange}
                                                placeholder="e.g. Jain Vidyalaya Higher Secondary"
                                                style={inputStyle}
                                                onFocus={e => { e.target.style.borderColor = '#1e3a8a'; e.target.style.boxShadow = '0 0 0 4px rgba(30,58,138,0.05)'; }}
                                                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Admin Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input type="text" name="adminName" required value={formData.adminName} onChange={handleChange} placeholder="Your Full Name" style={inputStyle} onFocus={e => { e.target.style.borderColor = '#1e3a8a'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Primary Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="admin@academy.edu" style={inputStyle} onFocus={e => { e.target.style.borderColor = '#1e3a8a'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" style={inputStyle} onFocus={e => { e.target.style.borderColor = '#1e3a8a'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input 
                                                    type={showPassword ? 'text' : 'password'} 
                                                    name="password" 
                                                    required 
                                                    value={formData.password} 
                                                    onChange={handleChange} 
                                                    placeholder="Create secure password" 
                                                    style={{...inputStyle, paddingRight: '4rem'}} 
                                                    onFocus={e => { e.target.style.borderColor = '#1e3a8a'; }} 
                                                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }} 
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="p-5 rounded-[1.25rem] bg-indigo-50 border-2 border-indigo-100 flex flex-col items-center">
                                            <p className="text-sm font-bold text-indigo-700">Code sent to your email</p>
                                            <p className="text-xl font-black text-indigo-900 mt-1">{formData.email}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest text-center block">Enter 6-Digit OTP</label>
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                                <input 
                                                    type="text" 
                                                    maxLength="6" 
                                                    value={otp} 
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    placeholder="0 0 0 0 0 0"
                                                    style={{...inputStyle, textAlign: 'center', letterSpacing: '0.8rem', fontSize: '1.5rem', paddingLeft: '1rem'}}
                                                    onFocus={e => { e.target.style.borderColor = '#4f46e5'; }}
                                                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        <button type="button" onClick={handleRequestOTP} className="w-full text-center text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                                            Resend Verification Code
                                        </button>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-slate-100 space-y-4">
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Registration Summary</h3>
                                            {[
                                                ['Institution', formData.campusName],
                                                ['Admin User', formData.adminName],
                                                ['Email Id', formData.email],
                                                ['Contact No', formData.phone]
                                            ].map(([l, v]) => (
                                                <div key={l} className="flex justify-between items-center text-sm">
                                                    <span className="font-bold text-slate-400">{l}</span>
                                                    <span className="font-black text-slate-700">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
                                            <CheckCircle className="text-emerald-500" size={24} />
                                            <p className="text-xs font-bold text-emerald-800 leading-tight">Your identifier has been verified successfully. Ready to create your campus!</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex gap-4 pt-6">
                            {step > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(s => s - 1)}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-black uppercase text-[11px] tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                                >
                                    Previous
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-[1.5] py-4.5 px-8 bg-blue-600 text-white rounded-[1.25rem] font-black uppercase text-[11px] tracking-widest shadow-[0_12px_25px_-5px_rgba(37,99,235,0.4)] hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isLoading ? (step === 3 ? 'Finalizing...' : 'Verifying...') : 
                                 step === 3 ? 'Launch My Campus' : 'Continue'}
                                {!isLoading && <ArrowRight size={16} />}
                            </button>
                        </div>
                    </form>

                    {/* Footer Area */}
                    <div className="mt-12 text-center text-sm font-bold text-slate-400">
                        Already have a campus? <Link to="/login" className="text-blue-600 hover:underline ml-1">Sign In instead</Link>
                    </div>

                    <div className="mt-8 flex justify-center">
                         <Link to="/" className="text-slate-400 hover:text-blue-600 text-[10px] font-bold transition-colors inline-flex items-center gap-1 uppercase tracking-widest">
                             <ArrowRight size={12} className="rotate-180"/> Return to Homepage
                         </Link>
                    </div>

                    <div className="mt-16 flex flex-col items-center gap-2 opacity-30">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800">Powered by Sqool AI Platform</div>
                        <div className="text-[9px] font-bold text-slate-400">© 2026 Sqool Education Ltd. All rights reserved.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
