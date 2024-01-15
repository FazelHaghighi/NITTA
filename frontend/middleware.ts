import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const access_token = cookieStore.get('access_token');
    const refresh_token = cookieStore.get('refresh_token');

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

    console.log(tokens);

    axios
      .post(
        'http://127.0.0.1:8000/authorize',
        {
          access_token: tokens.access_token.value,
          refresh_token: tokens.refresh_token.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(({ data }) => {
        if (data === 'False') {
          return NextResponse.rewrite(new URL('/', request.url));
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
    return NextResponse.rewrite(new URL('/', request.url));
  }
}
