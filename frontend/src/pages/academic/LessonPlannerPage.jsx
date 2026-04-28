import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import LessonPlanForm from '../../components/academic/LessonPlanForm';

const API_BASE = 'http://localhost:5002/api/academic/lessons';
const CLASSES_API = 'http://localhost:5002/api/academic/classes';
const SUBJECTS_API = 'http://localhost:5002/api/academic/subjects';
const TEACHERS_API = 'http://localhost:5002/api/teachers';

const LessonPlannerPage = () => {
  const [plans, setPlans] = useState([]);
  const [meta, setMeta] = useState({ classes: [], subjects: [], teachers: [] });
  const [showModal, setShowModal] = useState(false);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lRes, cRes, sRes, tRes] = await Promise.all([
        axios.get(`${API_BASE}?institution_id=${institutionId}`),
        axios.get(`${CLASSES_API}?institution_id=${institutionId}`),
        axios.get(`${SUBJECTS_API}?institution_id=${institutionId}`),
        axios.get(`${TEACHERS_API}?institution_id=${institutionId}`)
      ]);
      setPlans(lRes.data);
      setMeta({ classes: cRes.data, subjects: sRes.data, teachers: tRes.data });
    } catch (err) { console.error('Error fetching plans', err); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete lesson plan?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daily Lesson Planner</h1>
          <p className="text-slate-500 font-medium">Coordinate and log daily teaching activities.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all">
          <Plus size={20}/> Add New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 && <p className="text-slate-400 italic">No lesson plans found.</p>}
        {plans.map(lp => (
          <div key={lp.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative group">
             <button onClick={() => handleDelete(lp.id)} className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
             <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-3">
               <BookOpen size={14}/> {new Date(lp.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
             </div>
             <h2 className="text-xl font-bold text-slate-800 leading-tight mb-1">{lp.topic}</h2>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{lp.subject?.name} • Class {lp.class?.name}</p>
             
             <div className="mt-5 space-y-3">
               <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                 <div>
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Homework Assigned</span>
                   <span className="text-sm font-semibold text-slate-700">{lp.homework || 'None'}</span>
                 </div>
               </div>
               {lp.materials_used && (
                 <div className="text-xs font-medium text-slate-500 italic">
                   Materials: {lp.materials_used}
                 </div>
               )}
             </div>
          </div>
        ))}
      </div>
      {showModal && (
        <LessonPlanForm 
          institutionId={institutionId}
          classesList={meta.classes}
          subjectsList={meta.subjects}
          teachersList={meta.teachers}
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

export default LessonPlannerPage;

