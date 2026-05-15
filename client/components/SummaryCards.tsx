import React from 'react';
import { SummaryData } from '../lib/types';
import { CheckCircle2, Clock, ListTodo, Activity } from 'lucide-react';

interface SummaryCardsProps {
  data: SummaryData;
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const cards = [
    {
      title: 'Time Tracked Today',
      value: formatTime(data.totalTimeTracked),
      icon: <Clock size={24} className="text-blue-500" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Tasks Worked On',
      value: data.tasksWorkedOn,
      icon: <Activity size={24} className="text-purple-500" />,
      bg: 'bg-purple-50',
    },
    {
      title: 'Completed Tasks',
      value: data.completedTasks,
      icon: <CheckCircle2 size={24} className="text-green-500" />,
      bg: 'bg-green-50',
    },
    {
      title: 'Pending / In Progress',
      value: data.pendingOrInProgressTasks,
      icon: <ListTodo size={24} className="text-orange-500" />,
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-center">
          <div className={`${card.bg} p-3 rounded-full mr-4`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">{card.title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
