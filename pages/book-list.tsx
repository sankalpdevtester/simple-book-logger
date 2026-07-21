import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import { Book } from '../src/models/book';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { data, isLoading, error } = trpc.useQuery(['book.getAllBooks']);

  useEffect(() => {
    if (data) {
      setBooks(data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Book List</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;