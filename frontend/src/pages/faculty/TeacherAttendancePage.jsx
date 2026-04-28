import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle2, XCircle, AlertCircle, Search, Save } from 'lucide-react';

const ATTENDANCE_API = 'http://localhost:5002/api/faculty/attendance';
const PROFILES_API = 'http://localhost:5002/api/faculty/profiles';

const TeacherAttendancePage = () => {
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;
  const loggedInUser = localStorage.getItem('sqool_user_id');

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all teachers
      const tRes = await axios.get(`${PROFILES_API}?institution_id=${institutionId}`);
      setTeachers(tRes.data);

      // Fetch attendance for the selected date
      const aRes = await axios.get(`${ATTENDANCE_API}?institution_id=${institutionId}&date=${date}`);
      
      const attMap = {};
      aRes.data.forEach(record => {
        attMap[record.teacher_id] = record.status;
      });
      setAttendance(attMap);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (teacherId, status) => {
    setAttendance(prev => ({ ...prev, [teacherId]: status }));
  };

  const saveAttendance = async () => {
    try {
      const promises = Object.entries(attendance).map(([teacherId, status]) => {
        return axios.post(ATTENDANCE_API, {
          institution_id: institutionId,
          teacher_id: teacherId,
          date: date,
          status,
          marked_by: loggedInUser
        });
      });
      await Promise.all(promises);
      alert('Attendance saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving attendance');
    }
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'Present': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
          case 'Absent': return 'bg-rose-100 text-rose-800 border-rose-300';
          case 'Half-Day': return 'bg-amber-100 text-amber-800 border-amber-300';
          case 'Leave': return 'bg-blue-100 text-blue-800 border-blue-300';
          default: return 'bg-slate-50 text-slate-500 border-slate-200';
      }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in zoom-in-95 duration-300 text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Faculty Attendance</h1>
          <p className="text-slate-500 font-medium mt-1">Mark and track daily teacher attendance.</p>
        </div>
        <div className="flex items-center gap-4">
           <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-sm focus:ring-2 outline-none"
           />
           <button onClick={saveAttendance} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all">
             <Save size={20}/> Save Record
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest font-black text-slate-500">
                <th className="p-4 pl-6">Teacher</th>
                <th className="p-4">Department</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                  <tr><td colSpan="4" className="p-6 text-center text-slate-500 font-bold">Loading...</td></tr>
              ) : teachers.length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-slate-500 font-bold">No teachers found.</td></tr>
              ) : teachers.map(t => (
                <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {t.photo_url ? <img src={t.photo_url} alt="" className="w-full h-full rounded-full object-cover"/> : t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.employee_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-600">{t.department || 'N/A'}</td>
                  <td className="p-4 font-medium text-slate-600">{t.phone || 'N/A'}</td>
                  <td className="p-4">
                     <div className="flex items-center justify-center gap-2">
                        {['Present', 'Absent', 'Half-Day', 'Leave'].map(status => (
                            <button 
                               key={status}
                               onClick={() => handleStatusChange(t.id, status)}
                               className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg border-2 transition-all ${
                                   attendance[t.id] === status ? getStatusColor(status) : 'border-slate-100 text-slate-400 hover:border-slate-300'
                               }`}
                            >
                                {status}
                            </button>
                        ))}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;

