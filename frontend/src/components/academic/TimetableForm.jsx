import React, { useState } from 'react';
import axios from 'axios';
import { XCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api/academic/timetable';

const TimetableForm = ({ onClose, onSuccess, meta, classesList = [], selectedClass, days, editingPeriod }) => {
  const [formData, setFormData] = useState(editingPeriod ? {
    subject_id: editingPeriod.subject_id.toString(),
    teacher_id: editingPeriod.teacher_id.toString(),
    day_of_week: editingPeriod.day_of_week,
    // Fix: start_time and end_time from DB might be ISO strings or partial times
    start_time: editingPeriod.start_time ? new Date(editingPeriod.start_time).toISOString().substring(11, 16) : '',
    end_time: editingPeriod.end_time ? new Date(editingPeriod.end_time).toISOString().substring(11, 16) : '',
    room_number: editingPeriod.room_number || ''
  } : { 
    subject_id: '', teacher_id: '', day_of_week: 'Monday', start_time: '', end_time: '', room_number: '' 
  });
  const [loading, setLoading] = useState(false);
  const uniqueRooms = Array.from(new Set((classesList || []).map(c => c.room_number).filter(Boolean)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return alert('Select a class first');
    const institutionId = localStorage.getItem('sqool_institution_id') || 3;
    setLoading(true);
    try {
      const payload = { ...formData, class_id: selectedClass, institution_id: institutionId };
      if (editingPeriod) {
        await axios.put(`${API_BASE}/${editingPeriod.id}`, payload);
      } else {
        await axios.post(API_BASE, payload);
      }
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving period');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <div>
              <h2 className="text-xl font-black italic tracking-tighter">SCHEDULE PERIOD</h2>
              <p className="text-[10px] uppercase font-bold text-indigo-200">Auto-checks teacher/room conflicts</p>
          </div>
          <button onClick={onClose} className="hover:text-indigo-200 transition-colors"><XCircle size={24}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day</label>
              <select required value={formData.day_of_week} onChange={e => setFormData({...formData, day_of_week: e.target.value})} className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-black outline-none placeholder:text-gray-500">
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room (Optional)</label>
              <select value={formData.room_number || ''} onChange={e => setFormData({...formData, room_number: e.target.value})} className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-black outline-none placeholder:text-gray-400">
                <option value="">Select Room...</option>
                {uniqueRooms.length > 0 && (
                  <optgroup label="Assigned Home Rooms">
                    {uniqueRooms.map(r => <option key={`dyn-${r}`} value={r}>{r}</option>)}
                  </optgroup>
                )}
                <optgroup label="Standard Classrooms">
                  {[101, 102, 103, 104, 105, 201, 202, 203, 204, 205, 301, 302, 303, 304, 305].map(r => <option key={r} value={r}>Room {r}</option>)}
                </optgroup>
                <optgroup label="Specialized Rooms">
                  <option value="Science Lab">Science Lab</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Library">Library</option>
                  <option value="Sports Ground">Sports Ground</option>
                  <option value="Music Room">Music Room</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period Slot</label>
            <select 
              required 
              value={`${formData.start_time}-${formData.end_time}`} 
              onChange={e => {
                const [start, end] = e.target.value.split('-');
                if (start && end) {
                  setFormData({...formData, start_time: start, end_time: end});
                } else {
                  setFormData({...formData, start_time: '', end_time: ''});
                }
              }} 
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-black outline-none placeholder:text-gray-500"
            >
              <option value="-">Select a period...</option>
              <option value="09:30-10:10">Period 1 (09:30 - 10:10)</option>
              <option value="10:10-10:50">Period 2 (10:10 - 10:50)</option>
              <option value="11:00-11:40">Period 3 (11:00 - 11:40)</option>
              <option value="11:40-12:20">Period 4 (11:40 - 12:20)</option>
              <option value="12:20-13:00">Period 5 (12:20 - 01:00)</option>
              <option value="13:30-14:10">Period 6 (01:30 - 02:10)</option>
              <option value="14:10-14:50">Period 7 (02:10 - 02:50)</option>
              <option value="14:55-15:35">Period 8 (02:55 - 03:35)</option>
              <option value="15:35-16:15">Period 9 (03:35 - 04:15)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
            <select required value={formData.subject_id} onChange={e => setFormData({...formData, subject_id: e.target.value})} className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-black outline-none placeholder:text-gray-500">
              <option value="">Select subject...</option>
              {meta.subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher</label>
            <select required value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-black outline-none placeholder:text-gray-500">
              <option value="">Select teacher...</option>
              {meta.teachers.map(t => <option key={t.user_id} value={t.user_id}>{t.name || 'Unknown'}</option>)}
            </select>
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 mt-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all disabled:opacity-50">
            {loading ? 'Saving...' : (editingPeriod ? 'Update Period' : 'Add to Timetable')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimetableForm;
