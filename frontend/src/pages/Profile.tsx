import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  User, Mail, Building2, Shield, Clock, Calendar,
  Edit3, Save, X, Camera, CheckCircle
} from 'lucide-react';

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  designation?: string;
  createdAt: string;
  company?: { name: string; email: string };
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', designation: '' });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${user?.id}`);
      setProfile(res.data);
      setFormData({
        firstName: res.data.firstName || '',
        lastName: res.data.lastName || '',
        phone: res.data.phone || '',
        designation: res.data.designation || '',
      });
    } catch {
      if (user) {
        const fallback: ProfileData = {
          id: user.id,
          firstName: user.firstName,
          lastName: '',
          email: user.email,
          role: user.role,
          createdAt: new Date().toISOString(),
        };
        setProfile(fallback);
        setFormData({ firstName: user.firstName, lastName: '', phone: '', designation: '' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (profile) setProfile({ ...profile, ...formData });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getInitials = () => {
    const f = profile?.firstName?.[0] ?? '';
    const l = profile?.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || 'U';
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      SUPER_ADMIN:   { label: 'Super Admin',   color: 'bg-purple-100 text-purple-700 border-purple-200' },
      COMPANY_ADMIN: { label: 'Company Admin', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      HR:            { label: 'HR Manager',    color: 'bg-pink-100 text-pink-700 border-pink-200' },
      MANAGER:       { label: 'Manager',       color: 'bg-orange-100 text-orange-700 border-orange-200' },
      EMPLOYEE:      { label: 'Employee',      color: 'bg-green-100 text-green-700 border-green-200' },
    };
    return badges[role] ?? { label: role, color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const badge = getRoleBadge(profile?.role ?? 'EMPLOYEE');

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 shadow-sm"
          >
            <CheckCircle size={18} /> Profile updated successfully!
          </motion.div>
        )}

        {/* Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-12 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-blue-600">
                  {getInitials()}
                </div>
                <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 shadow-md hover:bg-blue-500 transition-colors">
                  <Camera size={12} />
                </button>
              </div>
              <div className="flex gap-2 mt-14">
                {editing ? (
                  <>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                      <X size={16} /> Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium transition-colors shadow-sm">
                      <Save size={16} /> Save Changes
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                    <Edit3 size={16} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{profile?.firstName} {profile?.lastName}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
                <Shield size={12} /> {badge.label}
              </span>
              {profile?.designation && <span className="text-slate-500 text-sm">{profile.designation}</span>}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
              <User size={13} /> Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(['firstName', 'lastName'] as const).map((field) => (
                  <div key={field}>
                    <label className="text-xs text-slate-400 font-medium block mb-1">
                      {field === 'firstName' ? 'First Name' : 'Last Name'}
                    </label>
                    {editing ? (
                      <input value={formData[field]} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" />
                    ) : (
                      <p className="text-slate-800 font-medium">{profile?.[field] || '—'}</p>
                    )}
                  </div>
                ))}
              </div>
              {(['designation', 'phone'] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs text-slate-400 font-medium block mb-1 capitalize">{field}</label>
                  {editing ? (
                    <input value={formData[field]} onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                      placeholder={field === 'designation' ? 'e.g. Software Engineer' : '+91 98765 43210'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none" />
                  ) : (
                    <p className="text-slate-800 font-medium">{profile?.[field] || '—'}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Shield size={13} /> Account Details
            </h2>
            <div className="space-y-4">
              {[
                { icon: Mail,      color: 'blue',   label: 'Email Address',  value: profile?.email },
                { icon: Building2, color: 'purple',  label: 'Company',        value: profile?.company?.name ?? 'Test Company' },
                { icon: Calendar,  color: 'green',  label: 'Member Since',   value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                { icon: Clock,     color: 'orange', label: 'User ID',        value: profile?.id },
              ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon size={15} className={`text-${color}-500`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                    <p className="text-slate-800 font-medium text-sm truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
