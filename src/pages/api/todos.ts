import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const todos = await prisma.todo.findMany();
        res.status(200).json(todos);
    } else if (req.method === 'POST') {
        const { title, completed } = req.body;
        const newTodo = await prisma.todo.create({
            data: {
                title,
                completed,
            },
        });
        res.status(201).json(newTodo);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}