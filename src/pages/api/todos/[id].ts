import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const todoId = parseInt(id as string, 10);

    if (isNaN(todoId)) {
        return res.status(400).json({ error: 'Invalid todo ID' });
    }

    if (req.method === 'PATCH') {
        try {
            const { completed } = req.body;

            const updatedTodo = await prisma.todo.update({
                where: { id: todoId },
                data: { completed },
            });

            res.status(200).json(updatedTodo);
        } catch (error) {
            console.error('Error updating todo:', error);
            res.status(500).json({ error: 'Failed to update todo' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.todo.delete({
                where: { id: todoId },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting todo:', error);
            res.status(500).json({ error: 'Failed to delete todo' });
        }
    } else {
        res.setHeader('Allow', ['PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 