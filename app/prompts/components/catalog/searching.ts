import { Prompt } from "../../api/schemas";
import * as z from 'zod';

export const SearchSchema = z.object({
    search: z.string().min(1),
    selectedTags: z.array(z.string()),
    searchBy: z.enum(['all','title', 'description'])
});

function Search(data: Prompt[], search: z.infer<typeof SearchSchema>) {
    switch (search.searchBy) {
        case 'all':
            return [...data].filter(p => 
                (!search.search || 
                  p.title.toLowerCase().includes(search.search.toLowerCase()) ||
                  p.content.toLowerCase().includes(search.search.toLowerCase())) &&
                (!search.selectedTags.length || search.selectedTags.every(t => p.tags.includes(t)))
              );
        case 'title':
            return [...data].filter(prompt => prompt.title.toLowerCase().includes(search.search.toLowerCase()));
        default:
            return [...data];
    }
}

export default Search;  