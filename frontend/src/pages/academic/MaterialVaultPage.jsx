import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Film, Link as LinkIcon, Download, ExternalLink, Plus, Trash2 } from 'lucide-react';
import MaterialForm from '../../components/academic/MaterialForm';

const API_BASE = 'http://localhost:5002/api/academic/materials';
const CLASSES_API = 'http://localhost:5002/api/academic/classes';
const SUBJECTS_API = 'http://localhost:5002/api/academic/subjects';

const MaterialVaultPage = () => {
  const [materials, setMaterials] = useState([]);
  const [meta, setMeta] = useState({ classes: [], subjects: [], teachers: [] });
  const [showModal, setShowModal] = useState(false);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [mRes, cRes, sRes] = await Promise.all([
        axios.get(`${API_BASE}?institution_id=${institutionId}`),
        axios.get(`${CLASSES_API}?institution_id=${institutionId}`),
        axios.get(`${SUBJECTS_API}?institution_id=${institutionId}`)
      ]);
      setMaterials(mRes.data);
      setMeta({ classes: cRes.data, subjects: sRes.data, teachers: [] });
    } catch (err) { console.error('Error fetching materials', err); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this resource?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const IconMap = {
    'DOC': <FileText size={32} className="text-blue-500" />,
    'PDF': <FileText size={32} className="text-rose-500" />,
    'VIDEO': <Film size={32} className="text-purple-500" />,
    'LINK': <LinkIcon size={32} className="text-emerald-500" />
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Material Vault</h1>
          <p className="text-slate-500 font-medium">Digital repository for study materials and notes.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all">
          <Plus size={20}/> Upload Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {materials.length === 0 && <p className="text-slate-400 italic font-medium col-span-full">No materials uploaded yet.</p>}
        {materials.map(m => (
          <div key={m.id} className="bg-white border text-left border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative group flex flex-col h-full">
            <button onClick={() => handleDelete(m.id)} className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
            <div className="mb-4">
              {IconMap[m.file_type]}
            </div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight mb-1">{m.title}</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{m.subjects?.name} • Class {m.classes?.name}</p>
            
            <div className="mt-4 flex-grow">
              <p className="text-sm text-slate-500">{m.description || 'No description provided.'}</p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 text-center bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 text-sm">
                 <ExternalLink size={16}/> Access Resource
              </a>
              <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <Download size={20}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <MaterialForm 
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

export default MaterialVaultPage;

