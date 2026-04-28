import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, MapPin, Search, Plus, Trash2 } from 'lucide-react';
import CalendarForm from '../../components/academic/CalendarForm';

const API_BASE = 'http://localhost:5002/api/academic/calendar';

const AcademicCalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('upcoming'); // upcoming, past
  const [showModal, setShowModal] = useState(false);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}?institution_id=${institutionId}`);
      setEvents(res.data);
    } catch (err) { console.error('Error fetching calendar', err); }
  }, [institutionId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id) => {
    if(!window.confirm('Delete event from calendar?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  const EventTypes = {
    'EXAM': 'bg-rose-50 text-rose-700 border-rose-100',
    'HOLIDAY': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'EVENT': 'bg-indigo-50 text-indigo-700 border-indigo-100'
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Academic Calendar</h1>
          <p className="text-slate-500 font-medium">Important dates, exams, and holidays for the year.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all">
          <CalendarIcon size={20}/> Add Event
        </button>
      </div>

      <div className="flex gap-8">
         <div className="w-full lg:w-3/4 space-y-4">
            {events.length === 0 && <p className="text-slate-400 italic">No events scheduled.</p>}
            {events.map(ev => (
              <div key={ev.id} className={`p-5 rounded-2xl border flex items-center justify-between group transition-all hover:shadow-md ${EventTypes[ev.event_type] || EventTypes['EVENT']}`}>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{ev.event_type}</span>
                   <h3 className="text-lg font-bold leading-none">{ev.title}</h3>
                   {ev.description && <p className="text-sm mt-2 opacity-80">{ev.description}</p>}
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="text-right">
                       <span className="text-[10px] uppercase font-black tracking-widest block opacity-60">Date</span>
                       <span className="font-bold">
                         {new Date(ev.start_date).toLocaleDateString()} 
                         {ev.end_date && ` - ${new Date(ev.end_date).toLocaleDateString()}`}
                       </span>
                    </div>
                    <button onClick={() => handleDelete(ev.id)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/20 rounded-lg transition-all"><Trash2 size={16}/></button>
                 </div>
              </div>
            ))}
         </div>
         <div className="hidden lg:block w-1/4">
            {/* Context/Filter panel placeholder */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <h4 className="font-black text-slate-400 uppercase tracking-widest text-xs mb-4">Legend</h4>
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Exams & Tests</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Holidays</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> School Events</div>
               </div>
            </div>
         </div>
      </div>

      {showModal && (
        <CalendarForm 
          institutionId={institutionId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
};

export default AcademicCalendarPage;

