// Matches AuthorDto (what the API returns)
export interface Author {
  id: number;
  name: string;
  country: string;
  books: BookSummary[];
}

export interface BookSummary {
  id: number;
  title: string;
  year: number;
}

// Matches AuthorSummaryDto (embedded inside BookDto)
export interface AuthorSummary {
  id: number;
  name: string;
}

// Matches CreateAuthorDto (what you POST/PUT)
export interface CreateAuthor {
  name: string;
  country: string;
}
