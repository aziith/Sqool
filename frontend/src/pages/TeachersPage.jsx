import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Mail, Phone, MapPin, Briefcase, GraduationCap, Plus, Trash2, ShieldCheck, ChevronRight } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;
  const userId = localStorage.getItem('sqool_user_id'); // Added this line

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/teachers?institution_id=${institutionId}`);
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete faculty record?')) return;
    try {
      await axios.delete(`${API_BASE}/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      alert('Error deleting teacher');
    }
  };

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Faculty Management</h1>
        <div className="h-1.5 w-24 bg-indigo-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <button className="h-[430px] rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group">
           <div className="p-5 bg-slate-50 rounded-full group-hover:bg-indigo-100 transition-colors">
              <Plus size={32} />
           </div>
           <span className="font-black uppercase tracking-widest text-sm">Onboard Faculty</span>
        </button>

        {loading ? (
          <div className="col-span-3 py-20 text-center text-slate-300 font-black tracking-widest uppercase italic">Initializing Faculty Registry...</div>
        ) : teachers.map(t => (
          <div key={t.id} className="relative bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 flex flex-col items-center group overflow-hidden border border-slate-100 hover:-translate-y-2 transition-all duration-500">
             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(t.id)}
                  className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                   <Trash2 size={18} />
                </button>
             </div>
             
             <div className="relative mb-8">
                <div className="w-32 h-32 rounded-[48px] bg-slate-50 border-8 border-white shadow-inner flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-indigo-800 flex items-center justify-center text-white font-black text-4xl">
                      {t.name.charAt(0)}
                   </div>
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-2xl border-4 border-white text-white shadow-lg">
                   <ShieldCheck size={18} />
                </div>
             </div>

             <div className="text-center space-y-1 mb-6">
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{t.name}</h3>
                <p className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.2em]">{t.department || 'General Education'}</p>
             </div>

             <div className="w-full space-y-4 mb-8">
                <div className="flex items-center gap-4 group/item">
                   <div className="p-3 bg-slate-50 rounded-2xl group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-colors">
                      <GraduationCap size={16} />
                   </div>
                   <div className="text-left">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Qualification</div>
                      <div className="text-xs font-bold text-slate-700">{t.qualification || 'M.A., Ph.D'}</div>
                   </div>
                </div>
                <div className="flex items-center gap-4 group/item">
                   <div className="p-3 bg-slate-50 rounded-2xl group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-colors text-slate-500">
                      <Briefcase size={16} />
                   </div>
                   <div className="text-left">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">ID Code</div>
                      <div className="text-xs font-bold text-slate-700 tracking-widest">{t.employee_id}</div>
                   </div>
                </div>
             </div>

             <button className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2">
                Full Profile <ChevronRight size={14} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;

