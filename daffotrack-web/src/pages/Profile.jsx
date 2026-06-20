import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Cpu, Mail, User, IdCard, BookUser, Phone, CalendarDays, MapPin, Users, BadgeInfo, VenusAndMars, Earth, Edit3 } from 'lucide-react';
import { apiRequest, buildApiUrl } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/session';
import NavigationDrawer from '../components/NavigationDrawer';

export default function Profile() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingImage, setSavingImage] = useState(false);

  useEffect(() => {
    if (!currentUser?.userId) {
      setLoading(false);
      return;
    }

    apiRequest(`/api/users/${currentUser.userId}`)
      .then((data) => setProfile(data))
      .catch((requestError) => setError(requestError.message || 'Unable to load profile.'))
      .finally(() => setLoading(false));
  }, [currentUser?.userId]);

  const displayedProfile = profile || currentUser;

  const handleImageUpdate = async (event) => {
    event.preventDefault();
    if (!currentUser?.userId || !profileImage) {
      return;
    }

    setSavingImage(true);
    setError('');

    const payload = new FormData();
    payload.append('profileImage', profileImage);

    try {
      const updatedProfile = await apiRequest(`/api/users/${currentUser.userId}/image`, {
        method: 'PUT',
        body: payload,
      });

      setProfile(updatedProfile);
      setCurrentUser({ ...currentUser, ...updatedProfile });
      setProfileImage(null);
    } catch (requestError) {
      setError(requestError.message || 'Failed to update profile image.');
    } finally {
      setSavingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1A30] text-white grid place-items-center px-4">
        <div className="rounded-3xl border border-[#1E3A5F] bg-[#13253F] px-6 py-5 text-sm text-slate-300 shadow-2xl">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!displayedProfile?.userId) {
    return (
      <div className="min-h-screen bg-[#0B1A30] text-white grid place-items-center px-4">
        <div className="max-w-lg rounded-[28px] border border-[#1E3A5F] bg-[#13253F] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00E5FF]/10 text-[#00E5FF]">
            <User className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">No profile found</h1>
          <p className="mt-3 text-sm text-slate-300">Please register or log in first so we can load your saved student profile.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/register" className="rounded-xl bg-[#00E5FF] px-5 py-3 text-sm font-bold text-[#0B1A30]">Create profile</Link>
            <Link to="/login" className="rounded-xl border border-[#1E3A5F] px-5 py-3 text-sm font-semibold text-slate-200">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = displayedProfile.profileImageUrl ? buildApiUrl(displayedProfile.profileImageUrl) : null;

  return (
    <div className="min-h-screen bg-[#0B1A30] text-white px-4 py-8 sm:px-6 lg:px-8">
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#00E5FF]">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E3A5F] bg-[#13253F] px-4 py-2 text-xs font-semibold text-[#00E5FF]">
            <Cpu className="h-4 w-4" />
            Profile view
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-[#1E3A5F] bg-[#13253F] p-6 shadow-2xl shadow-black/30">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[30px] border border-[#1E3A5F] bg-[#0B1A30] shadow-[0_0_30px_rgba(0,229,255,0.12)]">
                  {imageUrl ? (
                    <img src={imageUrl} alt={displayedProfile.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-[#00E5FF]" />
                  )}
                </div>
                <div className="absolute -right-2 -bottom-2 rounded-full border border-[#1E3A5F] bg-[#0B1A30] p-2 text-[#00E5FF]">
                  <Camera className="h-4 w-4" />
                </div>
              </div>

              <h1 className="mt-5 text-2xl font-extrabold tracking-tight">{displayedProfile.fullName}</h1>
              <p className="mt-1 text-sm text-slate-300">{displayedProfile.department}</p>
              <p className="mt-2 text-xs text-slate-400">{displayedProfile.studentId}</p>

              <div className="mt-6 w-full rounded-2xl border border-[#1E3A5F] bg-[#0B1A30]/70 p-4 text-left">
                <p className="text-xs uppercase tracking-wider text-slate-400">Account Email</p>
                <p className="mt-2 text-sm font-semibold">{displayedProfile.email}</p>
              </div>

              <form onSubmit={handleImageUpdate} className="mt-5 w-full space-y-4">
                <label className="block text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Update profile image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-[#00E5FF] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#0B1A30]"
                />
                <button
                  type="submit"
                  disabled={!profileImage || savingImage}
                  className="w-full rounded-2xl bg-[#00E5FF] px-4 py-3 text-sm font-bold text-[#0B1A30] disabled:opacity-60"
                >
                  {savingImage ? 'Saving...' : 'Save new photo'}
                </button>
              </form>
            </div>
          </aside>

          <main className="rounded-[28px] border border-[#1E3A5F] bg-[#13253F]/70 p-6 shadow-2xl shadow-black/30 sm:p-8">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Student profile details</h2>
                <p className="mt-2 text-sm text-slate-300">All saved registration data is loaded from MySQL.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                <Edit3 className="h-4 w-4" />
                Registered profile
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DetailCard icon={<IdCard className="h-4 w-4" />} label="Student ID" value={displayedProfile.studentId} />
              <DetailCard icon={<Mail className="h-4 w-4" />} label="Email" value={displayedProfile.email} />
              <DetailCard icon={<BookUser className="h-4 w-4" />} label="Department" value={displayedProfile.department} />
              <DetailCard icon={<Phone className="h-4 w-4" />} label="Phone" value={displayedProfile.phone || 'Not provided'} />
              <DetailCard icon={<CalendarDays className="h-4 w-4" />} label="Session" value={displayedProfile.sessionYear || 'Not provided'} />
              <DetailCard icon={<BadgeInfo className="h-4 w-4" />} label="Semester" value={displayedProfile.semester || 'Not provided'} />
              <DetailCard icon={<CalendarDays className="h-4 w-4" />} label="Date of Birth" value={displayedProfile.dateOfBirth || 'Not provided'} />
              <DetailCard icon={<MapPin className="h-4 w-4" />} label="Address" value={displayedProfile.address || 'Not provided'} />
              <DetailCard icon={<Users className="h-4 w-4" />} label="Guardian Name" value={displayedProfile.guardianName || 'Not provided'} />
              <DetailCard icon={<BadgeInfo className="h-4 w-4" />} label="Blood Group" value={displayedProfile.bloodGroup || 'Not provided'} />
              <DetailCard icon={<VenusAndMars className="h-4 w-4" />} label="Gender" value={displayedProfile.gender || 'Not provided'} />
              <DetailCard icon={<Earth className="h-4 w-4" />} label="Nationality" value={displayedProfile.nationality || 'Not provided'} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-[#1E3A5F] bg-[#0B1A30]/70 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Password</p>
                <p className="mt-2 text-sm text-slate-300">Stored in the database for the demo app.</p>
                <p className="mt-2 text-lg font-bold tracking-widest">{maskValue(displayedProfile.password)}</p>
              </div>
              <div className="rounded-3xl border border-[#1E3A5F] bg-[#0B1A30]/70 p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Profile status</p>
                <p className="mt-2 text-sm text-slate-300">{displayedProfile.hasProfileImage ? 'Profile photo uploaded' : 'No profile photo yet'}</p>
                <p className="mt-2 text-lg font-bold text-[#00E5FF]">{displayedProfile.createdAt || 'Created just now'}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-[#1E3A5F] bg-[#0B1A30]/70 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-sm font-semibold text-white break-words">{value}</p>
    </div>
  );
}

function maskValue(value) {
  if (!value) {
    return 'Not provided';
  }

  return '•'.repeat(Math.min(Math.max(value.length, 6), 12));
}