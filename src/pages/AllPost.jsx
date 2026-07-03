import React,{useState,useEffect} from 'react'
import { Container , PostCard } from '../components'    
import appwriteService from "../appwrite/config"
import { useSelector } from 'react-redux'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

function AllPost() {
    const [posts,setPost]=useState([])
    const isLoggedIn = useSelector((state) => state.auth.status)
    useEffect(()=>{
        if(isLoggedIn){
            appwriteService.getPosts([]).then((posts)=> {
                if(posts){
                    setPost(posts.rows ||[])
                }
        }) 
    }else{
        setPost([])
    }
    },[isLoggedIn])
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
            {posts.length === 0 ? (
                <EmptyState 
                    title="No stories found" 
                    description="There are no stories to show right now."
                />
            ) : (
                <div className='grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                    gap-6'>
                    {posts.map((post)=>(
                        <PostCard key={post.$id} {...post} />
                    ))}
                </div>
            )}
        </Container>
    </div>
  )
}

export default AllPost