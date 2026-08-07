'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import LSPAnalytics from '@/components/lsp/LSPAnalytics';
import api from '@/lib/api';
import {
  GraduationCap,
  School,
  Handshake,
  HeartHandshake,
  CalendarCheck,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Download,
  Loader2,
} from 'lucide-react';

type SectionKey =
  | 'students'
  | 'active-students'
  | 'schools'
  | 'sponsors'
  | 'sponsorships';

interface Summary {
  totalStudents: number;
  totalSchools: number;
  totalSponsors: number;
  totalSponsorships: number;
  activeStudents: number;
}

interface Student {
  id: string;
  student_code: string;
  admission_number: string;
  full_name: string;
  gender: string;
  grade: string;
  section: string;
  status: string;
  school: string | null;
}

interface School {
  id: string;
  name: string;
  municipality: string | null;
  district: string | null;
  province: string | null;
  principal_name: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean | null;
  students: number;
}

interface Sponsor {
  id: string;
  full_name: string;
  organization_name?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  sponsor_type?: string | null;
  status?: string | null;
}

interface Sponsorship {
  id: string;
  student_name: string;
  sponsor_name: string;
  monthly_amount: number;
  sponsorship_start: string;
  sponsorship_end: string;
  status: string;
}

const SECTION_KEYS: SectionKey[] = [
  'students',
  'active-students',
  'schools',
  'sponsors',
  'sponsorships',
];

const SECTION_LABELS: Record<SectionKey, string> = {
  students: 'Students',
  'active-students': 'Active Students',
  schools: 'Schools',
  sponsors: 'Sponsors',
  sponsorships: 'Sponsorships',
};

const SECTION_DESCRIPTIONS: Record<SectionKey, string> = {
  students: 'Manage students enrolled in the Learning Support Program.',
  'active-students':
    'View students currently active in the Learning Support Program.',
  schools: 'Manage schools participating in the Learning Support Program.',
  sponsors: 'Manage sponsors supporting children through the program.',
  sponsorships: 'Manage student sponsorship relationships.',
};

const STATUS_FILTERS = ['all', 'active', 'inactive'];
const GRADES = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default function LSPPage() {
  return (
    <Suspense fallback={<LSPLoading />}>
      <LSPContent />
    </Suspense>
  );
}

function LSPLoading() {
  return (
    <>
      <Navbar title="Learning Support Program" />
      <div className="p-8 text-center text-gray-500">Loading...</div>
    </>
  );
}

function LSPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSection = searchParams.get('section');
  const section: SectionKey =
    rawSection && SECTION_KEYS.includes(rawSection as SectionKey)
      ? (rawSection as SectionKey)
      : 'students';

  const [summary, setSummary] = useState<Summary>({
    totalStudents: 0,
    totalSchools: 0,
    totalSponsors: 0,
    totalSponsorships: 0,
    activeStudents: 0,
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [sponsorStudentCount, setSponsorStudentCount] = useState<
    Record<string, number>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search + filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'students' | 'schools' | 'sponsors' | 'sponsorships';
    id: string;
    label: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, studentsRes, schoolsRes, sponsorsRes, sponsorshipsRes] =
        await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/students'),
          api.get('/schools'),
          api.get('/sponsors'),
          api.get('/sponsorships'),
        ]);

      setSummary(summaryRes.data.data);
      setStudents(studentsRes.data.data || []);
      setSchools(schoolsRes.data.data || []);
      setSponsors(sponsorsRes.data.data || []);

      const sponsorshipsData = sponsorshipsRes.data.data || [];
      setSponsorships(sponsorshipsData);

      const counts: Record<string, number> = {};
      sponsorshipsData.forEach((item: any) => {
        if (item.sponsor_id) {
          counts[item.sponsor_id] = (counts[item.sponsor_id] || 0) + 1;
        }
      });
      setSponsorStudentCount(counts);
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function selectSection(key: SectionKey) {
    // Reset filters when switching sections
    setSearch('');
    setStatusFilter('all');
    setGradeFilter('all');
    setSchoolFilter('all');
    router.push(`/lsp?section=${key}`, { scroll: false });
  }

  const activeStudents = useMemo(
    () => students.filter((s) => s.status === 'active'),
    [students]
  );

  // Filtering logic
  const filteredStudents = useMemo(() => {
    let list = section === 'active-students' ? activeStudents : students;

    if (statusFilter !== 'all') {
      list = list.filter((s) => s.status === statusFilter);
    }
    if (gradeFilter !== 'all') {
      list = list.filter((s) => s.grade === gradeFilter);
    }
    if (schoolFilter !== 'all') {
      list = list.filter((s) => s.school === schoolFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.full_name.toLowerCase().includes(q) ||
          s.student_code.toLowerCase().includes(q) ||
          (s.admission_number || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [students, activeStudents, section, search, statusFilter, gradeFilter, schoolFilter]);

  const filteredSchools = useMemo(() => {
    let list = schools;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.municipality || '').toLowerCase().includes(q) ||
          (s.district || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [schools, search]);

  const filteredSponsors = useMemo(() => {
    let list = sponsors;
    if (statusFilter !== 'all') {
      list = list.filter((s) => (s.status || '') === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (sp) =>
          sp.full_name.toLowerCase().includes(q) ||
          (sp.organization_name || '').toLowerCase().includes(q) ||
          (sp.country || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [sponsors, search, statusFilter]);

  const filteredSponsorships = useMemo(() => {
    let list = sponsorships;
    if (statusFilter !== 'all') {
      list = list.filter((s) => s.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.student_name.toLowerCase().includes(q) ||
          item.sponsor_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [sponsorships, search, statusFilter]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/${deleteTarget.type}/${deleteTarget.id}`);
      setDeleteTarget(null);
      await loadAll();
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message || 'Failed to delete. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  }

  function exportStudentsCSV() {
    const rows = filteredStudents.map((s) => ({
      Name: s.full_name,
      Code: s.student_code,
      Admission: s.admission_number,
      Gender: s.gender,
      Grade: s.grade,
      Section: s.section,
      School: s.school || '',
      Status: s.status,
    }));
    const header = Object.keys(rows[0] || {}).join(',');
    const body = rows
      .map((r) =>
        Object.values(r)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
    const blob = new Blob([[header, body].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  const statCards = [
    {
      key: 'students' as SectionKey,
      label: 'Students',
      value: summary.totalStudents,
      icon: GraduationCap,
      accent: 'blue' as const,
    },
    {
      key: 'schools' as SectionKey,
      label: 'Schools',
      value: summary.totalSchools,
      icon: School,
      accent: 'green' as const,
    },
    {
      key: 'sponsors' as SectionKey,
      label: 'Sponsors',
      value: summary.totalSponsors,
      icon: Handshake,
      accent: 'blue' as const,
    },
    {
      key: 'sponsorships' as SectionKey,
      label: 'Sponsorships',
      value: summary.totalSponsorships,
      icon: HeartHandshake,
      accent: 'green' as const,
    },
    {
      key: 'active-students' as SectionKey,
      label: 'Active Students',
      value: summary.activeStudents,
      icon: CalendarCheck,
      accent: 'blue' as const,
    },
  ];

  const addLink = {
    students: '/lsp/students/add',
    'active-students': '/lsp/students/add',
    schools: '/lsp/schools/add',
    sponsors: '/lsp/sponsors/add',
    sponsorships: '/lsp/sponsorships/add',
  }[section];

  const showStudentsFilters = section === 'students' || section === 'active-students';
  const showSponsorsFilters = section === 'sponsors';
  const showSponsorshipsFilters = section === 'sponsorships';

  return (
    <>
      <Navbar title="Learning Support Program" />

      <div className="p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Learning Support Program</h1>
          <p className="text-gray-500 mt-2">
            Manage students, schools, sponsors and sponsorships.
          </p>
        </div>

        {/* Statistics — clickable cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => {
            const isActive = section === card.key;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => selectSection(card.key)}
                className={`text-left ${
                  isActive ? 'ring-2 ring-indigo-500 rounded-3xl' : ''
                }`}
              >
                <StatCard
                  label={card.label}
                  value={card.value}
                  icon={card.icon}
                  accent={card.accent}
                />
              </button>
            );
          })}
        </div>

        {/* Analytics section */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <p className="text-gray-500 text-sm">Program overview from live data.</p>
          </div>
          <LSPAnalytics />
        </div>

        {/* Section content */}
        {loading ? (
          <div className="rounded-3xl border bg-white p-12 text-center shadow-sm">
            <Loader2 className="mx-auto animate-spin text-blue-600" size={32} />
            <p className="text-gray-500 mt-4">Loading data...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center shadow-sm">
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadAll}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">{SECTION_LABELS[section]}</h2>
                <p className="text-gray-500 text-sm">
                  {SECTION_DESCRIPTIONS[section]}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {section === 'students' && (
                  <button
                    onClick={exportStudentsCSV}
                    className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    <Download size={16} /> Export
                  </button>
                )}
                <Link
                  href={addLink}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <Plus size={16} /> Add {SECTION_LABELS[section]}
                </Link>
              </div>
            </div>

            {/* Search + filters */}
            <div className="flex flex-col lg:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${SECTION_LABELS[section].toLowerCase()}...`}
                  className="w-full border rounded-lg pl-10 pr-4 py-2.5"
                />
              </div>

              {showStudentsFilters && (
                <>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2.5"
                  >
                    {STATUS_FILTERS.map((s) => (
                      <option key={s} value={s}>
                        {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2.5"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g === 'all' ? 'All grades' : `Grade ${g}`}
                      </option>
                    ))}
                  </select>

                  <select
                    value={schoolFilter}
                    onChange={(e) => setSchoolFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2.5"
                  >
                    <option value="all">All schools</option>
                    {schools.map((sch) => (
                      <option key={sch.id} value={sch.name}>
                        {sch.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {showSponsorsFilters && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2.5"
                >
                  {STATUS_FILTERS.map((s) => (
                    <option key={s} value={s}>
                      {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              )}

              {showSponsorshipsFilters && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2.5"
                >
                  {['all', 'active', 'paused', 'completed', 'cancelled'].map((s) => (
                    <option key={s} value={s}>
                      {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {(section === 'students' || section === 'active-students') && (
              <StudentTable
                students={filteredStudents}
                onDelete={(id, label) =>
                  setDeleteTarget({ type: 'students', id, label })
                }
              />
            )}

            {section === 'schools' && (
              <SchoolTable
                schools={filteredSchools}
                onDelete={(id, label) =>
                  setDeleteTarget({ type: 'schools', id, label })
                }
              />
            )}

            {section === 'sponsors' && (
              <SponsorTable
                sponsors={filteredSponsors}
                sponsorStudentCount={sponsorStudentCount}
                onDelete={(id, label) =>
                  setDeleteTarget({ type: 'sponsors', id, label })
                }
              />
            )}

            {section === 'sponsorships' && (
              <SponsorshipTable
                sponsorships={filteredSponsorships}
                onDelete={(id, label) =>
                  setDeleteTarget({ type: 'sponsorships', id, label })
                }
              />
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold">Confirm Delete</h3>
            <p className="mt-3 text-gray-600">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{deleteTarget.label}</span>? This
              action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-5 py-2.5 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg disabled:opacity-50"
              >
                {deleting && <Loader2 className="animate-spin" size={16} />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   ACTION BUTTONS
============================================================ */

function ActionButtons({
  viewHref,
  editHref,
  onDelete,
}: {
  viewHref: string;
  editHref: string;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={viewHref}
        className="inline-flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg text-sm font-medium"
      >
        <Eye size={15} /> View
      </Link>
      <Link
        href={editHref}
        className="inline-flex items-center gap-1 text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-lg text-sm font-medium"
      >
        <Pencil size={15} /> Edit
      </Link>
      <button
        onClick={onDelete}
        className="inline-flex items-center gap-1 text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg text-sm font-medium"
      >
        <Trash2 size={15} /> Delete
      </button>
    </div>
  );
}

/* ============================================================
   TABLES
============================================================ */

function StudentTable({
  students,
  onDelete,
}: {
  students: Student[];
  onDelete: (id: string, label: string) => void;
}) {
  if (students.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg font-medium">No students found.</p>
        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="bg-gray-50">
          <tr className="border-b">
            <th className="text-left py-3 px-4">Name</th>
            <th className="text-left">Student Code</th>
            <th className="text-left">Admission No.</th>
            <th className="text-left">Gender</th>
            <th className="text-left">Grade</th>
            <th className="text-left">Section</th>
            <th className="text-left">School</th>
            <th className="text-left">Status</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4">
                <Link
                  href={`/lsp/students/${student.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {student.full_name}
                </Link>
              </td>
              <td>{student.student_code}</td>
              <td>{student.admission_number}</td>
              <td className="capitalize">{student.gender}</td>
              <td>{student.grade}</td>
              <td>{student.section}</td>
              <td>{student.school || '-'}</td>
              <td>
                <StatusBadge status={student.status} />
              </td>
              <td>
                <ActionButtons
                  viewHref={`/lsp/students/${student.id}`}
                  editHref={`/lsp/students/edit/${student.id}`}
                  onDelete={() => onDelete(student.id, student.full_name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SchoolTable({
  schools,
  onDelete,
}: {
  schools: School[];
  onDelete: (id: string, label: string) => void;
}) {
  if (schools.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg font-medium">No schools found.</p>
        <p className="text-sm mt-1">Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead className="bg-gray-50">
          <tr className="border-b">
            <th className="text-left py-3 px-4">School Name</th>
            <th className="text-left">Municipality</th>
            <th className="text-left">District</th>
            <th className="text-left">Province</th>
            <th className="text-left">Principal</th>
            <th className="text-left">Phone</th>
            <th className="text-left">Students</th>
            <th className="text-left">Status</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4">
                <Link
                  href={`/lsp/schools/${school.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {school.name}
                </Link>
              </td>
              <td>{school.municipality || '-'}</td>
              <td>{school.district || '-'}</td>
              <td>{school.province || '-'}</td>
              <td>{school.principal_name || '-'}</td>
              <td>{school.phone || '-'}</td>
              <td>{school.students}</td>
              <td>
                <StatusBadge status={school.is_active ? 'active' : 'inactive'} />
              </td>
              <td>
                <ActionButtons
                  viewHref={`/lsp/schools/${school.id}`}
                  editHref={`/lsp/schools/edit/${school.id}`}
                  onDelete={() => onDelete(school.id, school.name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SponsorTable({
  sponsors,
  sponsorStudentCount,
  onDelete,
}: {
  sponsors: Sponsor[];
  sponsorStudentCount: Record<string, number>;
  onDelete: (id: string, label: string) => void;
}) {
  if (sponsors.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg font-medium">No sponsors found.</p>
        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead className="bg-gray-50">
          <tr className="border-b">
            <th className="text-left py-3 px-4">Sponsor</th>
            <th className="text-left">Organization</th>
            <th className="text-left">Country</th>
            <th className="text-left">Phone</th>
            <th className="text-left">Email</th>
            <th className="text-left">Sponsor Type</th>
            <th className="text-left">Sponsored Students</th>
            <th className="text-left">Status</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor) => (
            <tr key={sponsor.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4">
                <Link
                  href={`/lsp/sponsors/${sponsor.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {sponsor.full_name}
                </Link>
              </td>
              <td>{sponsor.organization_name || '-'}</td>
              <td>{sponsor.country || '-'}</td>
              <td>{sponsor.phone || '-'}</td>
              <td>{sponsor.email || '-'}</td>
              <td className="capitalize">{sponsor.sponsor_type || '-'}</td>
              <td>{sponsorStudentCount[sponsor.id] || 0}</td>
              <td>
                <StatusBadge status={sponsor.status || ''} />
              </td>
              <td>
                <ActionButtons
                  viewHref={`/lsp/sponsors/${sponsor.id}`}
                  editHref={`/lsp/sponsors/edit/${sponsor.id}`}
                  onDelete={() => onDelete(sponsor.id, sponsor.full_name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SponsorshipTable({
  sponsorships,
  onDelete,
}: {
  sponsorships: Sponsorship[];
  onDelete: (id: string, label: string) => void;
}) {
  if (sponsorships.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg font-medium">No sponsorships found.</p>
        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="bg-gray-50">
          <tr className="border-b">
            <th className="text-left py-3 px-4">Student</th>
            <th className="text-left">Sponsor</th>
            <th className="text-left">Start Date</th>
            <th className="text-left">End Date</th>
            <th className="text-left">Monthly Amount</th>
            <th className="text-left">Status</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sponsorships.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4">
                <Link href={`/lsp/sponsorships/${item.id}`}>
                  <span className="font-semibold text-blue-600 hover:underline">
                    {item.student_name}
                  </span>
                </Link>
              </td>
              <td>{item.sponsor_name}</td>
              <td>{item.sponsorship_start || '-'}</td>
              <td>{item.sponsorship_end || '-'}</td>
              <td>Rs. {Number(item.monthly_amount || 0).toLocaleString()}</td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td>
                <ActionButtons
                  viewHref={`/lsp/sponsorships/${item.id}`}
                  editHref={`/lsp/sponsorships/edit/${item.id}`}
                  onDelete={() =>
                    onDelete(item.id, `${item.student_name}'s sponsorship`)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active';
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isActive
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
