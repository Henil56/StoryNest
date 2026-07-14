import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, PostCard } from '../components'
import appwriteService from '../appwrite/config'
import EmptyState from '../components/ui/EmptyState'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import Pagination from '../components/ui/Pagination'

const POSTS_PER_PAGE = 12

export default function AuthorPosts() {
    const { authorId } = useParams()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if (authorId) {
            setLoading(true)
            appwriteService.getPostsByAuthor(authorId)
                .then((res) => {
                    if (res) {
                        setPosts(res.documents || [])
                    }
                })
                .catch(() => setPosts([]))
                .finally(() => setLoading(false))
        }
    }, [authorId])

    const authorName = posts.length > 0 && posts[0].authorName ? posts[0].authorName : null
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    const paginatedPosts = posts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    )

    return (
        <div className="w-full py-12 animate-fade-in">
            <Container>
                {/* Author Header */}
                <div className="mb-10">
                    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary-600 transition-colors duration-200 mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg shadow-primary-500/20">
                            {(authorName || authorId || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                                {authorName || 'Author'}
                            </h1>
                            <p className="mt-1 text-text-muted text-sm">
                                {loading ? 'Loading...' : `${posts.length} ${posts.length === 1 ? 'story' : 'stories'} published`}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 h-px bg-border"></div>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <LoadingSkeleton key={i} />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <EmptyState
                        title="No stories yet"
                        description="This author hasn't published any stories yet."
                        icon="📝"
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
