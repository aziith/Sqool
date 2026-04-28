import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            return setError("Password must be at least 6 characters long.");
        }
        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        setLoading(true);

        const studentId = localStorage.getItem('sqool_user_id');
        const token = localStorage.getItem('sqool_token');

        try {
            await axios.post('http://localhost:5002/api/student/change-password', {
                studentId,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Redirect to dashboard after successful password change
            navigate('/dashboard/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute w-[600px] h-[600px] bg-rose-500/20 blur-[100px] rounded-full top-[10%] left-[-10%]" />
                <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full bottom-[-10%] right-[10%]" />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="mx-auto w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-rose-500/50">
                    <ShieldCheck className="text-white" size={32} />
                </div>
                <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-white uppercase font-sans italic">
                    Secure Account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400 font-bold tracking-widest uppercase">
                    Mandatory Password Update Required
                </p>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="bg-slate-800/50 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-black/50 sm:rounded-3xl sm:px-10 border border-slate-700">
                    <form className="space-y-6" onSubmit={handleChangePassword}>
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-2xl text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
                                New Password
                            </label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-slate-500" size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 pr-3 py-4 border border-slate-700 rounded-2xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all font-bold"
                                    placeholder="Min. 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
                                Confirm New Password
                            </label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-slate-500" size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 pr-3 py-4 border border-slate-700 rounded-2xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all font-bold"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-[0_0_40px_-10px_rgba(225,29,72,0.5)] text-sm font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update & Continue'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
