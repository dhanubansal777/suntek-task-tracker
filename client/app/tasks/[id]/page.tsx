'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth';
import api from '../../../lib/api';
import { Task } from '../../../lib/types';
import TimerButton from '../../../components/TimerButton';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function TaskDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.error('Failed to fetch task', error);
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && id) {
      fetchTask();
    }
  }, [user, authLoading, id, router]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        router.push('/tasks');
      } catch (error) {
        console.error('Failed to delete task', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
      fetchTask();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (authLoading || loading) return <div className="text-center py-10">Loading...</div>;
  if (!task) return null;

  const activeLog = task.timeLogs?.find(log => log.endTime === null) || null;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/tasks" className="text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-6 transition">
        <ArrowLeft size={16} /> Back to tasks
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow border border-slate-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{task.title}</h1>
            <div className="flex items-center gap-3">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`text-sm px-3 py-1 rounded-full font-medium appearance-none cursor-pointer outline-none ${
                  task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TimerButton taskId={task.id} activeTimeLog={activeLog} onTimerChange={fetchTask} />
            <button 
              onClick={handleDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded transition"
              title="Delete task"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Description</h3>
          <p className="text-slate-600 bg-slate-50 p-4 rounded-md border border-slate-100 min-h-[100px]">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Time Logs</h3>
          {task.timeLogs && task.timeLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-sm">
                    <th className="pb-2 font-medium">Start Time</th>
                    <th className="pb-2 font-medium">End Time</th>
                    <th className="pb-2 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {task.timeLogs.map(log => {
                    const start = new Date(log.startTime);
                    const end = log.endTime ? new Date(log.endTime) : null;
                    let durationStr = 'In Progress';
                    
                    if (end) {
                      const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
                      const h = Math.floor(diff / 3600);
                      const m = Math.floor((diff % 3600) / 60);
                      const s = diff % 60;
                      durationStr = `${h}h ${m}m ${s}s`;
                    }

                    return (
                      <tr key={log.id} className="border-b border-slate-100 last:border-0 text-sm">
                        <td className="py-3 text-slate-700">{start.toLocaleString()}</td>
                        <td className="py-3 text-slate-700">{end ? end.toLocaleString() : '-'}</td>
                        <td className="py-3 font-medium text-slate-800">{durationStr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No time logged for this task yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
