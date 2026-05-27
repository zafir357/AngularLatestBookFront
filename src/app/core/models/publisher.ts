// Matches PublisherDto (what the API returns)
export interface Publisher {
  id: number;
  name: string;
  country: string;
  bookTitles: string[];
}

// Matches PublisherSummaryDto (embedded inside BookDto)
export interface PublisherSummary {
  id: number;
  name: string;
}

// Matches CreatePublisherDto / UpdatePublisherDto (what you POST/PUT)
export interface CreatePublisher {
  name: string;
  country: string;
}
