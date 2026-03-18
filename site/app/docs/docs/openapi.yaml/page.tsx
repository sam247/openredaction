import { redirect } from 'next/navigation';

export default function OpenApiRedirect() {
  redirect('/docs');
}

