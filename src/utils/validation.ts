// src/utils/validation.ts
import { z } from 'zod';

// Define a schema for book entries
export const BookEntrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  pages: z.number('Pages must be a number').min(1, 'Pages must be greater than 0'),
  rating: z.number('Rating must be a number').min(1, 'Rating must be greater than 0').max(5, 'Rating must be less than or equal to 5'),
  review: z.string().optional(),
});

// Define a schema for creating new book entries
export const CreateBookEntrySchema = BookEntrySchema.omit({ id: true });

// Define a schema for updating existing book entries
export const UpdateBookEntrySchema = BookEntrySchema.partial();

// Define a function to validate book entries
export function validateBookEntry(data: any) {
  return BookEntrySchema.parse(data);
}

// Define a function to validate creating new book entries
export function validateCreateBookEntry(data: any) {
  return CreateBookEntrySchema.parse(data);
}

// Define a function to validate updating existing book entries
export function validateUpdateBookEntry(data: any) {
  return UpdateBookEntrySchema.parse(data);
}

// Example usage:
// const bookEntry = { title: 'Example Book', author: 'Example Author', pages: 100, rating: 4 };
// try {
//   const validatedBookEntry = validateBookEntry(bookEntry);
//   console.log(validatedBookEntry);
// } catch (error) {
//   console.error(error);
// }