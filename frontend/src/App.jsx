import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/AdminDashboard';
import TeacherPanel from './pages/TeacherPanel';
import StudentPanel from './pages/StudentPanel';
import RegisterCampus from './pages/RegisterCampus';
import LandingPage from './pages/LandingPage';
import FeaturePlaceholder from './pages/FeaturePlaceholder';
import AdmissionPage from './pages/AdmissionPage';
import EventsPage from './pages/EventsPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import TimetablePage from './pages/TimetablePage';
import CircularsPage from './pages/CircularsPage';
import ExamsPage from './pages/exams/ExamsPage';
import LibraryDashboard from './pages/LibraryDashboard';
import GalleryPage from './pages/GalleryPage';
import TransportPage from './pages/TransportPage';
import AwardsPage from './pages/AwardsPage';
import FeesPage from './pages/FeesPage';

// Academic Module Pages
import AcademicDashboard from './pages/academic/AcademicDashboard';
import ClassManagementPage from './pages/academic/ClassManagementPage';
import SubjectManagementPage from './pages/academic/SubjectManagementPage';
import TimetableAdvancedPage from './pages/academic/TimetableAdvancedPage';
import SyllabusTrackerPage from './pages/academic/SyllabusTrackerPage';
import LessonPlannerPage from './pages/academic/LessonPlannerPage';
import AssignmentCenterPage from './pages/academic/AssignmentCenterPage';
import MaterialVaultPage from './pages/academic/MaterialVaultPage';
import AcademicCalendarPage from './pages/academic/AcademicCalendarPage';
import RoomManagementPage from './pages/academic/RoomManagementPage';

// Faculty Module Pages
import FacultyDashboardPage from './pages/faculty/FacultyDashboardPage';
import TeacherDirectoryPage from './pages/faculty/TeacherDirectoryPage';
import TeacherWorkloadPage from './pages/faculty/TeacherWorkloadPage';
import TeacherPayrollPage from './pages/faculty/TeacherPayrollPage';
import TeacherAttendancePage from './pages/faculty/TeacherAttendancePage';
import ProfilePage from './pages/ProfilePage';
import AdmissionAppForm from './pages/AdmissionAppForm';
import PaymentSim from './pages/PaymentSim';
import AdmissionLogin from './pages/AdmissionLogin';
import AdmissionDashboard from './pages/AdmissionDashboard';
import AdmissionAdmin from './pages/AdmissionAdmin';


import { 
    UserCheck, BookOpen, GraduationCap, Users, Library, 
    CreditCard, Landmark, FileText, Bell, Calendar, 
    Image as ImageIcon, Bus, Trophy, Clock, CheckSquare, 
    FileEdit, ClipboardList, MessageSquare 
} from 'lucide-react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/student" element={<Login />} />
        <Route path="/login/teacher" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/register" element={<RegisterCampus />} />
        
        {/* Admission System Public Routes */}
        <Route path="/admission-form" element={<AdmissionAppForm />} />
        <Route path="/admission-payment" element={<PaymentSim />} />
        <Route path="/admission-login" element={<AdmissionLogin />} />
        <Route path="/admission-dashboard" element={<AdmissionDashboard />} />


        {/* Protected Routes (Dashboard & Panels) */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Navigate to="admin" replace />} />
          
          {/* Shared/Dynamic Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="teacher" element={<TeacherPanel />} />
          <Route path="student" element={<StudentPanel />} />
          
          {/* Feature Modules - Admin/Shared */}
          <Route path="admission" element={<AdmissionPage />} />
          
          {/* Academic Module Routes */}
          <Route path="academic" element={<AcademicDashboard />} />
          <Route path="academic/rooms" element={<RoomManagementPage />} />
          <Route path="academic/classes" element={<ClassManagementPage />} />
          <Route path="academic/subjects" element={<SubjectManagementPage />} />
          <Route path="academic/timetable" element={<TimetableAdvancedPage />} />
          <Route path="academic/syllabus" element={<SyllabusTrackerPage />} />
          <Route path="academic/lessons" element={<LessonPlannerPage />} />
          <Route path="academic/assignments" element={<AssignmentCenterPage />} />
          <Route path="academic/materials" element={<MaterialVaultPage />} />
          <Route path="academic/calendar" element={<AcademicCalendarPage />} />

          {/* Faculty Module Routes */}
          <Route path="faculty" element={<FacultyDashboardPage />} />
          <Route path="faculty/directory" element={<TeacherDirectoryPage />} />
          <Route path="faculty/workload" element={<TeacherWorkloadPage />} />
          <Route path="faculty/payroll" element={<TeacherPayrollPage />} />
          <Route path="faculty/attendance" element={<TeacherAttendancePage />} />

          <Route path="students" element={<StudentsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="library" element={<LibraryDashboard />} />
          <Route path="fees" element={<FeesPage />} />
          <Route path="accounts" element={<FeaturePlaceholder title="Accounts" icon={Landmark} />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="circulars" element={<CircularsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="transport" element={<TransportPage />} />
          <Route path="awards" element={<AwardsPage />} />
          <Route path="admission-pipeline" element={<AdmissionAdmin />} />


          {/* Teacher Specific Modals */}
          <Route path="manage-students" element={<StudentsPage />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="exam-validation" element={<FeaturePlaceholder title="Exam Validation" icon={CheckSquare} />} />
          <Route path="homework" element={<FeaturePlaceholder title="Homework & Assignments" icon={FileEdit} />} />
          <Route path="attendance" element={<FeaturePlaceholder title="Attendance Tracking" icon={ClipboardList} />} />
          <Route path="leaves" element={<FeaturePlaceholder title="Leave Management" icon={MessageSquare} />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
