'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Users,
  FolderKanban,
  Image as ImageIcon,
  CalendarDays,
  LogIn,
  GraduationCap,
  HandHeart,
  Megaphone,
  Menu,
  X,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
} from 'lucide-react';

type PublicEvent = {
  id: string;
  title: string;
  description?: string | null;
  event_date: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
};

// Centralized API base URL (same source as lib/api.ts).
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

export default function RootPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [gallery, setGallery] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    beneficiaries: 0,
    activities: 0,
    districts: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
const [events, setEvents] = useState<PublicEvent[]>([]);
const [eventsLoading, setEventsLoading] = useState(true);


  useEffect(() => {
    const loadGallery = async () => {
try {
        const response = await fetch(
          `${API_BASE}/gallery/public`
        );

        const result = await response.json();

        if (result.success) {
          setGallery(result.data || []);
        }
      } catch (error) {
        console.error(
          'Failed to load public gallery:',
          error
        );
      } finally {
        setGalleryLoading(false);
      }
    };

    loadGallery();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
const response = await fetch(
          `${API_BASE}/public/stats`
        );

        const result = await response.json();

        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error(
          'Failed to load public statistics:',
          error
        );
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
const response = await fetch(
          `${API_BASE}/public/events`
        );

        const data = await response.json();

        if (data.success) {
          setEvents(data.data || []);
        }
      } catch (error) {
        console.error('Failed to load public events:', error);
      } finally {
        setEventsLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          {/* LOGO */}

          <a
            href="#top"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
              <img
                src="/logo.jpg"
                alt="Loo Niva Child Concern Group"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="font-bold leading-tight">
                Loo Niva
              </h1>

              <p className="text-[11px] text-gray-500">
                Child Concern Group
              </p>
            </div>
          </a>

          {/* DESKTOP NAV */}

          <div className="hidden items-center gap-8 md:flex">

            <a
              href="#about"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              About Us
            </a>

            <a
              href="#work"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Our Work
            </a>

            <a
              href="#progress"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Progress
            </a>

            <a
              href="#gallery"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Gallery
            </a>

            <a
              href="#contact"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Contact
            </a>

          </div>

          {/* STAFF LOGIN */}

          <div className="hidden md:block">

            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 hover:-translate-y-0.5"
            >
              <LogIn size={17} />
              Staff Login
            </Link>

          </div>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            {mobileMenu ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

        {/* MOBILE MENU */}

        {mobileMenu && (
          <div className="border-t border-gray-100 bg-white px-5 py-5 md:hidden">

            <div className="flex flex-col gap-4">

              <a
                href="#about"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-gray-700"
              >
                About Us
              </a>

              <a
                href="#work"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-gray-700"
              >
                Our Work
              </a>

              <a
                href="#progress"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-gray-700"
              >
                Progress
              </a>

              <a
                href="#gallery"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-gray-700"
              >
                Gallery
              </a>

              <a
                href="#contact"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-gray-700"
              >
                Contact
              </a>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
              >
                <LogIn size={17} />
                Staff Login
              </Link>

            </div>

          </div>
        )}

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        id="top"
        className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-900 to-cyan-700"
      >

        {/* Background decorations */}

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute right-1/3 top-20 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">

          {/* LEFT */}

          <div className="text-white">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">

              <HeartHandshake size={17} />

              Working for children's rights

            </div>

            <h2 className="text-5xl font-extrabold leading-[1.05] md:text-7xl">

              Empowering

              <br />

              <span className="text-cyan-300">
                Every Child.
              </span>

            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/75">

              Loo Niva Child Concern Group works to protect
              children's rights through education, advocacy,
              participation and community empowerment.

            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#about"
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 shadow-xl transition hover:-translate-y-1 hover:bg-gray-100"
              >
                Discover Our Work
                <ArrowRight size={18} />
              </a>

              <a
                href="#progress"
                className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                View Progress
                <ChevronRight size={18} />
              </a>

            </div>

          </div>


          {/* RIGHT — IMPACT */}

          <div className="grid grid-cols-2 gap-5">

            <StatCard
              icon={<FolderKanban size={28} />}
              value={
                statsLoading
                  ? '...'
                  : stats.projects.toString()
              }
              label="Active Projects"
            />

            <StatCard
              icon={<Users size={28} />}
              value={
                statsLoading
                  ? '...'
                  : stats.beneficiaries.toString()
              }
              label="Beneficiaries"
            />

            <StatCard
              icon={<MapPin size={28} />}
              value={
                statsLoading
                  ? '...'
                  : stats.districts.toString()
              }
              label="Districts Covered"
            />

            <StatCard
              icon={<ShieldCheck size={28} />}
              value={
                statsLoading
                  ? '...'
                  : stats.activities.toString()
              }
              label="Community Activities"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="mx-auto max-w-7xl px-6 py-24"
      >

        <div className="grid items-center gap-16 lg:grid-cols-2">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              About Loo Niva
            </p>

            <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Building a better future for children.
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Loo Niva Child Concern Group is committed to
              creating safer and more empowering communities
              where children can learn, participate and exercise
              their rights.
            </p>

            <p className="mt-5 leading-7 text-gray-500">
              Through education, advocacy, participation and
              community-based initiatives, our work focuses on
              creating meaningful opportunities for children and
              strengthening the communities around them.
            </p>

            <a
              href="#work"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Explore our work
              <ArrowRight size={18} />
            </a>

          </div>


          {/* MISSION / VISION */}

          <div className="grid gap-5">

            <InfoCard
              icon={<HeartHandshake />}
              title="Our Mission"
              description="To promote children's rights, participation, education and wellbeing through community-based action."
            />

            <InfoCard
              icon={<GraduationCap />}
              title="Our Vision"
              description="A society where every child is respected, protected, heard and given the opportunity to reach their potential."
            />

            <InfoCard
              icon={<HandHeart />}
              title="Our Approach"
              description="We work together with children, families, schools and communities to create sustainable positive change."
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR WORK
      ===================================================== */}

      <section
        id="work"
        className="bg-gray-50 py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto mb-14 max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              What We Do
            </p>

            <h2 className="mt-4 text-4xl font-extrabold">
              Creating meaningful change
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Our work focuses on creating opportunities,
              strengthening communities and ensuring that
              children's voices are heard.
            </p>

          </div>


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon={<FolderKanban />}
              title="Community Projects"
              description="Community projects designed to support children and strengthen local communities."
            />

            <FeatureCard
              icon={<Users />}
              title="Child Participation"
              description="Creating opportunities for children to participate, express themselves and contribute."
            />

            <FeatureCard
              icon={<GraduationCap />}
              title="Education"
              description="Supporting learning opportunities and creating stronger educational environments."
            />

            <FeatureCard
              icon={<Megaphone />}
              title="Child Rights Advocacy"
              description="Promoting awareness and advocacy for children's rights and protection."
            />

            <FeatureCard
              icon={<HandHeart />}
              title="Community Empowerment"
              description="Working with families, schools and communities to create sustainable change."
            />

            <FeatureCard
              icon={<ShieldCheck />}
              title="Protection & Wellbeing"
              description="Supporting safer environments where children can grow, learn and participate."
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <section
        id="progress"
        className="mx-auto max-w-7xl px-6 py-24"
      >

        <div className="mb-14">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Our Progress
          </p>

          <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">
            Our impact at a glance
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-gray-600">
            A snapshot of the reach and activities of Loo Niva
            Child Concern Group.
          </p>

        </div>


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <ProgressCard
            value={
              statsLoading
                ? '...'
                : stats.projects.toString()
            }
            label="Projects"
            icon={<FolderKanban />}
          />

          <ProgressCard
            value={
              statsLoading
                ? '...'
                : stats.beneficiaries.toString()
            }
            label="Beneficiaries"
            icon={<Users />}
          />

          <ProgressCard
            value={
              statsLoading
                ? '...'
                : stats.districts.toString()
            }
            label="Districts"
            icon={<MapPin />}
          />

          <ProgressCard
            value={
              statsLoading
                ? '...'
                : stats.activities.toString()
            }
            label="Community Activities"
            icon={<CalendarDays />}
          />

        </div>


        {/* PROGRESS BANNER */}

        <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 to-cyan-600 p-8 text-white shadow-xl md:p-12">

          <div className="grid items-center gap-8 md:grid-cols-2">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Together
              </p>

              <h3 className="mt-3 text-3xl font-bold md:text-4xl">
                Every child deserves a chance to thrive.
              </h3>

              <p className="mt-4 leading-7 text-white/75">
                Our work continues through collaboration with
                children, families, schools and communities.
              </p>

            </div>

            <div className="flex justify-start md:justify-end">

              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">

                <ShieldCheck size={34} />

                <p className="mt-3 text-2xl font-bold">
                  Child Rights
                </p>

                <p className="mt-1 text-white/70">
                  At the heart of everything we do.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          LATEST GALLERY
      ===================================================== */}

      <section className="bg-gray-50 py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Our Activities
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                From our work in the community
              </h2>

              <p className="mt-4 max-w-2xl text-gray-600">
                Take a look at some of the activities and moments
                from our work with children, families and communities.
              </p>

            </div>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              View Full Gallery
              <ArrowRight size={18} />
            </Link>

          </div>

          {galleryLoading ? (

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

              {[1, 2, 3, 4, 5, 6].map((item) => (

                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl bg-gray-200"
                />

              ))}

            </div>

          ) : gallery.length === 0 ? (

            <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center">

              <ImageIcon
                size={42}
                className="mx-auto text-gray-300"
              />

              <p className="mt-4 text-gray-500">
                No gallery photos available yet.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

              {gallery.slice(0, 6).map((item) => (

                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm"
                >

                  {item.media_type === 'video' ? (

                    <video
                      src={item.file_url}
                      className="h-56 w-full object-cover"
                      controls
                    />

                  ) : (

                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.file_url}
                      alt={item.caption || 'Loo Niva activity'}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  )}

                  {item.caption && (

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">

                      <p className="text-sm font-medium text-white">
                        {item.caption}
                      </p>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          LATEST UPDATES (PUBLIC FEATURES)
      ===================================================== */}

      <section className="bg-indigo-50 py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Stay Connected
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Latest Updates
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Follow our activities, upcoming events and work
              with children and communities.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {/* GALLERY */}

            <PublicCard
              icon={<ImageIcon />}
              title="Gallery"
              description="Explore photographs and stories from our activities."
            />

            {/* UPCOMING EVENTS */}

            <div className="rounded-3xl border border-indigo-100 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <CalendarDays />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Upcoming Events
              </h3>

              {eventsLoading ? (

                <p className="mt-4 text-sm text-gray-500">
                  Loading events...
                </p>

              ) : events.length === 0 ? (

                <p className="mt-4 text-sm text-gray-500">
                  No upcoming events at the moment.
                </p>

              ) : (

                <div className="mt-5 space-y-4">

                  {events.slice(0, 3).map((event) => (

                    <div
                      key={event.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >

                      <div className="flex items-start gap-3">

                        {/* DATE */}

                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-600 text-white">

                          <span className="text-xs font-medium">
                            {new Date(event.event_date).toLocaleDateString(
                              'en-US',
                              { month: 'short' }
                            )}
                          </span>

                          <span className="text-lg font-bold leading-none">
                            {new Date(event.event_date).getDate()}
                          </span>

                        </div>

                        {/* EVENT DETAILS */}

                        {/* EVENT DETAILS */}

<div className="min-w-0 flex-1">

  <h4 className="font-semibold text-gray-900">
    {event.title}
  </h4>

  {event.description && (
    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
      {event.description}
    </p>
  )}

  {event.location && (
    <p className="mt-2 text-xs text-gray-500">
      📍 {event.location}
    </p>
  )}

  {event.start_time && (
    <p className="mt-1 text-xs text-gray-500">
      🕐 {event.start_time.slice(0, 5)}
      {event.end_time
        ? ` - ${event.end_time.slice(0, 5)}`
        : ''}
    </p>
  )}

</div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* TRANSPARENCY */}

            <PublicCard
              icon={<ShieldCheck />}
              title="Transparency"
              description="Learn about our projects, activities and progress."
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          STAFF PORTAL
      ===================================================== */}

      <section className="bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 py-24">

        <div className="mx-auto max-w-4xl px-6 text-center text-white">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">

            <ShieldCheck size={34} />

          </div>

          <h2 className="mt-6 text-4xl font-extrabold md:text-5xl">
            Loo Niva Staff Portal
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Authorized Loo Niva staff can securely access
            the management system to manage projects,
            activities, beneficiaries, reports and other
            organizational information.
          </p>

          <Link
            href="/login"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-indigo-700 shadow-xl transition hover:-translate-y-1 hover:bg-gray-100"
          >
            <LogIn size={19} />
            Staff Login
          </Link>

        </div>

      </section>


      {/* =====================================================
          CONTACT / FOOTER
      ===================================================== */}

      <footer
        id="contact"
        className="bg-slate-950 text-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="grid gap-12 md:grid-cols-3">

            {/* BRAND */}

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">

                  <img
                    src="/logo.jpg"
                    alt="Loo Niva Child Concern Group"
                    className="h-full w-full object-contain"
                  />

                </div>

                <div>

                  <h3 className="font-bold">
                    Loo Niva
                  </h3>

                  <p className="text-xs text-white/50">
                    Child Concern Group
                  </p>

                </div>

              </div>

              <p className="mt-5 max-w-sm leading-7 text-white/50">
                Empowering every child through care,
                education, participation and community action.
              </p>

            </div>


            {/* CONTACT */}

            <div>

              <h3 className="font-bold">
                Contact
              </h3>

              <div className="mt-5 space-y-4 text-sm text-white/60">

                <p className="flex items-center gap-3">
                  <MapPin size={17} />
                  Nepal
                </p>

                <p className="flex items-center gap-3">
                  <Mail size={17} />
                  info@looniva.org
                </p>

                <p className="flex items-center gap-3">
                  <Phone size={17} />
                  Contact Loo Niva
                </p>

              </div>

            </div>


            {/* QUICK LINKS */}

            <div>

              <h3 className="font-bold">
                Quick Links
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-white/60">

                <a
                  href="#about"
                  className="transition hover:text-white"
                >
                  About Us
                </a>

                <a
                  href="#work"
                  className="transition hover:text-white"
                >
                  Our Work
                </a>

                <a
                  href="#progress"
                  className="transition hover:text-white"
                >
                  Our Progress
                </a>

                <Link
                  href="/login"
                  className="transition hover:text-white"
                >
                  Staff Login
                </Link>

              </div>

            </div>

          </div>

          <div className="mt-14 border-t border-white/10 pt-7">

            <div className="flex flex-col justify-between gap-3 text-sm text-white/40 md:flex-row">

              <p>
                © {new Date().getFullYear()} Loo Niva Child Concern Group
              </p>

              <p>
                Empowering Every Child Through Care & Education
              </p>

            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}


/* ============================================================
   COMPONENTS
============================================================ */

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/10 p-6 text-white backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:bg-white/15">

      <div className="text-cyan-200 transition group-hover:scale-110">
        {icon}
      </div>

      <p className="mt-5 text-4xl font-extrabold">
        {value}
      </p>

      <p className="mt-1 text-sm text-white/65">
        {label}
      </p>

    </div>
  );
}


function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">

        {icon}

      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>

    </div>
  );
}


function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition duration-300 group-hover:bg-indigo-600 group-hover:text-white">

        {icon}

      </div>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-indigo-600">

        Learn more

        <ArrowRight
          size={15}
          className="transition group-hover:translate-x-1"
        />

      </div>

    </div>
  );
}


function ProgressCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">

        {icon}

      </div>

      <p className="mt-6 text-4xl font-extrabold">
        {value}
      </p>

      <p className="mt-2 text-gray-500">
        {label}
      </p>

    </div>
  );
}


function PublicCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">

        {icon}

      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>

    </div>
  );
}