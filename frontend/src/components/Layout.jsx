import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LogOut, LayoutDashboard, Users, BookOpen, GraduationCap,
    Library, CreditCard, Landmark, FileText, Calendar,
    Image as ImageIcon, Bus, Trophy, UserCheck, ClipboardList,
    Clock, CheckSquare, FileEdit, MessageSquare, Bell
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem('sqool_user_role') || 'STUDENT';
    const userName = localStorage.getItem('sqool_user_name') || 'User';
    const institutionName = localStorage.getItem('sqool_institution_name') || userName;
    const institutionLogo = localStorage.getItem('sqool_institution_logo');
    const displayName = userRole === 'STUDENT' ? userName : institutionName;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getNavItems = () => {
        if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
            return [
                { name: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
                { name: 'Admission', path: '/dashboard/admission', icon: UserCheck },
                { name: 'Academic', path: '/dashboard/academic', icon: BookOpen },
                { name: 'Faculty', path: '/dashboard/faculty', icon: Users },
                { name: 'Students', path: '/dashboard/students', icon: GraduationCap },
                { name: 'Library', path: '/dashboard/library', icon: Library },
                { name: 'Fees', path: '/dashboard/fees', icon: CreditCard },
                { name: 'Accounts', path: '/dashboard/accounts', icon: Landmark },
                { name: 'Exams', path: '/dashboard/exams', icon: FileText },
                { name: 'Circular', path: '/dashboard/circulars', icon: Bell },
                { name: 'Events', path: '/dashboard/events', icon: Calendar },
                { name: 'Gallery', path: '/dashboard/gallery', icon: ImageIcon },
                { name: 'Transport', path: '/dashboard/transport', icon: Bus },
                { name: 'Awards', path: '/dashboard/awards', icon: Trophy },
            ];
        }

        if (userRole === 'TEACHER') {
            return [
                { name: 'Dashboard', path: '/dashboard/teacher', icon: LayoutDashboard },
                { name: 'Manage Students', path: '/dashboard/manage-students', icon: Users },
                { name: 'Timetable', path: '/dashboard/timetable', icon: Clock },
                { name: 'Exam Validation', path: '/dashboard/exam-validation', icon: CheckSquare },
                { name: 'Homework', path: '/dashboard/homework', icon: FileEdit },
                { name: 'Attendance', path: '/dashboard/attendance', icon: ClipboardList },
                { name: 'Leaves', path: '/dashboard/leaves', icon: MessageSquare },
                { name: 'Circular', path: '/dashboard/circulars', icon: Bell },
                { name: 'Events', path: '/dashboard/events', icon: Calendar },
                { name: 'Gallery', path: '/dashboard/gallery', icon: ImageIcon },
                { name: 'Awards', path: '/dashboard/awards', icon: Trophy },
            ];
        }

        // Default: Parent/Student
        return [
            { name: 'Dashboard', path: '/dashboard/student', icon: LayoutDashboard },
            { name: 'View Fees', path: '/dashboard/fees', icon: CreditCard },
            { name: 'Attendance', path: '/dashboard/attendance', icon: ClipboardList },
            { name: 'Timetable', path: '/dashboard/timetable', icon: Clock },
            { name: 'Calendar', path: '/dashboard/events', icon: Calendar },
            { name: 'Achievements', path: '/dashboard/awards', icon: Trophy },
            { name: 'Homework', path: '/dashboard/homework', icon: FileEdit },
            { name: 'Apply Leave', path: '/dashboard/leaves', icon: MessageSquare },
            { name: 'Circular', path: '/dashboard/circulars', icon: Bell },
            { name: 'Exam Schedule', path: '/dashboard/exams', icon: FileText },
            { name: 'Gallery', path: '/dashboard/gallery', icon: ImageIcon },
            { name: 'Transport', path: '/dashboard/transport', icon: Bus },
            { name: 'Library', path: '/dashboard/library', icon: Library },
        ];
    };

    const navItems = getNavItems();
    const roleColors = {
        ADMIN: { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
        SUPER_ADMIN: { bg: '#FEE2E2', text: '#DC2626', dot: '#EF4444' },
        TEACHER: { bg: '#DBEAFE', text: '#1D4ED8', dot: '#3B82F6' },
        STUDENT: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    };
    const rc = roleColors[userRole] || roleColors.STUDENT;

    return (
        <div className="flex h-screen" style={{ background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64" style={{
                background: '#f0f9ff',
                borderRight: '1px solid #e2e8f0',
                boxShadow: '2px 0 16px rgba(226,232,240,0.5)'
            }}>
                {/* School / Institution Info Card */}
                <div className="px-4 py-6" style={{ borderBottom: '1px solid #e0e7ff' }}>
                    <button
                        onClick={() => navigate('/dashboard/profile')}
                        className="w-full flex flex-col items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: 'transparent',
                            borderRadius: '24px',
                            padding: '16px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <div className="flex flex-col items-center gap-4" style={{ width: '100%' }}>
                            {/* Avatar / Logo */}
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: institutionLogo ? 'transparent' : '#f8fafc',
                                border: '2px solid #e2e8f0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '28px', fontWeight: '900', color: '#1e3a8a',
                                flexShrink: 0,
                                textTransform: 'uppercase',
                                overflow: 'hidden',
                                boxShadow: 'none'
                            }}>
                                {institutionLogo ? (
                                    <img src={institutionLogo} alt="logo" className="w-full h-full object-cover" />
                                ) : (
                                    displayName.charAt(0)
                                )}
                            </div>
                            
                            <div className="flex flex-col items-center w-full">
                                <p style={{
                                    color: '#1e293b',
                                    fontWeight: '800',
                                    fontSize: '1.1rem',
                                    letterSpacing: '-0.3px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.2,
                                    marginBottom: '4px',
                                    wordBreak: 'break-word',
                                    textAlign: 'center'
                                }}>{displayName}</p>
                                <p style={{
                                    color: '#64748b',
                                    fontSize: '0.65rem',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                }}>Powered by InstiFlow</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-3 px-3">
                    <ul className="space-y-0.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                                        style={{
                                            background: isActive ? '#1e3a8a' : 'transparent',
                                            color: isActive ? '#ffffff' : '#475569',
                                            fontWeight: isActive ? '700' : '500',
                                            fontSize: '0.8125rem',
                                        }}
                                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#e0f2fe'; e.currentTarget.style.color = '#1e3a8a'; } }}
                                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; } }}
                                    >
                                        <Icon size={17} />
                                        <span>{item.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4" style={{ borderTop: '1px solid #e0e7ff', background: 'transparent' }}>
                    <button onClick={handleLogout}
                        className="flex items-center justify-between w-full px-4 py-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                            color: '#ffffff',
                            border: 'none',
                            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                            cursor: 'pointer'
                        }}
                    >
                        {/* Decorative glow */}
                        <div style={{
                            position: 'absolute', top: '-10px', right: '-10px',
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)'
                        }} />
                        
                        <div className="flex items-center gap-3 relative z-10">
                            <LogOut size={18} />
                            <span className="font-bold text-sm">Logout</span>
                        </div>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '20px',
                            padding: '2px 8px',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            color: '#ffffff',
                            letterSpacing: '0.5px',
                            transition: 'all 0.2s'
                        }} className="relative z-10 group-hover:bg-white/30">
                            <span style={{ width: '4px', height: '4px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                            {userRole.replace('_', ' ')}
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto" style={{ background: '#f8fafc' }}>
                <Outlet />
            </main>
        </div>
    );
}
