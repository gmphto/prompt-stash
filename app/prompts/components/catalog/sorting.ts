import { Prompt } from '../../api/schemas';
import * as z from 'zod';

// Sort enum
export const SortOptions = z.enum(['title', 'updatedAt']);
export const SortDirection = z.enum(['asc', 'desc']);
export type SortOptionsType = z.infer<typeof SortOptions>;
export type SortDirectionType = z.infer<typeof SortDirection>;

export const SortSchema = z.object({
    sortBy: SortOptions,
    sortDirection: SortDirection
});

// Define return type for sort functions
export const SortResultSchema = z.array(z.lazy(() => z.any())); // Using any since we don't have the Prompt schema directly here

// Pure function
function Sort(data: Prompt[], sort: z.infer<typeof SortSchema>): Prompt[] {
    switch(sort.sortBy) {
        case 'title':
            return SortByTitle(data, sort.sortDirection);
        case 'updatedAt':
            return SortByUpdatedAt(data, sort.sortDirection);
    }
}

// Pure function
function SortByTitle(data: Prompt[], sortDirection: z.infer<typeof SortDirection>): Prompt[] {
    // Create a shallow copy of the array to avoid modifying the original
    return [...data].sort((a, b) => a.title.localeCompare(b.title) * (sortDirection === 'desc' ? -1 : 1));
}

// Pure function
function SortByUpdatedAt(data: Prompt[], sortDirection: z.infer<typeof SortDirection>): Prompt[] {
    // Create a shallow copy of the array to avoid modifying the original
    return [...data].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt) * (sortDirection === 'desc' ? -1 : 1));
}

export default Sort;
