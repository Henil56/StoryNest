import React,{useState,useEffect}from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard, Input, Button } from '../components'
import PageHeader from '../components/ui/PageHeader'
import Section from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Home() {
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(false)
    const isLoggedIn=useSelector((state)=>state.auth.status)
    const [email, setEmail] = useState('')
    const [subscribeStatus, setSubscribeStatus] = useState('idle')

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        
        setSubscribeStatus('loading');
        try {
            await appwriteService.subscribeNewsletter(email);
            setSubscribeStatus('success');
            setEmail('');
            setTimeout(() => setSubscribeStatus('idle'), 3000);
        } catch (error) {
            console.error("Subscription failed:", error);
            // Optionally set an error state here, but for now we can just reset
            setSubscribeStatus('idle');
            alert("Failed to subscribe. Please make sure the Appwrite collection is configured.");
        }
    };
    useEffect(()=>{
        setLoading(true)
        if(isLoggedIn){
            appwriteService.getPosts()
            .then((posts)=>{
                if(posts){
                    setPosts(posts.rows || [])
                }
            })
            .catch(()=>{
                setPosts([])
            })
            .finally(()=>setLoading(false))
        }else{
            setPosts([])
            setLoading(false)
        }
    },[isLoggedIn])

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
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-indigo-700 to-purple-800 dark:from-primary-900 dark:via-indigo-950 dark:to-purple-950 py-20 sm:py-28">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-300/10 blur-3xl"></div>
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
                                <button className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl bg-white text-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
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
            <Section className="bg-slate-50/50 dark:bg-surface-elevated/50">
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
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {posts.map((post) => (
                                <PostCard key={post.$id} {...post} />
                            ))}
                        </div>
                    )}
                </Container>
            </Section>

            {/* Newsletter Section */}
            <Section>
                <Container>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-700 p-8 sm:p-12 text-white">
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
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 min-w-[250px]" 
                                    disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                                />
                                <Button 
                                    type='submit' 
                                    className="bg-white text-primary-700 hover:bg-white/90 shadow-lg whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                    disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                                >
                                    {subscribeStatus === 'loading' ? 'Subscribing...' : subscribeStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </Container>
            </Section>
        </div>
    )
}

export default Home