'use client';

import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import api from '../lib/api';
import { TimeLog } from '../lib/types';

interface TimerButtonProps {
  taskId: string;
  activeTimeLog: TimeLog | null;
  onTimerChange: () => void | Promise<void>;
}

export default function TimerButton({ taskId, activeTimeLog, onTimerChange }: TimerButtonProps) {
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimeLog) {
      const start = new Date(activeTimeLog.startTime).getTime();
      setElapsed(Math.floor((Date.now() - start) / 1000));

      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimeLog]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await api.post('/timelogs/start', { taskId });
      await onTimerChange();
    } catch (error: any) {
      console.error('Failed to start timer:', error.response?.data || error.message);
      alert('Failed to start timer');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!activeTimeLog || loading) return;
    setLoading(true);
    try {
      await api.patch(`/timelogs/${activeTimeLog.id}/stop`);
      await onTimerChange();
    } catch (error: any) {
      console.error('Failed to stop timer:', error.response?.data || error.message);
      alert('Failed to stop timer');
    } finally {
      setLoading(false);
    }
  };

  if (activeTimeLog) {
    return (
      <button
        onClick={handleStop}
        disabled={loading}
        className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-md font-bold transition w-full sm:w-auto justify-center"
      >
        <Square size={18} fill="currentColor" />
        Stop Timer ({formatTime(elapsed)})
      </button>
    );
  }

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      className="flex items-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-md font-bold transition w-full sm:w-auto justify-center"
    >
      <Play size={18} fill="currentColor" />
      Start Timer
    </button>
  );
}
