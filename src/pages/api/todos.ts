import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('API route /api/todos called with method:', req.method);

    if (req.method === 'GET') {
        try {
            const todos = await prisma.todo.findMany({
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json(todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            res.status(500).json({ error: 'Failed to fetch todos' });
        }
    } else if (req.method === 'POST') {
        try {
            const { title, completed, deadline } = req.body;

            // データを作成
            const todoData = {
                title,
                completed: completed || false,
            };

            // 日付がある場合は追加
            if (deadline) {
                try {
                    const dateObj = new Date(deadline);
                    if (!isNaN(dateObj.getTime())) {
                        // @ts-expect-error
                        todoData.deadline = dateObj;
                    }
                } catch (err) {
                    console.error('Error parsing date:', err);
                }
            }

            // TodoをPrismaで作成
            const newTodo = await prisma.todo.create({
                data: todoData
            });

            res.status(201).json(newTodo);
        } catch (error) {
            console.error('Error creating todo:', error);
            res.status(500).json({ error: 'Failed to create todo' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 