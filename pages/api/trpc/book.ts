import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { prisma } from '../utils/prisma';

export const appRouter = trpc.router()
  .query('getAllBooks', {
    async resolve() {
      return await prisma.book.findMany();
    },
  })
  .query('getBookById', {
    input: z.string(),
    async resolve({ input }) {
      return await prisma.book.findUnique({ where: { id: input } });
    },
  })
  .mutation('addBook', {
    input: z.object({
      title: z.string(),
      author: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.book.create({ data: input });
    },
  })
  .mutation('editBook', {
    input: z.object({
      id: z.string(),
      title: z.string().optional(),
      author: z.string().optional(),
    }),
    async resolve({ input }) {
      return await prisma.book.update({ where: { id: input.id }, data: input });
    },
  })
  .mutation('deleteBook', {
    input: z.string(),
    async resolve({ input }) {
      return await prisma.book.delete({ where: { id: input } });
    },
  });

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});