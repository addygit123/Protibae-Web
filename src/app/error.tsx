'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="text-gray-500 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
