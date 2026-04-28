import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Youtube, 
  Instagram, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin,
  Smartphone,
  Monitor,
  Chrome,
  Send
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#F8FAFC] pt-24 pb-12 border-t border-slate-200 relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Branding */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImg} alt="Sqool Logo" className="w-10 h-10 object-contain" />
              <span className="text-3xl font-black tracking-tighter text-blue-600">Sqool</span>
            </Link>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">
              Sqool — The world's #1 kinetic school management software, empowering academies worldwide to manage everything digitally with ease and excellence.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/about" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider text-[11px]">About Sqool</Link>
              <Link to="/reviews" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider text-[11px]">Reviews & Awards</Link>
              <Link to="/careers" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider text-[11px]">Careers</Link>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-indigo-100 transition-all text-sm group">
              <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" /> Contact Us
            </button>
            <div className="flex gap-4 pt-4">
              <SocialIcon icon={<Facebook size={18} />} color="hover:bg-blue-100 hover:text-blue-600" />
              <SocialIcon icon={<Youtube size={18} />} color="hover:bg-rose-100 hover:text-rose-600" />
              <SocialIcon icon={<Instagram size={18} />} color="hover:bg-pink-100 hover:text-pink-600" />
              <SocialIcon icon={<Twitter size={18} />} color="hover:bg-sky-100 hover:text-sky-600" />
              <SocialIcon icon={<Linkedin size={18} />} color="hover:bg-blue-100 hover:text-blue-700" />
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-1">
            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Information</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-600">
                <li><Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link></li>
                <li><Link to="/pricing" className="hover:text-blue-600 transition-colors">Plans & Pricing</Link></li>
                <li><Link to="/services" className="hover:text-blue-600 transition-colors">Services</Link></li>
                <li><Link to="/features" className="hover:text-blue-600 transition-colors">Features</Link></li>
                <li><Link to="/affiliate" className="hover:text-blue-600 transition-colors">Affiliate Program</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Support</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-600">
                <li><Link to="/kb" className="hover:text-blue-600 transition-colors">Knowledge Base</Link></li>
                <li><Link to="/tutorials" className="hover:text-blue-600 transition-colors">Tutorials</Link></li>
                <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Our Blogs</Link></li>
                <li><Link to="/changelog" className="hover:text-blue-600 transition-colors">Changelogs</Link></li>
              </ul>
              <div className="pt-2">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Legal</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-600">
                  <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Column 3: Apps */}
          <div className="space-y-8">
            <div className="space-y-5">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><Smartphone size={14} /> Mobile apps</h4>
              <div className="flex flex-col gap-3">
                <AppButton 
                  icon={<img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-full" alt="Play Store" />} 
                  label="Play Store" 
                  sub="GET IT ON"
                  bg="bg-[#4F46E5]"
                />
                <AppButton 
                  icon={<img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" className="h-full" alt="App Store" />} 
                  label="App Store" 
                  sub="Download on the"
                  bg="bg-[#594EF1]"
                />
              </div>
            </div>
            <div className="space-y-5 pt-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><Monitor size={14} /> Desktop apps</h4>
              <div className="flex flex-wrap gap-2">
                <DesktopIcon icon={<Monitor size={16} />} bg="bg-[#0078D4]" title="Windows" />
                <DesktopIcon icon={<div className="font-black text-[10px]">OSX</div>} bg="bg-slate-900" title="macOS" />
                <DesktopIcon icon={<div className="font-black text-[10px]">Tux</div>} bg="bg-[#333333]" title="Linux" />
                <DesktopIcon icon={<Chrome size={16} />} bg="bg-[#4285F4]" title="Chrome" />
              </div>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Contacts</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0"><MapPin size={18} /></div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">Manchester M1 7ED, United Kingdom,<br />Oxford House, Oxford Rd</p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0"><Mail size={18} /></div>
                <p className="text-sm font-bold text-slate-600">support@sqool.com</p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0"><Phone size={18} /></div>
                <p className="text-2xl font-black text-slate-800">+44 (740) 407 4252</p>
              </div>
            </div>
          </div>

        </div>

        {/* Newsletter & Badges Row */}
        <div className="border-y border-slate-100 py-12 mb-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Get updates from Sqool</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subscribe now to be in the know</p>
            </div>
            <form className="flex gap-3 max-w-md">
              <div className="relative flex-1 group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold text-sm shadow-sm"
                />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 group">
                Subscribe <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 font-bold">By subscribing, you're accept <Link to="/privacy" className="text-indigo-600 border-b border-indigo-200">Privacy Policy</Link></p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-10 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <TrustBadge img="https://img.icons8.com/color/48/000000/google-play.png" label="Top Rated" />
            <TrustBadge img="https://img.icons8.com/color/48/000000/mac-os.png" label="Apple Choice" />
            <TrustBadge img="https://img.icons8.com/color/48/000000/product-hunt.png" label="#1 SaaS" />
            <TrustBadge img="https://img.icons8.com/color/48/000000/verified-account.png" label="COPPA Secure" />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm font-bold text-slate-400">
            Copyright © 2026 <span className="text-blue-600">Sqool Inc.</span> - All rights reserved.
          </div>
          <div className="flex items-center gap-6 opacity-40 grayscale">
             <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" alt="Visa" />
             <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6" alt="Mastercard" />
             <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-6" alt="Paypal" />
             <img src="https://img.icons8.com/color/48/000000/bank-cards.png" className="h-6" alt="Other Card" />
             <div className="h-6 w-12 bg-slate-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, color }) => (
  <button className={`w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm transition-all ${color} hover:scale-110 active:scale-95`}>
    {icon}
  </button>
);

const AppButton = ({ icon, label, sub, bg }) => (
  <button className={`flex items-center gap-3 px-6 py-2.5 ${bg} text-white rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95`}>
    <div className="h-8">
      {icon}
    </div>
    <div className="text-left">
      <div className="text-[10px] font-black uppercase text-white/70 leading-none">{sub}</div>
      <div className="text-sm font-black tracking-tight">{label}</div>
    </div>
  </button>
);

const DesktopIcon = ({ icon, bg, title }) => (
  <button className={`w-10 h-10 rounded-xl ${bg} text-white flex items-center justify-center hover:scale-110 transition-all shadow-md active:scale-95`} title={title}>
    {icon}
  </button>
);

const TrustBadge = ({ img, label }) => (
  <div className="flex items-center gap-3">
    <img src={img} className="w-8 h-8 object-contain" alt={label} />
    <div className="text-left">
      <div className="text-[9px] font-black text-slate-900 leading-none mb-1">{label}</div>
      <div className="flex gap-0.5"><div className="w-1 h-1 rounded-full bg-amber-400"></div><div className="w-1 h-1 rounded-full bg-amber-400"></div><div className="w-1 h-1 rounded-full bg-amber-400"></div><div className="w-1 h-1 rounded-full bg-amber-400"></div></div>
    </div>
  </div>
);

export default Footer;
