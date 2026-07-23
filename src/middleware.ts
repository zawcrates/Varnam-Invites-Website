import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);

  const url = new URL(request.url);
  const pathname = url.pathname;

  // ---------------------------------------------------------------------------
  // 1. Protection for /api/admin/* API Routes
  // ---------------------------------------------------------------------------
  if (pathname.startsWith('/api/admin')) {
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Active user session required' },
        { status: 401 }
      );
    }

    // Query public.admins table to verify membership
    const { data: adminRecord } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!adminRecord) {
      return NextResponse.json(
        { error: 'Forbidden: Admin privileges required' },
        { status: 403 }
      );
    }

    return supabaseResponse;
  }

  // ---------------------------------------------------------------------------
  // 2. Protection for /admin and /admin/* Page Routes
  // ---------------------------------------------------------------------------
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('login', 'true');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Query public.admins table to verify membership
    const { data: adminRecord } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!adminRecord) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }

    return supabaseResponse;
  }

  // ---------------------------------------------------------------------------
  // 3. Protection for User Dashboard / My Invites
  // ---------------------------------------------------------------------------
  const protectedPaths = ['/dashboard', '/my-invites', '/my-invitations', '/orders', '/settings'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !user) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('login', 'true');
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
