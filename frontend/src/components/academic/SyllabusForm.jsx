import React, { useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api/academic/syllabus';

const SyllabusForm = ({ onClose, onSuccess, classesList, subjectsList, institutionId }) => {
  const [formData, setFormData] = useState({ class_id: '', subject_id: '', topics: [{ title: '', description: '' }] });
  const [loading, setLoading] = useState(false);

  const handleAddTopicRow = () => {
    setFormData({ ...formData, topics: [...formData.topics, { title: '', description: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_BASE, { ...formData, institution_id: institutionId });
      onSuccess();
    } catch (err) {
      alert('Error creating syllabus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex justify-between bg-indigo-600 text-white font-black italic tracking-tighter text-xl">
          CREATE SYLLABUS PLAN
          <button onClick={onClose} className="hover:text-indigo-200 transition-colors"><Trash2 size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Class</label>
                <select required value={formData.class_id} onChange={e => setFormData({...formData, class_id: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none font-bold text-slate-900">
                  <option value="">Select...</option>
                  {classesList.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Subject</label>
                <select required value={formData.subject_id} onChange={e => setFormData({...formData, subject_id: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none font-bold text-slate-900">
                  <option value="">Select...</option>
                  {subjectsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase">Topics Breakdown</h4>
                <button type="button" onClick={handleAddTopicRow} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add Row</button>
              </div>
              {formData.topics.map((t, idx) => (
                <div key={idx} className="flex gap-3">
                  <input type="text" required placeholder={`Topic ${idx + 1}`} value={t.title} onChange={e => { const newT = [...formData.topics]; newT[idx].title = e.target.value; setFormData({...formData, topics: newT}); }} className="flex-1 p-3 bg-slate-50 border-none rounded-xl font-bold text-sm text-slate-900 outline-none focus:ring-2 placeholder:text-slate-300"/>
                  <input type="text" placeholder="Description (Optional)" value={t.description} onChange={e => { const newT = [...formData.topics]; newT[idx].description = e.target.value; setFormData({...formData, topics: newT}); }} className="flex-1 p-3 bg-slate-50 border-none rounded-xl font-medium text-sm text-slate-900 outline-none focus:ring-2 placeholder:text-slate-300"/>
                </div>
              ))}
            </div>

            <button disabled={loading} type="submit" className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all disabled:opacity-50 text-center">
              {loading ? 'Publishing...' : 'Publish Syllabus'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default SyllabusForm;

