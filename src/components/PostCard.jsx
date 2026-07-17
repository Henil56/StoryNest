import React, { useState } from 'react'
import appwriteService from "../appwrite/config"
import Badge from './ui/Badge'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

function stripHtml(input) {
  if (!input) return ''
  return input.replace(/<[^>]*>/g, '')
}

function PostCard({ $id, title, featuredImage, category, content, views, likes, userId, showDelete = false }) {
  const excerpt = stripHtml(content).substring(0, 120)
  const userData = useSelector((state) => state.auth.userData)
  const isAuthor = userData && userData.$id === userId
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent navigating to the post page
    if (window.confirm("Are you sure you want to delete this story?")) {
      setIsDeleting(true);
      try {
        const status = await appwriteService.deletePost($id);
        if (status) {
          await appwriteService.deleteFile(featuredImage);
          toast.success("Story deleted successfully");
          // Short timeout to let the user see the toast before reload
          setTimeout(() => window.location.reload(), 1000);
        }
      } catch (error) {
        toast.error("Failed to delete post");
        console.error("Failed to delete post:", error);
        setIsDeleting(false);
      }
    }
  }

  return (
    <Link to={`/post/${$id}`} className="group block h-full relative">
      <div className={`h-full flex flex-col rounded-2xl border border-[#A8D4EE] bg-surface-elevated shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#87CEEB]/30 hover:-translate-y-1 hover:border-[#87CEEB] ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* Delete Button for Author */}
        {isAuthor && showDelete && (
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="absolute top-3 right-3 z-10 p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full backdrop-blur-sm shadow-md transition-all duration-200 hover:scale-110"
            title="Delete post"
          >
            {isDeleting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        )}

        <div className='overflow-hidden shrink-0 relative'>
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className='w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105'
          />
        </div>
        <div className='p-5 flex flex-col flex-1'>
          {category && <Badge>{category}</Badge>}
          <h2 className='mt-3 text-lg font-bold text-text-primary line-clamp-2 group-hover:text-primary-600 transition-colors duration-200'>{title}</h2>
          {excerpt && <p className='mt-2 text-sm text-text-muted line-clamp-3 leading-relaxed'>{excerpt}...</p>}
          <div className='mt-auto pt-4 flex items-center justify-between text-sm'>
            <div className='flex items-center gap-3 text-text-muted'>
              <div className="flex items-center gap-1" title="Views">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{views || 0}</span>
              </div>
              <div className="flex items-center gap-1" title="Likes">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{(likes || []).length}</span>
              </div>
            </div>
            <div className='flex items-center font-semibold text-primary-600 group-hover:gap-1 transition-all duration-200'>
              Read more
              <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard