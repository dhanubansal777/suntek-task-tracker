export interface User {
  id: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  userId: string;
  createdAt: string;
  updatedAt: string;
  timeLogs?: TimeLog[];
}

export interface TimeLog {
  id: string;
  startTime: string;
  endTime: string | null;
  taskId: string;
}

export interface SummaryData {
  tasksWorkedOn: number;
  totalTimeTracked: number; // in seconds
  completedTasks: number;
  pendingOrInProgressTasks: number;
}
