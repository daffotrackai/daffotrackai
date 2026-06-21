import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowRight, Camera, Cpu, Sparkles, User, Mail, Lock, IdCard,
  BookUser, Phone, CalendarDays, MapPin, Users, BadgeInfo,
  VenusAndMars, Earth, CheckCircle2, Upload
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { setCurrentUser } from '../lib/session';
import PageTopBar from '../components/PageTopBar';

const DEPARTMENTS = [
  'Software Engineering', 'Computer Science & Engineering',
  'Computer Science', 'Electrical & Electronic Engineering',
  'Textile Engineering', 'Business Administration', 'Law', 'English',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function Register() {
  const navigate = useNavigate();
  // MainLayout থেকে ড্রয়ারের স্টেট রিসিভ করা হচ্ছে
  const { drawerOpen, setDrawerOpen } = useOutletContext();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', studentId: '',
    department: 'Software Engineering', phone: '', sessionYear: '',
    semester: '', dateOfBirth: '', address: '', guardianName: '',
    bloodGroup: '', gender: '', nationality: 'Bangladeshi',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    if (profileImage) payload.append('profileImage', profileImage);
    try {
      const response = await apiRequest('/api/users/register', { method: 'POST', body: payload });
      setCurrentUser(response);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed.');
      setStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ['Account Info', 'Academic Details', 'Personal Info'];

  return (
    <>
      <PageTopBar
        title="Create Profile"
        subtitle="Register your student information"
        backLabel="Login"
        backTo="/login"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* pt-24 যোগ করা হয়েছে যাতে টপ-বারের নিচে না ঢোকে */}
      <main className="flex-1 pt-24 pb-10 px-4 sm:px-6 lg:px-8 relative z-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 p-[2px] shadow-[0_0_20px_rgba(45,212,191,0.35)] shrink-0">
                <div className="w-full h-full bg-[#060e1a] rounded-[14px] flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-teal-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  Create your <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">DaffoTrack</span> Profile
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">Register once — access everything from your dashboard.</p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {steps.map((label, i) => {
                const num = i + 1;
                const done = step > num;
                const active = step === num;
                return (
                  <React.Fragment key={label}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      done ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30' :
                      active ? 'bg-teal-500 text-[#060e1a]' :
                      'bg-white/4 text-slate-500 border border-white/8'
                    }`}>
                      {done
                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : <span className="w-4 h-4 flex items-center justify-center">{num}</span>
                      }
                      <span className="hidden sm:block">{label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-6 h-px ${step > num ? 'bg-teal-500/50' : 'bg-white/10'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left: Photo upload + info */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-[#0a1525] border border-white/8 rounded-2xl p-6 space-y-5">
                  <h3 className="text-sm font-bold text-white">Profile Photo</h3>

                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-2xl bg-[#060e1a] border border-white/10 flex items-center justify-center overflow-hidden">
                        {previewUrl
                          ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          : <User className="w-12 h-12 text-slate-600" />
                        }
                      </div>
                      <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center cursor-pointer hover:bg-teal-400 transition-colors shadow-lg">
                        <Camera className="w-3.5 h-3.5 text-[#060e1a]" />
                      </label>
                    </div>
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Upload a clear profile photo</p>
                      <p className="text-[10px] text-slate-600 mt-1">JPG / PNG • Max 5 MB</p>
                    </div>
                    <label htmlFor="photo-upload"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 cursor-pointer text-xs font-semibold text-slate-300 transition-all">
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      {profileImage ? profileImage.name.slice(0, 22) + '…' : 'Choose file'}
                    </label>
                  </div>
                </div>

                <div className="bg-[#0a1525] border border-white/8 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> What you get
                  </div>
                  {['CGPA tracking & predictions', 'AI-powered academic advisor', 'Smart attendance alerts', 'DIU policy quick-guide', 'Secure MySQL profile storage'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </aside>

              {/* Right: Form panels */}
              <div className="lg:col-span-8">
                <div className="bg-[#0a1525] border border-white/8 rounded-2xl p-6 sm:p-8">

                  {error && (
                    <div className="mb-5 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Step 1: Account */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <SectionTitle icon={<User className="w-4 h-4" />} title="Account Information" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field icon={<User />} label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" required />
                        <Field icon={<Mail />} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="student@diu.edu.bd" required />
                        <Field icon={<Lock />} label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required />
                        <Field icon={<IdCard />} label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="221-15-XXXX" required />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Academic */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <SectionTitle icon={<BookUser className="w-4 h-4" />} title="Academic Details" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Department Select */}
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <BookUser className="w-3.5 h-3.5" /> Department
                          </label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/8 bg-[#060e1a] px-4 py-3 text-sm text-white focus:border-teal-500/60 focus:outline-none focus:ring-1 focus:ring-teal-500/30 transition-all"
                          >
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <Field icon={<CalendarDays />} label="Session Year" name="sessionYear" value={formData.sessionYear} onChange={handleChange} placeholder="2023–2024" />
                        <Field icon={<BadgeInfo />} label="Semester" name="semester" value={formData.semester} onChange={handleChange} placeholder="6th Semester" />
                        <Field icon={<Phone />} label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Personal */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <SectionTitle icon={<BadgeInfo className="w-4 h-4" />} title="Personal Information" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field icon={<CalendarDays />} label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                        <Field icon={<MapPin />} label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Home address" />
                        <Field icon={<Users />} label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Parent / Guardian" />
                        <Field icon={<Earth />} label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Bangladeshi" />

                        {/* Gender select */}
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <VenusAndMars className="w-3.5 h-3.5" /> Gender
                          </label>
                          <select name="gender" value={formData.gender} onChange={handleChange}
                            className="w-full rounded-xl border border-white/8 bg-[#060e1a] px-4 py-3 text-sm text-white focus:border-teal-500/60 focus:outline-none focus:ring-1 focus:ring-teal-500/30 transition-all">
                            <option value="">Select gender</option>
                            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>

                        {/* Blood group select */}
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <BadgeInfo className="w-3.5 h-3.5" /> Blood Group
                          </label>
                          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                            className="w-full rounded-xl border border-white/8 bg-[#060e1a] px-4 py-3 text-sm text-white focus:border-teal-500/60 focus:outline-none focus:ring-1 focus:ring-teal-500/30 transition-all">
                            <option value="">Select blood group</option>
                            {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div className="mt-8 flex items-center justify-between gap-4">
                    {step > 1 ? (
                      <button type="button" onClick={() => setStep(s => s - 1)}
                        className="px-6 py-3 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 text-sm font-semibold text-slate-300 transition-all">
                        ← Back
                      </button>
                    ) : (
                      <Link to="/login" className="text-xs text-slate-500 hover:text-teal-400 transition-colors">
                        ← Back to login
                      </Link>
                    )}

                    {step < 3 ? (
                      <button type="button" onClick={() => setStep(s => s + 1)}
                        className="flex items-center gap-2 px-7 py-3 rounded-xl bg-teal-500 text-[#060e1a] font-bold text-sm hover:bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all">
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button type="submit" disabled={isSubmitting}
                        className="flex items-center gap-2 px-7 py-3 rounded-xl bg-teal-500 text-[#060e1a] font-bold text-sm hover:bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all disabled:opacity-60">
                        {isSubmitting ? (
                          <><div className="w-4 h-4 border-2 border-[#060e1a] border-t-transparent rounded-full animate-spin" /> Saving...</>
                        ) : (
                          <>Create Profile <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5 pb-4 border-b border-white/6 mb-1">
      <div className="text-teal-400">{icon}</div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
    </div>
  );
}

function Field({ icon, label, name, value, onChange, placeholder, type = 'text', required = false }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span className="text-slate-500 w-3.5 h-3.5 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/8 bg-[#060e1a] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-teal-500/60 focus:outline-none focus:ring-1 focus:ring-teal-500/30 transition-all"
      />
    </div>
  );
}