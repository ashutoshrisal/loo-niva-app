'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-green p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-4">
            <Heart className="text-brand-green" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Loo Niva</h1>
          <p className="text-white/80 text-sm mt-1">NGO Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <h2 className="text-lg font-semibold mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            required
            className="input-field mb-4"
            placeholder="you@loonivachild.org.np"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            required
            className="input-field mb-6"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            Loo Niva Child Concern Group &mdash; Lalitpur, Nepal
          </p>
        </form>
      </div>
    </div>
  );
}
