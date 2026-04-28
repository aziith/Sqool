import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Users, Trash2, BookOpen } from 'lucide-react';
import ClassForm from '../../components/academic/ClassForm';
import SubjectForm from '../../components/academic/SubjectForm';

const API_BASE = 'http://localhost:5002/api/academics/classes';

const SUBJECTS_API = 'http://localhost:5002/api/academics/subjects';

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [clsRes, subsRes] = await Promise.all([
        axios.get(`${API_BASE}?institution_id=${institutionId}`),
        axios.get(`${SUBJECTS_API}?institution_id=${institutionId}`)
      ]);
      setClasses(clsRes.data);
      setSubjects(subsRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete class?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchData();
    } catch (err) { alert('Error deleting class'); }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setShowClassModal(true);
  };

  const handleAddClass = () => {
    setEditingClass(null);
    setShowClassModal(true);
  };

  const handleAddSubject = (classId) => {
    setSelectedClassId(classId);
    setShowSubjectModal(true);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Class Setup</h1>
          <p className="text-slate-500 font-medium">Manage classes, sections, and capacities.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleAddSubject('')} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Plus size={18} /> New Subject
          </button>
          <button onClick={handleAddClass} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all">
            <Plus size={20} /> New Class
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? <p>Loading...</p> : classes.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:border-indigo-100 transition-all">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-xl">
                  {c.name.replace(/\D/g, '') || c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 leading-none">{c.name}</h3>
                  <span className="text-xs font-black text-slate-400 tracking-widest uppercase">Section {c.section || 'N/A'}</span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                <button onClick={() => handleEdit(c)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg text-xs font-black uppercase tracking-tighter">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Class Teacher</span>
                <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">{c.teacher_name || 'Not Assigned'}</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Home Room</span>
                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{c.room_number || 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center mt-3 pb-3 border-b border-slate-50">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Capacity / Strength</span>
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1"><Users size={14} /> {c.student_count || 0} / {c.capacity}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Subjects</span>
                  <button onClick={() => handleAddSubject(c.id)} className="text-[10px] font-bold text-indigo-600 hover:underline">+ Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.filter(s => s.class_id === c.id).length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic">No subjects yet</span>
                  ) : (
                    subjects.filter(s => s.class_id === c.id).map(s => (
                      <span key={s.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                        <BookOpen size={10} /> {s.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showClassModal && (
        <ClassForm
          institutionId={institutionId}
          initialData={editingClass}
          onClose={() => setShowClassModal(false)}
          onSuccess={() => {
            setShowClassModal(false);
            fetchData();
          }}
        />
      )}

      {showSubjectModal && (
        <SubjectForm
          institutionId={institutionId}
          classesList={classes}
          initialClassId={selectedClassId}
          onClose={() => setShowSubjectModal(false)}
          onSuccess={() => {
            setShowSubjectModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default ClassManagementPage;
