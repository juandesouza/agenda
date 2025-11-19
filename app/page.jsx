'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/calendar');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

