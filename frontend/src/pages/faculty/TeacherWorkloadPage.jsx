import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Clock, Plus, Trash2, XCircle } from 'lucide-react';
import TimetableForm from '../../components/academic/TimetableForm';

const API_BASE = 'http://localhost:5002/api/faculty';
const ACADEMIC_BASE = 'http://localhost:5002/api/academic';

const TeacherWorkloadPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [meta, setMeta] = useState({ subjects: [], classes: [] });
  const [loading, setLoading] = useState(true);
  
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [formData, setFormData] = useState({ subject_id: '', class_id: '' });

  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, aRes, sRes, cRes] = await Promise.all([
        axios.get(`${API_BASE}/profiles?institution_id=${institutionId}`),
        axios.get(`${API_BASE}/assignments?institution_id=${institutionId}`),
        axios.get(`${ACADEMIC_BASE}/subjects?institution_id=${institutionId}`),
        axios.get(`${ACADEMIC_BASE}/classes?institution_id=${institutionId}`)
      ]);
      setTeachers(tRes.data);
      setAssignments(aRes.data);
      setMeta({ subjects: sRes.data, classes: cRes.data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/assignments`, {
        ...formData,
        institution_id: institutionId,
        teacher_id: selectedTeacherId
      });
      setShowSubjectModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error assigning subject');
    }
  };

  const removeAssignment = async (id) => {
    if(!window.confirm('Remove this assigned subject from the teacher?')) return;
    try {
      await axios.delete(`${API_BASE}/assignments/${id}`);
      fetchData();
    } catch (err) { 
        console.error(err);
        alert('Error removing assignment'); 
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in zoom-in-95 duration-300 text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Faculty Workload</h1>
          <p className="text-slate-500 font-medium mt-1">Assign subjects, classes, and manage timetables.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {loading ? <p className="text-slate-500 italic">Loading...</p> : teachers.map(t => {
            const tAssigned = assignments.filter(a => a.teacher_id === t.id);
            return (
              <div key={t.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col hover:shadow-xl transition-all h-full relative group">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-black text-xl">
                      {t.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800 tracking-tight leading-tight">{t.name}</h3>
                      <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{t.department || 'Faculty'}</p>
                   </div>
                </div>

                <div className="flex-1 space-y-3 mb-6">
                   <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400">Assigned Subjects ({tAssigned.length})</h4>
                   {tAssigned.length === 0 ? <p className="text-xs text-slate-400 italic">No subjects assigned.</p> : (
                      <div className="space-y-2">
                         {tAssigned.map(a => (
                            <div key={a.id} className="flex justify-between items-center bg-slate-50 p-2 px-3 rounded-lg text-xs font-bold text-slate-700">
                               <span>{a.subjects?.name} • Class {a.classes?.name}</span>
                               <button onClick={() => removeAssignment(a.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={14}/></button>
                            </div>
                         ))}
                      </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                   <button 
                     onClick={() => { setSelectedTeacherId(t.id); setShowSubjectModal(true); }}
                     className="py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors flex justify-center items-center gap-1"
                   >
                      <Plus size={14}/> Subject
                   </button>
                   <button 
                     onClick={() => { setShowTimetableModal(true); }}
                     className="py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors flex justify-center items-center gap-1"
                   >
                      <Clock size={14}/> Timetable
                   </button>
                </div>
              </div>
            );
         })}
      </div>

      {showTimetableModal && (
         <TimetableForm 
           institutionId={institutionId}
           classesList={meta.classes}
           subjectsList={meta.subjects}
           teachersList={teachers.map(t => ({ user_id: t.id, users: { name: t.name } }))}
           onClose={() => setShowTimetableModal(false)}
           onSuccess={() => {
             setShowTimetableModal(false);
             fetchData();
           }}
         />
      )}

      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between bg-indigo-600 text-white font-black italic tracking-tighter text-xl">
              ASSIGN SUBJECT
              <button onClick={() => setShowSubjectModal(false)}><XCircle size={24}/></button>
            </div>
            <form onSubmit={handleAssignSubmit} className="p-8 space-y-4">
              <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Subject</label>
                 <select required value={formData.subject_id} onChange={e => setFormData({...formData, subject_id: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border-none focus:ring-2 text-slate-700">
                   <option value="">Choose subject...</option>
                   {meta.subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                 </select>
              </div>
              <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Class</label>
                 <select required value={formData.class_id} onChange={e => setFormData({...formData, class_id: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border-none focus:ring-2 text-slate-700">
                   <option value="">Choose class...</option>
                   {meta.classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
                 </select>
              </div>
              <button type="submit" className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all">
                Create Assignment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherWorkloadPage;

