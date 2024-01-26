import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const access_token = cookieStore.get('access_token');
  const refresh_token = cookieStore.get('refresh_token');

  if (
    request.nextUrl.pathname.startsWith('/') &&
    request.nextUrl.pathname.endsWith('/')
  ) {
    const tokens = {
      access_token: access_token,
      refresh_token: refresh_token,
    };

    if (
      tokens.access_token === undefined ||
      tokens.refresh_token === undefined
    ) {
      return NextResponse.rewrite(new URL('/', request.url));
    }

    try {
      const resposne = await fetch('http://127.0.0.1:8000/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: tokens.access_token.value,
          refresh_token: tokens.refresh_token.value,
        }),
      });

      const result = await resposne.json();
      if (result === 'False') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (e) {
      console.log(e);
    }

    return NextResponse.rewrite(new URL('/', request.url));
  } else if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const tokens = {
      access_token: access_token,
      refresh_token: refresh_token,
    };

    if (
      tokens.access_token === undefined ||
      tokens.refresh_token === undefined
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const resposne = await fetch('http://127.0.0.1:8000/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: tokens.access_token.value,
          refresh_token: tokens.refresh_token.value,
        }),
      });

      const result = await resposne.json();
      if (result === 'False') {
        return NextResponse.rewrite(new URL('/', request.url));
      }
      return NextResponse.rewrite(new URL('/dashboard', request.url));
    } catch (e) {
      console.log(e);
    }

    return NextResponse.rewrite(new URL('/', request.url));
  } else if (request.nextUrl.pathname.startsWith('/request')) {
    const tokens = {
      access_token: access_token,
      refresh_token: refresh_token,
    };

    if (
      tokens.access_token === undefined ||
      tokens.refresh_token === undefined
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const resposne = await fetch('http://127.0.0.1:8000/isStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: tokens.access_token.value,
          refresh_token: tokens.refresh_token.value,
        }),
      });

      const result = await resposne.json();
      if (result === 'False') {
        return NextResponse.rewrite(new URL('/', request.url));
      } else if (result.code === '1') {
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      } else if (result.code === '11') {
        cookieStore.set('access_token', result.new_access_token);
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      } else if (
        result.code === '-2' ||
        result.code === '-3' ||
        result.code === '-33'
      ) {
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return NextResponse.rewrite(new URL('/', request.url));
      }
    } catch (e) {
      console.log(e);
    }

    return NextResponse.rewrite(new URL('/request', request.url));
  } else if (request.nextUrl.pathname.startsWith('/my-requests')) {
    const tokens = {
      access_token: access_token,
      refresh_token: refresh_token,
    };

    if (
      tokens.access_token === undefined ||
      tokens.refresh_token === undefined
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const resposne = await fetch('http://127.0.0.1:8000/isStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: tokens.access_token.value,
          refresh_token: tokens.refresh_token.value,
        }),
      });

      const result = await resposne.json();
      if (result === 'False') {
        return NextResponse.rewrite(new URL('/', request.url));
      } else if (result.code === '1') {
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      } else if (result.code === '11') {
        cookieStore.set('access_token', result.new_access_token);
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      } else if (
        result.code === '-2' ||
        result.code === '-3' ||
        result.code === '-33'
      ) {
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return NextResponse.rewrite(new URL('/', request.url));
      }
    } catch (e) {
      console.log(e);
    }

    return NextResponse.rewrite(new URL('/my-requests', request.url));
  } else if (request.nextUrl.pathname.startsWith('/rate')) {
    const tokens = {
      access_token: access_token,
      refresh_token: refresh_token,
    };

    if (
      tokens.access_token === undefined ||
      tokens.refresh_token === undefined
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const resposne = await fetch('http://127.0.0.1:8000/isStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: tokens.access_token.value,
          refresh_token: tokens.refresh_token.value,
        }),
      });

      const result = await resposne.json();
      if (result === 'False') {
        return NextResponse.rewrite(new URL('/', request.url));
      } else if (result.code === '1') {
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      } else if (result.code === '11') {
        cookieStore.set('access_token', result.new_access_token);
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      } else if (
        result.code === '-2' ||
        result.code === '-3' ||
        result.code === '-33'
      ) {
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return NextResponse.rewrite(new URL('/', request.url));
      }
    } catch (e) {
      console.log(e);
    }

    return NextResponse.rewrite(new URL('/rate', request.url));
  }
}
