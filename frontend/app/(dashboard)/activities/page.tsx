'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import {
  Plus,
  MapPin,
  Users as UsersIcon,
  CalendarDays,
  FolderKanban,
  X,
} from 'lucide-react';

type Activity = {
  id: string;
  project_id?: string;
  title: string;
  activity_type?: string;
  description?: string;
  venue?: string;
  activity_date?: string;
  start_time?: string;
  end_time?: string;
  budget?: number;
  project_title?: string;
};

export default function ActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

 const [form, setForm] = useState({
  project_id: '',
  title: '',
  activity_type: 'training',
  description: '',
  venue: '',
  activity_date: '',
  start_time: '',
  end_time: '',
  budget: '',
});

 async function load() {
  setLoading(true);

  try {
    const [activitiesRes, projectsRes] = await Promise.all([
      api.get('/activities'),
      api.get('/projects'),
    ]);

    setItems(
      Array.isArray(activitiesRes.data?.data)
        ? activitiesRes.data.data
        : []
    );

    setProjects(
      Array.isArray(projectsRes.data?.data)
        ? projectsRes.data.data
        : []
    );

  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = useMemo(
    () =>
      (value?: string | null) => {
        if (!value) return '';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '';
        return d.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      },
    []
  );

  async function handleCreate(e: React.FormEvent) {
  e.preventDefault();

  if (submitting) return;

  setSubmitting(true);

  try {
    await api.post('/activities', {
  ...form,

  budget: Number(form.budget) || 0,

  start_time: form.start_time || null,

  end_time: form.end_time || null,

  activity_date: form.activity_date || null,
});

    setShowForm(false);

    setForm({
      project_id: '',
      title: '',
      activity_type: 'training',
      description: '',
      venue: '',
      activity_date: '',
      start_time: '',
      end_time: '',
      budget: '',
    });

    await load();

  } finally {
    setSubmitting(false);
  }
}

  return (
    <>
      <Navbar title="Activities" />
      <div className="p-4 md:p-8 space-y-6">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-600 to-blue-500 p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <p className="text-white/80 text-lg">📅 Activity Management</p>
            <h1 className="mt-2 text-4xl font-bold">
              Organize Every
              <br />
              Community Activity
            </h1>
            <p className="mt-4 max-w-2xl text-white/90">
              Plan, record and monitor every activity conducted by Loo Niva Child Concern Group across Nepal.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Recent Activities</h2>
            <p className="text-gray-500">View and manage all recorded activities.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Record Activity
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <div
                key={a.id}
                className="
                  card
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-2xl
                  hover:border-violet-300
                  cursor-pointer
                "
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{a.title}</h3>
                    <div className="mt-2">
  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
    {a.activity_type}
  </span>
</div>
                    {a.description && <p className="mt-2 text-gray-500">{a.description}</p>}
                  </div>
                  <span className="badge bg-violet-100 text-violet-700">Activity</span>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
                  {a.venue && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} className="text-violet-600" />
                      {a.venue}
                    </div>
                  )}

                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarDays size={16} className="text-blue-600" />
                    {formatDate(a.activity_date)}
                  </div>
                </div>

                {a.project_title && (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                    <FolderKanban size={15} />
                    {a.project_title}
                  </div>
                )} 
                {a.budget && (
  <div className="mt-3 text-green-700 font-semibold">
    Budget: NPR {Number(a.budget).toLocaleString()}
  </div>
)}
              </div>
            ))}

            {!items.length && <p className="text-gray-400">No activities recorded yet.</p>}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreate} className="card w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Record Activity</h3>
              <button type="button" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <label className="block text-sm font-medium mb-1.5">
Project
</label>

<select
  className="input-field mb-4"
  value={form.project_id}
  onChange={(e) =>
    setForm({
      ...form,
      project_id: e.target.value,
    })
  }
>
  <option value="">Select Project</option>

  {projects.map((p) => (
    <option key={p.id} value={p.id}>
      {p.title}
    </option>
  ))}
</select>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input
              required
              className="input-field mb-4"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              className="input-field mb-4"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Date</label>
                <input
                  required
                  type="date"
                  className="input-field"
                  value={form.activity_date}
                  onChange={(e) => setForm({ ...form, activity_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
Activity Type
</label>

<select
className="input-field"
value={form.activity_type}
onChange={(e)=>setForm({...form,activity_type:e.target.value})}
>

<option value="training">Training</option>
<option value="meeting">Meeting</option>
<option value="awareness">Awareness</option>
<option value="field_visit">Field Visit</option>
<option value="distribution">Distribution</option>
<option value="monitoring">Monitoring</option>
<option value="other">Other</option>

</select>
              </div>
            </div>

            <label className="block text-sm font-medium mb-1.5">Venue</label>
            <input
              className="input-field mb-6"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4 mb-4">

<div>

<label className="block text-sm font-medium mb-1.5">
Start Time
</label>

<input
type="time"
className="input-field"
value={form.start_time}
onChange={(e)=>setForm({...form,start_time:e.target.value})}
/>

</div>

<div>

<label className="block text-sm font-medium mb-1.5">
End Time
</label>

<input
type="time"
className="input-field"
value={form.end_time}
onChange={(e)=>setForm({...form,end_time:e.target.value})}
/>

</div>

</div>

<label className="block text-sm font-medium mb-1.5">
Budget (NPR)
</label>

<input
type="number"
className="input-field"
value={form.budget}
onChange={(e)=>setForm({...form,budget:e.target.value})}
/>

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Activity'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

