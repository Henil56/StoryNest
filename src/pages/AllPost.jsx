import React, { useState, useMemo } from 'react'
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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1)
    }

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value)
        setCurrentPage(1)
    }

    const handleSortChange = (e) => {
        setSortBy(e.target.value)
        setCurrentPage(1)
    }

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

        // Sort: Pinned Founder post ALWAYS stays pinned at top of list!
        result.sort((a, b) => {
            const isAPinned = a.slug === 'welcome-to-storynest-founder-letter' || a.slug?.includes('welcome-to-storynest') || a.authorName?.includes('Founder') || a.isPinned;
            const isBPinned = b.slug === 'welcome-to-storynest-founder-letter' || b.slug?.includes('welcome-to-storynest') || b.authorName?.includes('Founder') || b.isPinned;

            if (isAPinned && !isBPinned) return -1;
            if (!isAPinned && isBPinned) return 1;

            if (sortBy === 'Latest') {
                return new Date(b.$createdAt) - new Date(a.$createdAt)
            } else if (sortBy === 'Oldest') {
                return new Date(a.$createdAt) - new Date(b.$createdAt)
            } else if (sortBy === 'Most Liked') {
                return (b.likes?.length || 0) - (a.likes?.length || 0)
            } else if (sortBy === 'Most Viewed') {
                return (b.views || 0) - (a.views || 0)
            }
            return 0;
        })

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
            <div className="w-full py-16 page-enter">
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
        <div className='w-full py-12 page-enter'>
            <Container>
                <PageHeader title="All Stories" subtitle="Browse every story published on StoryNest." />

                {/* Search & Filter Bar — Unified */}
                <div className="relative z-30 mb-8 p-4 rounded-2xl bg-surface-elevated/80 backdrop-blur-sm border border-border/30 shadow-sm animate-fade-in">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search stories..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-muted outline-none transition-all duration-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 hover:border-border-hover text-base sm:text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => handleSearchChange({ target: { value: '' } })}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
                                    aria-label="Clear search"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Category and Sort Filters */}
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Select
                                options={CATEGORIES}
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="min-w-[140px] !py-2.5 !text-sm"
                            />
                            <Select
                                options={SORT_OPTIONS}
                                value={sortBy}
                                onChange={handleSortChange}
                                className="min-w-[140px] !py-2.5 !text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Results count */}
                {!loading && (searchQuery || selectedCategory !== 'All') && (
                    <div className="mb-6 flex items-center gap-2 text-sm text-text-muted animate-fade-in">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>
                            <span className="font-semibold text-text-secondary">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'story' : 'stories'} found
                            {searchQuery && <> for "<span className="font-medium text-text-secondary">{searchQuery}</span>"</>}
                            {selectedCategory !== 'All' && <> in <span className="font-medium text-text-secondary">{selectedCategory}</span></>}
                        </span>
                    </div>
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