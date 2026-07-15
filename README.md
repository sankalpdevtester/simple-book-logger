# Personal Book Logger
A simple web app for book lovers to log and track the books they've read.

## Badges
[![Language](https://img.shields.io/badge/language-TypeScript-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](https://opensource.org/licenses/MIT)

## What it does
The Personal Book Logger is a web application designed for book enthusiasts to keep track of the books they've read. It provides a simple and intuitive interface for users to add, edit, and delete book entries. The app also features filtering capabilities, allowing users to quickly find specific books by title or author.

## Features
* Add book entry
* Edit book entry
* Delete book entry
* List all book entries
* Filter by book title or author

## Requirements
* Node.js 18.12.1
* npm 9.2.0
* tRPC 10.7.1
* Next.js 13.0.4
* Prisma 4.7.1
* PostgreSQL 15.2

## Installation
To install the required dependencies, run the following command:
```bash
npm install
```

## Usage
To start the development server, run the following command:
```bash
npm run dev
```
This will start the server and make the application available at [http://localhost:3000](http://localhost:3000). You can then interact with the application by navigating to this URL in your web browser.

Example usage:
* Add a new book entry: Navigate to [http://localhost:3000/books](http://localhost:3000/books) and click the "Add Book" button. Fill in the required fields (title, author, etc.) and submit the form.
* List all book entries: Navigate to [http://localhost:3000/books](http://localhost:3000/books) to view a list of all logged book entries.
* Filter by book title: Navigate to [http://localhost:3000/books](http://localhost:3000/books) and enter a book title in the search bar to filter the list of book entries.

## Environment Variables
| Variable | Description |
| --- | --- |
| `DATABASE_URL` | The URL of the PostgreSQL database |
| `PRISMA_CLIENT` | The path to the Prisma client |
| `NEXT_PUBLIC_API_URL` | The URL of the API endpoint |

## Project Structure
```markdown
.
├── components
│   ├── BookEntry.js
│   ├── BookList.js
│   └── ...
├── pages
│   ├── books
│   │   ├── index.js
│   │   └── ...
│   ├── _app.js
│   └── ...
├── prisma
│   ├── schema.prisma
│   └── ...
├── public
│   ├── index.html
│   └── ...
├── styles
│   ├── globals.css
│   └── ...
├── utils
│   ├── api.js
│   └── ...
├── package.json
├── README.md
└── ...
```

## Contributing
Contributions are welcome! To contribute to this project, please fork the repository and submit a pull request with your changes. Make sure to include a clear description of the changes you've made and why they're necessary.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.