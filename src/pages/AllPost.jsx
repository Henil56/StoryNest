import React, { useState, useEffect, useMemo } from 'react'
import { Container, PostCard, Select } from '../components'
import { useSelector } from 'react-redux'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import Pagination from '../components/ui/Pagination'
import { useGetPostsQuery } from '../store/apiSlice'

const CATEGORIES = [
    "All",
    "Technology",
    "AI",
    "Programming",
    "Business",
    "Startups",
    "Education",
    "Science",
    "Health",
    "Lifestyle",
    "Travel",
    "Food",
    "Entertainment",
    "Books",
    "Sports",
    "Finance",
    "Personal Stories",
    "Opinion",
    "News",
    "Creative Writing",
    "Other",
]

const SORT_OPTIONS = [
    "Latest",
    "Oldest",
    "Most Liked",
    "Most Viewed"
]

const POSTS_PER_PAGE = 12

function AllPost() {
    const isLoggedIn = useSelector((state) => state.auth.status)
    const { data: posts = [], isLoading: loading } = useGetPostsQuery(undefined, {
        skip: !isLoggedIn,
    })
    
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [sortBy, setSortBy] = useState('Latest')
    const [currentPage, setCurrentPage] = useState(1)

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedCategory, sortBy])

    // Filter posts by search & category
    const filteredPosts = useMemo(() => {
        let result = [...posts]

        // Filter by category
        if (selectedCategory !== 'All') {
            result = result.filter(post => post.category === selectedCategory)
        }

        // Filter by search query (title match)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            result = result.filter(post =>
                (post.title || '').toLowerCase().includes(q) ||
                (post.content || '').replace(/<[^>]*>/g, '').toLowerCase().includes(q)
            )
        }

        // Sort
        if (sortBy === 'Latest') {
            result.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
        } else if (sortBy === 'Oldest') {
            result.sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt))
        } else if (sortBy === 'Most Liked') {
            result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        } else if (sortBy === 'Most Viewed') {
            result.sort((a, b) => (b.views || 0) - (a.views || 0))
        }

        return result
    }, [posts, searchQuery, selectedCategory, sortBy])

    // Pagination
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    )

    if (!isLoggedIn) {
        return (
            <div className="w-full py-16">
                <Container>
                    <EmptyState
                        title="Sign in to explore"
                        description="Login to access all stories from our community of writers."
                        icon="🔒"
                    />
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-12'>
            <Container>
                <PageHeader title="All Stories" subtitle="Browse every story published on StoryNest." />

                {/* Search & Filter Bar */}
                <div className="mb-8 flex flex-col sm:flex-row gap-3 animate-fade-in">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search stories by title or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface-elevated text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 hover:border-border-hover text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary transition-colors"
                                aria-label="Clear search"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Category and Sort Filters */}
                    <div className="flex gap-4 max-sm:w-full overflow-x-auto min-w-max pb-2 sm:pb-0">
                        <Select
                            options={CATEGORIES}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="min-w-[150px]"
                        />
                        <Select
                            options={SORT_OPTIONS}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="min-w-[150px]"
                        />
                    </div>
                </div>

                {/* Results count */}
                {!loading && (searchQuery || selectedCategory !== 'All') && (
                    <p className="mb-6 text-sm text-text-muted">
                        {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'} found
                        {searchQuery && <> for "<span className="font-medium text-text-secondary">{searchQuery}</span>"</>}
                        {selectedCategory !== 'All' && <> in <span className="font-medium text-text-secondary">{selectedCategory}</span></>}
                    </p>
                )}

                {/* Content */}
                {loading ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <LoadingSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <EmptyState
                        title={searchQuery || selectedCategory !== 'All' ? "No matching stories" : "No stories found"}
                        description={
                            searchQuery || selectedCategory !== 'All'
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "There are no stories to show right now."
                        }
                        icon={searchQuery ? "🔍" : "📚"}
                    />
                ) : (
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {paginatedPosts.map((post) => (
                                <PostCard key={post.$id} {...post} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </Container>
        </div>
    )
}

export default AllPost