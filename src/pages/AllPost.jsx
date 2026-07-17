import React, { useState, useEffect, useMemo } from 'react'
import { Container, PostCard } from '../components'
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

const POSTS_PER_PAGE = 12

function AllPost() {
    const isLoggedIn = useSelector((state) => state.auth.status)
    const { data: posts = [], isLoading: loading } = useGetPostsQuery(undefined, {
        skip: !isLoggedIn,
    })
    
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedCategory])

    // Filter posts by search & category
    const filteredPosts = useMemo(() => {
        let result = posts

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

        return result
    }, [posts, searchQuery, selectedCategory])

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

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-border bg-surface-elevated text-text-primary outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 hover:border-border-hover text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2394A3B8%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:right_12px_center] bg-no-repeat pr-10 min-w-[160px]"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
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