import React, { useState, useEffect } from 'react'
import appwriteService from "../appwrite/config"
import Badge from './ui/Badge'
import ShareModal from './ui/ShareModal'
import ConfirmDialog from './ui/ConfirmDialog'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { useGetUserProfileQuery, apiSlice } from '../store/apiSlice'
import { formatTimeAgo } from '../utils/timeAgo'
import { getAvatarUrl } from '../utils/avatar'

function stripHtml(input) {
  if (!input) return ''
  return input.replace(/<[^>]*>/g, '')
}

function PostCard({ $id, title, featuredImage, category, content, views, likes = [], userId, authorName, status, showDelete = false, $createdAt, createdAt }) {
  const timeAgo = formatTimeAgo($createdAt || createdAt)
  const excerpt = stripHtml(content).substring(0, 120)
  const wordCount = stripHtml(content).split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const userData = useSelector((state) => state.auth.userData)
  const isAuthor = userData && userData.$id === userId
  const { data: authorProfile } = useGetUserProfileQuery(userId, { skip: !userId })
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [likesState, setLikesState] = useState(likes || [])
  const [authorImgError, setAuthorImgError] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    setLikesState(likes || [])
  }, [likes])

  const hasLiked = userData && likesState.includes(userData.$id)

  const handleLike = async (e) => {
    e.preventDefault()
    if (!userData) {
      navigate('/login')
      return
    }
    const currentLikes = likesState || []
    const updatedLikes = hasLiked
      ? currentLikes.filter((id) => id !== userData.$id)
      : [...currentLikes, userData.$id]

    setLikesState(updatedLikes)

    try {
      await appwriteService.toggleLike($id, userData.$id, currentLikes)
      dispatch(apiSlice.util.invalidateTags(['Post', 'AuthorPosts']))
    } catch (err) {
      setLikesState(currentLikes)
    }
  }

  const handleShareClick = (e) => {
    e.preventDefault();
    setShowShareModal(true);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  }

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const status = await appwriteService.deletePost($id);
      if (status) {
        await appwriteService.deleteFile(featuredImage);
        toast.success("Story deleted successfully");
        dispatch(apiSlice.util.invalidateTags(['Post', 'AuthorPosts']));
      }
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("Failed to delete post:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <>
      <Link to={`/post/${$id}`} className="group block h-full relative">
        {/* Card Content */}
        <div className={`relative z-10 h-full flex flex-col rounded-2xl border border-border/40 dark:border-white/8 bg-surface-elevated/95 dark:bg-surface-elevated/80 backdrop-blur-md shadow-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/5 hover:border-primary-300/50 dark:hover:border-primary-500/20 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
          
          {/* Delete Button for Author */}
          {isAuthor && showDelete && (
            <button 
              onClick={handleDeleteClick} 
              disabled={isDeleting}
              className="absolute top-3 right-3 z-10 p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full backdrop-blur-sm shadow-md transition-all duration-200 hover:scale-110"
              title="Delete post"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          <div className='overflow-hidden shrink-0 relative'>
            <img
              src={appwriteService.getFilePreview(featuredImage, 800, 0, 100)}
              alt={title}
              loading="lazy"
              className='w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105'
            />
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className='p-5 flex flex-col flex-1'>
            <div className="flex items-center gap-2 flex-wrap">
              {($id === 'welcome-to-storynest-founder-letter' || userId === 'author_storynest_founder' || authorName?.includes('Founder') || title?.includes('Welcome to StoryNest')) && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1 shadow-sm">
                  📌 Pinned Story
                </span>
              )}
              {category && <Badge>{category}</Badge>}
              {status === 'inactive' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30">
                  🔒 Private Draft
                </span>
              )}
            </div>
            <h2 className='mt-3 text-lg font-bold text-text-primary line-clamp-2 group-hover:text-primary-600 transition-colors duration-300'>{title}</h2>
            {excerpt && <p className='mt-2 text-sm text-text-muted line-clamp-3 leading-relaxed'>{excerpt}...</p>}
            
            {/* Author Info */}
            <div className="flex items-center gap-2 mt-4 mb-2">
               <img 
                 src={getAvatarUrl(authorProfile?.profilePic, authorProfile?.email, authorProfile?.username || authorName)} 
                 alt={authorProfile?.username || authorName || 'Author'} 
                 referrerPolicy="no-referrer"
                 className="w-6 h-6 rounded-full object-cover shadow-sm ring-1 ring-border/30 shrink-0" 
               />
               <span className="font-medium text-text-secondary text-sm line-clamp-1">{authorProfile?.username || authorName || 'Anonymous'}</span>
               <span className="text-text-muted text-xs">·</span>
               <span className="text-text-muted text-xs">{readingTime} min read</span>
               {timeAgo && (
                 <>
                   <span className="text-text-muted text-xs">·</span>
                   <span className="text-text-muted text-xs font-medium text-primary-600 dark:text-primary-400">{timeAgo}</span>
                 </>
               )}
            </div>

            <div className='mt-auto pt-3 border-t border-border/30 dark:border-white/5 flex items-center justify-between text-sm'>
              <div className='flex items-center gap-3 text-text-muted'>
                <div className="flex items-center gap-1" title="Views">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-xs">{views || 0}</span>
                </div>
                <button
                  onClick={handleLike}
                  title={hasLiked ? "Unlike story" : "Like story"}
                  className={`flex items-center gap-1 transition-all duration-300 hover:scale-110 ${
                    hasLiked ? 'text-rose-500 font-medium' : 'hover:text-rose-500'
                  }`}
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${hasLiked ? 'fill-current scale-110' : 'fill-none'}`}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-xs">{likesState.length}</span>
                </button>
                <button
                  onClick={handleShareClick}
                  title="Share this story"
                  className="flex items-center gap-1 hover:text-primary-600 transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
              <div className='flex items-center font-semibold text-primary-600 text-sm group-hover:gap-1.5 transition-all duration-300'>
                Read
                <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <ConfirmDialog
        open={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete this story?"
        message="Are you sure you want to delete this story? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete Story"}
        loading={isDeleting}
        variant="danger"
      />

      {showShareModal && (
        <ShareModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          url={`${window.location.origin}/post/${$id}`}
          title={title}
        />
      )}
    </>
  )
}

export default PostCard