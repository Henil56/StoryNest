import React,{useState,useEffect} from 'react'
import { Container , PostCard } from '../components'    
import appwriteService from "../appwrite/config"
import { useSelector } from 'react-redux'

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
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    
  return (
    <div className='w-full py-8'>
        <Container>
            <div className='grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-6'>
                {posts.map((post)=>(
                    <div key={post.$id} className='p-2'>
                        <PostCard {...post} />
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default AllPost