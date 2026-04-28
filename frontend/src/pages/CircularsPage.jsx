import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Megaphone, Search, Filter, Calendar, Send, 
  Bell, LayoutGrid, Clock, Archive, Plus 
} from 'lucide-react';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import CreateAnnouncementModal from '../components/announcements/CreateAnnouncementModal';
import { API_BASE } from '../config';

const CircularsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // active, scheduled, archived
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const institutionId = localStorage.getItem('sqool_institution_id') || 1;
  const userId = localStorage.getItem('sqool_user_id');

  useEffect(() => {
    fetchAnnouncements();
  }, [activeTab, institutionId]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/announcements`, {
        params: { 
          institution_id: institutionId,
          status: activeTab
        }
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSeen = async (id) => {
    try {
      await axios.post(`${API_BASE}/announcements/${id}/view`, { user_id: userId });
      fetchAnnouncements();
    } catch (err) {
      console.error('Error marking as seen', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirm permanent removal of this notice?')) return;
    try {
      await axios.delete(`${API_BASE}/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      console.error('Error deleting announcement', err);
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 rotate-3">
                <Megaphone size={24} />
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Official Announcements</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest ml-1">Central Intelligence & Communication Hub</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 italic"
        >
          <Send size={16}/> Dispatch New Notice
        </button>
      </div>

      {/* Filters Hub */}
      <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-100/50 border border-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search secure archives..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700 shadow-inner placeholder:text-slate-400"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="bg-transparent border-none outline-none font-black text-[10px] uppercase tracking-widest text-slate-500 appearance-none cursor-pointer"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="URGENT">Urgent</option>
              <option value="ACADEMIC">Academic</option>
              <option value="EVENT">Events</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm cursor-help hover:bg-white transition-colors">
            <Calendar size={18} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date().toDateString()}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] gap-1 shadow-inner">
           <TabButton 
             active={activeTab === 'active'} 
             onClick={() => setActiveTab('active')} 
             icon={<LayoutGrid size={14}/>} 
             label="ACTIVE" 
           />
           <TabButton 
             active={activeTab === 'scheduled'} 
             onClick={() => setActiveTab('scheduled')} 
             icon={<Clock size={14}/>} 
             label="SCHEDULED" 
           />
           <TabButton 
             active={activeTab === 'archived'} 
             onClick={() => setActiveTab('archived')} 
             icon={<Archive size={14}/>} 
             label="ARCHIVED" 
           />
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center gap-6 opacity-30">
            <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <p className="font-black text-slate-900 uppercase tracking-[0.5em] text-sm italic">Synchronizing Secure Stream...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="col-span-full py-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-8 shadow-inner">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 border-4 border-white shadow-xl">
               <Bell size={48} />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">No Intelligence Reports</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Awaiting primary directive or manual broadcast</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-900 shadow-2xl hover:-translate-y-2 transition-all flex items-center gap-3"
            >
               <Plus size={20}/> Dispatch First Broadcast
            </button>
          </div>
        ) : (
          filteredAnnouncements.map(a => (
            <AnnouncementCard 
              key={a.id} 
              data={a} 
              onDelete={handleDelete}
              onMarkSeen={handleMarkSeen}
              onEdit={(data) => {
                alert(`Edit feature coming soon for: ${data.title}`);
              }}
            />
          ))
        )}
      </div>

      {showModal && (
        <CreateAnnouncementModal 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchAnnouncements();
          }}
          institutionId={institutionId}
          API_BASE={API_BASE}
        />
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100 italic' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon} {label}
  </button>
);

export default CircularsPage;

