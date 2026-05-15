'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';
import Link from 'next/link';
import { CheckCircle2, Clock, BarChart3 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Master Your Time. <br className="hidden md:block" />
        <span className="text-blue-600">Conquer Your Tasks.</span>
      </h1>
      <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
        TaskTimeTracker is the ultimate tool to organize your work, track the time you spend on each task, and get valuable insights into your productivity.
      </p>
      
      <div className="flex gap-4 mb-20">
        <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl">
          Get Started for Free
        </Link>
        <Link href="/login" className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-3 rounded-lg font-semibold text-lg transition shadow-sm hover:shadow">
          Log In
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle2 size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Task Management</h3>
          <p className="text-slate-600">
            Create, organize, and track the status of all your tasks in one place. Never let anything fall through the cracks.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Clock size={24} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Time Tracking</h3>
          <p className="text-slate-600">
            Start and stop timers with a single click. Keep accurate records of how much time you spend on each task.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 size={24} className="text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Daily Summaries</h3>
          <p className="text-slate-600">
            Get beautiful daily summaries showing your most productive hours, completed tasks, and total time worked.
          </p>
        </div>
      </div>
    </div>
  );
}
