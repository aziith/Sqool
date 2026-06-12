import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Users, CreditCard, Activity, BookOpen, CheckCircle2, GraduationCap } from 'lucide-react';
import logoImg from '../assets/logo.png';
import ParticleBackground from '../components/ParticleBackground';
import Footer from '../components/Footer';

// --- 1. Cursor Spotlight & Global Blobs ---
function BackgroundEffects() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [particles] = useState(() =>
    Array.from({ length: 45 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 6 + 2,
      parallaxX: (Math.random() - 0.5) * 0.15,
      parallaxY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-[0.85] mix-blend-multiply">
        {/* Yellow-Amber Theme Blobs to match Onboarding flow */}
        <div className="absolute w-[900px] h-[900px] bg-amber-200/40 blur-[130px] rounded-full animate-blob top-[-200px] left-[-200px]" />
        <div className="absolute w-[700px] h-[700px] bg-yellow-400/30 blur-[130px] rounded-full animate-blob animation-delay-2000 bottom-[-150px] right-[-150px]" />
        <div className="absolute w-[600px] h-[600px] bg-orange-200/20 blur-[110px] rounded-full animate-blob animation-delay-4000 top-[35%] left-[25%]" />
        <div className="absolute w-[800px] h-[800px] bg-yellow-300/30 blur-[140px] rounded-full animate-blob animation-delay-[6000ms] top-[5%] right-[15%]" />
      </div>

      {/* Interactive Parallax Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              opacity: p.opacity,
            }}
            animate={{
              x: pos.x * p.parallaxX,
              y: pos.y * p.parallaxY,
            }}
            transition={{ type: "spring", stiffness: 40, damping: 20, mass: 0.5 }}
          />
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <motion.div
          animate={{ x: pos.x - 200, y: pos.y - 200 }}
          transition={{ type: "spring", mass: 0.1, stiffness: 200, damping: 20 }}
          className="absolute w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full"
        />
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none opacity-70 mix-blend-multiply">
        <ParticleBackground color="249, 199, 79" showLines={true} />
      </div>
    </>
  );
}

// --- 2. Magnetic Button Component ---
function MagneticButton({ children, className, ...props }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.button
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: (e.clientX - rect.left - rect.width / 2) * 0.2, y: (e.clientY - rect.top - rect.height / 2) * 0.2 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y, scale: (pos.x !== 0 || pos.y !== 0) ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className} {...props}
    >
      {children}
    </motion.button>
  );
}

// --- 3. Floating 3D Card Wrapper ---
function FloatingCardWrapper({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-200, 200], [10, -10]);
  const rotateY = useTransform(x, [-200, 200], [-10, 10]);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, transformStyle: "preserve-3d", transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Main Landing Page ---
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 overflow-hidden relative font-sans">
      <BackgroundEffects />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 15s infinite alternate ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}} />

      <header className="relative z-50 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="Sqool Logo" className="w-9 h-9 object-contain" />
            <span className="text-2xl font-black tracking-tight text-blue-600">Sqool</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600 items-center">
            <Link to="/" className="hover:text-blue-600 border-b-2 border-transparent pb-1">Home</Link>
            <a href="#features" className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-1">Features</a>
            <a href="#pricing" className="hover:text-blue-600 border-b-2 border-transparent pb-1">Pricing</a>
            <a href="#about" className="hover:text-blue-600 border-b-2 border-transparent pb-1">About</a>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-blue-600 border-b-2 border-transparent pb-1">
                Login <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden">
                <Link to="/login/student" className="px-4 py-3 hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center gap-2"><GraduationCap size={16} /> Student Portal</Link>
                <Link to="/login/teacher" className="px-4 py-3 hover:bg-slate-50 text-slate-700 font-medium text-sm border-t border-slate-100 flex items-center gap-2"><BookOpen size={16} /> Teacher Portal</Link>
                <Link to="/login" className="px-4 py-3 hover:bg-blue-50 text-blue-600 font-bold text-sm border-t border-slate-100 flex items-center gap-2"><Activity size={16} /> Admin Login</Link>
              </div>
            </div>
          </nav>
          <Link to="/register"><MagneticButton className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-700">Start Free Trial</MagneticButton></Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-20 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 bg-[#FDF0D5] text-[#D97706] rounded-full text-[10px] font-black tracking-widest uppercase">✨ Next-Gen Education</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tight">Smart Campus,<br /><span className="text-blue-600 italic font-serif tracking-normal">Better Future.</span></motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-600 max-w-lg leading-relaxed font-medium">The kinetic operating system for modern academies. Automate operations, track growth, and inspire learning with Sqool AI.</motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4 pt-4">
              <Link to="/register"><MagneticButton className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 shadow-xl border-2 border-blue-600">Explore Platform <ArrowRight size={20} /></MagneticButton></Link>
              <MagneticButton className="bg-white text-slate-700 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 border-2 border-slate-100 shadow-sm hover:shadow-md">Watch Demo</MagneticButton>
            </motion.div>
          </div>

          <div className="relative z-10 perspective-[2000px] h-[550px] w-full flex items-center justify-center">
            <FloatingCardWrapper className="w-[120%] h-full flex items-center justify-center relative -right-10">
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }} className="bg-white/80 backdrop-blur-3xl border border-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-xl" style={{ transform: "translateZ(50px)" }}>
                <div className="flex justify-between items-center mb-6 px-2">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-emerald-400"></div></div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-slate-300 bg-slate-100 px-3 py-1 rounded-full">Admin Control Center</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 relative">
                  <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-100"><Users size={18} className="text-blue-600 mb-3" /><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Students</p><h3 className="text-3xl font-black text-slate-800">2,840</h3><p className="text-[10px] font-bold text-blue-600 mt-2 flex gap-1"><ArrowRight size={10} className="-rotate-45" /> +12% this month</p></div>
                  <div className="bg-[#FEF9C3] p-6 rounded-3xl border border-amber-100"><CreditCard size={18} className="text-amber-600 mb-3" /><p className="text-[10px] font-black uppercase text-amber-600/70 mb-1">Fee Collection</p><h3 className="text-3xl font-black text-amber-900">94.2%</h3><p className="text-[10px] font-bold text-amber-600 mt-2 flex gap-1"><CheckCircle2 size={10} /> On track</p></div>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ y: { duration: 4, delay: 1, repeat: Infinity, ease: "easeInOut" } }} className="absolute -bottom-10 -left-12 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 border border-slate-100 z-20" style={{ transform: "translateZ(100px)" }}>
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white"><Activity size={16} /></div>
                    <div><p className="text-[9px] font-black uppercase text-amber-600">AI Insight</p><p className="text-xs font-bold text-slate-800">Attendance risk detected Grade 9</p></div>
                  </motion.div>
                </div>
                <div className="bg-[#F1F5F9] rounded-3xl p-6 relative">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-6">Academic Performance Index</p>
                  <div className="flex items-end justify-between h-20 gap-2 overflow-hidden mx-auto">
                    {[60, 80, 50, 95, 85, 100].map((h, i) => <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + Math.random() * 0.5 }} key={i} className={`w-full rounded-t-lg ${i === 3 || i === 5 ? 'bg-blue-700' : 'bg-blue-600'}`} />)}
                  </div>
                </div>
              </motion.div>
            </FloatingCardWrapper>
          </div>
        </div>
      </main>

      <section id="about" className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Image Side */}
            <div className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-100">
                {/* Fallback pattern if image is blocking/broken - simulates mockup illustration */}
                <div className="aspect-[4/3] w-full flex items-center justify-center relative bg-gradient-to-tr from-slate-200 to-slate-50">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Students learning" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <p className="text-5xl font-black mb-1 drop-shadow-md">500+</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/90 drop-shadow-sm">Institutions Empowered</p>
                  </div>
                </div>
              </div>
              {/* Decorative backgrounds */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-slate-100 rounded-[2.5rem] -z-10"></div>
              <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-[40px] -z-10"></div>
            </div>

            {/* Right Content Side */}
            <div>
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 border border-blue-100">Our Vision</div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Empowering education <br />
                <span className="text-blue-600">through AI.</span>
              </h2>
              <div className="space-y-6 text-slate-500 font-medium leading-relaxed mb-10 text-sm md:text-base">
                <p>
                  At Sqool, we believe that education is the cornerstone of a better future. Our mission is to dismantle the administrative hurdles that hold institutions back, allowing educators to focus on what truly matters: inspiring the next generation.
                </p>
                <p>
                  By integrating cutting-edge artificial intelligence into every facet of campus life—from automated attendance to academic analytics—we create a holistic ecosystem where data drives growth and technology serves humanity.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-[#F8F9FB] p-6 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
                  <h4 className="text-sm font-bold text-slate-800 mb-2">Human-Centric</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Built for the people who make the school system tick.</p>
                </div>
                <div className="bg-[#F8F9FB] p-6 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
                  <h4 className="text-sm font-bold text-slate-800 mb-2">Innovation-Led</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Always a step ahead with the latest AI breakthroughs.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="stakeholders" className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Designed for Every Stakeholder</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Tailored portals for personalized academic management and seamless communication.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FloatingCardWrapper>
              <div className="bg-white rounded-[2.5rem] p-10 h-full border border-slate-100 flex flex-col shadow-xl shadow-slate-200/40">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-8"><GraduationCap size={28} /></div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Student Portal</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">Your academic universe in one place. Stay on top of your journey with tools built for your success.</p>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-blue-600" /> Real-time attendance tracking</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-blue-600" /> Digital grades and report cards</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-blue-600" /> Exam schedules and study material</li>
                </ul>
                <Link to="/login/student" className="block w-full"><MagneticButton className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-bold shadow-lg transition-colors">Student Login</MagneticButton></Link>
              </div>
            </FloatingCardWrapper>

            <FloatingCardWrapper>
              <div className="bg-white rounded-[2.5rem] p-10 h-full border border-slate-100 flex flex-col shadow-xl shadow-slate-200/40">
                <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center text-slate-700 mb-8"><Users size={28} /></div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Teacher Portal</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">Empowering educators with automated tools. Focus more on teaching and less on paperwork.</p>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-slate-700" /> Automated roll calls & attendance</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-slate-700" /> Student performance analytics</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-slate-700" /> Fee management & reminders</li>
                </ul>
                <Link to="/login/teacher" className="block w-full"><MagneticButton className="w-full bg-slate-700 hover:bg-slate-800 text-white py-4 rounded-full font-bold shadow-lg transition-colors">Teacher Login</MagneticButton></Link>
              </div>
            </FloatingCardWrapper>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl pr-2 md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Ecosystem of Intelligence</h2>
            <p className="text-slate-500 font-medium">One platform to rule all campus administrative and academic hurdles.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <FloatingCardWrapper className="col-span-3">
              <div className="bg-[#F8F9FB] rounded-[2.5rem] p-10 h-full border border-slate-100 flex flex-col justify-between">
                <div><div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><CheckCircle2 size={24} /></div><h3 className="text-3xl font-black text-slate-800 mb-4">AI-Driven Attendance</h3><p className="text-slate-600 font-medium leading-relaxed max-w-sm mb-10">Automate roll calls using biometric and facial recognition integrated directly with your campus security system. Zero manual entry.</p></div>
                <div className="flex gap-3"><span className="bg-slate-200/50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold">99.9% Accuracy</span><span className="bg-slate-200/50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold">Real-time SMS Alerts</span></div>
              </div>
            </FloatingCardWrapper>
            <FloatingCardWrapper className="col-span-2">
              <div className="bg-[#FAF9F6] rounded-[2.5rem] p-10 h-full border border-stone-200 flex flex-col justify-between">
                <div><div className="bg-stone-200 w-14 h-14 rounded-2xl flex items-center justify-center text-stone-700 mb-6"><CreditCard size={24} /></div><h3 className="text-2xl font-black text-slate-800 mb-4">Automated Fees</h3><p className="text-slate-600 font-medium leading-relaxed mb-10">Smart invoicing, partial payments, and automated late-fee calculation with direct parent portal access.</p></div>
                <div><div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden mb-2"><div className="h-full bg-[#A16207] w-3/4"></div></div><p className="text-[9px] font-black uppercase text-[#A16207]">Current Revenue: 75% Collected</p></div>
              </div>
            </FloatingCardWrapper>
            <FloatingCardWrapper className="col-span-2">
              <div className="bg-[#F8FAFC] rounded-[2.5rem] p-10 h-full border border-slate-200 flex flex-col justify-between">
                <div><div className="bg-slate-200 w-14 h-14 rounded-2xl flex items-center justify-center text-slate-700 mb-6"><Activity size={24} /></div><h3 className="text-2xl font-black text-slate-800 mb-4">Academic Tracker</h3><p className="text-slate-600 font-medium leading-relaxed mb-10">Predict student performance using historical data and provide personalized interventions.</p></div>
                <div className="flex -space-x-3"><div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div><div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div><div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div><div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-white text-xs font-bold">+20</div></div>
              </div>
            </FloatingCardWrapper>
            <FloatingCardWrapper className="col-span-3">
              <div className="bg-[#F8F9FB] rounded-[2.5rem] p-10 h-full border border-slate-100 grid md:grid-cols-2 gap-8 items-center">
                <div><div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><BookOpen size={24} /></div><h3 className="text-2xl font-black text-slate-800 mb-4">Exam Mastery</h3><p className="text-slate-600 font-medium leading-relaxed">Schedule exams, generate digital papers, and publish results instantly to parent dashboards.</p></div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
                  {[{ l: 'Mid-Term Grade A', s: 'COMPLETED', c: 'text-emerald-500 bg-emerald-50' }, { l: 'Final Thesis Review', s: 'ONGOING', c: 'text-blue-500 bg-blue-50' }, { l: 'Lab Certifications', s: 'PENDING', c: 'text-amber-500 bg-amber-50' }].map((t, i) => <div key={i} className="flex justify-between items-center"><span className="text-xs font-bold text-slate-700">{t.l}</span><span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${t.c}`}>{t.s}</span></div>)}
                </div>
              </div>
            </FloatingCardWrapper>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black tracking-widest uppercase mb-6">Flexible Investment</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Plans for Every Academy</h2>
            <p className="text-slate-500 font-medium">Choose the toolkit that fits your institution's scale and goals.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Basic Plan */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative h-full flex flex-col">
              <h3 className="text-2xl font-black text-slate-800 mb-2">Basic</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-black text-slate-900">₹0</span>
                <span className="text-sm font-semibold text-slate-500">/ month</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Perfect for small coaching centers starting their digital journey.</p>
              <div className="flex-1">
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" /> Manual Attendance Entry</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" /> Basic Student Profiles</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" /> Digital Report Cards</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-400"><CheckCircle2 size={18} className="text-slate-300 flex-shrink-0" /> AI Academic Analytics</li>
                </ul>
              </div>
              <Link to="/register"><MagneticButton className="w-full bg-white border-2 border-blue-100 hover:border-blue-600 hover:text-blue-600 text-slate-700 py-4 rounded-full font-bold transition-colors">Get Started</MagneticButton></Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-[2.5rem] p-10 border-2 border-blue-600 shadow-2xl shadow-blue-600/20 relative lg:-mt-8 lg:mb-8 z-10 h-full flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-black text-slate-900">₹4,999</span>
                <span className="text-sm font-semibold text-slate-500">/ month</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">For growing schools that need automation and deep insights.</p>
              <div className="flex-1">
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" /> Automated Attendance (Biometric)</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" /> Full Fee Management Suite</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" /> AI Academic Performance Analytics</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" /> Automated Parent App Access</li>
                </ul>
              </div>
              <Link to="/register"><MagneticButton className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-bold shadow-lg transition-colors">Choose Pro Plan</MagneticButton></Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative h-full flex flex-col">
              <h3 className="text-2xl font-black text-slate-800 mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900">Custom</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Bespoke solutions for large multi-campus university networks.</p>
              <div className="flex-1">
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-slate-900 flex-shrink-0" /> Multi-Campus Management</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-slate-900 flex-shrink-0" /> White-label Mobile App</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-slate-900 flex-shrink-0" /> Custom ERP Integrations</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={18} className="text-slate-900 flex-shrink-0" /> 24/7 Dedicated Support</li>
                </ul>
              </div>
              <Link to="/register"><MagneticButton className="w-full bg-white border-2 border-slate-200 hover:border-slate-800 hover:text-slate-900 text-slate-700 py-4 rounded-full font-bold transition-colors">Contact Sales</MagneticButton></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative z-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="bg-blue-600 rounded-[3rem] p-16 text-center shadow-2xl shadow-blue-600/20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight max-w-2xl mx-auto">Ready to upgrade your institution?</h2>
            <p className="text-blue-100 font-medium text-lg max-w-xl mx-auto mb-10">Join 500+ academies globally who are leading the education revolution with Sqool AI.</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Link to="/register"><MagneticButton className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl">Get Started Now 🚀</MagneticButton></Link>
              <MagneticButton className="bg-transparent text-white border-2 border-white/20 hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg">Book a Workshop</MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
