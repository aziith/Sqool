import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, UserCog, Mail, Phone, BookOpen, Clock, Activity, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import FacultyOnboardingModal from '../../components/faculty/FacultyOnboardingModal';

const PROFILES_API = 'http://localhost:5002/api/faculty/profiles';

const TeacherDirectoryPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${PROFILES_API}?institution_id=${institutionId}`);
      setTeachers(res.data);
    } catch (err) {
      console.error('Error fetching teachers', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in zoom-in-95 duration-300 text-left">
      <div className="flex justify-between items-end bg-gradient-to-r from-blue-900 to-indigo-900 p-8 rounded-3xl shadow-xl text-white">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Faculty Directory</h1>
          <p className="text-blue-200 font-medium text-lg">Manage teacher profiles, qualifications, and workload.</p>
        </div>
        <button 
           onClick={() => setIsOnboardingOpen(true)}
           className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 rounded-xl shadow-lg hover:scale-105 font-bold transition-all"
        >
          <UserPlus size={20}/> Onboard Faculty
        </button>
      </div>

      <FacultyOnboardingModal 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)} 
        onSuccess={fetchTeachers}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? <p className="text-slate-500 italic p-4">Loading faculty members...</p> : teachers.map(t => (
          <div key={t.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden flex flex-col items-center pt-8 pb-6 px-6 relative group">
             <button className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"><UserCog size={18}/></button>

             {t.role !== 'TEACHER' && (
                <div className="absolute top-4 left-4 px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-widest">
                    {t.role}
                </div>
             )}

             <div className="w-24 h-24 mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-4xl text-indigo-700 font-black shadow-inner overflow-hidden border-4 border-white ring-2 ring-slate-100">
                {t.photo_url ? <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover"/> : (t.name ? t.name.charAt(0) : 'T')}
             </div>
             
             <h3 className="text-xl font-bold text-slate-800 tracking-tight text-center">{t.name}</h3>
             <p className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-4">{t.department || 'General Faculty'}</p>

             <div className="w-full space-y-3 mt-2 text-sm text-slate-600">
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                   <Mail size={16} className="text-slate-400"/>
                   <span className="truncate flex-1 font-medium">{t.email}</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                   <Phone size={16} className="text-slate-400"/>
                   <span className="truncate flex-1 font-medium">{t.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-indigo-100 bg-indigo-50/30">
                   <BookOpen size={16} className="text-indigo-500"/>
                   <span className="truncate flex-1 font-bold text-slate-700">{t.subjects || 'No Subjects Set'}</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                   <MapPin size={16} className="text-slate-400"/>
                   <span className="truncate flex-1 font-medium">{t.address || 'No Address'}</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                   <GraduationCap size={16} className="text-slate-400"/>
                   <span className="truncate flex-1 font-medium">{t.qualification || 'N/A'}</span>
                </div>
             </div>

             <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-100">
                <div className="text-center">
                   <div className="text-indigo-700 mx-auto w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mb-1"><BookOpen size={14}/></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subs</p>
                   <p className="text-lg font-black text-slate-800">{t.subjects_assigned || 0}</p>
                </div>
                <div className="text-center">
                   <div className="text-emerald-600 mx-auto w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-1"><Briefcase size={14}/></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classes</p>
                   <p className="text-lg font-black text-slate-800">{t.classes_assigned || 0}</p>
                </div>
                <div className="text-center">
                   <div className="text-rose-600 mx-auto w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center mb-1"><Clock size={14}/></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hrs/Wk</p>
                   <p className="text-lg font-black text-slate-800">{t.lectures_per_week || 0}</p>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDirectoryPage;

