import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, MapPin, Users, Activity, FileText, BookOpen, Layers, CheckCircle, XCircle, Grid, List, Search, Filter, Calendar } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api/academic/rooms';
const ALLOC_API = 'http://localhost:5002/api/academic/allocations';

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const [filterType, setFilterType] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', type: 'CLASSROOM', capacity: 40, building: '', floor: '', status: 'AVAILABLE', facilities: '' 
  });
  
  const [allocData, setAllocData] = useState({
    className: '', section: '', subject: '', teacher: '', date: '', startTime: '', endTime: ''
  });

  const [metadata, setMetadata] = useState({ classes: [], subjects: [], teachers: [] });

  const getInstitutionId = () => {
    const fromStorage = localStorage.getItem('sqool_institution_id');
    if (fromStorage && fromStorage !== 'null' && fromStorage !== 'undefined') return parseInt(fromStorage);
    return 3;
  };
  const institutionId = getInstitutionId();

  useEffect(() => {
    fetchRooms();
    fetchMetadata();
  }, [filterType]);

  const fetchMetadata = async () => {
    try {
      const [clsRes, subjRes, teachRes] = await Promise.all([
        axios.get(`http://localhost:5002/api/academic/classes?institution_id=${institutionId}`),
        axios.get(`http://localhost:5002/api/academic/subjects?institution_id=${institutionId}`),
        axios.get(`http://localhost:5002/api/teachers?institution_id=${institutionId}`)
      ]);
      setMetadata({
        classes: clsRes.data,
        subjects: subjRes.data,
        teachers: teachRes.data
      });
    } catch (err) {
      console.error('Metadata fetch error:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE}?institution_id=${institutionId}${filterType ? `&type=${filterType}` : ''}`;
      const res = await axios.get(url);
      setRooms(res.data);
    } catch (err) {
      console.error('Fetch rooms error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room? All allocations will be lost.')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchRooms();
    } catch (err) {
      alert('Error deleting room');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData,
        facilities: formData.facilities.split(',').map(f => f.trim()).filter(Boolean),
        institution_id: institutionId 
      };
      await axios.post(API_BASE, payload);
      setShowModal(false);
      setFormData({ name: '', type: 'CLASSROOM', capacity: 40, building: '', floor: '', status: 'AVAILABLE', facilities: '' });
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving room');
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(ALLOC_API, { ...allocData, roomId: selectedRoom.id, institution_id: institutionId });
      setShowAllocateModal(false);
      alert('Allocation successful!');
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.error || 'Allocation Conflict: Room is busy.');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'LAB': return <Activity size={20} className="text-cyan-500" />;
      case 'LIBRARY': return <BookOpen size={20} className="text-emerald-500" />;
      case 'EXAM_HALL': return <FileText size={20} className="text-rose-500" />;
      default: return <Layers size={20} className="text-indigo-500" />;
    }
  };

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length;
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;

  return (
    <div className="p-6 space-y-8 animate-in fade-in text-left">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Space & Room Management</h1>
          <p className="text-slate-500 font-medium">Coordinate classrooms, lab facilities, and exam halls.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all">
            <Plus size={20} /> Add Room
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600"><MapPin size={24} /></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Rooms</p><p className="text-2xl font-black text-slate-800">{loading ? '-' : totalRooms}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle size={24} /></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Rooms</p><p className="text-2xl font-black text-emerald-600">{loading ? '-' : availableRooms}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-rose-50 rounded-xl text-rose-600"><XCircle size={24} /></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Occupied Rooms</p><p className="text-2xl font-black text-rose-600">{loading ? '-' : occupiedRooms}</p></div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-slate-400" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-slate-50 border-none font-bold text-sm text-slate-700 rounded-lg p-2 focus:ring-0">
            <option value="">All Types</option>
            <option value="CLASSROOM">Classrooms</option>
            <option value="LAB">Laboratories</option>
            <option value="EXAM_HALL">Exam Halls</option>
          </select>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><Grid size={18} /></button>
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><List size={18} /></button>
        </div>
      </div>

      {loading ? <p className="font-bold text-slate-400">Loading rooms...</p> : rooms.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-3xl mx-auto flex items-center justify-center mb-4"><MapPin size={48} /></div>
          <p className="text-slate-400 font-bold text-lg">No rooms allocated yet.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col pt-2">
              <div className="px-6 py-4 flex justify-between items-start border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50/80 shadow-sm border border-slate-100 rounded-xl flex items-center justify-center">
                    {getIcon(r.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">{r.name} 
                      {r.status === 'AVAILABLE' ? <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> : r.status === 'MAINTENANCE' ? <span className="w-2 h-2 rounded-full bg-amber-400"></span> : <span className="w-2 h-2 rounded-full bg-rose-400"></span>}
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{r.type}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Capacity & Floor</span>
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={14}/> {r.capacity} <span className="text-slate-300">|</span> {r.building} - {r.floor || 'G'} </span>
                </div>
                {r.assigned_class && (
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-1">Live Assigned Class</span>
                    <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">{r.assigned_class}</span>
                  </div>
                )}
                {r.facilities && r.facilities.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-2">Facilities</span>
                    <div className="flex flex-wrap gap-2">
                      {r.facilities.map((f, i) => <span key={i} className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{f}</span>)}
                    </div>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-50 mt-4">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1 mb-2">
                    <Calendar size={12}/> Today's Schedule
                  </span>
                  {r.allocations && r.allocations.length > 0 ? (
                    <div className="space-y-1.5">
                      {r.allocations.map(a => (
                        <div key={a.id} className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1.5 rounded-md flex justify-between">
                          <span>{new Date(a.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(a.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="truncate ml-2">{a.subject} ({a.className})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-md text-center uppercase tracking-widest">
                      Available All Day
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button onClick={() => { setSelectedRoom(r); setShowAllocateModal(true); }} className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 flex justify-center items-center gap-2">
                  <Calendar size={14} /> Book / Allocate
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Room</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Type</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Capacity</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{r.name} <span className="text-xs text-slate-400 ml-2 block sm:inline">{r.building}</span></td>
                  <td className="p-4 text-xs font-bold text-slate-500">{r.type}</td>
                  <td className="p-4 font-bold text-slate-600">{r.capacity}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${r.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{r.status}</span></td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setSelectedRoom(r); setShowAllocateModal(true); }} className="text-indigo-600 font-bold text-xs uppercase hover:underline mr-4">Allocate</button>
                    <button onClick={() => handleDelete(r.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl p-10 transform animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Plus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create New Space</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Register a new room or facility</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block ml-1">Room Name / No.</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" size={18} />
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" placeholder="e.g. Lab 101" />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block ml-1">Room Category</label>
                  <div className="relative group">
                    <Grid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" size={18} />
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 appearance-none">
                      <option value="CLASSROOM">Classroom</option>
                      <option value="LAB">Laboratory</option>
                      <option value="LIBRARY">Library / Study Room</option>
                      <option value="EXAM_HALL">Exam Hall</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block ml-1">Seating Capacity</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="number" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block ml-1">Primary Status</label>
                  <div className="relative group">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 appearance-none">
                      <option value="AVAILABLE">🟢 Available</option>
                      <option value="OCCUPIED">🔴 Occupied</option>
                      <option value="MAINTENANCE">🟡 Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block ml-1">Building Wing</label>
                  <input type="text" value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" placeholder="e.g. Block A" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block ml-1">Floor Level</label>
                  <input type="text" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" placeholder="1st Floor" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block ml-1">Available Facilities (Comma Separated)</label>
                <div className="relative group">
                  <Grid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" value={formData.facilities} onChange={e => setFormData({...formData, facilities: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" placeholder="Projector, Wi-Fi, HVAC..." />
                </div>
              </div>
              <div className="flex gap-4 mt-10 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-100 rounded-[1.25rem] transition-colors">Discard</button>
                <button type="submit" className="flex-2 w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-[1.25rem] hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95">Save Room Details</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Room Modal */}
      {showAllocateModal && selectedRoom && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[4px] animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl p-10 transform animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col items-stretch">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-sky-400 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  <Calendar size={28} />
                </div>
                <div>
                  <h2 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">Booking Session</h2>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Allocate {selectedRoom.name}</h3>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Capacity: {selectedRoom.capacity}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{selectedRoom.building} • Floor {selectedRoom.floor || 'G'}</span>
              </div>
            </div>
            
            <form onSubmit={handleAllocate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Class Name</label>
                  <div className="relative group">
                    <Grid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500" size={18} />
                    <select required value={allocData.className} onChange={e => setAllocData({...allocData, className: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 mt-1 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 appearance-none">
                      <option value="">Select Class</option>
                      {[...new Set(metadata.classes.map(c => c.name))].map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Section</label>
                  <select required value={allocData.section} onChange={e => setAllocData({...allocData, section: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 mt-1 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 appearance-none">
                    <option value="">Sec</option>
                    {['A', 'B', 'C', 'D', 'E'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Subject & Course</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
                    <select required value={allocData.subject} onChange={e => setAllocData({...allocData, subject: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 mt-1 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 appearance-none">
                      <option value="">Select Subject</option>
                      {[...new Set(metadata.subjects.map(s => s.name))].map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Assigned Teacher</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
                    <select required value={allocData.teacher} onChange={e => setAllocData({...allocData, teacher: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 mt-1 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 appearance-none">
                      <option value="">Select Teacher</option>
                      {metadata.teachers.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.employee_id})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Allocation Date</label>
                  <input type="date" required value={allocData.date} onChange={e => setAllocData({...allocData, date: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 mt-1 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 text-emerald-600">Start Time</label>
                  <input type="time" required value={allocData.startTime} onChange={e => setAllocData({...allocData, startTime: e.target.value})} className="w-full px-4 py-3.5 bg-emerald-50/50 border border-emerald-200 mt-1 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 text-rose-600">End Time</label>
                  <input type="time" required value={allocData.endTime} onChange={e => setAllocData({...allocData, endTime: e.target.value})} className="w-full px-4 py-3.5 bg-rose-50/50 border border-rose-200 mt-1 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-bold text-slate-800" />
                </div>
              </div>

              <div className="flex gap-4 mt-10 pt-6">
                <button type="button" onClick={() => setShowAllocateModal(false)} className="flex-1 py-4 text-slate-500 font-extrabold text-[11px] uppercase tracking-widest hover:bg-slate-50 rounded-[1.25rem] transition-all">Cancel</button>
                <button type="submit" className="flex-2 w-full py-4 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.15em] rounded-[1.25rem] hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center gap-3 justify-center active:scale-95">
                  <CheckCircle size={18} /> Confirm Slot Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
