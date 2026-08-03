'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

import {
  Building2,
  User,
  Lock,
  Database,
  Save,
} from 'lucide-react';

type OrganizationSettings = {
  id?: string;
  organization_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  mission: string;
  vision: string;
};

type Profile = {
  full_name: string;
  email: string;
  phone: string;
  designation: string;
};

export default function SettingsPage() {
  // ==========================================
  // PROFILE STATE
  // ==========================================

  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: '',
    phone: '',
    designation: '',
  });

  const [profileLoading, setProfileLoading] =
    useState(true);

  const [profileSaving, setProfileSaving] =
    useState(false);

  const [profileMessage, setProfileMessage] =
    useState('');

  const [profileError, setProfileError] =
    useState('');

  // ==========================================
  // ORGANIZATION STATE
  // ==========================================

  const [organization, setOrganization] =
    useState<OrganizationSettings>({
      organization_name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      mission: '',
      vision: '',
    });

  const [loadingOrganization, setLoadingOrganization] =
    useState(true);

  const [savingOrganization, setSavingOrganization] =
    useState(false);

  const [organizationMessage, setOrganizationMessage] =
    useState('');

  const [organizationError, setOrganizationError] =
    useState('');

  // ==========================================
  // PASSWORD STATE
  // ==========================================

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState('');

  const [passwordError, setPasswordError] =
    useState('');

  // ==========================================
  // LOAD SETTINGS + PROFILE
  // ==========================================

  useEffect(() => {
    async function loadOrganization() {
      try {
        setLoadingOrganization(true);
        setOrganizationError('');

        const response = await api.get(
          '/settings/organization'
        );

        if (response.data?.data) {
          setOrganization({
            organization_name:
              response.data.data.organization_name || '',
            email:
              response.data.data.email || '',
            phone:
              response.data.data.phone || '',
            address:
              response.data.data.address || '',
            website:
              response.data.data.website || '',
            mission:
              response.data.data.mission || '',
            vision:
              response.data.data.vision || '',
          });
        }
      } catch (error: any) {
        console.error(
          'Failed to load organization settings:',
          error
        );

        setOrganizationError(
          error.response?.data?.message ||
            'Failed to load organization information.'
        );
      } finally {
        setLoadingOrganization(false);
      }
    }

    async function loadProfile() {
      try {
        setProfileLoading(true);
        setProfileError('');

        const response = await api.get(
          '/auth/me'
        );

        if (response.data?.data) {
          const user = response.data.data;

          setProfile({
            full_name:
              user.full_name ||
              user.name ||
              '',
            email:
              user.email || '',
            phone:
              user.phone || '',
            designation:
              user.designation || '',
          });
        }
      } catch (error: any) {
        console.error(
          'Failed to load profile:',
          error
        );

        setProfileError(
          error.response?.data?.message ||
            'Failed to load profile.'
        );
      } finally {
        setProfileLoading(false);
      }
    }

    loadOrganization();
    loadProfile();
  }, []);

  // ==========================================
  // UPDATE ORGANIZATION FIELD
  // ==========================================

  const updateOrganization = (
    field: keyof OrganizationSettings,
    value: string
  ) => {
    setOrganization((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================
  // SAVE ORGANIZATION
  // ==========================================

  const handleSaveOrganization = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setOrganizationMessage('');
    setOrganizationError('');

    if (!organization.organization_name.trim()) {
      setOrganizationError(
        'Organization name is required.'
      );
      return;
    }

    try {
      setSavingOrganization(true);

      const response = await api.put(
        '/settings/organization',
        organization
      );

      if (response.data?.data) {
        setOrganization({
          organization_name:
            response.data.data.organization_name || '',
          email:
            response.data.data.email || '',
          phone:
            response.data.data.phone || '',
          address:
            response.data.data.address || '',
          website:
            response.data.data.website || '',
          mission:
            response.data.data.mission || '',
          vision:
            response.data.data.vision || '',
        });
      }

      setOrganizationMessage(
        response.data?.message ||
          'Organization information updated successfully.'
      );
    } catch (error: any) {
      console.error(
        'Save organization settings error:',
        error
      );

      setOrganizationError(
        error.response?.data?.message ||
          'Failed to save organization information.'
      );
    } finally {
      setSavingOrganization(false);
    }
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSaveProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setProfileMessage('');
    setProfileError('');

    if (!profile.full_name.trim()) {
      setProfileError(
        'Full name is required.'
      );
      return;
    }

    if (!profile.email.trim()) {
      setProfileError(
        'Email is required.'
      );
      return;
    }

    try {
      setProfileSaving(true);

      const response = await api.put(
        '/auth/profile',
        profile
      );

      if (response.data?.data) {
        const updatedUser =
          response.data.data;

        setProfile({
          full_name:
            updatedUser.full_name || '',
          email:
            updatedUser.email || '',
          phone:
            updatedUser.phone || '',
          designation:
            updatedUser.designation || '',
        });

        // Update localStorage so Navbar/user
        // information stays synchronized.
        const storedUser =
          localStorage.getItem('user');

        if (storedUser) {
          try {
            const currentUser =
              JSON.parse(storedUser);

            localStorage.setItem(
              'user',
              JSON.stringify({
                ...currentUser,
                name:
                  updatedUser.full_name,
                email:
                  updatedUser.email,
              })
            );
          } catch (error) {
            console.error(
              'Failed to update local user:',
              error
            );
          }
        }
      }

      setProfileMessage(
        response.data?.message ||
          'Profile updated successfully.'
      );

    } catch (error: any) {
      console.error(
        'Update profile error:',
        error
      );

      setProfileError(
        error.response?.data?.message ||
          'Failed to update profile.'
      );
    } finally {
      setProfileSaving(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setPasswordMessage('');
    setPasswordError('');

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        'Please fill in all password fields.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        'New passwords do not match.'
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        'New password must be at least 8 characters long.'
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await api.put(
        '/auth/change-password',
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      setPasswordMessage(
        response.data?.message ||
          'Password changed successfully.'
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error: any) {
      console.error(
        'Change password error:',
        error
      );

      setPasswordError(
        error.response?.data?.message ||
          'Failed to change password.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ==========================================
  // DATABASE BACKUP
  // ==========================================

  const handleBackup = async () => {
    try {
      const response = await api.get(
        '/backup/database',
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type: 'application/sql',
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        `loo_niva_backup_${new Date()
          .toISOString()
          .slice(0, 10)}.sql`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        'Database backup error:',
        error
      );

      alert(
        'Database backup failed. Check the backend console.'
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <Navbar title="Settings" />

      <div className="p-4 md:p-8 space-y-8">

        {/* HERO */}

        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white p-10 shadow-xl">

          <p className="text-sm opacity-80 mb-2">
            ⚙️ System Settings
          </p>

          <h1 className="text-4xl font-bold">
            Manage Your NGO
          </h1>

          <p className="mt-3 text-white/90 max-w-2xl">
            Update organization information, manage
            your account, security and system
            preferences.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* NGO INFORMATION */}

          <div className="card">

            <div className="flex items-center gap-3 mb-6">

              <Building2 className="text-brand-blue" />

              <h2 className="text-xl font-bold">
                NGO Information
              </h2>

            </div>

            {loadingOrganization ? (
              <div className="text-gray-500">
                Loading organization information...
              </div>
            ) : (
              <form
                onSubmit={handleSaveOrganization}
                className="space-y-4"
              >

                <input
                  className="input-field"
                  value={
                    organization.organization_name
                  }
                  onChange={(e) =>
                    updateOrganization(
                      'organization_name',
                      e.target.value
                    )
                  }
                  placeholder="Organization Name"
                />

                <input
                  className="input-field"
                  value={organization.email}
                  onChange={(e) =>
                    updateOrganization(
                      'email',
                      e.target.value
                    )
                  }
                  placeholder="Email"
                  type="email"
                />

                <input
                  className="input-field"
                  value={organization.phone}
                  onChange={(e) =>
                    updateOrganization(
                      'phone',
                      e.target.value
                    )
                  }
                  placeholder="Phone"
                />

                <input
                  className="input-field"
                  value={organization.address}
                  onChange={(e) =>
                    updateOrganization(
                      'address',
                      e.target.value
                    )
                  }
                  placeholder="Address"
                />

                <input
                  className="input-field"
                  value={organization.website}
                  onChange={(e) =>
                    updateOrganization(
                      'website',
                      e.target.value
                    )
                  }
                  placeholder="Website"
                />

                <textarea
                  className="input-field min-h-[100px]"
                  value={organization.mission}
                  onChange={(e) =>
                    updateOrganization(
                      'mission',
                      e.target.value
                    )
                  }
                  placeholder="Mission"
                />

                <textarea
                  className="input-field min-h-[100px]"
                  value={organization.vision}
                  onChange={(e) =>
                    updateOrganization(
                      'vision',
                      e.target.value
                    )
                  }
                  placeholder="Vision"
                />

                {organizationError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                    {organizationError}
                  </div>
                )}

                {organizationMessage && (
                  <div className="rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
                    {organizationMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingOrganization}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >

                  <Save size={18} />

                  {savingOrganization
                    ? 'Saving...'
                    : 'Save Changes'}

                </button>

              </form>
            )}

          </div>

          {/* ACCOUNT */}

          <div className="card">

            <div className="flex items-center gap-3 mb-6">

              <User className="text-brand-blue" />

              <h2 className="text-xl font-bold">
                Account
              </h2>

            </div>

            {profileLoading ? (
              <div className="text-gray-500">
                Loading profile...
              </div>
            ) : (
              <form
                onSubmit={handleSaveProfile}
                className="space-y-4"
              >

                <input
                  className="input-field"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      full_name:
                        e.target.value,
                    })
                  }
                  placeholder="Full Name"
                />

                <input
                  className="input-field"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email:
                        e.target.value,
                    })
                  }
                  placeholder="Email"
                />

                <input
                  className="input-field"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone:
                        e.target.value,
                    })
                  }
                  placeholder="Phone"
                />

                <input
                  className="input-field"
                  value={profile.designation}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      designation:
                        e.target.value,
                    })
                  }
                  placeholder="Designation"
                />

                {profileError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                    {profileError}
                  </div>
                )}

                {profileMessage && (
                  <div className="rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
                    {profileMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >

                  <Save size={18} />

                  {profileSaving
                    ? 'Saving...'
                    : 'Update Profile'}

                </button>

              </form>
            )}

          </div>

          {/* SECURITY */}

          <div className="card">

            <div className="flex items-center gap-3 mb-6">

              <Lock className="text-brand-blue" />

              <h2 className="text-xl font-bold">
                Security
              </h2>

            </div>

            <form
              onSubmit={handleChangePassword}
              className="space-y-4"
            >

              <input
                type="password"
                className="input-field"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
              />

              <input
                type="password"
                className="input-field"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />

              <input
                type="password"
                className="input-field"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              {passwordError && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                  {passwordError}
                </div>
              )}

              {passwordMessage && (
                <div className="rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
                  {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading
                  ? 'Changing Password...'
                  : 'Change Password'}
              </button>

            </form>

          </div>

          {/* SYSTEM */}

          <div className="card">

            <div className="flex items-center gap-3 mb-6">

              <Database className="text-brand-blue" />

              <h2 className="text-xl font-bold">
                System
              </h2>

            </div>

            <div className="space-y-4">

              <button
                type="button"
                onClick={handleBackup}
                className="btn-primary w-full"
              >
                Backup Database
              </button>

              <button
                type="button"
                className="w-full rounded-xl border border-gray-200 py-3 hover:bg-gray-50"
              >
                Export Data
              </button>

              <div className="text-sm text-gray-500">
                Version 1.0.0
              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}