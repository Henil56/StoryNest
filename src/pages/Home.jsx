import React,{useState,useEffect}from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard, Input, Button } from '../components'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import Section from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useSelector } from 'react-redux'

function Home() {
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(false)
    const isLoggedIn=useSelector((state)=>state.auth.status)
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

    const trending = posts.slice(0, 3)
    const latest = posts.slice(3)

    return (
        <div className='w-full py-8'>
            <Container>
                <section className="rounded-3xl bg-linear-to-r from-indigo-600 to-purple-600 p-12 text-white">
                    <h1 className="text-5xl font-bold">Discover stories worth reading.</h1>
                    <p className="mt-6 text-lg">Share ideas with the world.</p>
                </section>
            </Container>

            <Section>
                <Container>
                    <PageHeader title="Trending" />
                    {loading ? (
                        <div className='grid lg:grid-cols-3 gap-4'>
                            <LoadingSkeleton />
                            <LoadingSkeleton />
                            <LoadingSkeleton />
                        </div>
                    ) : trending.length === 0 ? (
                        <EmptyState title="No trending stories" description="There are no trending stories right now." />
                    ) : (
                        <div className='grid gap-4 lg:grid-cols-3'>
                            <div className='lg:col-span-2'>
                                <Card className='overflow-hidden'>
                                    <PostCard {...trending[0]} />
                                </Card>
                            </div>
                            <div className='flex flex-col gap-4'>
                                {trending.slice(1).map((p) => (
                                    <Card key={p.$id} className='overflow-hidden'>
                                        <PostCard {...p} />
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </Container>
            </Section>

            <Section>
                <Container>
                    <PageHeader title="Latest Stories" subtitle="Discover inspiring articles from creators." />
                    {(!posts || posts.length === 0) && !isLoggedIn ? (
                        <div className="flex flex-wrap">
                            <div className="p-2 w-full text-center">
                                <h1 className="text-2xl font-bold hover:text-gray-500">Login to read posts</h1>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className='flex flex-wrap'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className='p-2 w-1/4'>
                                    <div className='rounded-2xl shadow-sm bg-white overflow-hidden animate-pulse'>
                                        <div className='h-40 bg-gray-200'></div>
                                        <div className='p-4'>
                                            <div className='h-4 bg-gray-200 w-3/4 mb-2'></div>
                                            <div className='h-3 bg-gray-200 w-1/2'></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex flex-wrap">
                            <div className="p-2 w-full text-center">
                                <h1 className="text-2xl font-bold">📚 No stories yet</h1>
                                <p className="mt-2 text-lg text-gray-600">Create your first story.</p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-wrap'>
                            {posts.map((post) => (
                                <div key={post.$id} className='p-2 w-1/4'>
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    )}
                </Container>
            </Section>

            <Section>
                <Container>
                    <Card className="p-6">
                        <div className='flex flex-col md:flex-row items-center gap-4'>
                            <div className='flex-1'>
                                <h3 className='text-2xl font-semibold'>Subscribe to our newsletter</h3>
                                <p className='text-gray-600 mt-2'>Get the latest stories delivered to your inbox.</p>
                            </div>
                            <form className='flex gap-2 w-full md:w-auto'>
                                <Input placeholder="Your email" />
                                <Button type='button'>Subscribe</Button>
                            </form>
                        </div>
                    </Card>
                </Container>
            </Section>
        </div>
    )
}

export default Home