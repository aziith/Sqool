import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Search, CheckCircle, Clock as ClockIcon, FileText } from 'lucide-react';

const PAYROLL_API = 'http://localhost:5002/api/faculty/payroll';
const PROFILES_API = 'http://localhost:5002/api/faculty/profiles';

const TeacherPayrollPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tRes = await axios.get(`${PROFILES_API}?institution_id=${institutionId}`);
      setTeachers(tRes.data);

      const pRes = await axios.get(`${PAYROLL_API}?institution_id=${institutionId}&month=${month}&year=${year}`);
      setPayrollData(pRes.data);
    } catch (err) {
      console.error('Error fetching payroll', err);
    } finally {
      setLoading(false);
    }
  };

  const processPayroll = async (teacherId, basic, allow, deduc) => {
    try {
      await axios.post(PAYROLL_API, {
        institution_id: institutionId,
        teacher_id: teacherId,
        month,
        year,
        basic_salary: basic || 50000, 
        allowances: allow || 0,
        deductions: deduc || 0,
        status: 'PAID',
        remarks: 'Processed via Dashboard'
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error processing payroll');
    }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="p-6 space-y-8 animate-in fade-in zoom-in-95 duration-300 text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Faculty Payroll</h1>
          <p className="text-slate-500 font-medium mt-1">Process and track monthly salaries.</p>
        </div>
        <div className="flex gap-4">
           <select 
             value={month} 
             onChange={e => setMonth(parseInt(e.target.value))}
             className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-sm focus:ring-2 outline-none"
           >
             {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
           </select>
           <select 
             value={year} 
             onChange={e => setYear(parseInt(e.target.value))}
             className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-sm focus:ring-2 outline-none"
           >
             {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? <p className="text-slate-500 italic">Loading payroll data...</p> : teachers.map(t => {
          const record = payrollData.find(p => p.teacher_id === t.id);
          const isPaid = record && record.status === 'PAID';
          
          return (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
               <div className="flex items-center gap-4 w-1/4">
                 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                    {t.name.charAt(0)}
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800">{t.name}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-black">{t.department || 'Faculty'}</p>
                 </div>
               </div>

               <div className="flex-1 grid grid-cols-3 gap-8 px-8 border-x border-slate-100">
                  <div>
                     <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Basic Salary</p>
                     <p className="font-bold text-slate-700">${record?.basic_salary || '50,000'}</p>
                  </div>
                  <div>
                     <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black mb-1">Allowances</p>
                     <p className="font-bold text-emerald-700">+${record?.allowances || '0'}</p>
                  </div>
                  <div>
                     <p className="text-[10px] text-rose-500 uppercase tracking-widest font-black mb-1">Deductions</p>
                     <p className="font-bold text-rose-700">-${record?.deductions || '0'}</p>
                  </div>
               </div>

               <div className="w-1/4 flex justify-end items-center gap-4">
                  <div className="text-right mr-4">
                     <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Net Pay</p>
                     <p className="text-2xl font-black text-indigo-700">${record?.net_salary || '50,000'}</p>
                  </div>
                  
                  {isPaid ? (
                     <div className="flex flex-col items-center justify-center bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl">
                        <CheckCircle size={20} className="mb-1"/>
                        <span className="text-[10px] font-black uppercase tracking-widest">Paid</span>
                     </div>
                  ) : (
                     <button 
                       onClick={() => processPayroll(t.id, 50000, 0, 0)}
                       className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                     >
                        <DollarSign size={16}/> Process
                     </button>
                  )}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherPayrollPage;

