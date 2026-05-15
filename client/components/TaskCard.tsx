import React from 'react';
import Link from 'next/link';
import { Task } from '../lib/types';
import { Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };

  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-slate-800 truncate">{task.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-slate-600 text-sm line-clamp-2 flex-grow mb-4">
          {task.description || 'No description provided.'}
        </p>
        <div className="flex items-center text-slate-400 text-xs mt-auto">
          <Clock size={14} className="mr-1" />
          <span>Last updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
