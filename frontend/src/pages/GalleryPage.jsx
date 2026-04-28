import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Image as ImageIcon, Video, Calendar, UploadCloud, X, ChevronLeft, ChevronRight, FileArchive, Download } from 'lucide-react';

export default function GalleryPage() {
    const [loading, setLoading] = useState(true);
    const [activeAlbum, setActiveAlbum] = useState(null);
    const [lightboxMedia, setLightboxMedia] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState([]);
    const [filter, setFilter] = useState('All');

    const userRole = localStorage.getItem('sqool_user_role') || 'STUDENT';
    const canManage = ['ADMIN', 'SUPER_ADMIN', 'TEACHER'].includes(userRole);

    // Mock Albums
    const albums = [
        { id: 1, title: 'Annual Cultural Fest 2025', date: 'Mar 15, 2025', photos: 124, cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600' },
        { id: 2, title: 'Inter-School Sports Meet', date: 'Feb 20, 2025', photos: 86, cover: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600' },
        { id: 3, title: 'Science Exhibition', date: 'Jan 10, 2025', photos: 45, cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600' },
        { id: 4, title: 'Republic Day Parade', date: 'Jan 26, 2025', photos: 112, cover: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=600' }
    ];

    // Mock media inside an album
    const albumMedia = [
        { id: 101, type: 'image', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800' },
        { id: 102, type: 'image', url: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=800' },
        { id: 103, type: 'image', url: 'https://images.unsplash.com/photo-1523580846011-d3a5a8f40775?auto=format&fit=crop&q=80&w=800' },
        { id: 104, type: 'image', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800' },
        { id: 105, type: 'image', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800' },
        { id: 106, type: 'image', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800' },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const openLightbox = (index) => {
        setLightboxMedia(index);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileArray = Array.from(e.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setFilesToUpload(fileArray);
        }
    };

    const nextMedia = (e) => {
        e.stopPropagation();
        setLightboxMedia((prev) => (prev + 1) % albumMedia.length);
    };

    const prevMedia = (e) => {
        e.stopPropagation();
        setLightboxMedia((prev) => (prev - 1 + albumMedia.length) % albumMedia.length);
    };

    if (loading) return <GallerySkeletonLoader />;

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#FFFBF0] font-['Inter']">
            
            {/* Main Header / Top Section */}
            {!activeAlbum && (
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-white p-6 rounded-[2.5rem] border border-[#FDEE8A] shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-rose-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                            <ImageIcon size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Media Gallery</h1>
                            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">School Memories & Events</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative group flex-grow md:flex-grow-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search albums..." 
                                className="w-full md:w-64 pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all shadow-inner"
                            />
                        </div>
                        <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                            <Filter size={18} />
                        </button>
                        {canManage && (
                            <button 
                                onClick={() => setShowUploadModal(true)}
                                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02]"
                            >
                                <Plus size={18} /> Upload
                            </button>
                        )}
                    </div>
                </motion.header>
            )}

            {/* Album Grid View */}
            <AnimatePresence mode="wait">
                {!activeAlbum ? (
                    <motion.div 
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {albums.map((album, index) => (
                            <motion.div 
                                key={album.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveAlbum(album)}
                                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                            >
                                <div className="h-48 relative overflow-hidden bg-slate-100">
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                                    <img 
                                        src={album.cover} 
                                        alt={album.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        loading="lazy"
                                    />
                                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg z-20 flex items-center gap-1.5">
                                        <ImageIcon size={12} /> {album.photos} Items
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-black text-slate-800 mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">{album.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                        <Calendar size={14} /> {album.date}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Inside Album / Masonry View */
                    <motion.div 
                        key="album"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-between items-end mb-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div>
                                <button 
                                    onClick={() => setActiveAlbum(null)}
                                    className="flex items-center gap-1 text-slate-400 hover:text-slate-800 text-[11px] font-black uppercase tracking-widest transition-colors mb-4"
                                >
                                    <ChevronLeft size={16} /> Back to Gallery
                                </button>
                                <h1 className="text-3xl font-black text-slate-900">{activeAlbum.title}</h1>
                                <p className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-3">
                                    <span><Calendar size={14} className="inline mr-1" /> {activeAlbum.date}</span>
                                    <span>•</span>
                                    <span>{activeAlbum.photos} Media items</span>
                                </p>
                            </div>
                            <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all text-sm">
                                <Download size={16} /> <span className="hidden sm:inline">Download Zip</span>
                            </button>
                        </div>

                        {/* Pinterest Style Masonry Grid Simulation */}
                        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {albumMedia.map((media, idx) => (
                                <motion.div 
                                    key={media.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
                                    onClick={() => openLightbox(idx)}
                                >
                                    <img 
                                        src={media.url} 
                                        alt="Gallery item" 
                                        className="w-full h-auto object-cover rounded-2xl"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                                        <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg hover:bg-white/40 transition-colors pointer-events-auto">
                                            <Download size={14}/>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox Preview */}
            <AnimatePresence>
                {lightboxMedia !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                        onClick={() => setLightboxMedia(null)}
                    >
                        <button 
                            className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                            onClick={() => setLightboxMedia(null)}
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="relative w-full max-w-5xl md:px-12 flex items-center justify-center">
                            <img 
                                src={albumMedia[lightboxMedia].url} 
                                alt="Fullscreen Preview"
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                                onClick={e => e.stopPropagation()} 
                            />

                            <button 
                                className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md"
                                onClick={prevMedia}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md"
                                onClick={nextMedia}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-bold text-xs">
                            {lightboxMedia + 1} / {albumMedia.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Modal (For Admins) */}
            <AnimatePresence>
                {showUploadModal && canManage && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800">Upload Media</h2>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">To existing or new album</p>
                                </div>
                                <button onClick={() => { setShowUploadModal(false); setFilesToUpload([]); }} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><X size={20}/></button>
                            </div>
                            <div className="p-8 overflow-y-auto">
                                {filesToUpload.length === 0 ? (
                                    <label className="border-3 border-dashed border-slate-200 rounded-3xl bg-slate-50 p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors group">
                                        <input type="file" multiple className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                            <UploadCloud size={32} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-700 mb-2">Drag & Drop files here</h3>
                                        <p className="text-sm font-semibold text-slate-400 mb-6 max-w-sm">Support JPG, PNG, MP4 up to 50MB per file. High-resolution photos will be automatically compressed.</p>
                                        <div className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all inline-block pointer-events-none">
                                            Browse Files
                                        </div>
                                    </label>
                                ) : (
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Preview Section */}
                                        <div className="w-full md:w-1/2 space-y-4">
                                            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                                                <img src={filesToUpload[0].preview} className="w-full h-full object-cover" alt="Preview Main" />
                                                {filesToUpload.length > 1 && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                                        <span className="text-white text-3xl font-black shadow-sm">+{filesToUpload.length - 1}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                                {filesToUpload.map((f, i) => (
                                                    <div key={i} className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all">
                                                        <img src={f.preview} className="w-full h-full object-cover" alt="Thumb" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Details Form Section */}
                                        <div className="w-full md:w-1/2 space-y-5">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Select Album</label>
                                                <select className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20">
                                                    <option>Select an existing album...</option>
                                                    {albums.map(a => <option key={a.id}>{a.title}</option>)}
                                                </select>
                                            </div>
                                            <div className="relative flex items-center gap-3">
                                                <div className="h-px bg-slate-200 flex-1"></div>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                                                <div className="h-px bg-slate-200 flex-1"></div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Create New Album</label>
                                                <input type="text" placeholder="e.g. Science Fair 2026" className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Event Date</label>
                                                <input type="date" className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20" />
                                            </div>
                                            
                                            <div className="pt-4 flex gap-3">
                                                <button onClick={() => setFilesToUpload([])} className="flex-1 py-3.5 bg-slate-100 text-slate-500 text-xs uppercase tracking-widest font-black rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                                                <button onClick={() => { setShowUploadModal(false); setFilesToUpload([]); }} className="flex-[2] py-3.5 bg-blue-600 text-white text-xs uppercase tracking-widest font-black rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                                    <UploadCloud size={16} /> Upload {filesToUpload.length} Files
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

function GallerySkeletonLoader() {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#FFFBF0]">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 mb-10">
                <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-200 rounded-2xl animate-pulse"></div>
                    <div>
                        <div className="w-40 h-6 bg-slate-200 rounded-md animate-pulse mb-2"></div>
                        <div className="w-24 h-3 bg-slate-200 rounded-md animate-pulse"></div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="w-64 h-12 bg-slate-100 rounded-xl animate-pulse"></div>
                    <div className="w-24 h-12 bg-slate-100 rounded-xl animate-pulse"></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100">
                        <div className="w-full h-40 bg-slate-100 rounded-2xl mb-4 animate-pulse"></div>
                        <div className="w-3/4 h-5 bg-slate-200 rounded-md mb-3 animate-pulse"></div>
                        <div className="w-1/2 h-3 bg-slate-100 rounded-md animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
