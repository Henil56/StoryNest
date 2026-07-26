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
import { rateLimiter } from '../utils/rateLimiter'

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

        const rateCheck = rateLimiter.checkPublicLimit('newsletter_subscribe');
        if (!rateCheck.allowed) {
            setSubscribeStatus('idle');
            setSubscribeError(rateCheck.errorMessage);
            return;
        }

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


    return (
        <div className='w-full page-enter'>
            <Helmet>
                <title>Home | StoryNest</title>
                <meta name="description" content="There's a story inside you that someone, somewhere, is waiting to read. Share your thoughts and stories on StoryNest." />
            </Helmet>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-surface pt-12 pb-16 sm:pt-16 sm:pb-20">
                {/* Floating Ambient Glow Orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-sky-400/20 dark:bg-[#87CEEB]/15 blur-[120px] animate-pulse"></div>
                    <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] rounded-full bg-indigo-400/15 dark:bg-rose-500/10 blur-[130px]" style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 rounded-full bg-teal-300/20 dark:bg-purple-600/15 blur-[110px]" style={{ animation: 'glow-pulse 5s ease-in-out infinite 1s' }}></div>
                </div>

                <Container>
                    <div className="relative z-10 animate-slide-up">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-[#0284C7]/15 dark:border-white/10 backdrop-blur-md text-sm font-medium text-[#0F172A] dark:text-white/90 shadow-sm mb-6 animate-fade-in">
                            <span className="flex h-2 w-2 relative shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 dark:bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-amber-400"></span>
                            </span>
                            <span className="tracking-wide text-xs sm:text-sm">We all have stories we've never told anyone</span>
                        </div>

                        {/* Headline — Full Width */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F2942] dark:text-white leading-[1.15] tracking-tight max-w-4xl">
                            There's a story inside you <br className="hidden sm:block" />
                            <span className="text-primary-600 dark:text-primary-300">
                                that someone, somewhere, is waiting to read.
                            </span>
                        </h1>

                        {/* Two-Column: Subtitle Left + Action Card Right */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                            {/* Left: Subtitle */}
                            <div className="lg:col-span-7">
                                <p className="text-lg sm:text-xl text-[#334155] dark:text-slate-200/90 leading-relaxed font-normal">
                                    The most meaningful stories aren't found in books, they're carried quietly inside people like you. A memory that still makes you smile, a lesson you learned the hard way, or a moment that quietly changed your life.
                                </p>
                                <p className="mt-5 text-base sm:text-lg text-[#475569] dark:text-white/75 leading-relaxed">
                                    <span className="storynest-brand">StoryNest</span> is your space to put those moments into words, share them with people who care, and inspire someone who needs your story today.
                                </p>

                                {/* Trust indicators */}
                                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#64748B] dark:text-white/50">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                        <span>Free to use</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                        <span>No ads ever</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                        <span>Your stories, your way</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Action Card */}
                            <div className="lg:col-span-5 rounded-2xl border border-border/60 dark:border-white/10 bg-surface-elevated/95 dark:bg-[#0F172A] backdrop-blur-xl p-6 shadow-xl shadow-primary-500/5 dark:shadow-black/40 flex flex-col justify-between gap-5 transition-colors duration-300">
                                <div className="flex items-center gap-3">
                                    <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300 text-base border border-amber-500/20">✍️</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-text-primary dark:text-white leading-tight">Ready to share your voice?</h3>
                                        <p className="text-xs text-text-muted dark:text-white/70 mt-0.5">Join writers & readers around the world</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    <Link to={isLoggedIn ? "/add-post" : "/login"} className="w-full">
                                        <button className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-600/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-transform transition-colors duration-300">
                                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Start Writing
                                        </button>
                                    </Link>
                                    <Link to="/all-post" className="w-full">
                                        <button className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl text-text-primary dark:text-white bg-surface dark:bg-white/10 hover:bg-border/40 dark:hover:bg-white/20 border border-border dark:border-white/20 shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] backdrop-blur-md transition-transform transition-colors duration-300">
                                            Explore Stories
                                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </Link>
                                </div>

                                <div className="pt-3 border-t border-border/50 dark:border-white/10">
                                    <div className="flex items-center gap-2 text-xs text-text-muted dark:text-white/70">
                                        <span className="text-sm">💭</span>
                                        <span>Join real writers sharing real stories every day.</span>
                                    </div>
                                </div>
                            </div>
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
            <Section className="bg-[#C5E3F3]/50 dark:bg-surface-elevated/30">
                <Container>
                    <PageHeader title="Latest Stories" subtitle="Discover inspiring articles from creators around the world." />
                    {(!posts || posts.length === 0) && !isLoggedIn ? (
                        <div className="rounded-2xl border border-border/50 bg-surface-elevated/80 backdrop-blur-sm py-16 text-center animate-fade-in">
                            <div className="text-5xl mb-4 animate-float">🔒</div>
                            <h2 className="text-xl font-bold text-text-primary">Login to read stories</h2>
                            <p className="mt-2 text-text-muted">Sign in to access all stories and start your journey.</p>
                        </div>
                    ) : loading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {Array.from({ length: 4 }).map((_, i) => (
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
                                {[...posts].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)).slice(0, 4).map((post) => (
                                    <PostCard key={post.$id} {...post} />
                                ))}
                            </div>
                            {posts.length > 4 && (
                                <div className="mt-10 text-center">
                                    <Link
                                        to="/all-post"
                                        className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
                                    >
                                        View All Stories
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17304D] via-[#234768] to-[#1E3A5F] dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] p-8 sm:p-12 text-white border border-white/10 shadow-2xl">
                        {/* Background decorations */}
                        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#B0E0E6]/10 dark:bg-primary-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary-400/10 dark:bg-primary-600/10 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
                        
                        <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
                            <div className='flex-1 max-w-xl text-left'>
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold tracking-wider uppercase mb-4 text-[#B0E0E6]">
                                    ✨ NEVER RUN OUT OF STORY
                                </div>
                                <h3 className='text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight'>Fresh stories, straight to your inbox</h3>
                                <p className='text-white/70 mt-3 text-base sm:text-lg leading-relaxed'>Subscribe to receive instant email notifications whenever authors publish new stories on StoryNest.</p>
                            </div>
                            <form onSubmit={handleSubscribe} className='flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0'>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40 focus:ring-white/10 min-w-[260px] shadow-inner transition-all duration-300 rounded-xl"
                                    disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                                />
                                <Button
                                    type='submit'
                                    size='lg'
                                    className="bg-[#B0E0E6] text-[#17304D] hover:bg-white hover:-translate-y-0.5 shadow-xl whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 font-bold rounded-xl px-6"
                                    disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                                    loading={subscribeStatus === 'loading'}
                                >
                                    {subscribeStatus === 'success' ? '✓ Subscribed!' : 'Subscribe Free'}
                                </Button>
                            </form>
                        </div>
                        {subscribeError && (
                            <p className="mt-3 text-sm text-rose-200 flex items-center gap-1 relative z-10">
                                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
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