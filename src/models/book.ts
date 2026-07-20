import { z } from 'zod';

export const Book = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
});

export const CreateBook = z.object({
  title: z.string(),
  author: z.string(),
});

export const UpdateBook = z.object({
  id: z.string(),
  title: z.string().optional(),
  author: z.string().optional(),
});

export type BookType = z.infer<typeof Book>;
export type CreateBookType = z.infer<typeof CreateBook>;
export type UpdateBookType = z.infer<typeof UpdateBook>;