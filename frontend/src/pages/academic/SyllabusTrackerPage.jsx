import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, CheckCircle2, ChevronDown, Plus, Trash2 } from 'lucide-react';
import SyllabusForm from '../../components/academic/SyllabusForm';

const API_BASE = 'http://localhost:5002/api/academic/syllabus';
const CLASSES_API = 'http://localhost:5002/api/academic/classes';
const SUBJECTS_API = 'http://localhost:5002/api/academic/subjects';

const SyllabusTrackerPage = () => {
  const [syllabusTracks, setSyllabusTracks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [expandedTrack, setExpandedTrack] = useState(null);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sylRes, clsRes, subRes] = await Promise.all([
        axios.get(`${API_BASE}?institution_id=${institutionId}`),
        axios.get(`${CLASSES_API}?institution_id=${institutionId}`),
        axios.get(`${SUBJECTS_API}?institution_id=${institutionId}`)
      ]);
      setSyllabusTracks(sylRes.data);
      setClassesList(clsRes.data);
      setSubjectsList(subRes.data);
    } catch (err) { console.error('Error fetching data', err); }
  };

  const handleTopicToggle = async (topicId, currentStatus) => {
    try {
      await axios.patch(`${API_BASE}/topic/${topicId}`, { completion_status: !currentStatus });
      fetchData();
    } catch (err) { console.error('Error toggling topic status'); }
  };

  const handleDeleteSyllabus = async (id) => {
    if(!window.confirm('Delete this whole syllabus track?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchData();
    } catch (err) { console.error('Error deleting syllabus', err); }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Syllabus Tracker</h1>
          <p className="text-slate-500 font-medium">Track curriculum completion percentage for all classes.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all">
          <Target size={20}/> New Syllabus Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {syllabusTracks.length === 0 && <p className="text-slate-500 italic col-span-2">No syllabus plans created yet.</p>}
         {syllabusTracks.map(s => (
           <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h3 className="text-xl font-black text-slate-800 tracking-tight">{s.subjects?.name}</h3>
                 <p className="text-xs font-black text-slate-500 tracking-widest uppercase mt-1">Class {s.classes?.name} {s.classes?.section}</p>
               </div>
               <div className="flex flex-col items-end gap-2">
                 <button onClick={() => handleDeleteSyllabus(s.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={16}/></button>
                 <div className="flex items-center gap-2">
                   <div className="text-3xl font-black text-indigo-700">{s.progress}%</div>
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">completion<br/>status</div>
                 </div>
               </div>
             </div>
             
             {/* Progress Bar */}
             <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
               <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.progress}%` }}></div>
             </div>

             <div className="space-y-3">
               {s.topics.map(t => (
                 <div key={t.id} className="flex items-center gap-4 group">
                    <button onClick={() => handleTopicToggle(t.id, t.completion_status)} className="flex-shrink-0 focus:outline-none">
                      {t.completion_status ? <CheckCircle2 size={22} className="text-emerald-500" /> : <ChevronDown size={22} className="text-slate-300 group-hover:text-indigo-300" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${t.completion_status ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{t.title}</p>
                      {t.description && <p className="text-xs text-slate-500">{t.description}</p>}
                    </div>
                 </div>
               ))}
             </div>
           </div>
         ))}
      </div>

      {showModal && (
        <SyllabusForm 
          institutionId={institutionId}
          classesList={classesList}
          subjectsList={subjectsList}
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

export default SyllabusTrackerPage;

