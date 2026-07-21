import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { BookInput } from '../src/models/book';

const BookForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const { mutate, isLoading, error } = trpc.useMutation(['book.addBook']);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ title, author });
  };

  return (
    <div>
      <h1>Add Book</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <br />
        <label>
          Author:
          <input type="text" value={author} onChange={(event) => setAuthor(event.target.value)} />
        </label>
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Book'}
        </button>
        {error && <div style={{ color: 'red' }}>{error.message}</div>}
      </form>
    </div>
  );
};

export default BookForm;