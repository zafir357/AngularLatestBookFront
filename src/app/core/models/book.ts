import { AuthorSummary } from './author';
import { PublisherSummary } from './publisher';

// Matches BookDto (what the API returns)
export interface Book {
  id: number;
  title: string;
  year: number;
  publisher: PublisherSummary | null;
  authors: AuthorSummary[];
}

// Matches CreateBookDto (what you POST)
export interface CreateBook {
  title: string;
  year: number;
  publisherId: number | null;
  authorIds: number[];
}

// Matches UpdateBookDto (what you PUT)
export interface UpdateBook {
  title: string;
  year: number;
  publisherId: number | null;
}

// Matches UpdateBookAuthorsDto (what you PUT to /books/{id}/authors)
export interface UpdateBookAuthors {
  authorIds: number[];
}
