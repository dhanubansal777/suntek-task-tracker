import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        timeLogs: true,
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const task = await prisma.task.findFirst({
      where: { id, userId },
      include: {
        timeLogs: {
          orderBy: { startTime: 'desc' }
        },
      },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const validatedData = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const validatedData = updateTaskSchema.parse(req.body);

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: validatedData,
    });

    res.status(200).json(updatedTask);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
