import React from 'react';
import { Link } from 'react-router-dom';

function NotFound({ message = 'Page not found' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
      <div className="text-7xl">🏠</div>
      <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
      <p className="text-gray-500 text-sm max-w-xs">{message}</p>
      <Link to="/" className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
