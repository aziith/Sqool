import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, GraduationCap, Plus, Download, Filter, MoreHorizontal, User, Mail, Phone, Calendar as CalendarIcon, MapPin, Edit3, Trash, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const API_BASE = 'http://localhost:5002/api';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [importing, setImporting] = useState(false);
    const [toast, setToast] = useState(null); // For "Next Level" notifications
    const fileInputRef = useRef(null);
    const institutionId = localStorage.getItem('sqool_institution_id') || 1;

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('sqool_token');
            const res = await axios.get(`${API_BASE}/students?institution_id=${institutionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Smart field matcher
    const getVal = (row, possibilities) => {
        const keys = Object.keys(row);
        const found = keys.find(k => 
            possibilities.some(p => k.toLowerCase().trim().replace(/[\s\-_]/g, '') === p.toLowerCase().replace(/[\s\-_]/g, ''))
        );
        return found ? row[found] : null;
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImporting(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Map fields flexibly with smart detection
                const studentsToImport = jsonData.map(row => ({
                    name: getVal(row, ['name', 'fullname', 'studentname', 'scholarname', 'applicantname']),
                    email: getVal(row, ['email', 'emailid', 'emailaddress', 'mail']),
                    phone: getVal(row, ['phone', 'phonenumber', 'contact', 'mobile']),
                    class_name: getVal(row, ['class', 'classname', 'grade', 'specialization', 'course']),
                    section: getVal(row, ['section', 'sec']),
                    dob: getVal(row, ['dob', 'dateofbirth', 'birthdate', 'dob_date'])
                })).filter(s => s.name && s.email);

                if (studentsToImport.length === 0) {
                    alert('No valid student records found. Ensure headers contain "name" and "email" (e.g. Student Name, Email Address)');
                    return;
                }

                const token = localStorage.getItem('sqool_token');
                const res = await axios.post(`${API_BASE}/students/bulk`, { 
                    students: studentsToImport, 
                    institution_id: institutionId 
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const { importedCount, linkedCount, failedCount, errors } = res.data;
                
                if (failedCount > 0) {
                    const failList = errors.slice(0, 3).map(e => `${e.name || e.email}: ${e.error}`).join('\n');
                    alert(`Import Partial Success:\n✅ ${importedCount} Added\n🔗 ${linkedCount || 0} Already Registered (Linked Successfully)\n❌ ${failedCount} Failed\n\nErrors (first 3):\n${failList}${errors.length > 3 ? '\n...' : ''}`);
                } else {
                    showToast(`Success: ${importedCount} Added, ${linkedCount || 0} Linked!`);
                }

                setImporting(false); 
                fetchStudents();
            } catch (err) {
                setImporting(false);
                alert('Import failed: ' + (err.response?.data?.error || err.message));
            } finally {
                e.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filtered);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
        XLSX.writeFile(workbook, `Students_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this scholar?");
        if (!confirmDelete) return;

        try {
            // Optimistic UI update: Remove instantly for "Next Level" UX
            setStudents(prev => prev.filter(s => s.id !== id));
            
            const token = localStorage.getItem('sqool_token');
            await axios.delete(`${API_BASE}/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('Student deleted successfully!');
        } catch (error) {
            console.error("Delete error:", error);
            showToast('Delete failed. Please retry.', 'error');
            fetchStudents(); // Rollback if failed
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('WARNING: THIS WILL DELETE ALL STUDENT DATA PERMANENTLY. Proceed?')) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('sqool_token');
            await axios.delete(`${API_BASE}/students/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('Student database wiped clean!');
            fetchStudents();
        } catch (err) {
            showToast('Bulk clear failed.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.enrollment_number?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500 relative">
            {/* "Next Level" Toast System */}
            {toast && (
                <div className={`fixed top-8 right-8 z-[100] px-8 py-5 rounded-[24px] shadow-2xl border-2 backdrop-blur-xl animate-in slide-in-from-top-12 duration-500 fill-mode-both flex items-center gap-4 ${
                    toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-rose-500/90 border-rose-400 text-white'
                }`}>
                    <div className="p-2 bg-white/20 rounded-full">
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div>
                        <div className="font-black uppercase tracking-widest text-[10px] opacity-70">System Message</div>
                        <div className="font-black text-sm tracking-tight">{toast.message}</div>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Student Directory</h1>
                        <p className="text-slate-400 text-sm font-medium">Access and manage comprehensive student profiles.</p>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".csv,.xlsx,.xls" 
                        onChange={handleImport}
                    />
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        disabled={importing}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm shadow-sm"
                    >
                        {importing ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <Upload size={18} />}
                        Import
                    </button>
                    <button 
                        onClick={handleExport}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm shadow-sm"
                    >
                        <Download size={18} /> Export
                    </button>
                    <button 
                        onClick={handleClearAll}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition-all text-sm shadow-sm"
                    >
                        Clear All Data
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100">
                        <Plus size={18} /> Add Student
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4">
                    <div className="relative group w-full md:w-80">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Find by name or enrollment ID..." 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl border-none text-sm outline-none focus:ring-2 ring-indigo-500/20 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <button className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Filter size={18} /></button>
                        <button className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><MoreHorizontal size={18} /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">R.No</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 tracking-widest">Student Information</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 tracking-widest">Academic Context</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">Fees</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold italic bg-slate-50/30">Syncing directory...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold italic bg-slate-50/30">No matching scholars found.</td></tr>
                            ) : filtered.map((s, idx) => (
                                <tr key={s.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                    <td className="px-6 py-5 text-center">
                                       <span className="text-slate-400 font-mono text-xs">{s.roll_number?.toString().padStart(2, '0') || '—'}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 p-0.5 group-hover:scale-110 transition-transform">
                                                <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl tracking-tighter">
                                                    {s.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 text-sm">{s.name}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{s.enrollment_number}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-600 italic">
                                                {s.class_name} — {s.section}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                                <CalendarIcon size={12}/> {s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-wider shadow-sm transition-all ${
                                            idx % 3 === 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-500 group-hover:text-white'
                                        }`}>
                                            {idx % 3 === 0 ? 'PAID' : 'UNPAID'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                            <button className="p-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"><Edit3 size={16}/></button>
                                            <button 
                                                onClick={() => handleDelete(s.id)}
                                                className="p-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl hover:text-rose-600 hover:border-rose-200 shadow-sm transition-all"
                                            >
                                                <Trash size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {filtered.length} active enrollments</p>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map(page => (
                            <button key={page} className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                                page === 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-600 hover:bg-indigo-50 border border-slate-100 outline-none'
                            }`}>{page}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentsPage;

