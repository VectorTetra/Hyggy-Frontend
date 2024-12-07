import axios from 'axios';


export class BlogMainCategoryQuery {
    SearchParameter: string = "Query";
    Id?: number | null;
    BlogTitle?: string | null;
    Keyword?: string | null;
    FilePath?: string | null;
    PreviewImagePath?: string | null;
    BlogCategory1Name?: string | null;
    BlogCategory2Name?: string | null;
    BlogCategory1Id?: number | null;
    BlogCategory2Id?: number | null;
    PageNumber?: number | null;
    PageSize?: number | null;
    StringIds?: string | null;
    Sorting?: string | null;
    QueryAny?: string | null;
}

export async function getBlogSubCatsByMainCat(params: BlogMainCategoryQuery = { SearchParameter: "BlogCategory1Id", BlogCategory1Id: 1 }) {
    try {
        const response = await axios.get('http://www.hyggy.somee.com/api/BlogCategory2', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching Blogs:', error);
        throw new Error('Failed to fetch Blogs');
    }
}

export async function getBlogSubCats(params: BlogMainCategoryQuery = { SearchParameter: "Paged", PageNumber: 1, PageSize: 50 }) {
    try {
        const response = await axios.get('http://www.hyggy.somee.com/api/BlogCategory2', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching Blogs:', error);
        throw new Error('Failed to fetch Blogs');
    }
}