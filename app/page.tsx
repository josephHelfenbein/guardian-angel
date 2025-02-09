'use client';

import Link from 'next/link';
import { AlertCircle, Car, Laptop, Sun, Moon, BarChart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 transition-colors duration-300 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <div className="container mx-auto space-y-16 px-4 py-16">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-bold md:text-6xl">
            Stay Alert, Stay Safe
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 md:text-2xl">
            AI-powered vigilance for driving
          </p>
        </header>

        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          <Link
            href="/driving"
            className="flex transform items-center rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
          >
            <Car className="mr-2" size={24} />
            Driving Mode
          </Link>
          <Link
            href="/dashboards"
            className="flex transform items-center rounded-full bg-purple-600 px-8 py-4 text-lg font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-purple-700"
          >
            <BarChart className="mr-2" size={24} />
            Dashboards
          </Link>
        </div>

        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 flex items-center text-2xl font-bold">
            <AlertCircle className="mr-2" size={24} />
            How It Works
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Our advanced computer vision technology keeps you safe and focused:
          </p>
          <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
            <li>Detects signs of drowsiness while driving</li>
            <li>
              Alerts you if you're looking at your phone instead of the road
            </li>
            <li>Monitors your focus during work hours</li>
            <li>Provides real-time notifications to keep you on track</li>
          </ul>
        </div>

        <footer className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Stay Alert App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
