import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Users, CalendarDays, ClipboardList, Clock, ArrowUpRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClassForm from '../../components/academic/ClassForm';
import SubjectForm from '../../components/academic/SubjectForm';

const API_BASE = 'http://localhost:5002/api/academic';

const AcademicDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [classesList, setClassesList] = useState([]);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  const fetchData = async () => {
    try {
      const [analyticsRes, classRes] = await Promise.all([
        axios.get(`${API_BASE}/analytics?institution_id=${institutionId}`),
        axios.get(`${API_BASE}/classes?institution_id=${institutionId}`)
      ]);
      setData(analyticsRes.data);
      setClassesList(classRes.data);
    } catch (err) {
      console.error('Error fetching academic data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Loading Academic Systems...</div>;
  }

  const stats = data?.stats || { total_classes: 0, total_subjects: 0, upcoming_exams: 0, pending_assignments: 0 };
  const schedule = data?.todays_schedule || [];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Academic Control</h1>
          <p className="text-slate-500 font-medium">Manage curriculum, subjects, and daily schedules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users size={24} className="text-blue-500" />} title="Total Classes" value={stats.total_classes} bg="bg-blue-50" />
        <StatCard icon={<BookOpen size={24} className="text-indigo-500" />} title="Total Subjects" value={stats.total_subjects} bg="bg-indigo-50" />
        <StatCard icon={<CalendarDays size={24} className="text-rose-500" />} title="Upcoming Exams" value={stats.upcoming_exams} bg="bg-rose-50" />
        <StatCard icon={<ClipboardList size={24} className="text-amber-500" />} title="Pending Assignments" value={stats.pending_assignments} bg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" /> Today's Live Schedule
            </h2>
            <Link to="/dashboard/academic/timetable" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Full Timetable <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {schedule.length === 0 ? (
              <div className="text-center p-8 text-slate-400 italic font-medium">No classes scheduled for today.</div>
            ) : (
              schedule.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-6 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group bg-slate-50/50">
                  <div className="w-24 text-center">
                    <div className="text-sm font-black text-slate-800">
                      {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="w-1 h-12 bg-indigo-100 rounded-full group-hover:bg-indigo-400 transition-colors"></div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base font-bold text-indigo-900">{slot.subjects?.name || 'Unknown Subject'}</h3>
                    <p className="text-xs font-bold text-slate-500">
                      Class {slot.classes?.name} - {slot.classes?.section} • Room {slot.room_number || 'TBA'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-indigo-500/30 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-lg font-bold mb-6 relative z-10">Academic Hub</h2>
          <div className="space-y-3 relative z-10">
            <QuickLink to="/dashboard/academic/rooms" label="Space & Room Allocation" />
            <QuickLink to="/dashboard/academic/classes" label="Class & Section Setup" />
            <QuickLink to="/dashboard/academic/subjects" label="Subject Curriculum" />
            <QuickLink to="/dashboard/academic/timetable" label="Timetable Scheduler" />
            <QuickLink to="/dashboard/academic/syllabus" label="Syllabus Tracker" />
          </div>
        </div>
      </div>

      {showClassModal && <ClassForm institutionId={institutionId} onClose={() => setShowClassModal(false)} onSuccess={() => { setShowClassModal(false); fetchData(); }} />}
      {showSubjectModal && <SubjectForm institutionId={institutionId} classesList={classesList} onClose={() => setShowSubjectModal(false)} onSuccess={() => { setShowSubjectModal(false); fetchData(); }} />}
    </div>
  );
};

const StatCard = ({ icon, title, value, bg }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
    <div className={`p-4 rounded-2xl ${bg}`}>{icon}</div>
    <div>
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
      <p className="text-3xl font-black text-slate-800 mt-1 leading-none">{value}</p>
    </div>
  </div>
);

const QuickLink = ({ to, label }) => (
  <Link to={to} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
    <span className="text-sm font-bold tracking-wide">{label}</span>
    <ArrowUpRight size={16} className="text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all" />
  </Link>
);

export default AcademicDashboard;

