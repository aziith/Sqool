import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, Filter, Download, MoreVertical, Eye, Edit2, Trash2, CheckCircle, Clock, XCircle, AlertCircle, FileText, File as FileIcon, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const API_BASE = 'http://localhost:5002/api';

const AdmissionPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    applicant_name: '',
    dob: '',
    gender: 'Male',
    class_applied: '',
    parent_name: '',
    parent_phone: '',
    email: '',
    address: '',
    current_address: '',
    guardian_id_proof: '',
    student_id_proof: ''
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Advanced Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const institutionId = localStorage.getItem('sqool_institution_id') || 1;

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter]);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sqool_token');
      const res = await axios.get(`${API_BASE}/admissions?institution_id=${institutionId}&status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedData = res.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setAdmissions(sortedData);
    } catch (err) {
      console.error('Error fetching admissions:', err);
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
      const token = localStorage.getItem('sqool_token');
      await axios.post(`${API_BASE}/admissions`, { ...formData, institution_id: institutionId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({
        applicant_name: '',
        dob: '',
        gender: 'Male',
        class_applied: '',
        parent_name: '',
        parent_phone: '',
        email: '',
        address: '',
        current_address: '',
        guardian_id_proof: '',
        student_id_proof: ''
      });
      fetchAdmissions();
    } catch (err) {
      alert('Error saving admission: ' + err.message);
    }
  };

  const handleView = (app) => {
    setSelectedApp(app);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const token = localStorage.getItem('sqool_token');
        await axios.delete(`${API_BASE}/admissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAdmissions();
      } catch (err) {
        alert('Error deleting: ' + err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SELECTED': return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Selected</span>;
      case 'REJECTED': return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      case 'INTERVIEW': return <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full flex items-center gap-1"><Clock size={12} /> Interview</span>;
      case 'ON_HOLD': return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1"><AlertCircle size={12} /> On Hold</span>;
      default: return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full flex items-center gap-1"><Clock size={12} /> Received</span>;
    }
  };

  const filteredData = admissions.filter(app => {
    const matchesSearch = app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_no?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = !classFilter || app.class_applied === classFilter;

    let matchesDate = true;
    if (startDate || endDate) {
      const appDate = new Date(app.applied_date);
      appDate.setHours(0, 0, 0, 0);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (appDate < start) matchesDate = false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (appDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesClass && matchesDate;
  });

  const exportToCSV = () => {
    const data = filteredData.map(app => ({
      'Applicant Name': app.applicant_name,
      'Gender': app.gender,
      'Applied Date': new Date(app.applied_date).toLocaleDateString(),
      'Application No': app.application_no,
      'Class Applied': app.class_applied,
      'Parent Name': app.parent_name,
      'Parent Phone': app.parent_phone,
      'Email': app.email,
      'Status': app.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Admissions");
    XLSX.writeFile(wb, `Admissions_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowExportDropdown(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add Header
    doc.setFontSize(18);
    doc.text('Student Admissions Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["S.No", "Applicant Name", "Gender", "Date", "App No", "Class", "Status"];
    const tableRows = filteredData.map((app, index) => [
      index + 1,
      app.applicant_name,
      app.gender,
      new Date(app.applied_date).toLocaleDateString(),
      app.application_no,
      app.class_applied,
      app.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillStyle: '#4f46e5' }
    });

    doc.save(`Admissions_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportDropdown(false);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Application Details</h1>
          <p className="text-slate-500 text-sm">Manage student admission applications across your institution.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all font-medium"
            >
              <Download size={18} /> Export <ChevronDown size={14} />
            </button>

            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={exportToPDF}
                  className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                >
                  <FileText size={16} /> PDF Document
                </button>
                <button
                  onClick={exportToCSV}
                  className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                >
                  <FileIcon size={16} /> Excel Spreadsheet
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 font-medium"
          >
            <UserPlus size={18} /> Start Admission
          </button>
        </div>
      </div>

      {/* View Details Modal */}
      {showViewModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600">
              <div className="text-white">
                <h2 className="text-2xl font-black tracking-tight">{selectedApp.applicant_name}</h2>
                <div className="flex items-center gap-3 mt-1 opacity-90 text-xs font-bold uppercase tracking-widest">
                  <span>{selectedApp.application_no}</span>
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                  <span>{selectedApp.class_applied}</span>
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50/30 overflow-y-auto max-h-[80vh]">
              <section className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Personal Information</label>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center group">
                      <span className="text-xs font-bold text-slate-500">Gender</span>
                      <span className="text-sm font-black text-slate-700">{selectedApp.gender}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-xs font-bold text-slate-500">Date of Birth</span>
                      <span className="text-sm font-black text-slate-700">{selectedApp.dob ? new Date(selectedApp.dob).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-xs font-bold text-slate-500">Applied Date</span>
                      <span className="text-sm font-black text-slate-700">{new Date(selectedApp.applied_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-xs font-bold text-slate-500">Current Status</span>
                      <div>{getStatusBadge(selectedApp.status)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">ID Verification</label>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Student ID Proof</span>
                      <span className="text-sm font-black text-slate-700">{selectedApp.student_id_proof || 'Not provided'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Guardian ID Proof</span>
                      <span className="text-sm font-black text-slate-700">{selectedApp.guardian_id_proof || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Parent / Contact Info</label>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Guardianship</span>
                      <span className="text-sm font-black text-slate-700 uppercase">{selectedApp.parent_name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Contact Number</span>
                      <span className="text-sm font-black text-slate-700">{selectedApp.parent_phone}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Email ID</span>
                      <span className="text-sm font-black text-slate-700 lowercase">{selectedApp.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Enrollment Notes</span>
                  </div>
                  <p className="text-xs font-bold text-indigo-900/60 italic leading-relaxed">
                    {selectedApp.remarks || 'No internal remarks added for this application yet.'}
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Address Details</label>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mb-1">Permanent Address</span>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">
                        {selectedApp.address || 'No address provided'}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mb-1">Current Address</span>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">
                        {selectedApp.current_address || 'Same as permanent'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Start Admission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 text-left">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Admission Form</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">New Student Registration</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
              <div className="space-y-8">
                {/* Section: Academic & Personal */}
                <section>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 block">Academic & Personal</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input
                        type="text" name="applicant_name" required value={formData.applicant_name} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                      <input
                        type="date" name="dob" required value={formData.dob} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                      <select
                        name="gender" value={formData.gender} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm appearance-none cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Applied</label>
                      <input
                        type="text" name="class_applied" required value={formData.class_applied} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                        placeholder="e.g. Grade 10"
                      />
                    </div>
                  </div>
                </section>

                {/* Section: Guardian & Contact */}
                <section>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 block">Guardian & Contact</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guardian Name</label>
                      <input
                        type="text" name="parent_name" required value={formData.parent_name} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                        placeholder="Father/Mother name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</label>
                      <input
                        type="tel" name="parent_phone" required value={formData.parent_phone} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                      <input
                        type="email" name="email" value={formData.email} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </section>

                {/* Section: Addresses */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Address Details</label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, current_address: formData.address });
                          }
                        }}
                      />
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-500 transition-all uppercase tracking-tighter">Same as permanent</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permanent Address</label>
                      <textarea
                        name="address" rows="3" value={formData.address} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all resize-none text-sm"
                        placeholder="Full permanent address..."
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Address</label>
                      <textarea
                        name="current_address" rows="3" value={formData.current_address} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all resize-none text-sm"
                        placeholder="Current residential address (optional)..."
                      ></textarea>
                    </div>
                  </div>
                </section>

                {/* Section: ID Proofs */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Documentation</label>
                    <span className="text-[8px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded tracking-normal">OPTIONAL</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student ID Proof (Aadhar/Passport)</label>
                      <input
                        type="text" name="student_id_proof" value={formData.student_id_proof} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                        placeholder="Enter ID number"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guardian ID Proof</label>
                      <input
                        type="text" name="guardian_id_proof" value={formData.guardian_id_proof} onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm"
                        placeholder="Enter ID number"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="pt-8 flex gap-4">
                <button
                  type="button" onClick={() => setShowModal(false)}
                  className="px-8 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all transform active:scale-[0.98]"
                >
                  Submit Admission Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 w-full md:w-96">
              <div className="pl-2 text-slate-400"><Search size={18} /></div>
              <input
                type="text"
                placeholder="Search by name or app no..."
                className="w-full p-2 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 font-bold">
              {['ALL', 'RECEIVED', 'SELECTED', 'REJECTED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest rounded-lg whitespace-nowrap transition-all ${statusFilter === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white/50 p-3 rounded-xl border border-dashed border-slate-200">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-600 min-w-[100px]"
              >
                <option value="">All Classes</option>
                {[...new Set(admissions.map(a => a.class_applied))].filter(Boolean).sort().map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            {(startDate || endDate || classFilter) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); setClassFilter(''); }}
                className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors ml-auto"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-slate-100">S.No</th>
                <th className="p-4 border-b border-slate-100">Applicant Name</th>
                <th className="p-4 border-b border-slate-100">Gender</th>
                <th className="p-4 border-b border-slate-100">Applied Date</th>
                <th className="p-4 border-b border-slate-100">Application No</th>
                <th className="p-4 border-b border-slate-100">Class</th>
                <th className="p-4 border-b border-slate-100">Fee Status</th>
                <th className="p-4 border-b border-slate-100">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-400">Loading applications...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-400">No applications found.</td></tr>
              ) : filteredData.map((app, idx) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-all border-b border-slate-50">
                  <td className="p-4 font-medium text-slate-400">{(idx + 1).toString().padStart(2, '0')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                        {app.applicant_name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{app.applicant_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{app.gender || 'N/A'}</td>
                  <td className="p-4 text-slate-500">{new Date(app.applied_date).toLocaleDateString()}</td>
                  <td className="p-4 font-mono text-xs text-slate-600">{app.application_no}</td>
                  <td className="p-4 font-medium text-indigo-600 italic">{app.class_applied || 'Grade X'}</td>
                  <td className="p-4">
                    {app.registration_fee_paid
                      ? <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold">PAID</span>
                      : <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold">UNPAID</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(app)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Rows Per Page: <select className="bg-transparent border-none outline-none font-bold text-slate-800"><option>10</option><option>25</option></select> of {filteredData.length}</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 transition-all">{'<'}</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-indigo-600 text-white shadow-md">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 transition-all">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 transition-all">{'>'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPage;

