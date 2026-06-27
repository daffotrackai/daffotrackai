import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Camera, Cpu, Mail, User, IdCard, BookUser, Phone,
  CalendarDays, MapPin, Users, BadgeInfo, VenusAndMars,
  Earth, Edit3, Upload, CheckCircle2, Shield
} from 'lucide-react';
import { apiRequest, buildApiUrl } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/session';
import { useToast } from '../lib/ToastContext';
import PageTopBar from '../components/PageTopBar';

const PROFILE_FIELDS = [
  { name: 'fullName', label: 'Full Name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'studentId', label: 'Student ID' },
  { name: 'department', label: 'Department' },
  { name: 'phone', label: 'Phone' },
  { name: 'sessionYear', label: 'Session' },
  { name: 'semester', label: 'Semester' },
  { name: 'admissionDate', label: 'Admission Date', type: 'date' },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'address', label: 'Address' },
  { name: 'guardianName', label: 'Guardian Name' },
  { name: 'bloodGroup', label: 'Blood Group' },
  { name: 'gender', label: 'Gender' },
  { name: 'nationality', label: 'Nationality' },
];

export default function Profile() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);
  const { addToast } = useToast();
  // MainLayout থেকে ড্রয়ারের স্টেট রিসিভ করা হচ্ছে
  const { drawerOpen, setDrawerOpen } = useOutletContext();

  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingImage, setSavingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!currentUser?.userId) { setLoading(false); return; }
    apiRequest(`/api/users/${currentUser.userId}`)
      .then(data => {
        setProfile(data);
        setProfileForm(toProfileForm(data));
      })
      .catch(err => setError(err.message || 'Unable to load profile.'))
      .finally(() => setLoading(false));
  }, [currentUser?.userId]);

  const displayedProfile = profile || currentUser;

  useEffect(() => {
    if (displayedProfile?.userId) {
      setProfileForm(toProfileForm(displayedProfile));
    }
  }, [displayedProfile?.userId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser?.userId || !profileImage) return;
    setSavingImage(true);
    setError('');
    const payload = new FormData();
    payload.append('profileImage', profileImage);
    try {
      const updated = await apiRequest(`/api/users/${currentUser.userId}/image`, { method: 'PUT', body: payload });
      setProfile(updated);
      setCurrentUser({ ...currentUser, ...updated });
      setProfileImage(null);
      setPreviewUrl(null);
      setSaved(true);
      addToast('Profile image updated successfully!', 'success');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      // apiRequest already dispatches a global toast for errors
    } finally {
      setSavingImage(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser?.userId) return;

    setSavingProfile(true);
    setError('');
    try {
      const updated = await apiRequest(`/api/users/${currentUser.userId}`, {
        method: 'PUT',
        body: JSON.stringify(profileForm),
      });
      setProfile(updated);
      setCurrentUser({ ...currentUser, ...updated });
      setEditingProfile(false);
      setSaved(true);
      addToast('Profile updated successfully!', 'success');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      // apiRequest already dispatches a global toast for errors
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!displayedProfile?.userId) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="max-w-md text-center bg-[#0a1525] border border-white/8 rounded-2xl p-10 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto mb-5">
            <User className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white mb-3">No Profile Found</h1>
          <p className="text-sm text-slate-400 mb-7">Please register or log in first to access your student profile.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/register" className="px-6 py-3 rounded-xl bg-teal-500 text-[#060e1a] font-bold text-sm hover:bg-teal-400 transition-all">Create Profile</Link>
            <Link to="/login" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/8 transition-all">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = displayedProfile.profileImageUrl ? buildApiUrl(displayedProfile.profileImageUrl) : null;

  const infoFields = [
    { icon: IdCard, label: 'Student ID', value: displayedProfile.studentId },
    { icon: Mail, label: 'Email', value: displayedProfile.email },
    { icon: BookUser, label: 'Department', value: displayedProfile.department },
    { icon: Phone, label: 'Phone', value: displayedProfile.phone || 'Not provided' },
    { icon: CalendarDays, label: 'Admission Date', value: displayedProfile.admissionDate || 'Not provided' },
    { icon: CalendarDays, label: 'Session', value: displayedProfile.sessionYear || 'Not provided' },
    { icon: BadgeInfo, label: 'Semester', value: displayedProfile.semester || 'Not provided' },
    { icon: CalendarDays, label: 'Date of Birth', value: displayedProfile.dateOfBirth || 'Not provided' },
    { icon: MapPin, label: 'Address', value: displayedProfile.address || 'Not provided' },
    { icon: Users, label: 'Guardian Name', value: displayedProfile.guardianName || 'Not provided' },
    { icon: BadgeInfo, label: 'Blood Group', value: displayedProfile.bloodGroup || 'Not provided' },
    { icon: VenusAndMars, label: 'Gender', value: displayedProfile.gender || 'Not provided' },
    { icon: Earth, label: 'Nationality', value: displayedProfile.nationality || 'Not provided' },
  ];

  return (
    <>
      <PageTopBar
        title="My Profile"
        subtitle="View and manage your student information"
        backLabel="Dashboard"
        backTo="/dashboard"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Ambient */}
      <div className="fixed top-1/3 right-0 w-[500px] h-[400px] bg-teal-500/4 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 overflow-y-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 bg-(--bg-main) text-(--text-main)">
        <div className="max-w-6xl mx-auto">

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-500">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-7">

            {/* Left: Avatar & photo upload */}
            <aside className="space-y-5">
              <div className="bg-(--bg-card) border border-(--border-main) rounded-2xl p-6 space-y-5">

                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl bg-(--bg-main) border border-(--border-main) flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(45,212,191,0.1)] relative">
                      {(previewUrl || imageUrl)
                        ? <img src={previewUrl || imageUrl} alt={displayedProfile.fullName} className="w-full h-full object-cover" />
                        : <User className="w-14 h-14 text-(--text-muted)" />
                      }

                      {/* Loading Overlay inside the image box */}
                      {savingImage && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    {!savingImage && (
                      <label htmlFor="photo-update" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center cursor-pointer hover:bg-teal-400 transition-colors shadow-lg z-30">
                        <Camera className="w-3.5 h-3.5 text-white" />
                      </label>
                    )}
                  </div>
                  <input id="photo-update" type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={savingImage} />

                  <div className="text-center">
                    <h2 className="text-lg font-black text-(--text-main)">{displayedProfile.fullName}</h2>
                    <p className="text-xs text-(--text-muted) mt-0.5">{displayedProfile.department}</p>
                    <p className="text-[10px] text-teal-500 font-mono mt-1">{displayedProfile.studentId}</p>
                  </div>
                </div>

                <div className="bg-(--bg-main) border border-(--border-main) rounded-xl p-3.5">
                  <p className="text-[10px] uppercase tracking-wider text-(--text-muted) mb-1.5">Account Email</p>
                  <p className="text-sm font-semibold text-(--text-main) break-all">{displayedProfile.email}</p>
                </div>

                {/* Photo update */}
                <form onSubmit={handleImageUpdate} className="space-y-3">
                  <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider">Update Profile Photo</p>
                  <label htmlFor="photo-update"
                    className="flex items-center gap-2 justify-center py-2.5 rounded-xl bg-white/5 border border-(--border-main) hover:bg-white/10 cursor-pointer text-xs font-semibold text-(--text-muted) transition-all">
                    <Upload className="w-3.5 h-3.5 text-teal-500" />
                    {profileImage ? profileImage.name.slice(0, 22) + '…' : 'Choose new photo'}
                  </label>
                  <button
                    type="submit"
                    disabled={!profileImage || savingImage}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-400 transition-all disabled:opacity-40">
                    {savingImage
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                      : saved
                        ? <><CheckCircle2 className="w-4 h-4" /> Photo Updated!</>
                        : 'Save New Photo'
                    }
                  </button>
                </form>
              </div>

              {/* Status cards */}
              <div className="bg-(--bg-card) border border-(--border-main) rounded-2xl p-5 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-(--text-muted)">Profile Status</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-sm font-semibold text-emerald-500">
                      {displayedProfile.hasProfileImage ? 'Photo uploaded' : 'No photo yet'}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-(--border-main)">
                  <p className="text-[10px] uppercase tracking-wider text-(--text-muted)">Registered</p>
                  <p className="text-sm font-semibold text-(--text-main) mt-1.5">{displayedProfile.createdAt || 'Just now'}</p>
                </div>
                <div className="pt-3 border-t border-(--border-main)">
                  <p className="text-[10px] uppercase tracking-wider text-(--text-muted) mb-1.5">Password</p>
                  <p className="text-lg font-bold tracking-widest text-(--text-muted)">{maskValue(displayedProfile.password)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-(--text-muted) px-1">
                <Shield className="w-3 h-3 text-teal-500/50" />
                All data stored in MySQL. No third-party access.
              </div>
            </aside>

            {/* Right: Detail grid */}
            <div className="bg-(--bg-card) border border-(--border-main) rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-(--border-main)">
                <div>
                  <h2 className="text-2xl font-black text-(--text-main) tracking-tight">Student Profile Details</h2>
                  <p className="text-sm text-(--text-muted) mt-1">All data loaded from MySQL database.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProfile((value) => !value)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-500 hover:bg-emerald-500/15"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {editingProfile ? 'Cancel Edit' : 'Edit Information'}
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {PROFILE_FIELDS.map(({ name, label, type = 'text' }) => (
                      <label key={name} className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-(--text-muted)">{label}</span>
                        {name === 'semester' ? (
                          <select
                            name={name}
                            value={profileForm[name] || ''}
                            onChange={handleProfileChange}
                            className="mt-2 w-full rounded-xl border border-(--border-main) bg-(--bg-main) px-4 py-3 text-sm text-(--text-main) outline-none focus:border-teal-500/50"
                          >
                            <option value="">Select Semester</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                            <option value="Fall">Fall</option>
                          </select>
                        ) : (
                          <input
                            type={type}
                            name={name}
                            value={profileForm[name] || ''}
                            onChange={handleProfileChange}
                            className="mt-2 w-full rounded-xl border border-(--border-main) bg-(--bg-main) px-4 py-3 text-sm text-(--text-main) outline-none focus:border-teal-500/50"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white hover:bg-teal-400 disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving...' : saved ? 'Saved' : 'Save Information'}
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {infoFields.map(({ icon: Icon, label, value }) => (
                    <DetailCard key={label} icon={<Icon className="w-3.5 h-3.5" />} label={label} value={value} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="bg-(--bg-main) border border-(--border-main) rounded-xl p-4 hover:border-teal-500/20 transition-all">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-(--text-muted) mb-2.5">
        <span className="text-teal-500">{icon}</span>
        {label}
      </div>
      <p className="text-sm font-semibold text-(--text-main) break-words leading-relaxed">{value}</p>
    </div>
  );
}

function maskValue(value) {
  if (!value) return 'Not provided';
  return '•'.repeat(Math.min(Math.max(value.length, 6), 12));
}

function toProfileForm(profile) {
  return PROFILE_FIELDS.reduce((form, field) => {
    form[field.name] = profile?.[field.name] || '';
    return form;
  }, {});
}
