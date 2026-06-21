import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera, Cpu, Mail, User, IdCard, BookUser, Phone,
  CalendarDays, MapPin, Users, BadgeInfo, VenusAndMars,
  Earth, Edit3, Upload, CheckCircle2, Shield
} from 'lucide-react';
import { apiRequest, buildApiUrl } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/session';
import NavigationDrawer from '../components/NavigationDrawer';
import PageTopBar from '../components/PageTopBar';
import useLocalStorageState from '../lib/useLocalStorageState';

export default function Profile() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [drawerOpen, setDrawerOpen] = useLocalStorageState('daffotrack.drawerOpen', false);
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingImage, setSavingImage] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!currentUser?.userId) { setLoading(false); return; }
    apiRequest(`/api/users/${currentUser.userId}`)
      .then(data => setProfile(data))
      .catch(err => setError(err.message || 'Unable to load profile.'))
      .finally(() => setLoading(false));
  }, [currentUser?.userId]);

  const displayedProfile = profile || currentUser;

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
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile image.');
    } finally {
      setSavingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060e1a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!displayedProfile?.userId) {
    return (
      <div className="min-h-screen bg-[#060e1a] text-white flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-[#060e1a] text-white flex flex-col">
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} />
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

      <div className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-400">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-7">

            {/* Left: Avatar & photo upload */}
            <aside className="space-y-5">
              <div className="bg-[#0a1525] border border-white/8 rounded-2xl p-6 space-y-5">

                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-[#060e1a] border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(45,212,191,0.1)]">
                      {(previewUrl || imageUrl)
                        ? <img src={previewUrl || imageUrl} alt={displayedProfile.fullName} className="w-full h-full object-cover" />
                        : <User className="w-14 h-14 text-slate-600" />
                      }
                    </div>
                    <label htmlFor="photo-update" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center cursor-pointer hover:bg-teal-400 transition-colors shadow-lg">
                      <Camera className="w-3.5 h-3.5 text-[#060e1a]" />
                    </label>
                  </div>
                  <input id="photo-update" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

                  <div className="text-center">
                    <h2 className="text-lg font-black text-white">{displayedProfile.fullName}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{displayedProfile.department}</p>
                    <p className="text-[10px] text-teal-400 font-mono mt-1">{displayedProfile.studentId}</p>
                  </div>
                </div>

                <div className="bg-[#060e1a] border border-white/6 rounded-xl p-3.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Account Email</p>
                  <p className="text-sm font-semibold text-white break-all">{displayedProfile.email}</p>
                </div>

                {/* Photo update */}
                <form onSubmit={handleImageUpdate} className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Update Profile Photo</p>
                  <label htmlFor="photo-update"
                    className="flex items-center gap-2 justify-center py-2.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 cursor-pointer text-xs font-semibold text-slate-300 transition-all">
                    <Upload className="w-3.5 h-3.5 text-teal-400" />
                    {profileImage ? profileImage.name.slice(0, 22) + '…' : 'Choose new photo'}
                  </label>
                  <button
                    type="submit"
                    disabled={!profileImage || savingImage}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 text-[#060e1a] font-bold text-sm hover:bg-teal-400 transition-all disabled:opacity-40">
                    {savingImage
                      ? <><div className="w-4 h-4 border-2 border-[#060e1a] border-t-transparent rounded-full animate-spin" /> Saving...</>
                      : saved
                        ? <><CheckCircle2 className="w-4 h-4" /> Photo Updated!</>
                        : 'Save New Photo'
                    }
                  </button>
                </form>
              </div>

              {/* Status cards */}
              <div className="bg-[#0a1525] border border-white/8 rounded-2xl p-5 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Profile Status</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <p className="text-sm font-semibold text-emerald-300">
                      {displayedProfile.hasProfileImage ? 'Photo uploaded' : 'No photo yet'}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Registered</p>
                  <p className="text-sm font-semibold text-white mt-1.5">{displayedProfile.createdAt || 'Just now'}</p>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Password</p>
                  <p className="text-lg font-bold tracking-widest text-slate-300">{maskValue(displayedProfile.password)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-600 px-1">
                <Shield className="w-3 h-3 text-teal-500/50" />
                All data stored in MySQL. No third-party access.
              </div>
            </aside>

            {/* Right: Detail grid */}
            <main className="bg-[#0a1525] border border-white/8 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-white/6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Student Profile Details</h2>
                  <p className="text-sm text-slate-400 mt-1">All data loaded from MySQL database.</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/8 border border-emerald-500/15 text-xs font-semibold text-emerald-300">
                  <Edit3 className="w-3.5 h-3.5" /> Registered Profile
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {infoFields.map(({ icon: Icon, label, value }) => (
                  <DetailCard key={label} icon={<Icon className="w-3.5 h-3.5" />} label={label} value={value} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="bg-[#060e1a] border border-white/6 rounded-xl p-4 hover:border-teal-500/20 transition-all">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
        <span className="text-slate-600">{icon}</span>
        {label}
      </div>
      <p className="text-sm font-semibold text-white break-words leading-relaxed">{value}</p>
    </div>
  );
}

function maskValue(value) {
  if (!value) return 'Not provided';
  return '•'.repeat(Math.min(Math.max(value.length, 6), 12));
}
