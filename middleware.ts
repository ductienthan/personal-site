import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secretPath = process.env.ADMIN_SECRET_PATH || 'ghost-protocol';
  // Rewrite /<secret> → /admin/login (sets a gate cookie)
  if (pathname === `/${secretPath}`) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    const res = NextResponse.redirect(url);
    res.cookies.set('admin-gate', '1', {
      httpOnly: true,
      maxAge: 300, // 5 minutes to complete login
      path: '/',
      sameSite: 'strict',
    });
    return res;
  }

  // Block direct access to /admin/login unless the gate cookie is present
  if (pathname === '/admin/login') {
    const gate = req.cookies.get('admin-gate');
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!gate && !token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // Protect all /admin/* routes (except login)
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      // Send them to homepage — don't reveal the admin login URL
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
