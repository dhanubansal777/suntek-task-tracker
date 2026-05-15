'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import api from '../../lib/api';
import { SummaryData, Task } from '../../lib/types';
import SummaryCards from '../../components/SummaryCards';
import TaskCard from '../../components/TaskCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      const fetchDashboardData = async () => {
        try {
          const [summaryRes, tasksRes] = await Promise.all([
            api.get('/summary/daily'),
            api.get('/tasks')
          ]);
          setSummaryData(summaryRes.data);
          setRecentTasks(tasksRes.data.slice(0, 3)); // Only show top 3 recent tasks
        } catch (error) {
          console.error('Failed to fetch dashboard data', error);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user.email.split('@')[0]}!</h1>
        <p className="text-slate-500">Here's your activity for today.</p>
      </div>

      {summaryData && <SummaryCards data={summaryData} />}

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recent Tasks</h2>
          <Link href="/tasks" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        
        {recentTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
            <p className="text-slate-500 mb-4">You don't have any tasks yet.</p>
            <Link href="/tasks" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition inline-block">
              Create a Task
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
