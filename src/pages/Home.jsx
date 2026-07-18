import React, { useState } from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard, Input, Button } from '../components'
import PageHeader from '../components/ui/PageHeader'
import Section from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useGetPostsQuery } from '../store/apiSlice'

function Home() {
    const isLoggedIn = useSelector((state) => state.auth.status)
    const { data: posts = [], isLoading: loading } = useGetPostsQuery(undefined, {
        skip: !isLoggedIn,
    })
    
    const [email, setEmail] = useState('')
    const [subscribeStatus, setSubscribeStatus] = useState('idle')
    const [subscribeError, setSubscribeError] = useState('')

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        
        setSubscribeStatus('loading');
        setSubscribeError('');
        try {
            await appwriteService.subscribeNewsletter(email);
            setSubscribeStatus('success');
            setEmail('');
            setTimeout(() => setSubscribeStatus('idle'), 4000);
        } catch (error) {
            console.error("Subscription failed:", error);
            setSubscribeStatus('idle');
            setSubscribeError('Failed to subscribe. Please try again.');
        }
    };

    // Calculate popularity score: views + (likes * 3)
    const sortedPosts = [...posts].sort((a, b) => {
        const scoreA = (a.views || 0) + ((a.likes || []).length * 3);
        const scoreB = (b.views || 0) + ((b.likes || []).length * 3);
        return scoreB - scoreA;
    });

    const trending = sortedPosts.slice(0, 3)
    const latest = posts.filter(post => !trending.includes(post))

    return (
        <div className='w-full'>
            <Helmet>
                <title>Home | StoryNest</title>
                <meta name="description" content="Discover stories worth reading. Share ideas, inspire readers, and build your audience on StoryNest." />
            </Helmet>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#4682B4] via-[#2F5C84] to-[#17304D] dark:from-primary-900 dark:via-indigo-950 dark:to-purple-950 py-20 sm:py-28">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#87CEEB]/30 blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#B0E0E6]/20 blur-3xl"></div>
                </div>
                <Container>
                    <div className="relative z-10 max-w-3xl animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white/90 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Your creative home for stories
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                            Discover stories<br/>worth reading.
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed">
                            Share ideas, inspire readers, and build your audience — all in one beautiful platform.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link to={isLoggedIn ? "/add-post" : "/login"}>
                                <button className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl bg-[#B0E0E6] text-[#17304D] shadow-lg hover:shadow-xl hover:bg-[#87CEEB] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Start Writing
                                </button>
                            </Link>
                            <Link to="/all-post">
                                <button className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm transition-all duration-200">
                                    Explore Stories
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Trending Section */}
            <Section>
                <Container>
                    <PageHeader title="Trending" subtitle="Stories everyone is talking about" />
                    {loading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            <LoadingSkeleton />
                            <LoadingSkeleton />
                            <LoadingSkeleton />
                        </div>
                    ) : trending.length === 0 ? (
                        <EmptyState title="No trending stories" description="There are no trending stories right now. Check back later!" />
                    ) : (
                        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                            {trending.map((p) => (
                                <PostCard key={p.$id} {...p} />
                            ))}
                        </div>
                    )}
                </Container>
            </Section>

            {/* Latest Stories Section */}
            <Section className="bg-[#C5E3F3] dark:bg-surface-elevated/50">
                <Container>
                    <PageHeader title="Latest Stories" subtitle="Discover inspiring articles from creators around the world." />
                    {(!posts || posts.length === 0) && !isLoggedIn ? (
                        <div className="rounded-2xl border border-dashed border-border bg-surface-elevated py-16 text-center animate-fade-in">
                            <div className="text-5xl mb-4">🔒</div>
                            <h2 className="text-xl font-bold text-text-primary">Login to read stories</h2>
                            <p className="mt-2 text-text-muted">Sign in to access all stories and start your journey.</p>
                        </div>
                    ) : loading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <LoadingSkeleton key={i} />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <EmptyState 
                            title="No stories yet" 
                            description="Be the first to share a story and inspire others."
                            icon="✍️" 
                        />
                    ) : (
                        <>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {[...posts].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)).slice(0, 8).map((post) => (
                                    <PostCard key={post.$id} {...post} />
                                ))}
                            </div>
                            {posts.length > 8 && (
                                <div className="mt-10 text-center">
                                    <Link
                                        to="/all-post"
                                        className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl border border-primary-200 bg-primary-50 text-primary-700 shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50 transition-all duration-300"
                                    >
                                        View All Stories
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </Container>
            </Section>

            {/* Newsletter Section */}
            <Section>
                <Container>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4682B4] to-[#234768] p-8 sm:p-12 text-white">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className='relative z-10 flex flex-col md:flex-row items-center gap-8'>
                            <div className='flex-1'>
                                <h3 className='text-2xl sm:text-3xl font-bold'>Subscribe to our newsletter</h3>
                                <p className='text-white/70 mt-2 text-lg'>Get the latest stories delivered straight to your inbox.</p>
                            </div>
                            <form onSubmit={handleSubscribe} className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
                                <Input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address" 
                                    required
                                    className="bg-white/20 border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white focus:ring-white/30 min-w-[250px] shadow-inner transition-all duration-300" 
                                    disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                                />
                                <Button 
                                    type='submit' 
                                    size='lg'
                                    className="bg-[#17304D] text-white hover:bg-[#234768] hover:-translate-y-0.5 shadow-xl shadow-[#17304D]/30 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 border border-[#2F5C84]"
                                    disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                                    loading={subscribeStatus === 'loading'}
                                >
                                    {subscribeStatus === 'success' ? '✓ Subscribed!' : 'Subscribe'}
                                </Button>
                            </form>
                        </div>
                        {subscribeError && (
                            <p className="mt-3 text-sm text-rose-200 flex items-center gap-1">
                                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                                {subscribeError}
                            </p>
                        )}
                    </div>
                </Container>
            </Section>
        </div>
    )
}

export default Home