// app/login/page.tsx
'use client';

import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import '../globals.css';

export default function LoginPage() {
  const supabase = createSupabaseBrowser();
  const router   = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError]     = useState('');

  // ── Guest Login ──────────────────────────────────────
  async function handleGuest() {
    setLoading('guest');
    setError('');

    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      setError(error.message);
      setLoading(null);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  // ── Google Login ─────────────────────────────────────
  async function handleGoogle() {
    setLoading('google');
    setError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    }
  }

  // ── GitHub Login ─────────────────────────────────────
  async function handleGitHub() {
    setLoading('github');
    setError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 420 }}>
      <header className="brutalist-header">
        <h1>DEV EXPENSE TRACKER</h1>
        <p>เลือกวิธีเข้าใช้งาน</p>
      </header>

      <div className="brutalist-box form-box">
        <h2>Login</h2>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {/* Guest */}
        <button
          className="login-btn guest-btn"
          onClick={handleGuest}
          disabled={!!loading}
        >
          {loading === 'guest' ? '⏳ กำลังเข้าสู่ระบบ...' : '👤 เข้าแบบ Guest'}
        </button>

        <div className="divider">หรือ</div>

        {/* Google */}
        <button
          className="login-btn google-btn"
          onClick={handleGoogle}
          disabled={!!loading}
        >
          {loading === 'google' ? '⏳ กำลังเชื่อมต่อ...' : '🔵 เข้าด้วย Google'}
        </button>

        {/* GitHub */}
        <button
          className="login-btn github-btn"
          onClick={handleGitHub}
          disabled={!!loading}
        >
          {loading === 'github' ? '⏳ กำลังเชื่อมต่อ...' : '⚫ เข้าด้วย GitHub'}
        </button>

        <p className="login-note">
          Guest จะถูกจดจำในเครื่องนี้ — ข้อมูลจะไม่หายเมื่อกลับมาใช้ใหม่
        </p>
      </div>
    </main>
  );
}