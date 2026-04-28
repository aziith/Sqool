import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Plus, Trash2, Edit2, AlertCircle, RefreshCw, Users, BookOpen, MapPin, ChevronRight } from 'lucide-react';
import TimetableForm from '../../components/academic/TimetableForm';

const API_BASE = 'http://localhost:5002/api/academic/timetable';
const CLASSES_API = 'http://localhost:5002/api/academic/classes';
const SUBJECTS_API = 'http://localhost:5002/api/academic/subjects';
const TEACHERS_API = 'http://localhost:5002/api/teachers';

const TimetableAdvancedPage = () => {
  const [schedule, setSchedule] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [meta, setMeta] = useState({ subjects: [], teachers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getInstitutionId = () => {
    const fromStorage = localStorage.getItem('sqool_institution_id');
    if (fromStorage && fromStorage !== 'null' && fromStorage !== 'undefined') return parseInt(fromStorage);
    return 3; // Hardcoded fallback for the current user's institution (jain public school)
  };

  const institutionId = getInstitutionId();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchInitData();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchSchedule();
  }, [selectedClass]);

  const fetchInitData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clsRes, subRes, teachRes] = await Promise.allSettled([
        axios.get(`${CLASSES_API}?institution_id=${institutionId}`),
        axios.get(`${SUBJECTS_API}?institution_id=${institutionId}`),
        axios.get(`${TEACHERS_API}?institution_id=${institutionId}`)
      ]);

      let classes = [];
      if (clsRes.status === 'fulfilled') {
        classes = clsRes.value.data;
        setClassesList(classes);
        if (classes.length > 0) setSelectedClass(classes[0].id.toString());
      }

      setMeta({ 
        subjects: subRes.status === 'fulfilled' ? subRes.value.data : [], 
        teachers: teachRes.status === 'fulfilled' ? teachRes.value.data : [] 
      });

      if (classes.length === 0) {
        setError('NO_CLASSES');
      }
    } catch (err) { 
      setError('CONNECTION_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    if (!selectedClass) return;
    try {
      const res = await axios.get(`${API_BASE}?institution_id=${institutionId}&class_id=${selectedClass}`);
      setSchedule(res.data);
    } catch (err) { console.error('Schedule fetch failed:', err); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this period?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchSchedule();
    } catch (err) { alert('Error deleting period'); }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    if (timeStr.includes('T')) {
      return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const [h, m] = timeStr.split(':');
    const dt = new Date();
    dt.setHours(h, m, 0);
    return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (error === 'NO_CLASSES') {
    return (
      <div className="p-12 max-w-4xl mx-auto text-center animate-in fade-in duration-700">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-500 mx-auto mb-8">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic mb-4 caps">SETUP REQUIRED</h2>
          <p className="text-slate-500 font-bold max-w-md mx-auto mb-10">You need to create classes and subjects before you can manage the timetable. It only takes a minute!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group">
               <h3 className="font-black text-slate-800 flex items-center justify-between">Create Classes <ChevronRight className="group-hover:translate-x-1 transition-transform" /></h3>
               <p className="text-xs text-slate-400 font-bold uppercase mt-1">Add class names and sections</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group">
               <h3 className="font-black text-slate-800 flex items-center justify-between">Add Subjects <ChevronRight className="group-hover:translate-x-1 transition-transform" /></h3>
               <p className="text-xs text-slate-400 font-bold uppercase mt-1">Define subjects for each class</p>
            </div>
          </div>
          <button onClick={fetchInitData} className="mt-10 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all">
             Refresh After Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">MASTER TIMETABLE</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1 uppercase">Class: {classesList.find(c => c.id.toString() === selectedClass)?.name || '--'}</p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 ml-1">Change Class</span>
            <select 
              value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="p-3 bg-slate-50 border-none rounded-2xl font-black text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 shadow-sm min-w-[180px]"
            >
              {classesList.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
            </select>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            disabled={!selectedClass || loading} 
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 font-black uppercase tracking-widest text-[11px] transition-all disabled:opacity-50 mt-4 h-fit self-end"
          >
            <Plus size={18}/> Add Period
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing Schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {days.map(day => (
            <div key={day} className="space-y-4">
              <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-between">
                {day}
                <span className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center font-bold">{schedule.filter(s => s.day_of_week === day).length}</span>
              </div>
              <div className="space-y-3">
                {schedule.filter(s => s.day_of_week === day).map(period => (
                  <div key={period.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative group hover:shadow-md hover:border-indigo-200 transition-all border-l-4" style={{borderLeftColor: '#4F46E5'}}>
                    <div className="text-[10px] font-black text-slate-400 flex items-center gap-1 mb-2">
                      <Clock size={10}/> {formatTime(period.start_time)} - {formatTime(period.end_time)}
                    </div>
                    <div className="font-black text-slate-800 tracking-tight leading-tight flex items-center gap-1">
                      <BookOpen size={12} className="text-indigo-400"/> {period.subjects?.name} {period.subjects?.code && <span className="text-[10px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded leading-none ml-1">{period.subjects.code}</span>}
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                      <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Users size={10} className="text-slate-300"/> {period.users?.name || 'Assigned Staff'}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <MapPin size={10} className="text-slate-300"/> Room {period.room_number || 'TBD'}
                      </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => { setEditingPeriod(period); setShowModal(true); }} 
                        className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      >
                        <Edit2 size={12}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(period.id)} 
                        className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={12}/>
                      </button>
                    </div>
                  </div>
                ))}
                {schedule.filter(s => s.day_of_week === day).length === 0 && (
                  <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                    Free Day
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TimetableForm 
          meta={meta}
          classesList={classesList}
          selectedClass={selectedClass}
          days={days}
          editingPeriod={editingPeriod}
          onClose={() => { setShowModal(false); setEditingPeriod(null); }}
          onSuccess={() => {
            setShowModal(false);
            setEditingPeriod(null);
            fetchSchedule();
          }}
        />
      )}
    </div>
  );
};

export default TimetableAdvancedPage;
