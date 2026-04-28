import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, ArrowLeft, RefreshCw, CheckCircle, Smartphone } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api';

const PaymentSim = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [autoPass, setAutoPass] = useState('');

    const student = location.state?.student;

    useEffect(() => {
        if (!student) {
            navigate('/admission-form');
        }
    }, [student, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/fake-payment-success`, {
                application_no: student.application_no
            });
            setAutoPass(res.data.password);
            setSuccess(true);
        } catch (err) {
            alert('Payment failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-left">
                <div className="bg-white p-12 rounded-[50px] shadow-2xl shadow-emerald-100 max-w-xl w-full border border-emerald-50 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase italic">Success!</h2>
                    <p className="text-slate-500 font-bold mb-10 leading-relaxed uppercase tracking-widest text-xs px-10">
                        Your admission fee has been paid successfully. Use the credentials below to access your dashboard.
                    </p>

                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-3xl mb-10 space-y-4 shadow-inner">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Application No</span>
                            <span className="text-sm font-black text-slate-700 tracking-tighter">{student.application_no}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto Password</span>
                            <span className="text-sm font-black text-indigo-600 tracking-widest">{autoPass}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/admission-login')}
                        className="w-full py-5 bg-[#0F172A] text-white rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-200 transition-all active:scale-[0.98]"
                    >
                        Go to Student Dashboard
                    </button>
                    <p className="mt-6 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                        * Note down your password now.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-left">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Information Side */}
                <div className="space-y-10 py-10 order-2 md:order-1">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-all outline-none">
                        <ArrowLeft size={16} /> Back to details
                    </button>

                    <div className="space-y-4">
                         <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Billing Overview</h3>
                         <h1 className="text-5xl font-black text-[#0F172A] tracking-tighter uppercase italic leading-tight">Complete <br/> Payment</h1>
                         <p className="text-sm font-bold text-slate-400 leading-loose uppercase tracking-wide max-w-sm">Please review your admission details and complete the formal registration fee payment.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm">
                                {student?.name?.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applicant</h4>
                                <p className="text-sm font-black text-slate-800">{student?.name}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Application ID</h4>
                                <p className="text-sm font-black text-slate-800 tracking-widest">{student?.application_no}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dummy Payment Card */}
                <div className="order-1 md:order-2 flex items-center justify-center">
                    <div className="bg-white rounded-[48px] shadow-2xl shadow-indigo-100 w-full p-10 border border-slate-100 relative overflow-hidden group">
                        
                        <div className="relative z-10 space-y-10">
                            <div className="flex justify-between items-center">
                                <CreditCard size={32} className="text-slate-300" />
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Registration Fee</span>
                                    <span className="text-3xl font-black text-indigo-600 italic tracking-tighter">₹5,000.00</span>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-slate-50">
                                <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Card Number</label>
                                     <div className="p-4 bg-slate-50 rounded-2xl border border-transparent font-bold text-slate-400 flex items-center justify-between text-xs tracking-[0.2em]">
                                        <span>XXXX XXXX XXXX 4242</span>
                                        <Smartphone size={14} className="opacity-50" />
                                     </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry</label>
                                          <div className="p-4 bg-slate-50 rounded-2xl border border-transparent font-bold text-slate-400 text-xs text-center tracking-widest">12 / 28</div>
                                     </div>
                                     <div className="space-y-2">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CVC</label>
                                          <div className="p-4 bg-slate-50 rounded-2xl border border-transparent font-bold text-slate-400 text-xs text-center tracking-[0.4em]">***</div>
                                     </div>
                                </div>
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[.25em] text-xs shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {loading ? <RefreshCw size={18} className="animate-spin" /> : "Pay Now (Demo Mode)"}
                            </button>

                            <div className="flex items-center justify-center gap-3 pt-6 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-loose text-center">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                End-to-end Encrypted SSL Sandbox
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute top-[-40%] left-[-40%] w-[300px] h-[300px] bg-slate-50 rounded-full blur-[80px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentSim;
