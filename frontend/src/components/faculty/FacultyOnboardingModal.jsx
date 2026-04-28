import React, { useState } from 'react';
import axios from 'axios';
import { X, User, Mail, Lock, Briefcase, Phone, MapPin, GraduationCap, Clock } from 'lucide-react';

const FacultyOnboardingModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'Password@123',
        role: 'TEACHER',
        employee_id: '',
        subjects: '',
        phone: '',
        address: '',
        qualification: '',
        experience_years: '0',
        institution_id: localStorage.getItem('sqool_institution_id') || 1
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.post('http://localhost:5002/api/faculty/profiles/onboard', formData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Onboarding error:", err);
            setError(err.response?.data?.error || "Failed to onboard faculty");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                        <Briefcase size={120} />
                    </div>
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                    <h2 className="text-3xl font-black tracking-tight">Onboard Faculty</h2>
                    <p className="text-indigo-100 font-medium mt-1">Add new teachers or staff members to your institution.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-left">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Login Credentials</h3>
                            
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    required name="name" placeholder="Full Name" value={formData.name} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-black transition-all shadow-sm placeholder:text-gray-500"
                                />
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    required name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-black transition-all shadow-sm placeholder:text-gray-500"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    required name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-black transition-all shadow-sm placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Professional Details</h3>
                            
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select 
                                    name="role" value={formData.role} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all appearance-none shadow-sm"
                                >
                                    <option value="TEACHER">Teacher</option>
                                    <option value="ADMIN">Administrator</option>
                                    <option value="ACCOUNTANT">Accountant</option>
                                    <option value="LIBRARIAN">Librarian</option>
                                    <option value="STAFF">General Staff</option>
                                </select>
                            </div>


                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    name="subjects" placeholder="Subjects Handled (e.g. Math, Science)" value={formData.subjects} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-black transition-all shadow-sm placeholder:text-gray-500"
                                />
                            </div>

                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    name="employee_id" placeholder="Employee ID (Optional)" value={formData.employee_id} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-black transition-all shadow-sm placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mt-6">Contact & Background</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                name="phone" placeholder="Contact Number" value={formData.phone} onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-black transition-all shadow-sm placeholder:text-gray-500"
                            />
                        </div>

                        <div className="relative group md:col-span-1">
                             <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                             <input 
                                name="address" placeholder="Residential Address" value={formData.address} onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-black transition-all shadow-sm placeholder:text-gray-500"
                             />
                        </div>

                        <div className="relative group">
                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-black transition-all shadow-sm placeholder:text-gray-500"
                            />
                        </div>

                        {formData.role === 'TEACHER' && (
                            <div className="relative group">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    name="experience_years" type="number" placeholder="Experience (Years)" value={formData.experience_years} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold text-black transition-all shadow-sm placeholder:text-gray-500"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all uppercase tracking-widest text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm disabled:opacity-50">
                            {loading ? 'Processing...' : 'Complete Onboarding'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FacultyOnboardingModal;
