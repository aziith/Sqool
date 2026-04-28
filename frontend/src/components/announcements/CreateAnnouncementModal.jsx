import React, { useState } from 'react';
import { X, Send, Megaphone, Target, Clock, AlertCircle, FilePlus, Filter } from 'lucide-react';
import axios from 'axios';

const CreateAnnouncementModal = ({ onClose, onSuccess, institutionId, API_BASE }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'GENERAL',
    is_urgent: false,
    scheduled_at: '',
    expires_at: '',
    audiences: [{ type: 'ALL', value: 'ALL' }],
    attachments: []
  });

  const categories = ['GENERAL', 'ACADEMIC', 'EVENT', 'URGENT'];
  const audienceTypes = ['ALL', 'CLASS', 'STUDENT', 'TEACHER'];

  const handleAddAttachment = () => {
    const url = prompt('Enter attachment URL (Mock URL for now)');
    if (url) {
      setFormData({ ...formData, attachments: [...formData.attachments, { url, type: 'pdf' }] });
    }
  };

  const handleAddAudience = () => {
    setFormData({ ...formData, audiences: [...formData.audiences, { type: 'CLASS', value: '' }] });
  };

  const handleAudienceChange = (idx, field, value) => {
    const newAuds = [...formData.audiences];
    newAuds[idx][field] = value;
    setFormData({ ...formData, audiences: newAuds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/announcements`, { 
        ...formData, 
        institution_id: institutionId,
        is_urgent: formData.category === 'URGENT' || formData.is_urgent
      });
      onSuccess();
    } catch (err) {
      alert('Error publishing announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-[0_32px_64px_-16px_rgba(30,58,138,0.3)] overflow-hidden animate-in zoom-in-95 duration-500 border border-white">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between bg-white text-slate-900 relative">
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <Megaphone size={28} className="animate-bounce-slow" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight leading-none italic uppercase">Dispatch Notice</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Verified institutional communication channel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all h-fit z-10">
            <X size={24}/>
          </button>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 z-0 blur-3xl opacity-50" />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto relative bg-white">
          {/* Title and Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Announcement Title</label>
              <input 
                required
                placeholder="Enter headline..."
                className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 shadow-inner placeholder:text-slate-300 transition-all text-xl"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
              <select 
                className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 shadow-inner appearance-none transition-all"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Directive Details</label>
            <textarea 
              required
              rows={4}
              placeholder="Detailed communication message goes here..."
              className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium text-slate-600 shadow-inner placeholder:text-slate-300 transition-all resize-none leading-relaxed"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {/* Audience and Attachments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <div className="flex justify-between items-center px-1">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={14}/> Target Audience</h4>
                 <button type="button" onClick={handleAddAudience} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800">+ Add Level</button>
               </div>
               {formData.audiences.map((aud, idx) => (
                 <div key={idx} className="flex gap-2 group">
                    <select 
                      className="flex-1 p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-xs text-slate-600 shadow-inner appearance-none"
                      value={aud.type}
                      onChange={e => handleAudienceChange(idx, 'type', e.target.value)}
                    >
                      {audienceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {aud.type !== 'ALL' && (
                       <input 
                         placeholder="ID/Class..."
                         className="flex-1 p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-xs text-slate-600 shadow-inner"
                         value={aud.value}
                         onChange={e => handleAudienceChange(idx, 'value', e.target.value)}
                       />
                    )}
                    <button 
                       type="button"
                       onClick={() => {
                         const newAuds = formData.audiences.filter((_, i) => i !== idx);
                         setFormData({ ...formData, audiences: newAuds });
                       }}
                       className="p-3 text-slate-300 hover:text-rose-500 rounded-lg group-hover:bg-slate-50 transition-all"
                    >
                       <X size={14}/>
                    </button>
                 </div>
               ))}
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FilePlus size={14}/> Documents</h4>
                  <button type="button" onClick={handleAddAttachment} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800">+ Secure Link</button>
                </div>
                <div className="space-y-2">
                   {formData.attachments.length === 0 && <p className="p-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">No attachments selected</p>}
                   {formData.attachments.map((att, idx) => (
                     <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-transparent hover:border-indigo-100 group">
                        <span className="text-[10px] font-bold text-slate-500 truncate max-w-[150px]">{att.url}</span>
                        <button 
                          onClick={() => setFormData({ ...formData, attachments: formData.attachments.filter((_, i) => i !== idx) })}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <X size={14}/>
                        </button>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Scheduling */}
          <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 space-y-4">
             <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">
                <Clock size={16}/> Dispatch Dynamics
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">Scheduled Release</label>
                   <input 
                      type="datetime-local" 
                      className="w-full p-4 bg-white border-2 border-transparent focus:border-indigo-200 rounded-2xl outline-none font-bold text-xs text-slate-600 transition-all text-center"
                      value={formData.scheduled_at}
                      onChange={e => setFormData({ ...formData, scheduled_at: e.target.value })}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">Automatic Archive</label>
                   <input 
                      type="datetime-local" 
                      className="w-full p-4 bg-white border-2 border-transparent focus:border-indigo-200 rounded-2xl outline-none font-bold text-xs text-slate-600 transition-all text-center"
                      value={formData.expires_at}
                      onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                   />
                </div>
             </div>
             <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="urgent" 
                  className="w-5 h-5 rounded-lg border-indigo-200 text-indigo-600 focus:ring-indigo-500"
                  checked={formData.is_urgent}
                  onChange={e => setFormData({ ...formData, is_urgent: e.target.checked })}
                />
                <label htmlFor="urgent" className="text-xs font-black text-indigo-600 uppercase tracking-widest cursor-pointer select-none">
                   Prioritize as Critical Communication (Bypass Muting)
                </label>
             </div>
          </div>

          {/* Footer Action */}
          <button 
             disabled={loading}
             type="submit" 
             className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest italic text-sm hover:bg-indigo-600 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
          >
             {loading ? (
                <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Authenticating Packet...</div>
             ) : (
                <>Initiate Secure Distribution <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"/></>
             )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
