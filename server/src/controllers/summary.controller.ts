import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getDailySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    
    // Get start and end of current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch tasks modified or created today
    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      include: {
        timeLogs: {
          where: {
            startTime: {
              gte: startOfDay,
              lte: endOfDay,
            }
          }
        }
      }
    });

    let totalTimeTracked = 0;
    let tasksWorkedOn = 0;
    let completedTasks = 0;
    let pendingOrInProgressTasks = 0;

    tasks.forEach(task => {
      if (task.status === 'COMPLETED') completedTasks++;
      else pendingOrInProgressTasks++;

      let hasTimeLogsToday = false;

      task.timeLogs.forEach(log => {
        hasTimeLogsToday = true;
        const start = log.startTime.getTime();
        const end = log.endTime ? log.endTime.getTime() : new Date().getTime(); // If currently running, up to now
        totalTimeTracked += (end - start);
      });

      if (hasTimeLogsToday) {
        tasksWorkedOn++;
      }
    });

    res.status(200).json({
      tasksWorkedOn,
      totalTimeTracked: Math.floor(totalTimeTracked / 1000), // convert to seconds
      completedTasks,
      pendingOrInProgressTasks,
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
