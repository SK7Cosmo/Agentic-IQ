import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Attempt to fetch profile role, with fallback to user_metadata and email patterns
  let role = data.user.user_metadata?.role;
  if (!role && (email?.toLowerCase().includes('teacher') || data.user.email?.toLowerCase().includes('teacher'))) {
    role = 'teacher';
  }

  if (!role) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      if (profile?.role) role = profile.role;
    } catch {
      // Ignore database permission fallback
    }
  }

  return NextResponse.json({
    user: data.user,
    role: role || 'student',
  });
}