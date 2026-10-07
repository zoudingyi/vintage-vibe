import React from 'react';
import { Button } from 'react95';
import { getSearchQuery, searchVaporNet } from '../browserModel';
import PageHeader from '../PageHeader';

export default function SearchPage({ address, onNavigate }) {
  const initialQuery = getSearchQuery(address);
  const [query, setQuery] = React.useState(initialQuery);
  const results = searchVaporNet(initialQuery);

  function submitSearch(event) {
    event.preventDefault();
    onNavigate(`vintage://search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <article className="vapornet-page">
      <PageHeader eyebrow="LOCAL INDEX" title="SEARCH RESULTS">
        <p>Search pages and project records stored on VaporNet.</p>
      </PageHeader>
      <form className="vapornet-search-form" onSubmit={submitSearch} role="search">
        <label htmlFor="vapornet-search-input">Search VaporNet</label>
        <div>
          <input
            id="vapornet-search-input"
            onChange={event => setQuery(event.target.value)}
            value={query}
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      {initialQuery ? (
        <section aria-label="Search results" className="vapornet-search-results">
          <p>
            {results.length} result{results.length === 1 ? '' : 's'} for “
            {initialQuery}”
          </p>
          {results.length > 0 ? (
            results.map(result => (
              <button
                className="vapornet-search-result"
                onClick={() => onNavigate(result.address)}
                type="button"
                key={result.id}
              >
                <strong>{result.title}</strong>
                <span>{result.description}</span>
              </button>
            ))
          ) : (
            <p>No matching documents were found on the local intranet.</p>
          )}
        </section>
      ) : (
        <p>Enter a search term to query the local index.</p>
      )}
    </article>
  );
}
