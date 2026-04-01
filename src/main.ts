import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import path from 'path';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/api/books', async (req: Request, res: Response) => {
    try {
        const books = await prisma.book.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.post('/api/books', async (req: Request, res: Response) => {
    try {
        const { title, author, isbn, status, rating, notes } = req.body;
        
        const book = await prisma.book.create({
            data: {
                title,
                author,
                isbn,
                status: status || 'TO_READ',
                rating,
                notes
            }
        });
        
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create book' });
    }
});

app.get('/api/books/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

app.put('/api/books/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, author, isbn, status, rating, notes } = req.body;
        
        const book = await prisma.book.update({
            where: { id: parseInt(id) },
            data: {
                title,
                author,
                isbn,
                status,
                rating,
                notes
            }
        });
        
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

app.delete('/api/books/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.book.delete({
            where: { id: parseInt(id) }
        });
        
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

app.get('/api/stats', async (req: Request, res: Response) => {
    try {
        const [total, reading, completed, toRead] = await Promise.all([
            prisma.book.count(),
            prisma.book.count({ where: { status: 'READING' } }),
            prisma.book.count({ where: { status: 'COMPLETED' } }),
            prisma.book.count({ where: { status: 'TO_READ' } })
        ]);
        
        res.json({
            total,
            reading,
            completed,
            toRead
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Serve frontend
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`📚 Book Logger running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
