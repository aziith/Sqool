import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Plus, Trash2, Tag, Info, Clock, ExternalLink } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;
  const userRole = localStorage.getItem('sqool_user_role') || 'STUDENT';
  const canManage = ['ADMIN', 'SUPER_ADMIN', 'TEACHER'].includes(userRole);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    venue: '',
    event_type: 'GENERAL'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/events?institution_id=${institutionId}`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/events`, 
        { ...formData, institution_id: institutionId },
        { headers: { 'x-user-role': userRole } }
      );
      setShowModal(false);
      setFormData({ title: '', description: '', event_date: '', venue: '', event_type: 'GENERAL' });
      fetchEvents();
    } catch (err) {
      alert('Error creating event: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await axios.delete(`${API_BASE}/events/${id}`, {
        headers: { 'x-user-role': userRole }
      });
      fetchEvents();
    } catch (err) {
      alert('Error deleting event: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Events Gallery</h1>
          <p className="text-slate-500 font-medium">Capture and organize school celebrations and important dates.</p>
        </div>
        {canManage && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all font-bold"
          >
            <Plus size={20}/> Create Event
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 text-left">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-indigo-600 text-white">
                <div>
                   <h2 className="text-xl font-black italic tracking-tighter">PUBLISH EVENT</h2>
                   <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Add to school archive</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><Plus size={24} className="rotate-45"/></button>
             </div>

             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Title</label>
                      <input 
                        type="text" name="title" required value={formData.title} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500/20 outline-none font-bold text-slate-700 transition-all shadow-inner"
                        placeholder="e.g. Annual Sports Meet 2025"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Date</label>
                         <input 
                           type="date" name="event_date" required value={formData.event_date} onChange={handleInputChange}
                           className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500/20 outline-none font-bold text-slate-700 transition-all shadow-inner"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Type</label>
                         <select 
                           name="event_type" value={formData.event_type} onChange={handleInputChange}
                           className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500/20 outline-none font-bold text-slate-700 transition-all shadow-inner"
                         >
                            <option value="GENERAL">General</option>
                            <option value="ACADEMIC">Academic</option>
                            <option value="SPORTS">Sports</option>
                            <option value="CULTURAL">Cultural</option>
                            <option value="HOLIDAY">Holiday</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue / Location</label>
                      <div className="relative">
                         <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                         <input 
                           type="text" name="venue" required value={formData.venue} onChange={handleInputChange}
                           className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500/20 outline-none font-bold text-slate-700 transition-all shadow-inner"
                           placeholder="School Auditorium..."
                         />
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                      <textarea 
                        name="description" rows="3" value={formData.description} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500/20 outline-none font-bold text-slate-700 transition-all shadow-inner resize-none"
                        placeholder="Detail about the event..."
                      ></textarea>
                   </div>
                </div>

                <div className="pt-4 flex gap-3">
                   <button 
                     type="button" onClick={() => setShowModal(false)}
                     className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                   >
                     Discard
                   </button>
                   <button 
                     type="submit"
                     className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                   >
                     Publish to Gallery
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium italic">Loading events repository...</div>
        ) : events.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 flex flex-col items-center gap-4">
            <Calendar size={48} className="text-slate-200" />
            <p className="font-medium text-lg text-slate-300 italic">No events recorded yet. Start documentation today.</p>
          </div>
        ) : events.map(event => (
          <div key={event.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all overflow-hidden flex flex-col">
            <div className="h-40 bg-indigo-50 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-transparent"></div>
              <Calendar size={64} className="text-indigo-200/50 absolute bottom-[-10px] right-[-10px] transform rotate-12" />
              <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-sm text-center min-w-[80px] z-10">
                <div className="text-[10px] uppercase font-black text-slate-400 mb-1">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</div>
                <div className="text-3xl font-black text-indigo-700 leading-none">{new Date(event.event_date).getDate()}</div>
                <div className="text-[10px] font-bold text-slate-500 mt-1">{new Date(event.event_date).getFullYear()}</div>
              </div>
              {canManage && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="p-2 bg-white/20 hover:bg-rose-500 text-white rounded-lg transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6 flex-grow space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100">
                    {event.event_type || 'GENERAL'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 line-clamp-1 leading-tight">{event.title}</h3>
              </div>
              
              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed h-10">{event.description}</p>
              
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                  <MapPin size={14} className="text-indigo-400"/>
                  <span>{event.venue || 'School Campus'}</span>
                </div>
                <button className="flex items-center gap-1 text-indigo-600 text-xs font-bold hover:gap-2 transition-all">
                  Gallery <ExternalLink size={12}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;

