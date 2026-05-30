'use client';

import { useFormStatus } from 'react-dom';
import { LogOut } from 'lucide-react';
import { signOut } from '@/app/auth/actions';

export function SignOutButton() {
  return (
    <form action={signOut}>
      <SignOutButtonInner />
    </form>
  );
}

function SignOutButtonInner() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px',
        fontSize: 13, color: 'rgba(255,255,255,0.32)',
        background: 'none', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)',
        cursor: pending ? 'wait' : 'pointer', width: '100%', textAlign: 'left',
        opacity: pending ? 0.6 : 1,
      }}
    >
      <LogOut size={13} />
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
