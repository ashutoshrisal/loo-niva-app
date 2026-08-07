'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarDays, Plus } from 'lucide-react';

export default function CalendarPage() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Child Protection Workshop',
      date: '2026-07-20',
    },
    {
      id: '2',
      title: 'Community Meeting',
      date: '2026-07-24',
    },
    {
      id: '3',
      title: 'Field Visit',
      date: '2026-07-28',
    },
  ]);

  function handleDateClick(arg: any) {
    const title = prompt('Enter Event Title');

    if (!title) return;

    setEvents((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title,
        date: arg.dateStr,
      },
    ]);
  }

  return (
    <>
      <Navbar title="Calendar" />

<div className="p-8 space-y-8">

        {/* Hero */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-10 text-white shadow-xl">

          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">

            <p className="text-sm opacity-90">
              📅 NGO Event Planner
            </p>

            <h1 className="mt-2 text-5xl font-bold">
              Calendar
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-white/90">
              Organize meetings, project deadlines, workshops,
              field visits and community events.
            </p>

          </div>

        </div>

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold">
              Event Calendar
            </h2>

            <p className="text-gray-500">
              Click any date to add an event.
            </p>

          </div>

          <button className="btn-primary flex items-center gap-2">

            <Plus size={18} />

            Add Event

          </button>

        </div>

{/* Calendar */}

<div className="card p-6">

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            editable={true}
            height="auto"
            dateClick={handleDateClick}
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth',
            }}
          />

        </div>

        {/* Legend */}

        <div className="grid md:grid-cols-3 gap-5">

          <div className="card flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

              <CalendarDays className="text-blue-600" />

            </div>

            <div>

              <h4 className="font-semibold">
                {events.length}
              </h4>

              <p className="text-gray-500 text-sm">
                Scheduled Events
              </p>

            </div>

          </div>

          <div className="card">

            <h4 className="font-semibold">
              Tips
            </h4>

            <p className="text-sm text-gray-500 mt-2">
              Click on any day to quickly create a new NGO event.
            </p>

          </div>

          <div className="card">

            <h4 className="font-semibold">
              Coming Soon
            </h4>

            <p className="text-sm text-gray-500 mt-2">
              Google Calendar Sync, reminders and recurring events.
            </p>

          </div>

        </div>

      </div>
    </>
  );
}