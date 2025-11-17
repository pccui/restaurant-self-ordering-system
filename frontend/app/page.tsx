import { redirect } from 'next/navigation';

export default function Page() {
  // redirect to default locale en
  redirect('/en');
}
