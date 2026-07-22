// src/utils/validation.ts
import { z } from 'zod';

// Define a schema for book entries
export const bookEntrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  pages: z.number().int().min(1, 'Pages must be a positive integer'),
  rating: z.number().int().min(1, 'Rating must be a positive integer').max(5, 'Rating must be between 1 and 5'),
  review: z.string().optional(),
});

// Define a schema for book entry updates
export const bookEntryUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').optional(),
  author: z.string().min(1, 'Author is required').optional(),
  pages: z.number().int().min(1, 'Pages must be a positive integer').optional(),
  rating: z.number().int().min(1, 'Rating must be a positive integer').max(5, 'Rating must be between 1 and 5').optional(),
  review: z.string().optional(),
});

// Define a function to validate book entries
export function validateBookEntry(data: any) {
  return bookEntrySchema.parse(data);
}

// Define a function to validate book entry updates
export function validateBookEntryUpdate(data: any) {
  return bookEntryUpdateSchema.parse(data);
}

// Example usage:
// const bookEntry = { title: 'Example Book', author: 'John Doe', pages: 200, rating: 4 };
// try {
//   const validatedBookEntry = validateBookEntry(bookEntry);
//   console.log(validatedBookEntry);
// } catch (error) {
//   console.error(error);
// }