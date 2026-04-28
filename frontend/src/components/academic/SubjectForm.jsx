import React, { useState } from 'react';
import axios from 'axios';
import { XCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api/academics/subjects';

const SubjectForm = ({ institutionId, classesList, onClose, onSuccess, initialClassId, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    institution_id: institutionId,
    class_id: initialClassId || '',
    name: '',
    code: '',
    max_marks: 100
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await axios.put(`${API_BASE}/${initialData.id}`, formData);
      } else {
        await axios.post(API_BASE, { ...formData, institution_id: institutionId });
      }
      onSuccess();
    } catch (err) {
      alert('Error saving subject: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <h2 className="text-xl font-black italic tracking-tighter">{initialData ? 'EDIT SUBJECT' : 'ADD SUBJECT'}</h2>
          <button onClick={onClose} className="hover:text-indigo-200 transition-colors"><XCircle size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500/20 font-bold text-slate-900" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</label>
              <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500/20 font-bold text-slate-900" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Marks</label>
              <input type="number" required value={formData.max_marks} onChange={e => setFormData({ ...formData, max_marks: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500/20 font-bold text-slate-900" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign to Class</label>
            <select required value={formData.class_id} onChange={e => setFormData({ ...formData, class_id: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500/20 font-bold text-slate-900">
              <option value="">Select a class...</option>
              {classesList.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
            </select>
          </div>
          <button disabled={loading} type="submit" className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Subject'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
