'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Image as ImageIcon,
  Video,
  CalendarDays,
  MapPin,
  LogIn,
  Menu,
  X,
} from 'lucide-react';

type GalleryItem = {
  id: string;
  media_type: 'image' | 'video';
  file_url: string;
  caption?: string | null;
  created_at?: string;
};

// Centralized API base URL (same source as lib/api.ts).
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

export default function PublicGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);

  async function loadGallery() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${API_BASE}/gallery/public`
      );

      const result = await response.json();

      if (result.success) {
        setItems(result.data || []);
      } else {
        setError(
          result.message ||
            'Failed to load gallery.'
        );
      }
    } catch (err) {
      console.error(
        'Failed to load public gallery:',
        err
      );

      setError(
        'Unable to load the gallery. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          {/* LOGO */}

          <Link
            href="/"
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
          </Link>

          {/* DESKTOP NAV */}

          <div className="hidden items-center gap-8 md:flex">

            <Link
              href="/#about"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              About Us
            </Link>

            <Link
              href="/#work"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Our Work
            </Link>

            <Link
              href="/#progress"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Progress
            </Link>

            <Link
              href="/#gallery"
              className="text-sm font-medium text-indigo-600 transition"
            >
              Gallery
            </Link>

            <Link
              href="/#contact"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Contact
            </Link>

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

              <Link
                href="/#about"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-gray-700"
              >
                About Us
              </Link>

              <Link
                href="/#work"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-gray-700"
              >
                Our Work
              </Link>

              <Link
                href="/#progress"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-gray-700"
              >
                Progress
              </Link>

              <Link
                href="/#gallery"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-indigo-600"
              >
                Gallery
              </Link>

              <Link
                href="/#contact"
                onClick={() => setMobileMenu(false)}
                className="font-medium text-gray-700"
              >
                Contact
              </Link>

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

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-900 to-cyan-700">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl items-center gap-16 px-6 py-20 text-white lg:py-24">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Photo Gallery
          </p>

          <h1 className="mt-4 text-5xl font-extrabold leading-tight md:text-6xl">
            Moments from our work
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            A glimpse into the activities, projects and community
            events that Loo Niva Child Concern Group carries out
            with children, families and communities across Nepal.
          </p>

          <Link
            href="/#contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 shadow-xl transition hover:-translate-y-1 hover:bg-gray-100"
          >
            Get in Touch
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      {/* =====================================================
          GALLERY GRID
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16">

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (

              <div
                key={item}
                className="h-56 animate-pulse rounded-2xl bg-gray-200"
              />

            ))}

          </div>

        ) : items.length === 0 ? (

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-16 text-center">

            <ImageIcon
              size={48}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              No photos available yet
            </h2>

            <p className="mt-2 max-w-md mx-auto text-gray-500">
              We are still gathering photos from our activities.
              Please check back soon.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Back to Homepage
              <ArrowRight size={18} />
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {items.map((item) => (

              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* MEDIA */}

                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

                  {item.media_type === 'video' ? (

                    <video
                      src={item.file_url}
                      className="h-full w-full object-cover"
                      controls
                    />

                  ) : (

                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.file_url}
                      alt={
                        item.caption ||
                        'Loo Niva gallery image'
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  )}

                  {/* MEDIA TYPE */}

                  <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">

                    {item.media_type === 'video' ? (
                      <span className="flex items-center gap-1">
                        <Video size={13} />
                        Video
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ImageIcon size={13} />
                        Image
                      </span>
                    )}

                  </div>

                </div>

                {/* DETAILS */}

                <div className="p-4">

                  <p className="min-h-[24px] font-semibold text-gray-800">

                    {item.caption ||
                      'Loo Niva activity'}

                  </p>

                  {item.created_at && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">

                      <CalendarDays size={12} />

                      {new Date(
                        item.created_at
                      ).toLocaleDateString()}

                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

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
                  info@looniva.org
                </p>

              </div>

            </div>

            {/* QUICK LINKS */}

            <div>

              <h3 className="font-bold">
                Quick Links
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-white/60">

                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/#about"
                  className="transition hover:text-white"
                >
                  About Us
                </Link>

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
