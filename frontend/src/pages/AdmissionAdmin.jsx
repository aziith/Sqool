import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, GraduationCap, Plus, Download, Filter, MoreHorizontal, User, Mail, Phone, Calendar as CalendarIcon, Edit3, Trash, Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const API_BASE = 'http://localhost:5002/api';

const AdmissionAdmin = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const fetchAdmissions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('sqool_token');
            const res = await axios.get(`${API_BASE}/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmissions(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePaid = async (id) => {
        if (!window.confirm('Are you sure you want to mark this applicant as PAID and move to Student Directory?')) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('sqool_token');
            await axios.post(`${API_BASE}/mark-paid/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Student moved successfully!');
            fetchAdmissions();
        } catch (err) {
            console.error('Payment error:', err);
            alert('Failed to process payment.');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImporting(true);
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                const getVal = (row, possibilities) => {
                    const keys = Object.keys(row);
                    const key = keys.find(k => possibilities.includes(k.toLowerCase().replace(/\s/g, '')));
                    return key ? row[key] : null;
                };

                const records = data.map(row => ({
                    name: getVal(row, ['name', 'studentname', 'fullname']),
                    email: getVal(row, ['email', 'emailaddress']) || `temp_${Date.now()}@school.com`,
                    phone: getVal(row, ['phone', 'mobile', 'contact']) || '0000000000',
                    course: getVal(row, ['class', 'course', 'appliedfor']) || 'N/A',
                    dob: getVal(row, ['dob', 'dateofbirth']) || '2010-01-01',
                    gender: getVal(row, ['gender', 'sex']) || 'M',
                    class_applied: getVal(row, ['class', 'standard']) || 'N/A'
                })).filter(r => r.name);

                for (const record of records) {
                    const token = localStorage.getItem('sqool_token');
                    await axios.post(`${API_BASE}/admissions`, record, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }

                alert(`Successfully imported ${records.length} applications!`);
                fetchAdmissions();
            } catch (err) {
                console.error('Import error:', err);
                alert('Failed to import records.');
            } finally {
                setImporting(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleClearAll = async () => {
        if (!window.confirm('Delete ALL admission applications?')) return;
        try {
            const token = localStorage.getItem('sqool_token');
            await axios.delete(`${API_BASE}/admissions-all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAdmissions();
        } catch (err) {
            alert('Clear failed.');
        }
    };

    const filtered = admissions.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.application_no?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-10 space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-indigo-600 rounded-[32px] text-white shadow-2xl shadow-indigo-100 rotate-3 hover:rotate-0 transition-transform">
                        <GraduationCap size={44} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter">Admission Pipeline</h1>
                        <p className="text-slate-400 text-sm font-black uppercase tracking-widest leading-loose">Manage incoming scholar applications.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <input type="file" id="import-excel" className="hidden" onChange={handleImport} accept=".xlsx, .xls, .csv" />
                    <button 
                        onClick={() => document.getElementById('import-excel').click()}
                        disabled={importing}
                        className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-slate-100 rounded-[24px] font-black uppercase tracking-widest text-xs text-slate-600 hover:bg-slate-50 transition-all shadow-xl shadow-slate-100"
                    >
                        {importing ? 'Syncing...' : <Upload size={18} />} Import XLSX
                    </button>
                    <button 
                        onClick={handleClearAll}
                        className="px-8 py-5 bg-red-50 text-red-500 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-50/50"
                    >
                        Clear Pipeline
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[48px] border-4 border-slate-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-10 border-b-2 border-slate-50 bg-slate-50/30 flex items-center justify-between flex-wrap gap-8">
                    <div className="relative group w-full md:w-[450px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="SEARCH BY NAME OR APPLICATION ID..." 
                            className="w-full pl-16 pr-8 py-6 bg-white rounded-[24px] border-none text-xs font-black uppercase tracking-widest outline-none shadow-sm focus:ring-4 ring-indigo-500/10 transition-all placeholder:text-slate-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Applicant Information</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Academic Target</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Admission Code</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="4" className="px-10 py-32 text-center text-slate-400 font-black uppercase tracking-[0.3em] bg-slate-50/20 italic">Scanning pipeline...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="4" className="px-10 py-32 text-center text-slate-400 font-black uppercase tracking-[0.3em] bg-slate-50/20 italic">No applications found.</td></tr>
                            ) : filtered.map((s) => (
                                <tr key={s.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl italic tracking-tighter uppercase shadow-sm group-hover:-rotate-6 transition-transform">
                                                {s.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 text-sm italic uppercase tracking-tight">{s.name}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-loose">{s.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1">
                                            <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg w-fit italic">
                                                {s.course}
                                            </div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">CLASS: {s.class || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="font-mono text-xs font-black text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">{s.application_no}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handlePaid(s.id)}
                                                className="px-5 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-50"
                                            >
                                                Mark Paid
                                            </button>
                                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><MoreHorizontal size={18} /></button>
                                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-white transition-all"><Trash size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdmissionAdmin;
