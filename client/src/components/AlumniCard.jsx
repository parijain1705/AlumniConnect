import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Edit,
  Trash2,
} from 'lucide-react';

const AlumniCard = ({ alumni, isAdmin, onDeleteClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Header & Avatar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={alumni.profilePhoto || `https://i.pravatar.cc/150?u=${alumni._id}`}
                alt={alumni.fullName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    alumni.fullName
                  )}&background=0284c7&color=fff`;
                }}
              />
              {alumni.isMentor && (
                <span
                  title="Available as a Mentor"
                  className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full ring-2 ring-white shadow-sm"
                >
                  <Sparkles className="w-3 h-3" />
                </span>
              )}
            </div>
            <div>
              <Link
                to={`/alumni/${alumni._id}`}
                className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
              >
                {alumni.fullName}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="line-clamp-1">
                  {alumni.jobTitle ? `${alumni.jobTitle}` : 'Alumnus'}
                  {alumni.currentCompany && (
                    <span className="font-semibold text-slate-800">
                      {' '}
                      @ {alumni.currentCompany}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges: Department & Year */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap className="w-3 h-3" />
            {alumni.department} &apos;{String(alumni.graduationYear).slice(-2)}
          </span>
          {alumni.city && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              <MapPin className="w-3 h-3 text-slate-400" />
              {alumni.city}
              {alumni.country && alumni.country !== 'India' ? `, ${alumni.country}` : ''}
            </span>
          )}
          {alumni.isMentor && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Mentor
            </span>
          )}
        </div>

        {/* Bio preview */}
        {alumni.bio && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {alumni.bio}
          </p>
        )}

        {/* Skills Pills */}
        {alumni.skills && alumni.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {alumni.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {skill}
              </span>
            ))}
            {alumni.skills.length > 3 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400">
                +{alumni.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/alumni/${alumni._id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link
              to={`/alumni/${alumni._id}/edit`}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Profile"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDeleteClick(alumni)}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Profile"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniCard;

