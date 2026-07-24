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


    return (
        <div className='w-full'>
            <Helmet>
                <title>Home | StoryNest</title>
                <meta name="description" content="There's a story inside you that someone, somewhere, is waiting to read. Share your thoughts and stories on StoryNest." />
            </Helmet>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#BAE6FD] via-[#E2E8F0] to-[#C7D2FE] dark:from-[#0F172A] dark:via-[#111827] dark:to-[#0B0F19] pt-24 pb-20 sm:pt-24 sm:pb-22">
                {/* Floating Ambient Glow Orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-sky-400/25 dark:bg-[#87CEEB]/20 blur-[120px]"></div>
                    <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] rounded-full bg-indigo-400/20 dark:bg-rose-500/15 blur-[130px]"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 rounded-full bg-teal-300/25 dark:bg-purple-600/20 blur-[110px]"></div>
                </div>

                <Container>
                    <div className="relative z-10 animate-slide-up">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 dark:bg-white/5 border border-[#0284C7]/20 dark:border-white/15 backdrop-blur-md text-sm font-medium text-[#0F172A] dark:text-white/90 shadow-md dark:shadow-xl mb-6 animate-fade-in">
                            <span className="flex h-2.5 w-2.5 relative shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 dark:bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 dark:bg-amber-400"></span>
                            </span>
                            <span className="tracking-wide">We all have stories we've never told anyone</span>
                        </div>

                        {/* Headline — Full Width */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F2942] dark:text-white leading-[1.2] tracking-tight max-w-4xl">
                            There's a story inside you <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-[#0F2942] via-[#2B5D8C] to-[#407B9E] dark:from-amber-200 dark:via-rose-200 dark:to-sky-200 bg-clip-text text-transparent">
                                that someone, somewhere, is waiting to read.
                            </span>
                        </h1>

                        {/* Two-Column: Subtitle Left + Action Card Right */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                            {/* Left: Subtitle */}
                            <div className="lg:col-span-8">
                                <p className="text-lg sm:text-xl text-[#334155] dark:text-slate-200/90 leading-relaxed font-normal">
                                    The most meaningful stories aren't found in books, they're carried quietly inside people like you. A memory that still makes you smile, a lesson you learned the hard way, or a moment that quietly changed your life.
                                </p>
                                <p className="mt-4 text-base sm:text-lg text-[#475569] dark:text-white/80 leading-relaxed font-medium">
                                    <span className="font-semibold text-[#0F172A] dark:text-white underline decoration-[#0284C7]/40 dark:decoration-amber-300/50 underline-offset-4">StoryNest</span> is your space to put those moments into words, share them with people who care, and inspire someone who needs your story today.
                                </p>
                            </div>

                            {/* Right: Action Card */}
                            <div className="lg:col-span-4 rounded-2xl border border-[#0284C7]/20 dark:border-white/15 bg-white/75 dark:bg-white/5 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-[#0284C7]/10 dark:shadow-black/20 flex flex-col justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-300 text-sm border border-amber-400/30">✍️</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-[#17304D] dark:text-white leading-tight">Ready to share your voice?</h3>
                                        <p className="text-[10px] text-[#64748B] dark:text-white/50">Join writers & readers around the world</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Link to={isLoggedIn ? "/add-post" : "/login"} className="w-full">
                                        <button className="group w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#17304D] via-[#2E5C8A] to-[#4682B4] text-white shadow-md shadow-[#17304D]/20 hover:shadow-lg hover:shadow-[#17304D]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                                            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Start Writing
                                        </button>
                                    </Link>
                                    <Link to="/all-post" className="w-full">
                                        <button className="group w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-[#17304D] dark:text-white bg-[#17304D]/5 dark:bg-white/10 hover:bg-[#17304D]/10 dark:hover:bg-white/20 border border-[#17304D]/10 dark:border-white/15 hover:border-[#17304D]/20 dark:hover:border-white/30 shadow-sm hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md transition-all duration-300">
                                            Explore Stories
                                            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </Link>
                                </div>

                                <div className="pt-2 border-t border-[#17304D]/10 dark:border-white/10">
                                    <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] dark:text-white/60">
                                        <span className="text-xs">💭</span>
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