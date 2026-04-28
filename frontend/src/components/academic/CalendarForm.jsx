import React, { useState } from 'react';
import axios from 'axios';
import { XCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api/academic/calendar';

const CalendarForm = ({ onClose, onSuccess, institutionId }) => {
  const [formData, setFormData] = useState({ title: '', event_type: 'EVENT', start_date: '', end_date: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_BASE, { ...formData, institution_id: institutionId });
      onSuccess();
    } catch (err) { alert('Error saving event'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex justify-between bg-indigo-600 text-white font-black italic tracking-tighter text-xl">
          ADD CALENDAR EVENT
          <button onClick={onClose} className="hover:text-indigo-200 transition-colors"><XCircle size={24}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Title</label>
             <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border-none focus:ring-2 text-slate-700" placeholder="Mid-Term Exams" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</label>
                <input type="date" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border-none focus:ring-2 text-slate-700" />
             </div>
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Date (Optional)</label>
                <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border-none focus:ring-2 text-slate-700" />
             </div>
          </div>
          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
             <select value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border-none focus:ring-2 text-slate-700">
                <option value="EVENT">School Event</option>
                <option value="EXAM">Exam / Assessment</option>
                <option value="HOLIDAY">Holiday</option>
             </select>
          </div>
          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
             <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border-none focus:ring-2 text-slate-700 resize-none" rows="2" placeholder="Details..."></textarea>
          </div>
          <button disabled={loading} type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all disabled:opacity-50">
            {loading ? 'Publishing...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CalendarForm;

