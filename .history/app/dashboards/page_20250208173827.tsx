'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Search,
  Car,
  Laptop,
  ChevronDown,
  Filter,
  AlertTriangle,
} from 'lucide-react';

interface Session {
  id: string;
  type: 'driving' | 'productivity';
  date: string;
  duration: number;
  averageScore: number;
  alerts: number;
}

export default function DashboardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'driving' | 'productivity'
  >('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'score'>('date');

  // Mock data - replace with actual data fetching
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      type: 'driving',
      date: '2025-02-08T14:30:00',
      duration: 3600,
      averageScore: 85,
      alerts: 3,
    },
    {
      id: '2',
      type: 'productivity',
      date: '2025-02-08T10:00:00',
      duration: 7200,
      averageScore: 92,
      alerts: 1,
    },
    // Add more mock sessions as needed
  ]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const filteredSessions = sessions
    .filter((session) => {
      if (typeFilter !== 'all' && session.type !== typeFilter) return false;
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          session.type.toLowerCase().includes(searchLower) ||
          formatDate(session.date).toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'score':
          return b.averageScore - a.averageScore;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            <ArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold">Your Dashboards</h1>
        </header>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Total Sessions
            </h2>
            <p className="mt-2 text-3xl font-bold">{sessions.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Average Score
            </h2>
            <p className="mt-2 text-3xl font-bold">
              {(
                sessions.reduce(
                  (acc, session) => acc + session.averageScore,
                  0,
                ) / sessions.length
              ).toFixed(1)}
              %
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Total Time
            </h2>
            <p className="mt-2 text-3xl font-bold">
              {formatTime(
                sessions.reduce((acc, session) => acc + session.duration, 0),
              )}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Types</option>
            <option value="driving">Driving</option>
            <option value="productivity">Productivity</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="date">Sort by Date</option>
            <option value="duration">Sort by Duration</option>
            <option value="score">Sort by Score</option>
          </select>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <Link
              key={session.id}
              href={`/stats?type=${session.type}&id=${session.id}`}
              className="block transform rounded-lg bg-white p-4 shadow-lg transition-transform hover:scale-[1.02] dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {session.type === 'driving' ? (
                    <Car className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Laptop className="h-6 w-6 text-green-500" />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {session.type.charAt(0).toUpperCase() +
                        session.type.slice(1)}{' '}
                      Session
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(session.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Duration
                    </p>
                    <p className="font-semibold">
                      {formatTime(session.duration)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Score
                    </p>
                    <p className="font-semibold">{session.averageScore}%</p>
                  </div>
                  {session.alerts > 0 && (
                    <div className="flex items-center text-yellow-500">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="ml-1">{session.alerts}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {filteredSessions.length === 0 && (
            <div className="rounded-lg bg-white p-8 text-center dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                No sessions found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
