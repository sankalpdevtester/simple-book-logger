import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';

export default function Home() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const { data: books, isLoading } = trpc.useQuery(['book.getAll']);
  const { mutate: addBook } = trpc.useMutation(['book.add']);
  const { mutate: deleteBook } = trpc.useMutation(['book.delete']);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addBook({ title, author });
    setTitle('');
    setAuthor('');
  };

  const handleDelete = (id: string) => {
    deleteBook({ id });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Personal Book Logger</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Book title"
        />
        <input
          type="text"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Book author"
        />
        <button type="submit">Add book</button>
      </form>
      <ul>
        {books?.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}