import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PenTool, CheckCircle, FileText, Download, Trash2 } from 'lucide-react';
import AssignmentForm from '../../components/academic/AssignmentForm';

const API_BASE = 'http://localhost:5002/api/academic/assignments';
const CLASSES_API = 'http://localhost:5002/api/academic/classes';
const SUBJECTS_API = 'http://localhost:5002/api/academic/subjects';
const TEACHERS_API = 'http://localhost:5002/api/teachers';

const AssignmentCenterPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [meta, setMeta] = useState({ classes: [], subjects: [], teachers: [] });
  const [showModal, setShowModal] = useState(false);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [aRes, cRes, sRes, tRes] = await Promise.all([
        axios.get(`${API_BASE}?institution_id=${institutionId}`),
        axios.get(`${CLASSES_API}?institution_id=${institutionId}`),
        axios.get(`${SUBJECTS_API}?institution_id=${institutionId}`),
        axios.get(`${TEACHERS_API}?institution_id=${institutionId}`)
      ]);
      setAssignments(aRes.data);
      setMeta({ classes: cRes.data, subjects: sRes.data, teachers: tRes.data });
    } catch (err) { console.error('Error fetching assignments', err); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete assignment?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Assignment Center</h1>
          <p className="text-slate-500 font-medium">Distribute tasks, collect submissions, and grade work.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all">
          <PenTool size={20}/> New Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {assignments.length === 0 && <p className="text-slate-400 italic">No assignments posted.</p>}
        {assignments.map(a => (
          <div key={a.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
            <button onClick={() => handleDelete(a.id)} className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 bg-rose-50 p-2 rounded-xl"><Trash2 size={16}/></button>
            <div className="bg-amber-50 text-amber-600 w-max px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4">
              Due: {new Date(a.due_date).toLocaleDateString()}
            </div>
            <h2 className="text-xl font-bold text-slate-800 leading-tight mb-2">{a.title}</h2>
            <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{a.description}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-100 mt-auto">
               <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Class {a.classes?.name}</span>
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">{a.subjects?.name}</span>
               </div>
               <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Submissions</span>
                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"><CheckCircle size={14}/> {a._count?.submissions || 0}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AssignmentForm 
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

export default AssignmentCenterPage;

