import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AlumniCard from '../components/AlumniCard';
import AlumniTable from '../components/AlumniTable';
import DeleteModal from '../components/DeleteModal';
import { CardSkeleton, TableSkeleton } from '../components/SkeletonLoader';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  RotateCcw,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AlumniDirectory = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || 'All');
  const [year, setYear] = useState(searchParams.get('year') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [mentorOnly, setMentorOnly] = useState(searchParams.get('isMentor') === 'true');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Data & loading states
  const [alumniList, setAlumniList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, pages: 1 });
  const [filterOptions, setFilterOptions] = useState({
    departments: ['CSE', 'IT', 'ECE', 'Mechanical', 'Civil', 'MBA'],
    years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012],
    cities: [],
  });
  const [loading, setLoading] = useState(true);

  // Deletion modal state
  const [targetAlumni, setTargetAlumni] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch filter options once
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/alumni/filter-options');
        if (res.data.success) {
          setFilterOptions(res.data.options);
        }
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch alumni with active query params
  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: viewMode === 'grid' ? 9 : 12,
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (department !== 'All') params.department = department;
      if (year !== 'All') params.year = year;
      if (city !== 'All') params.city = city;
      if (mentorOnly) params.isMentor = 'true';

      const res = await api.get('/alumni', { params });
      if (res.data.success) {
        setAlumniList(res.data.alumni);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching alumni list:', err);
      toast.error('Unable to fetch alumni records');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, department, year, city, mentorOnly, page, viewMode]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  // Handle Search input with debouncing / enter key
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAlumni();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDepartment('All');
    setYear('All');
    setCity('All');
    setMentorOnly(false);
    setPage(1);
  };

  // Handle delete execution
  const handleDeleteConfirm = async () => {
    if (!targetAlumni) return;
    try {
      setIsDeleting(true);
      await api.delete(`/alumni/${targetAlumni._id}`);
      toast.success(`${targetAlumni.fullName}'s profile was removed`);
      setTargetAlumni(null);
      fetchAlumni();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.response?.data?.message || 'Failed to delete alumni');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Alumni Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through {pagination.total} registered graduates and mentors across batches
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link
              to="/alumni/new"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Alumni</span>
            </Link>
          )}

          {/* View toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-sm transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-sm transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, role, or skill (e.g. React, Google, SRE)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-24 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Department */}
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Departments</option>
            {filterOptions.departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Graduation Year */}
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Class Years</option>
            {filterOptions.years.map((y) => (
              <option key={y} value={y}>
                Class of {y}
              </option>
            ))}
          </select>

          {/* City */}
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Cities</option>
            {filterOptions.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Mentor Only Toggle */}
          <button
            type="button"
            onClick={() => {
              setMentorOnly(!mentorOnly);
              setPage(1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              mentorOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mentors Only</span>
          </button>

          {/* Reset Filters */}
          {(searchTerm || department !== 'All' || year !== 'All' || city !== 'All' || mentorOnly) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 ml-auto px-2 py-1 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Directory Content (Grid / Table) */}
      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <TableSkeleton />
        )
      ) : alumniList.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumniList.map((alumni) => (
                <AlumniCard
                  key={alumni._id}
                  alumni={alumni}
                  isAdmin={isAuthenticated}
                  onDeleteClick={(item) => setTargetAlumni(item)}
                />
              ))}
            </div>
          ) : (
            <AlumniTable
              alumniList={alumniList}
              isAdmin={isAuthenticated}
              onDeleteClick={(item) => setTargetAlumni(item)}
            />
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Showing page <span className="font-semibold">{pagination.page}</span> of{' '}
                <span className="font-semibold">{pagination.pages}</span> ({pagination.total} results)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Page number indicators */}
                <div className="hidden sm:flex items-center gap-1">
                  {[...Array(pagination.pages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Alumni Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn&apos;t find any alumni matching your search filters. Try loosening your keywords or reset all filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!targetAlumni}
        onClose={() => setTargetAlumni(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Alumni Profile"
        message={`Are you sure you want to delete ${targetAlumni?.fullName}'s profile? This will immediately remove their record from the alumni database.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AlumniDirectory;

