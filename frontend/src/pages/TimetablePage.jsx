import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Search, BookOpen, User, MapPin, Plus, Trash2, Download, Filter, ChevronLeft, ChevronRight, Hash } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api';

const TimetablePage = () => {
    const [timetable, setTimetable] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);
    const institutionId = localStorage.getItem('sqool_institution_id') || 1;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        { id: 1, label: 'Period 1', time: '09:30-10:10' },
        { id: 2, label: 'Period 2', time: '10:10-10:50' },
        { id: 'break1', label: 'BREAK', time: '10:50-11:00', isBreak: true },
        { id: 3, label: 'Period 3', time: '11:00-11:40' },
        { id: 4, label: 'Period 4', time: '11:40-12:20' },
        { id: 5, label: 'Period 5', time: '12:20-01:00' },
        { id: 'lunch', label: 'LUNCH', time: '01:00-01:30', isBreak: true },
        { id: 6, label: 'Period 6', time: '01:30-02:10' },
        { id: 7, label: 'Period 7', time: '02:10-02:50' },
        { id: 'break2', label: 'BREAK', time: '02:50-02:55', isBreak: true },
        { id: 8, label: 'Period 8', time: '02:55-03:35' },
        { id: 9, label: 'Period 9', time: '03:35-04:15' },
    ];

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${API_BASE}/academics/classes?institution_id=${institutionId}`);
            setClasses(res.data);
            if (res.data.length > 0) {
                handleSearch(res.data[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (cId) => {
        const classId = cId || selectedClass;
        if (!classId) return;
        setLoading(true);
        setSelectedClass(classId);
        try {
            const res = await axios.get(`${API_BASE}/timetable?institution_id=${institutionId}&class_id=${classId}`);
            setTimetable(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getPeriod = (day, slot) => {
        if (!timetable || timetable.length === 0) return null;
        const slotStart = slot.time.split('-')[0]; // e.g., "09:30"
        
        return timetable.find(t => {
            if (t.day_of_week !== day) return false;
            let tStart = "";
            if (t.start_time?.includes('T')) {
                 tStart = new Date(t.start_time).toISOString().substring(11, 16);
            } else if (t.start_time) {
                 tStart = t.start_time.substring(0, 5);
            }
            return tStart === slotStart;
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        if (timeStr.includes('T')) {
            return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        // Assume HH:MM:SS
        const [h, m] = timeStr.split(':');
        const dt = new Date();
        dt.setHours(h, m, 0);
        return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="p-6 space-y-6 animate-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Clock className="text-indigo-600" /> Class Timetable
                    </h1>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Academic Session 2025-26</p>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex-1 md:w-48 relative">
                        <select 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none appearance-none focus:ring-2 ring-indigo-500/20"
                            value={selectedClass}
                            onChange={(e) => handleSearch(e.target.value)}
                        >
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
                        </select>
                    </div>
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                        Search
                    </button>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-indigo-600">
                                <th className="p-6 text-white font-black uppercase tracking-widest text-xs border-r border-white/10 w-32">Days</th>
                                {timeSlots.map(slot => (
                                    <th key={slot.id} className={`p-4 text-center border-r border-white/10 ${slot.isBreak ? 'bg-indigo-700/50 w-12' : 'min-w-[140px]'}`}>
                                        <div className="text-[10px] font-black text-indigo-200 uppercase tracking-tighter mb-1">{slot.label}</div>
                                        <div className="text-[10px] font-black text-white whitespace-nowrap">({slot.time})</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map(day => (
                                <tr key={day} className="border-b border-slate-50">
                                    <td className="p-6 bg-slate-900 border-r border-slate-800">
                                        <span className="text-xs font-black text-white uppercase tracking-widest">{day.substring(0, 3)}</span>
                                    </td>
                                    {timeSlots.map(slot => (
                                        <td key={slot.id} className={`p-2 border-r border-slate-50 group transition-all ${slot.isBreak ? 'bg-slate-50/50' : 'hover:bg-indigo-50/30'}`}>
                                            {slot.isBreak ? (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="vertical-text text-[8px] font-black text-slate-300 tracking-[1em] py-4">{slot.label}</div>
                                                </div>
                                            ) : (() => {
                                                const period = getPeriod(day, slot);
                                                    if (!period) return (
                                                        <div className="h-full min-h-[100px] flex flex-col justify-center items-center gap-1.5 p-3 rounded-2xl bg-slate-50 border border-transparent transition-all">
                                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-tight text-center">Free</div>
                                                        </div>
                                                    );
                                                    return (
                                                        <div className="h-full min-h-[100px] flex flex-col justify-center items-center gap-1 p-3 rounded-2xl bg-indigo-50 group-hover:bg-white group-hover:shadow-md border border-indigo-100 group-hover:border-indigo-300 transition-all">
                                                            <div className="text-[10px] font-black text-indigo-700 text-center uppercase tracking-tight leading-tight">{period.subject_name || 'Subject'}</div>
                                                            <div className="text-[9px] font-bold text-slate-500 text-center">{period.teacher_name || 'Teacher'}</div>
                                                            <div className="h-px w-6 bg-indigo-200 my-1"></div>
                                                            <div className="text-[9px] font-black text-slate-700 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
                                                                {formatTime(period.start_time)} - {formatTime(period.end_time)}
                                                            </div>
                                                            {period.room_number && <div className="text-[8px] font-bold text-slate-400 italic mt-0.5">Room {period.room_number}</div>}
                                                        </div>
                                                    );
                                                })()}

                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    transform: rotate(180deg);
                }
            `}} />
        </div>
    );
};

export default TimetablePage;

