'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import {
  Search,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  X,
  Upload,
} from 'lucide-react';

type GalleryItem = {
  id: string;
  project_id?: string | null;
  media_type: 'image' | 'video';
  file_url: string;
  caption?: string | null;
  created_at?: string;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [search, setSearch] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);

  const [fileUrl, setFileUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [newMediaType, setNewMediaType] = useState('image');

  const [error, setError] = useState('');

  async function loadGallery() {
    try {
      setLoading(true);
      setError('');

      const params: any = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (mediaType) {
        params.media_type = mediaType;
      }

      const response = await api.get('/gallery', { params });

      setItems(response.data.data || []);
    } catch (err: any) {
      console.error('Failed to load gallery:', err);

      setError(
        err?.response?.data?.message ||
          'Failed to load gallery.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, [search, mediaType]);

  async function handleAdd() {
    if (!fileUrl.trim()) {
      setError('Image or video URL is required.');
      return;
    }

    try {
      setAdding(true);
      setError('');

      await api.post('/gallery', {
        media_type: newMediaType,
        file_url: fileUrl.trim(),
        caption: caption.trim() || null,
      });

      setFileUrl('');
      setCaption('');
      setNewMediaType('image');
      setShowAdd(false);

      await loadGallery();
    } catch (err: any) {
      console.error('Failed to add gallery item:', err);

      setError(
        err?.response?.data?.message ||
          'Failed to add gallery item.'
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this gallery item?'
    );

    if (!confirmed) return;

    try {
      setError('');

      await api.delete(`/gallery/${id}`);

      await loadGallery();
    } catch (err: any) {
      console.error('Failed to delete gallery item:', err);

      setError(
        err?.response?.data?.message ||
          'Failed to delete gallery item.'
      );
    }
  }

  return (
    <>
      <Navbar title="Gallery" />

      <div className="p-4 md:p-8 space-y-8">

        {/* HERO */}

        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm text-white/80">
                Media Management
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                Gallery
              </h1>

              <p className="mt-3 max-w-2xl text-white/80">
                Manage photographs and videos from Loo Niva
                activities, projects and community events.
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                setError('');
                setShowAdd(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-lg transition hover:bg-gray-100"
            >
              <Plus size={20} />
              Add Media
            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">

            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>

          </div>
        )}

        {/* SEARCH / FILTER */}

        <div className="rounded-2xl bg-white p-5 shadow-md">

          <div className="flex flex-col gap-4 md:flex-row">

            <div className="relative flex-1">

              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                className="w-full rounded-xl border border-gray-200 px-10 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Search captions..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
              value={mediaType}
              onChange={(e) =>
                setMediaType(e.target.value)
              }
            >
              <option value="">All media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>

          </div>

        </div>

        {/* GALLERY */}

        {loading ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow-md">

            <p className="text-gray-500">
              Loading gallery...
            </p>

          </div>

        ) : items.length === 0 ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow-md">

            <ImageIcon
              size={48}
              className="mx-auto text-indigo-300"
            />

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No media uploaded
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first photo or video to the gallery.
            </p>

            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Media
            </button>

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

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    title="Delete media"
                    className="absolute right-3 top-3 rounded-lg bg-red-600 p-2 text-white opacity-0 shadow-lg transition group-hover:opacity-100 hover:bg-red-700"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

                {/* DETAILS */}

                <div className="p-4">

                  <p className="min-h-[24px] font-semibold text-gray-800">

                    {item.caption ||
                      'Untitled media'}

                  </p>

                  {item.created_at && (
                    <p className="mt-2 text-xs text-gray-400">
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

      </div>

      {/* ADD MEDIA MODAL */}

      {showAdd && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Add Media
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add an image or video to the gallery.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={22} />
              </button>

            </div>

            {/* FORM */}

            <div className="mt-6 space-y-5">

              {/* MEDIA TYPE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Media Type
                </label>

                <select
                  value={newMediaType}
                  onChange={(e) =>
                    setNewMediaType(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="image">
                    Image
                  </option>

                  <option value="video">
                    Video
                  </option>
                </select>

              </div>

              {/* URL */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {newMediaType === 'video'
                    ? 'Video URL'
                    : 'Image URL'}
                </label>

                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) =>
                    setFileUrl(e.target.value)
                  }
                  placeholder={
                    newMediaType === 'video'
                      ? 'https://example.com/video.mp4'
                      : 'https://example.com/image.jpg'
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              {/* CAPTION */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Caption
                </label>

                <textarea
                  value={caption}
                  onChange={(e) =>
                    setCaption(e.target.value)
                  }
                  rows={3}
                  placeholder="Describe this activity..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

            </div>

            {/* ACTIONS */}

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={adding}
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Upload size={18} />

                {adding
                  ? 'Adding...'
                  : 'Add Media'}

              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}