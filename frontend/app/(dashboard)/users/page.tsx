'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

import {
  Plus,
  Search,
  Users,
  Pencil,
  Trash2,
  Eye,
  ShieldCheck,
  ShieldOff,
  X,
  Save,
} from 'lucide-react';

type UserData = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  designation?: string;
  is_active: boolean;
  last_login?: string | null;
  role: string;
};

type UserForm = {
  full_name: string;
  email: string;
  phone: string;
  designation: string;
  role_id: string;
  password: string;
};

const ROLES = [
  { id: '1', name: 'super_admin' },
  { id: '2', name: 'project_manager' },
  { id: '3', name: 'field_staff' },
  { id: '4', name: 'viewer' },
];

export default function UsersPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [viewUser, setViewUser] = useState<UserData | null>(null);

  const [form, setForm] = useState<UserForm>({
    full_name: '',
    email: '',
    phone: '',
    designation: '',
    role_id: '4',
    password: '',
  });

  const isSuperAdmin = user?.role === 'super_admin';

  // ==========================================
  // LOAD USERS
  // ==========================================

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // MODAL HELPERS
  // ==========================================

  const openAddModal = () => {
    setEditingUser(null);
    setForm({
      full_name: '',
      email: '',
      phone: '',
      designation: '',
      role_id: '4',
      password: '',
    });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (target: UserData) => {
    setEditingUser(target);
    const role = ROLES.find((item) => item.name === target.role);
    setForm({
      full_name: target.full_name || '',
      email: target.email || '',
      phone: target.phone || '',
      designation: target.designation || '',
      role_id: role?.id || '4',
      password: '',
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingUser(null);
    setFormError('');
  };

  const updateForm = (field: keyof UserForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ==========================================
  // SAVE USER (CREATE / UPDATE)
  // ==========================================

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setNotice(null);

    if (!form.full_name.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!form.email.trim()) {
      setFormError('Email is required.');
      return;
    }
    if (!editingUser && !form.password) {
      setFormError('Password is required when creating a user.');
      return;
    }
    if (!editingUser && form.password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    try {
      setSaving(true);

      if (!editingUser) {
        await api.post('/auth/register', {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone || null,
          designation: form.designation || null,
          role_id: form.role_id,
        });
        setNotice({ type: 'success', text: 'User created successfully.' });
      } else {
        await api.put(`/users/${editingUser.id}`, {
          full_name: form.full_name.trim(),
          phone: form.phone || null,
          designation: form.designation || null,
          role_id: form.role_id,
        });
        setNotice({ type: 'success', text: 'User updated successfully.' });
      }

      setShowModal(false);
      setEditingUser(null);
      await load();
    } catch (err: any) {
      console.error('Save user error:', err);
      setFormError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // DEACTIVATE / ACTIVATE
  // ==========================================

  const isCurrentUser = (id: string) => user?.id === id;

  async function handleDeactivate(id: string) {
    if (isCurrentUser(id)) {
      setNotice({ type: 'error', text: 'You cannot deactivate your own account.' });
      return;
    }

    const confirmed = window.confirm('Are you sure you want to deactivate this user?');
    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);
      setNotice({ type: 'success', text: 'User deactivated successfully.' });
      await load();
    } catch (err: any) {
      console.error('Deactivate user error:', err);
      setNotice({
        type: 'error',
        text: err.response?.data?.message || 'Failed to deactivate user.',
      });
    }
  }

  async function handleActivate(target: UserData) {
    try {
      await api.put(`/users/${target.id}`, { is_active: true });
      setNotice({ type: 'success', text: 'User activated successfully.' });
      await load();
    } catch (err: any) {
      console.error('Activate user error:', err);
      setNotice({
        type: 'error',
        text: err.response?.data?.message || 'Failed to activate user.',
      });
    }
  }

  // ==========================================
  // SEARCH + FILTERS
  // ==========================================

  const filteredUsers = users.filter((u) => {
    const value = search.toLowerCase();

    const matchesSearch =
      u.full_name?.toLowerCase().includes(value) ||
      u.email?.toLowerCase().includes(value) ||
      (u.phone || '').toLowerCase().includes(value) ||
      u.role?.toLowerCase().includes(value) ||
      u.designation?.toLowerCase().includes(value);

    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'active' && u.is_active) ||
      (statusFilter === 'inactive' && !u.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // ==========================================
  // ACCESS DENIED (DEFENSE IN DEPTH)
  // ==========================================

  if (!isSuperAdmin) {
    return (
      <>
        <Navbar title="User Management" />
        <div className="p-4 md:p-8">
          <div className="card">
            <p className="font-semibold text-red-600">Access Denied</p>
            <p className="text-sm text-gray-500 mt-2">
              Only super administrators can manage users.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="User Management" />
      <div className="p-4 md:p-8 space-y-6">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <p className="text-white/80 text-lg">👥 Administration</p>
            <h1 className="mt-2 text-4xl font-bold">User Management</h1>
            <p className="mt-4 max-w-2xl text-white/90">
              Manage staff accounts, roles and access to the Loo Niva
              management system.
            </p>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-1 gap-3 flex-wrap">
            <div className="relative w-80">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                className="input-field pl-10"
                placeholder="Search by name, email, phone, designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input-field w-auto"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="project_manager">Project Manager</option>
              <option value="field_staff">Field Staff</option>
              <option value="viewer">Viewer</option>
            </select>
            <select
              className="input-field w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="button" onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add User
          </button>
        </div>

        {/* NOTICE */}
        {notice && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              notice.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {notice.text}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* USERS TABLE */}
        <div className="card overflow-hidden p-0">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold">System Users</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage registered staff accounts.
            </p>
          </div>

          {loading ? (
            <p className="p-10 text-center text-gray-400">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="p-10 text-center text-gray-400">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold">User</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Designation</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Last Login</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      {/* USER */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Users size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{u.full_name}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                            {u.phone && (
                              <p className="text-xs text-gray-400">{u.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-4">
                        <span className="badge bg-indigo-50 text-indigo-700">
                          <ShieldCheck size={15} />
                          {u.role}
                        </span>
                      </td>

                      {/* DESIGNATION */}
                      <td className="px-6 py-4 text-gray-600">
                        {u.designation || '-'}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        {u.is_active ? (
                          <span className="badge bg-green-50 text-green-700">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-red-50 text-red-700">
                            <ShieldOff size={15} />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* LAST LOGIN */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {u.last_login
                          ? new Date(u.last_login).toLocaleString()
                          : 'Never'}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="View user"
                            onClick={() => setViewUser(u)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            type="button"
                            title="Edit user"
                            onClick={() => openEditModal(u)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={18} />
                          </button>

                          {u.is_active ? (
                            <button
                              type="button"
                              title={
                                isCurrentUser(u.id)
                                  ? 'You cannot deactivate your own account'
                                  : 'Deactivate user'
                              }
                              onClick={() => handleDeactivate(u.id)}
                              disabled={isCurrentUser(u.id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              title="Activate user"
                              onClick={() => handleActivate(u)}
                              className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                            >
                              <ShieldCheck size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editingUser
                    ? 'Update staff account information.'
                    : 'Create a new staff account.'}
                </p>
              </div>
              <button type="button" onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  className="input-field"
                  value={form.full_name}
                  onChange={(e) => updateForm('full_name', e.target.value)}
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  className="input-field"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="Email"
                  disabled={!!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Phone</label>
                <input
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="Phone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Designation</label>
                <input
                  className="input-field"
                  value={form.designation}
                  onChange={(e) => updateForm('designation', e.target.value)}
                  placeholder="Designation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Role</label>
                <select
                  className="input-field"
                  value={form.role_id}
                  onChange={(e) => updateForm('role_id', e.target.value)}
                >
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Password</label>
                  <input
                    className="input-field"
                    type="password"
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    placeholder="Password"
                  />
                </div>
              )}

              {formError && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving
                    ? 'Saving...'
                    : editingUser
                    ? 'Update User'
                    : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">User Details</h3>
                <p className="text-sm text-gray-500 mt-1">
                  View staff account information.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewUser(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <Users size={26} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{viewUser.full_name}</p>
                <p className="text-sm text-gray-500">{viewUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
                <p className="mt-1 font-semibold">{viewUser.phone || '-'}</p>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium">Designation</p>
                <p className="mt-1 font-semibold">{viewUser.designation || '-'}</p>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium">Role</p>
                <p className="mt-1 font-semibold capitalize">
                  {viewUser.role.replace('_', ' ')}
                </p>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium">Status</p>
                <p className="mt-1 font-semibold">
                  {viewUser.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium">Last Login</p>
                <p className="mt-1 font-semibold">
                  {viewUser.last_login
                    ? new Date(viewUser.last_login).toLocaleString()
                    : 'Never'}
                </p>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium">User ID</p>
                <p className="mt-1 font-semibold break-all">{viewUser.id}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button type="button" onClick={() => setViewUser(null)} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
