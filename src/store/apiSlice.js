import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import appwriteService from '../appwrite/config'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Post', 'AuthorPosts'],
    endpoints: (builder) => ({
        getPosts: builder.query({
            queryFn: async () => {
                try {
                    const response = await appwriteService.getPosts();
                    return { data: response?.documents || [] }
                } catch (error) {
                    return { error }
                }
            },
            providesTags: (result = []) => [
                'Post',
                ...result.map(({ $id }) => ({ type: 'Post', id: $id }))
            ],
        }),
        getPostsByAuthor: builder.query({
            queryFn: async (authorId) => {
                try {
                    const response = await appwriteService.getPostsByAuthor(authorId);
                    return { data: response?.documents || [] }
                } catch (error) {
                    return { error }
                }
            },
            providesTags: (result = [], error, arg) => [
                { type: 'AuthorPosts', id: arg },
                ...result.map(({ $id }) => ({ type: 'Post', id: $id }))
            ],
        }),
        getPost: builder.query({
            queryFn: async (slug) => {
                try {
                    const response = await appwriteService.getPost(slug);
                    return { data: response }
                } catch (error) {
                    return { error }
                }
            },
            providesTags: (result, error, arg) => [{ type: 'Post', id: arg }],
        }),
    }),
})

export const {
    useGetPostsQuery,
    useGetPostsByAuthorQuery,
    useGetPostQuery,
} = apiSlice
