'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { ArrowLeft, CalendarDays } from 'lucide-react';

export default function ActivityDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const { data } = await api.get(`/activities/${id}`);
        setActivity(data.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'Failed to load activity.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <>
      <Navbar title="Activity Details" />

      <div className="p-4 md:p-8 space-y-6">

        <Link
          href="/activities"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Activities
        </Link>

        {loading ? (
          <p className="text-gray-500">Loading activity...</p>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : activity ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
            <div className="flex items-center gap-3 text-indigo-600">
              <CalendarDays size={20} />
              <p className="text-sm font-semibold uppercase tracking-wider">
                Activity
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              {activity.title}
            </h1>

{activity.description && (
              <p className="mt-4 leading-7 text-gray-600">
                {activity.description}
              </p>
            )}

            {activity.venue && (
              <p className="mt-4 text-sm text-gray-500">
                <span className="font-semibold">Venue:</span>{' '}
                {activity.venue}
              </p>
            )}

            {activity.activity_date && (
              <p className="mt-2 text-sm text-gray-500">
                <span className="font-semibold">Date:</span>{' '}
                {new Date(
                  activity.activity_date
                ).toLocaleDateString()}
              </p>
            )}

            {activity.start_time && (
              <p className="mt-2 text-sm text-gray-500">
                <span className="font-semibold">Time:</span>{' '}
                {activity.start_time.slice(0, 5)}
                {activity.end_time
                  ? ` - ${activity.end_time.slice(0, 5)}`
                  : ''}
              </p>
            )}

            {activity.activity_type && (
              <p className="mt-2 text-sm text-gray-500 capitalize">
                <span className="font-semibold">Type:</span>{' '}
                {activity.activity_type.replace('_', ' ')}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">Activity not found.</p>
          </div>
        )}

      </div>
    </>
  );
}
