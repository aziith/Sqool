import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import SubjectForm from '../../components/academic/SubjectForm';

const API_BASE = 'http://localhost:5002/api/academics/subjects';
const CLASSES_API = 'http://localhost:5002/api/academics/classes';

const SubjectManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subsRes, clsRes] = await Promise.all([
        axios.get(`${API_BASE}?institution_id=${institutionId}`),
        axios.get(`${CLASSES_API}?institution_id=${institutionId}`)
      ]);
      setSubjects(subsRes.data);
      setClassesList(clsRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete subject?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchData();
    } catch (err) { alert('Error deleting subject'); }
  };

  const handleAddSubject = (classId) => {
    setEditingSubject(null);
    setSelectedClassId(classId);
    setShowModal(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSelectedClassId(subject.class_id);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Curriculum Subjects</h1>
          <p className="text-slate-500 font-medium">Manage subject mappings across different grades.</p>
        </div>
        <button onClick={() => handleAddSubject('')} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all">
          <Plus size={20} /> Register General Subject
        </button>
      </div>

      <div className="space-y-12">
        {loading ? (
            <div className="py-20 text-center font-bold text-slate-400 animate-pulse">Mapping Curriculum...</div>
        ) : classesList.map(cls => (
            <section key={cls.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                            {cls.name.replace(/\D/g, '') || cls.name.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{cls.name} <span className="text-slate-400 font-medium ml-2">Section {cls.section}</span></h2>
                    </div>
                    <button 
                        onClick={() => handleAddSubject(cls.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Plus size={14} /> Add Subject to {cls.name}
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subjects.filter(s => s.class_id === cls.id).length === 0 ? (
                        <div className="col-span-full py-6 text-center text-slate-400 text-sm font-medium italic border-2 border-dashed border-slate-50 rounded-2xl">
                            No subjects mapped to this class yet.
                        </div>
                    ) : (
                        subjects.filter(s => s.class_id === cls.id).map(s => (
                            <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                                <div className="p-5 flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><BookOpen size={20} /></div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-800 leading-tight">{s.name}</h3>
                                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{s.code || 'NO-CODE'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleEditSubject(s)} className="p-1 px-2 text-indigo-500 hover:bg-indigo-50 rounded-lg text-[10px] font-black uppercase tracking-tighter">Edit</button>
                                        <button onClick={() => handleDelete(s.id)} className="text-rose-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                    <span>MAX Marks: {s.max_marks}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        ))}
      </div>

      {showModal && (
        <SubjectForm
          institutionId={institutionId}
          classesList={classesList}
          initialClassId={selectedClassId}
          initialData={editingSubject}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default SubjectManagementPage;
