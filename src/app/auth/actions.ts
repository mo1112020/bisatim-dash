'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function login(fd: FormData) {
  const email = fd.get('email') as string;
  const password = fd.get('password') as string;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (pairs: { name: string; value: string; options?: object }[]) =>
          pairs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    },
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect('/dashboard');
}

export async function signOut() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (pairs: { name: string; value: string; options?: object }[]) =>
          pairs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    },
  );
  await supabase.auth.signOut();
  redirect('/login');
}
