'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  ShieldOff,
  Pencil,
  Trash2,
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
  {
    id: '1',
    name: 'super_admin',
  },
  {
    id: '2',
    name: 'project_manager',
  },
  {
    id: '3',
    name: 'field_staff',
  },
  {
    id: '4',
    name: 'viewer',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] =
    useState<UserData | null>(null);

  const [saving, setSaving] = useState(false);

  const [formError, setFormError] = useState('');

  const [form, setForm] = useState<UserForm>({
    full_name: '',
    email: '',
    phone: '',
    designation: '',
    role_id: '4',
    password: '',
  });

  // ==========================================
  // LOAD USERS
  // ==========================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/users');

      setUsers(response.data.data || []);
    } catch (err: any) {
      console.error('Failed to load users:', err);

      setError(
        err.response?.data?.message ||
          'Failed to load users.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================================
  // OPEN ADD MODAL
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

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (user: UserData) => {
    setEditingUser(user);

    const role = ROLES.find(
      (item) => item.name === user.role
    );

    setForm({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      designation: user.designation || '',
      role_id: role?.id || '4',
      password: '',
    });

    setFormError('');

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingUser(null);
    setFormError('');
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const updateForm = (
    field: keyof UserForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================
  // SAVE USER
  // ==========================================

  const handleSaveUser = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setFormError('');

    if (!form.full_name.trim()) {
      setFormError('Full name is required.');
      return;
    }

    if (!form.email.trim()) {
      setFormError('Email is required.');
      return;
    }

    if (!editingUser && !form.password) {
      setFormError(
        'Password is required when creating a user.'
      );
      return;
    }

    if (
      !editingUser &&
      form.password.length < 8
    ) {
      setFormError(
        'Password must be at least 8 characters.'
      );
      return;
    }

    try {
      setSaving(true);

      // ========================================
      // CREATE USER
      // ========================================

      if (!editingUser) {
        await api.post('/auth/register', {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone || null,
          designation: form.designation || null,
          role_id: form.role_id,
        });

        alert('User created successfully.');
      }

      // ========================================
      // UPDATE USER
      // ========================================

      else {
        await api.put(
          `/users/${editingUser.id}`,
          {
            full_name: form.full_name.trim(),
            phone: form.phone || null,
            designation:
              form.designation || null,
            role_id: form.role_id,
          }
        );

        alert('User updated successfully.');
      }

      setShowModal(false);
      setEditingUser(null);

      await loadUsers();
    } catch (err: any) {
      console.error(
        'Save user error:',
        err
      );

      setFormError(
        err.response?.data?.message ||
          'Failed to save user.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DEACTIVATE USER
  // ==========================================

  const handleDeactivate = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate this user?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);

      await loadUsers();
    } catch (err: any) {
      console.error(
        'Deactivate user error:',
        err
      );

      alert(
        err.response?.data?.message ||
          'Failed to deactivate user.'
      );
    }
  };

  // ==========================================
  // ACTIVATE USER
  // ==========================================

  const handleActivate = async (
    user: UserData
  ) => {
    try {
      await api.put(
        `/users/${user.id}`,
        {
          is_active: true,
        }
      );

      await loadUsers();
    } catch (err: any) {
      console.error(
        'Activate user error:',
        err
      );

      alert(
        err.response?.data?.message ||
          'Failed to activate user.'
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredUsers = users.filter(
    (user) => {
      const value =
        search.toLowerCase();

      return (
        user.full_name
          ?.toLowerCase()
          .includes(value) ||
        user.email
          ?.toLowerCase()
          .includes(value) ||
        user.role
          ?.toLowerCase()
          .includes(value) ||
        user.designation
          ?.toLowerCase()
          .includes(value)
      );
    }
  );

  return (
    <>
      <Navbar title="User Management" />

      <div className="p-4 md:p-8 space-y-8">

        {/* ========================================
            HERO
        ======================================== */}

        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white p-8 md:p-10 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-sm text-white/80 mb-2">
                👥 Administration
              </p>

              <h1 className="text-4xl font-bold">
                User Management
              </h1>

              <p className="mt-3 text-white/90 max-w-2xl">
                Manage staff accounts, roles and
                access to the Loo Niva management
                system.
              </p>

            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-100 transition"
            >
              <UserPlus size={20} />
              Add User
            </button>

          </div>

        </div>

        {/* ========================================
            SEARCH + STATS
        ======================================== */}

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-5">

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">

              <Search
                size={20}
                className="text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search users..."
                className="w-full outline-none"
              />

            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

              <Users
                size={24}
                className="text-indigo-600"
              />

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <p className="text-2xl font-bold">
                {users.length}
              </p>

            </div>

          </div>

        </div>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {/* ========================================
            USERS TABLE
        ======================================== */}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-xl font-bold">
              System Users
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage registered staff accounts.
            </p>

          </div>

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No users found.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Designation
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Last Login
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-semibold">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {filteredUsers.map(
                    (user) => (

                    <tr
                      key={user.id}
                      className="hover:bg-gray-50"
                    >

                      {/* USER */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">

                            <Users
                              size={18}
                              className="text-indigo-600"
                            />

                          </div>

                          <div>

                            <p className="font-semibold">
                              {user.full_name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>

                            {user.phone && (
                              <p className="text-xs text-gray-400">
                                {user.phone}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-4">

                        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm font-medium">

                          <ShieldCheck size={15} />

                          {user.role}

                        </span>

                      </td>

                      {/* DESIGNATION */}

                      <td className="px-6 py-4 text-gray-600">
                        {user.designation || '-'}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">

                        {user.is_active ? (

                          <span className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm font-medium">

                            <span className="w-2 h-2 rounded-full bg-green-500" />

                            Active

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 px-3 py-1 text-sm font-medium">

                            <ShieldOff size={15} />

                            Inactive

                          </span>

                        )}

                      </td>

                      {/* LAST LOGIN */}

                      <td className="px-6 py-4 text-sm text-gray-500">

                        {user.last_login
                          ? new Date(
                              user.last_login
                            ).toLocaleString()
                          : 'Never'}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            title="Edit user"
                            onClick={() =>
                              openEditModal(user)
                            }
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          >

                            <Pencil size={18} />

                          </button>

                          {user.is_active ? (

                            <button
                              type="button"
                              title="Deactivate user"
                              onClick={() =>
                                handleDeactivate(
                                  user.id
                                )
                              }
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                            >

                              <Trash2 size={18} />

                            </button>

                          ) : (

                            <button
                              type="button"
                              title="Activate user"
                              onClick={() =>
                                handleActivate(
                                  user
                                )
                              }
                              className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                            >

                              <ShieldCheck
                                size={18}
                              />

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

      {/* ==========================================
          ADD / EDIT USER MODAL
      ========================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-6 border-b">

              <div>

                <h2 className="text-2xl font-bold">

                  {editingUser
                    ? 'Edit User'
                    : 'Add New User'}

                </h2>

                <p className="text-sm text-gray-500 mt-1">

                  {editingUser
                    ? 'Update staff account information.'
                    : 'Create a new staff account.'}

                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100"
              >

                <X size={20} />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSaveUser}
              className="p-6 space-y-4"
            >

              <input
                className="input-field"
                value={form.full_name}
                onChange={(e) =>
                  updateForm(
                    'full_name',
                    e.target.value
                  )
                }
                placeholder="Full Name"
              />

              <input
                className="input-field"
                type="email"
                value={form.email}
                onChange={(e) =>
                  updateForm(
                    'email',
                    e.target.value
                  )
                }
                placeholder="Email"
                disabled={!!editingUser}
              />

              <input
                className="input-field"
                value={form.phone}
                onChange={(e) =>
                  updateForm(
                    'phone',
                    e.target.value
                  )
                }
                placeholder="Phone"
              />

              <input
                className="input-field"
                value={form.designation}
                onChange={(e) =>
                  updateForm(
                    'designation',
                    e.target.value
                  )
                }
                placeholder="Designation"
              />

              <select
                className="input-field"
                value={form.role_id}
                onChange={(e) =>
                  updateForm(
                    'role_id',
                    e.target.value
                  )
                }
              >

                {ROLES.map((role) => (

                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>

                ))}

              </select>

              {!editingUser && (

                <input
                  className="input-field"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    updateForm(
                      'password',
                      e.target.value
                    )
                  }
                  placeholder="Password"
                />

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

    </>
  );
}