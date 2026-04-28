import React from 'react';
import { Calendar, Users, Eye, Trash2, Edit2, AlertCircle, Bookmark, FileText } from 'lucide-react';

const AnnouncementCard = ({ data, onDelete, onEdit, onMarkSeen }) => {
  const categoryColors = {
    URGENT: 'bg-rose-50 text-rose-600 border-rose-100',
    ACADEMIC: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    EVENT: 'bg-amber-50 text-amber-600 border-amber-100',
    GENERAL: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  return (
    <div className={`group bg-white rounded-3xl p-6 border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${data.is_urgent ? 'border-rose-100 shadow-rose-50' : 'border-slate-50 hover:border-indigo-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${categoryColors[data.category] || categoryColors.GENERAL}`}>
            {data.category}
          </span>
          {data.is_urgent && (
            <span className="px-4 py-1 bg-rose-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
              <AlertCircle size={12}/> Critical
            </span>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(data)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Edit2 size={16}/>
          </button>
          <button onClick={() => onDelete(data.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
            <Trash2 size={16}/>
          </button>
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
        {data.title}
      </h3>
      
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
        {data.message}
      </p>

      {data.attachments?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {data.attachments.map((att, idx) => (
            <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
              <FileText size={14}/>
              <span className="text-[10px] font-bold">Attachment {idx + 1}</span>
            </a>
          ))}
        </div>
      )}

      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <Users size={14} className="text-indigo-400"/>
            {data.audiences?.[0]?.type || 'All'} {data.audiences?.[0]?.value && `- ${data.audiences[0].value}`}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <Calendar size={14} className="text-indigo-400"/>
            {new Date(data.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
            <Eye size={14}/>
            {data.view_count || 0} Registered Reads
          </div>
          <button 
            onClick={() => onMarkSeen(data.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
          >
            Mark Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
