import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { prisma } from '../../utils/prisma';

export const appRouter = trpc
  .router()
  .query('book.getAll', {
    async resolve() {
      return prisma.book.findMany();
    },
  })
  .mutation('book.add', {
    input: z.object({
      title: z.string(),
      author: z.string(),
    }),
    async resolve({ input }) {
      return prisma.book.create({
        data: {
          title: input.title,
          author: input.author,
        },
      });
    },
  })
  .mutation('book.delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return prisma.book.delete({
        where: {
          id: input.id,
        },
      });
    },
  });

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});