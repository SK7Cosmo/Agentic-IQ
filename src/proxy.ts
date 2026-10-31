import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require auth
  const publicRoutes = ['/', '/login', '/api/auth/login', '/api/auth/logout', '/api/auth/callback'];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith('/api/auth/')
  );
  const isApiRoute = pathname.startsWith('/api/');

  // Redirect unauthenticated users from protected routes
  if (!user && !isPublicRoute && !isApiRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  const isTeacher = user?.email?.toLowerCase().includes('teacher') || user?.user_metadata?.role === 'teacher';

  // Redirect authenticated users away from login
  if (user && pathname === '/login') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = isTeacher ? '/teacher/dashboard' : '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect root / directly to /login or user dashboard
  if (pathname === '/') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = user ? (isTeacher ? '/teacher/dashboard' : '/dashboard') : '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // Route protection: prevent teachers from landing on the student dashboard
  if (user && isTeacher && pathname === '/dashboard') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/teacher/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Route protection: prevent students from accessing teacher intelligence center
  if (user && !isTeacher && pathname.startsWith('/teacher')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
