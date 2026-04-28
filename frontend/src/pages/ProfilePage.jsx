import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    User, Building, Shield, Save, Key, Phone, Mail, 
    MapPin, Globe, CheckCircle, AlertCircle, Loader2, Image as ImageIcon 
} from 'lucide-react';
import { API_BASE } from '../config';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('account');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [data, setData] = useState({
        user: { name: '', email: '', phone: '' },
        institution: { name: '', email: '', phone: '', address: '' }
    });
    
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [otpState, setOtpState] = useState({
        isOtpMode: false,
        otp: '',
        isOtpSent: false,
        isOtpVerified: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('sqool_token');
            const res = await axios.get(`${API_BASE}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestOtp = async () => {
        setIsSaving(true);
        try {
            await axios.post(`${API_BASE}/auth/request-otp`, { identifier: data.user.email });
            setOtpState({ ...otpState, isOtpSent: true });
            setMessage({ type: 'success', text: 'OTP sent to your email' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to send OTP' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleVerifyOtp = async () => {
        setIsSaving(true);
        try {
            await axios.post(`${API_BASE}/auth/verify-otp`, { 
                identifier: data.user.email, 
                otp: otpState.otp 
            });
            setOtpState({ ...otpState, isOtpVerified: true });
            setMessage({ type: 'success', text: 'OTP verified! Now set your new password.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Invalid OTP' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('sqool_token');
            const res = await axios.post(`${API_BASE}/auth/update-profile`, data.user, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.setItem('sqool_user_name', res.data.user.name);
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateInstitution = async (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('sqool_token');
            const res = await axios.post(`${API_BASE}/auth/update-institution`, data.institution, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.setItem('sqool_institution_name', res.data.institution.name);
            localStorage.setItem('sqool_institution_logo', res.data.institution.logo_url || '');
            setMessage({ type: 'success', text: 'Institution info updated successfully' });
            // Refresh page to show new logo in sidebar
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (limit to 1MB for base64)
        if (file.size > 1024 * 1024) {
            return setMessage({ type: 'error', text: 'Image size should be less than 1MB' });
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setData({
                ...data,
                institution: { ...data.institution, logo_url: base64String }
            });
            // Auto save logo
            setMessage({ type: 'success', text: 'Logo selected. Click "Update Records" to save.' });
        };
        reader.readAsDataURL(file);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMessage({ type: 'error', text: 'New passwords do not match' });
        }
        setIsSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('sqool_token');
            await axios.post(`${API_BASE}/auth/change-password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Password changed successfully' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to change password' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetWithOtp = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMessage({ type: 'error', text: 'New passwords do not match' });
        }
        setIsSaving(true);
        try {
            await axios.post(`${API_BASE}/auth/reset-password`, {
                identifier: data.user.email,
                otp: otpState.otp,
                newPassword: passwords.newPassword
            });
            setMessage({ type: 'success', text: 'Password reset successfully with OTP!' });
            setOtpState({ isOtpMode: false, otp: '', isOtpSent: false, isOtpVerified: false });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Reset failed' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
                <p className="text-slate-500">Manage your personal and institution account details</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 border ${
                    message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-2xl w-fit">
                <button 
                    onClick={() => setActiveTab('account')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        activeTab === 'account' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <User size={18} /> Account Info
                </button>
                <button 
                    onClick={() => setActiveTab('institution')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        activeTab === 'institution' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <Building size={18} /> Institution Details
                </button>
                <button 
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        activeTab === 'security' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <Shield size={18} /> Security
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
                {activeTab === 'account' && (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={data.user.name}
                                        onChange={(e) => setData({...data, user: {...data.user, name: e.target.value}})}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address (Read-only)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="email" 
                                        value={data.user.email} 
                                        readOnly
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="tel" 
                                        value={data.user.phone || ''}
                                        onChange={(e) => setData({...data, user: {...data.user, phone: e.target.value}})}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'institution' && (
                    <div className="space-y-8">
                        {/* Logo Section */}
                        <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <div className="relative group cursor-pointer" onClick={() => document.getElementById('logo-input').click()}>
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white flex items-center justify-center">
                                    {data.institution.logo_url ? (
                                        <img src={data.institution.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Building className="text-slate-300" size={40} />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                    <ImageIcon className="text-white" size={24} />
                                </div>
                                <input 
                                    id="logo-input"
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoUpload}
                                />
                            </div>
                            <div className="text-center mt-3">
                                <h3 className="font-bold text-slate-800 text-sm">Institution Logo</h3>
                                <p className="text-xs text-slate-500">Click image to upload (JPEG, PNG, max 1MB)</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateInstitution} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Institution Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            value={data.institution.name}
                                            onChange={(e) => setData({...data, institution: {...data.institution, name: e.target.value}})}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Subdomain (Read-only)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            value={data.institution.subdomain}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="tel" 
                                            value={data.institution.phone || ''}
                                            onChange={(e) => setData({...data, institution: {...data.institution, phone: e.target.value}})}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Official Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="email" 
                                            value={data.institution.email || ''}
                                            onChange={(e) => setData({...data, institution: {...data.institution, email: e.target.value}})}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Campus Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                                    <textarea 
                                        rows="3"
                                        value={data.institution.address || ''}
                                        onChange={(e) => setData({...data, institution: {...data.institution, address: e.target.value}})}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 text-center">
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50"
                                >
                                    <Save size={18} /> {isSaving ? 'Updating...' : 'Update Institution Records'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-slate-800">Password Settings</h2>
                            <button 
                                onClick={() => {
                                    setOtpState({...otpState, isOtpMode: !otpState.isOtpMode});
                                    setMessage(null);
                                }}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700"
                            >
                                {otpState.isOtpMode ? 'Use Current Password' : 'Reset via OTP?'}
                            </button>
                        </div>

                        {!otpState.isOtpMode ? (
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="password" 
                                                value={passwords.currentPassword}
                                                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="password" 
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="password" 
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-black/20 disabled:opacity-50"
                                    >
                                        <Shield size={18} /> {isSaving ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {!otpState.isOtpSent ? (
                                    <div className="text-center p-8 bg-blue-50 rounded-2xl border border-blue-100 italic">
                                        <p className="text-blue-700 text-sm mb-4">We will send a 6-digit OTP to your registered email <b>{data.user.email}</b></p>
                                        <button 
                                            onClick={handleRequestOtp}
                                            disabled={isSaving}
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Send OTP
                                        </button>
                                    </div>
                                ) : !otpState.isOtpVerified ? (
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Enter 6-Digit OTP</label>
                                            <input 
                                                type="text" 
                                                placeholder="000000"
                                                maxLength="6"
                                                value={otpState.otp}
                                                onChange={(e) => setOtpState({...otpState, otp: e.target.value})}
                                                className="w-full text-center px-4 py-4 text-2xl font-black tracking-[0.5em] rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleVerifyOtp}
                                            disabled={isSaving || otpState.otp.length < 6}
                                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Verify OTP
                                        </button>
                                        <button onClick={handleRequestOtp} className="w-full text-xs font-bold text-slate-500 hover:text-blue-600">Resend OTP</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleResetWithOtp} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                            <input 
                                                type="password" 
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            Reset Password
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
