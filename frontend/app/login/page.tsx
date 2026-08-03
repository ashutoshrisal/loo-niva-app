'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';
import {
  HeartHandshake,
  FolderKanban,
  Users,
  ShieldCheck
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  console.log("FORM SUBMITTED");

  setError('');
  setLoading(true);

  try {
    await login(email, password);
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
      'Login failed. Please check your credentials.'
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-cyan-600 flex">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex w-1/2 flex-col justify-center px-20 text-white relative overflow-hidden">

        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>

        <h1 className="text-6xl font-extrabold leading-tight">
          Empowering
          <br />
          Every Child.
        </h1>

        <p className="mt-8 text-xl text-white/80 max-w-xl leading-9">
          Loo Niva Child Concern Group is committed to protecting children's
          rights through education, advocacy, participation and community
          empowerment.
        </p>

        <div className="grid grid-cols-2 gap-8 mt-16">

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
            <FolderKanban size={34} />
            <h2 className="text-4xl font-bold mt-4">40+</h2>
            <p className="text-white/70 mt-1">
              Active Projects
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
            <Users size={34} />
            <h2 className="text-4xl font-bold mt-4">2500+</h2>
            <p className="text-white/70 mt-1">
              Beneficiaries
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
            <HeartHandshake size={34} />
            <h2 className="text-4xl font-bold mt-4">15+</h2>
            <p className="text-white/70 mt-1">
              Districts Covered
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
            <ShieldCheck size={34} />
            <h2 className="text-4xl font-bold mt-4">100%</h2>
            <p className="text-white/70 mt-1">
              Secure Management
            </p>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex flex-1 items-center justify-center p-10">

        <div className="w-full max-w-md">

          <Logo />

          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/30">

            <h2 className="text-4xl font-bold mb-2">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mb-8">
              Sign in to continue.
            </p>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <Input
                label="Email"
                type="email"
                placeholder="admin@loonivachild.org.np"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

<Button
  type="submit"
  disabled={loading}
>
  {loading ? "Signing In..." : "Sign In"}
</Button>
            </form>

            <div className="mt-8 border-t pt-6">

              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Loo Niva Child Concern Group
              </p>

              <p className="text-center text-xs text-gray-400 mt-2">
                Empowering Every Child Through Care & Education
              </p>

            </div>

          </Card>

        </div>

      </div>

    </div>
  );
}