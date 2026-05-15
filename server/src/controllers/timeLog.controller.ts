import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const startTimeLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { taskId } = req.body;

    if (!taskId) {
      res.status(400).json({ error: 'taskId is required' });
      return;
    }

    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Check if there's already an active time log for this task
    const activeLog = await prisma.timeLog.findFirst({
      where: { taskId, endTime: null },
    });

    if (activeLog) {
      res.status(400).json({ error: 'Task already has an active timer' });
      return;
    }

    const timeLog = await prisma.timeLog.create({
      data: {
        taskId,
      },
    });

    // Automatically update task status to IN_PROGRESS if it's PENDING
    if (task.status === 'PENDING') {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    res.status(201).json(timeLog);
  } catch (error) {
    console.error('Start time log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const stopTimeLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const timeLog = await prisma.timeLog.findFirst({
      where: {
        id,
        task: { userId },
      },
      include: { task: true }
    });

    if (!timeLog) {
      res.status(404).json({ error: 'Time log not found' });
      return;
    }

    if (timeLog.endTime) {
      res.status(200).json(timeLog);
      return;
    }

    const updatedTimeLog = await prisma.timeLog.update({
      where: { id },
      data: { endTime: new Date() },
    });

    res.status(200).json(updatedTimeLog);
  } catch (error) {
    console.error('Stop time log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
