import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DeleteModal from '../components/DeleteModal';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AlumniDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/alumni/${id}`);
        if (res.data.success) {
          setAlumni(res.data.alumni);
        }
      } catch (err) {
        console.error('Error fetching alumni detail:', err);
        toast.error('Alumni record not found');
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, [id]);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/alumni/${id}`);
      toast.success('Alumni profile deleted successfully');
      navigate('/directory');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete profile');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${alumni.fullName} | Alumni Profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Alumni Not Found</h2>
        <p className="text-sm text-slate-500">The profile you requested does not exist or has been removed.</p>
        <Link
          to="/directory"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Back button & Admin Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/directory"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {isAuthenticated && (
            <>
              <Link
                to={`/alumni/${alumni._id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Decorative Header Banner */}
        <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 relative">
          {alumni.isMentor && (
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Available for Mentorship</span>
            </div>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="px-6 sm:px-10 pb-10">
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="flex items-end gap-5">
              <img
                src={alumni.profilePhoto || `https://i.pravatar.cc/150?u=${alumni._id}`}
                alt={alumni.fullName}
                className="w-28 h-28 sm:w-36 sm:w-36 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    alumni.fullName
                  )}&background=0284c7&color=fff&size=150`;
                }}
              />
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {alumni.fullName}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-blue-600 mt-0.5">
                  {alumni.jobTitle || 'Alumnus'} {alumni.currentCompany && `@ ${alumni.currentCompany}`}
                </p>
              </div>
            </div>

            {alumni.linkedinUrl && (
              <a
                href={alumni.linkedinUrl.startsWith('http') ? alumni.linkedinUrl : `https://${alumni.linkedinUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold rounded-xl shadow-sm transition-all sm:self-end"
              >
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap gap-2.5 pb-6 border-b border-slate-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <GraduationCap className="w-4 h-4" />
              {alumni.department} Engineering
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Calendar className="w-4 h-4" />
              Graduated Class of {alumni.graduationYear}
            </span>
            {alumni.city && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400" />
                {alumni.city}, {alumni.country || 'India'}
              </span>
            )}
          </div>

          {/* About / Bio */}
          <div className="py-6 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              About & Career Summary
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {alumni.bio || 'No bio information provided yet.'}
            </p>
          </div>

          {/* Skills Grid */}
          {alumni.skills && alumni.skills.length > 0 && (
            <div className="py-6 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {alumni.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details Grid */}
          <div className="pt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${alumni.email}`}
                    className="text-xs sm:text-sm font-medium text-slate-800 hover:text-blue-600 truncate block"
                  >
                    {alumni.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Phone / Mobile
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 truncate block">
                    {alumni.phone || 'Not shared'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Alumni Profile"
        message={`Are you sure you want to permanently delete ${alumni.fullName}'s profile?`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AlumniDetail;

