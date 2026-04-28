import React, { useState } from 'react';
import axios from 'axios';
import { XCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api/academic/assignments';

const AssignmentForm = ({ onClose, onSuccess, classesList, subjectsList, teachersList, institutionId }) => {
  const [formData, setFormData] = useState({ 
    class_id: '', subject_id: '', teacher_id: '', title: '', description: '', due_date: '', file_url: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_BASE, { ...formData, institution_id: institutionId });
      onSuccess();
    } catch (err) { alert('Error creating assignment'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex justify-between bg-indigo-600 text-white font-black italic tracking-tighter text-xl">
          CREATE ASSIGNMENT
          <button onClick={onClose} className="hover:text-indigo-200 transition-colors"><XCircle size={24}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none font-bold text-slate-700" placeholder="e.g. History Essay Part 1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</label>
              <input type="date" required value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none font-bold text-slate-700" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attachment URL (Optional)</label>
              <input type="url" value={formData.file_url} onChange={e => setFormData({...formData, file_url: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none font-bold text-slate-700 text-sm" placeholder="https://drive.google.com/..." />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</label>
                <select required value={formData.class_id} onChange={e => setFormData({...formData, class_id: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 outline-none font-bold text-slate-700 text-sm">
                  <option value="">Select...</option>
                  {classesList.map(c => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
                </select>
            </div>
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                <select required value={formData.subject_id} onChange={e => setFormData({...formData, subject_id: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 outline-none font-bold text-slate-700 text-sm">
                  <option value="">Select...</option>
                  {subjectsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher</label>
                <select required value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 outline-none font-bold text-slate-700 text-sm">
                  <option value="">Select...</option>
                  {teachersList.map(t => <option key={t.user_id} value={t.user_id}>{t.users?.name || 'Teacher'}</option>)}
                </select>
            </div>
          </div>

          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructions / Description</label>
             <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Provide detailed instructions for the students..." className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 outline-none font-medium text-slate-700 resize-none" rows="3"></textarea>
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all disabled:opacity-50">
            {loading ? 'Publishing...' : 'Publish Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;

