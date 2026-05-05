// components/AuthButton.tsx
'use client';

import { createSupabaseBrowser } from '@/lib/db';
import { useRouter } from 'next/navigation';

type Props = {
  email: string;
};

export default function AuthButton({ email }: Props) {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center',
                  gap: '1rem', marginBottom: '1rem',
                  fontSize: '0.8rem', fontFamily: 'inherit' }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{email}</span>
      <button
        onClick={handleSignOut}
        style={{ background: '#ffcc00', border: '2px solid #000',
                 padding: '4px 12px', fontFamily: 'inherit',
                 fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
      >
        Logout
      </button>
    </div>
  );
}