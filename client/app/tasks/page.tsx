'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import api from '../../lib/api';
import { Task } from '../../lib/types';
import TaskCard from '../../components/TaskCard';
import TaskForm from '../../components/TaskForm';
import { Plus } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTasks();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Your Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {showForm && (
        <TaskForm 
          onSuccess={() => {
            setShowForm(false);
            fetchTasks();
          }} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      {tasks.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-medium text-slate-600 mb-2">No tasks found</h3>
          <p className="text-slate-500 mb-4">You haven't created any tasks yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 font-medium hover:underline"
          >
            Create your first task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
