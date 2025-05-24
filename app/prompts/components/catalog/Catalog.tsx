import React from 'react';
import * as z from 'zod';
import { Prompt, promptSchema } from '../../api/schemas';
import { useCatalogState } from './hooks/useCatalogState';
import { CatalogSearch } from './components/CatalogSearch';
import { CatalogSorter } from './components/CatalogSorter';
import { CatalogTags } from './components/CatalogTags';
import { CatalogItem } from './components/CatalogItem';
import { CatalogEmpty } from './components/CatalogEmpty';

/**
 * Catalog component for browsing, filtering, and managing prompts
 * Uses centralized state management through useCatalogState hook
 */
export default function Catalog() {
  const {
    filteredPrompts,
    allTags,
    isLoading,
    filterState,
    toggleSort,
    toggleTag,
    updateSearch,
    selectPrompt,
    editPrompt,
    deletePrompt,
    duplicatePrompt
  } = useCatalogState();

  const { search, sortBy, sortDir, selectedTags } = filterState;

  if (isLoading && filteredPrompts.length === 0) {
    return <div className="loading">Loading prompts...</div>;
  }

  return (
    <div className="prompt-list-container card border-light">
      {isLoading && <div className="loading-indicator">Refreshing...</div>}

      <header className="prompt-list-header card-header" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>


        <div className='d-flex justify-content-between'>

        <CatalogSearch
          value={search}
          onChange={updateSearch}
        />

          <CatalogSorter
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={toggleSort}
          />

        </div>

        <div className='d-flex justify-content-between'>
        <CatalogTags
            tags={allTags}
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
          />

        </div>


      </header>

      <div className='card-body'>
        {!filteredPrompts.length ? (
          <CatalogEmpty hasPrompts={allTags.length > 0} />
        ) : (
          <ul className="prompt-list list-group list-group-flush">
            {filteredPrompts.map(prompt => (
              <CatalogItem
                key={prompt.id}
                prompt={prompt}
                onSelect={(prompt) => {
                  selectPrompt(prompt.id);
                  editPrompt(prompt.id);
                }}
                onDelete={deletePrompt}
                onDuplicate={duplicatePrompt}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 