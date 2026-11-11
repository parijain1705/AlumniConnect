import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Edit, Trash2, ExternalLink } from 'lucide-react';

const AlumniTable = ({ alumniList, isAdmin, onDeleteClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Alumnus</th>
              <th className="py-3.5 px-4">Department & Year</th>
              <th className="py-3.5 px-4">Company & Role</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {alumniList.map((alumni) => (
              <tr key={alumni._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={alumni.profilePhoto || `https://i.pravatar.cc/150?u=${alumni._id}`}
                      alt={alumni.fullName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          alumni.fullName
                        )}&background=0284c7&color=fff`;
                      }}
                    />
                    <div>
                      <Link
                        to={`/alumni/${alumni._id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 block line-clamp-1"
                      >
                        {alumni.fullName}
                      </Link>
                      <span className="text-xs text-slate-400 block line-clamp-1">
                        {alumni.email}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-800">{alumni.department}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-mono text-xs">{alumni.graduationYear}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="line-clamp-1 font-medium text-slate-800">
                    {alumni.currentCompany || '--'}
                  </div>
                  <div className="line-clamp-1 text-xs text-slate-500">
                    {alumni.jobTitle || 'Alumnus'}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-slate-600">
                  {alumni.city ? `${alumni.city}, ${alumni.country || 'India'}` : '--'}
                </td>

                <td className="py-3.5 px-4">
                  {alumni.isMentor ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Mentor
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Alumnus</span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/alumni/${alumni._id}`}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          to={`/alumni/${alumni._id}/edit`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onDeleteClick(alumni)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlumniTable;

