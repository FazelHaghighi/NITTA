import Dashboard from './page';
import { cookies } from 'next/headers';

const cookieStore = cookies();
const access_token = cookieStore.get('access_token');
const refresh_token = cookieStore.get('refresh_token');

async function getUser() {
  try {
    const res = await fetch('http://127.0.0.1:8000/getUserById', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: access_token?.value,
        refresh_token: refresh_token?.value,
      }),
      cache: 'no-cache',
    });

    const user = await res.json();

    if (user.code === '1' || user.code === '2') {
      console.log('some error occured');
      return;
    }
    if (user.new_access_token) {
      cookieStore.set('access_token', user.new_access_token);
    }

    return user;
  } catch (error) {
    console.log(error);
  }
}

export default async function DashboardLayout() {
  const user = access_token
    ? await getUser()
    : {
        user: {
          id: '',
          username: '',
          name: '',
          email: '',
        },
      };
  return (
    <main>
      <Dashboard
        user={'teacher' in user ? user.teacher : user.student}
      ></Dashboard>
    </main>
  );
}
