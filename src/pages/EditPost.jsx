import React,{useEffect,useState} from 'react'
import {Container,PostForm} from '../components'
import appwriteService from "../appwrite/config"
import {useNavigate, useParams} from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'

function EditPost() {
    const [post,setPosts]=useState(null)
    const {slug}=useParams()
    const navigate=useNavigate()

    useEffect(()=>{
        if(slug){
            appwriteService.getPost(slug).then((post)=>{
                if(post){
                    setPosts(post)
                }
            })
        }else{
            navigate('/')
        }
    },[slug,navigate])
  return post ? (
    <div className='py-12'>
        <Container>
            <PageHeader title="Edit Story" subtitle="Update and refine your published story." />
            <PostForm post={post} />
        </Container>
    </div>
  ) : (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-sm text-text-muted">Loading story...</p>
        </div>
    </div>
  )
}

export default EditPost