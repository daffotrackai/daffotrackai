import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Cpu, Sparkles, User, Mail, Lock, IdCard, BookUser, Phone, CalendarDays, MapPin, Users, BadgeInfo, VenusAndMars, Earth } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { setCurrentUser } from '../lib/session';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    studentId: '',
    department: 'Software Engineering',
    phone: '',
    sessionYear: '',
    semester: '',
    dateOfBirth: '',
    address: '',
    guardianName: '',
    bloodGroup: '',
    gender: '',
    nationality: 'Bangladeshi',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    if (profileImage) {
      payload.append('profileImage', profileImage);
    }

    try {
      const response = await apiRequest('/api/users/register', {
        method: 'POST',
        body: payload,
      });

      setCurrentUser(response);
      navigate('/profile');
    } catch (requestError) {
      setError(requestError.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1A30] text-white px-4 py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[520px] h-[520px] bg-gradient-to-tr from-[#00E5FF]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[460px] h-[460px] bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section className="space-y-6 lg:sticky lg:top-8">
          <Link to="/login" className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-[#00E5FF] transition-colors">
            ← Back to login
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E3A5F] bg-[#13253F]/80 px-4 py-2 text-xs font-semibold text-[#00E5FF] w-fit">
            <Sparkles className="h-4 w-4" />
            Student profile registration
          </div>

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-blue-600 p-[2px] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <div className="w-full h-full rounded-[14px] bg-[#0B1A30] flex items-center justify-center">
                <Cpu className="w-7 h-7 text-[#00E5FF]" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Create your <span className="bg-gradient-to-r from-[#00E5FF] to-cyan-300 bg-clip-text text-transparent">DaffoTrack</span> profile
            </h1>
            <p className="max-w-xl text-slate-300 text-base leading-relaxed">
              Register once, save your details in MySQL, and view everything later from your profile page. You can also upload your profile photo during registration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#1E3A5F] bg-[#13253F]/60 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">Saved data</p>
              <p className="mt-2 text-lg font-bold">MySQL</p>
              <p className="text-xs text-slate-400 mt-1">Profile information and image are stored in the database.</p>
            </div>
            <div className="rounded-2xl border border-[#1E3A5F] bg-[#13253F]/60 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">Profile access</p>
              <p className="mt-2 text-lg font-bold">/profile</p>
              <p className="text-xs text-slate-400 mt-1">See all of your saved details after login or register.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#1E3A5F] bg-[#13253F]/80 shadow-2xl shadow-black/30 backdrop-blur-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={<User className="h-4 w-4" />} label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" required />
              <Field icon={<Mail className="h-4 w-4" />} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="student@diu.edu.bd" required />
              <Field icon={<Lock className="h-4 w-4" />} label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required />
              <Field icon={<IdCard className="h-4 w-4" />} label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="221-15-XXXX" required />
              <Field icon={<BookUser className="h-4 w-4" />} label="Department" name="department" value={formData.department} onChange={handleChange} placeholder="Software Engineering" required />
              <Field icon={<Phone className="h-4 w-4" />} label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" />
              <Field icon={<CalendarDays className="h-4 w-4" />} label="Session Year" name="sessionYear" value={formData.sessionYear} onChange={handleChange} placeholder="2023-2024" />
              <Field icon={<BadgeInfo className="h-4 w-4" />} label="Semester" name="semester" value={formData.semester} onChange={handleChange} placeholder="6th Semester" />
              <Field icon={<CalendarDays className="h-4 w-4" />} label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
              <Field icon={<MapPin className="h-4 w-4" />} label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Home address" />
              <Field icon={<Users className="h-4 w-4" />} label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Guardian / parent name" />
              <Field icon={<Earth className="h-4 w-4" />} label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Bangladeshi" />
              <Field icon={<VenusAndMars className="h-4 w-4" />} label="Gender" name="gender" value={formData.gender} onChange={handleChange} placeholder="Male / Female / Other" />
              <Field icon={<BadgeInfo className="h-4 w-4" />} label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="A+ / O+ / etc." />
            </div>

            <div className="rounded-2xl border border-dashed border-[#1E3A5F] bg-[#0B1A30]/60 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Camera className="h-4 w-4 text-[#00E5FF]" />
                Profile Image
              </div>
              <p className="mt-1 text-xs text-slate-400">Upload a JPG/PNG photo so it appears on your profile page.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
                className="mt-4 block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-[#00E5FF] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#0B1A30] hover:file:bg-cyan-300"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00E5FF] px-5 py-4 text-sm font-bold text-[#0B1A30] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(0,229,255,0.35)] disabled:opacity-60"
            >
              {isSubmitting ? 'Saving profile...' : 'Create profile'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Field({ icon, label, name, value, onChange, placeholder, type = 'text', required = false }) {
  return (
    <label className="space-y-2">
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
        {icon}
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-[#1E3A5F] bg-[#0B1A30] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
      />
    </label>
  );
}