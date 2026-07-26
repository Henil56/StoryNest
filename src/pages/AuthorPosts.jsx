import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, PostCard, Button, Input } from '../components'
import appwriteService from '../appwrite/config'
import authService from '../appwrite/auth'
import EmptyState from '../components/ui/EmptyState'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import Pagination from '../components/ui/Pagination'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { useGetPostsByAuthorQuery, apiSlice } from '../store/apiSlice'
import { getAvatarUrl } from '../utils/avatar'

const POSTS_PER_PAGE = 12

export default function AuthorPosts() {
    const { authorId } = useParams()
    const dispatch = useDispatch()
    const { data: posts = [], isLoading: loadingPosts } = useGetPostsByAuthorQuery(authorId, {
        skip: !authorId,
    })
    
    const [authorProfile, setAuthorProfile] = useState(null)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [profileImgError, setProfileImgError] = useState(false)

    useEffect(() => {
        setProfileImgError(false)
    }, [authorProfile?.profilePic])

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false)
    const [editUsername, setEditUsername] = useState("")
    const [editProfilePic, setEditProfilePic] = useState(null)
    const [editPreviewUrl, setEditPreviewUrl] = useState(null)
    const [editLoading, setEditLoading] = useState(false)
    const [editError, setEditError] = useState("")

    const handleEditFileChange = (e) => {
        const files = e.target.files
        setEditProfilePic(files)
        if (files && files[0]) {
            setEditPreviewUrl(URL.createObjectURL(files[0]))
        } else {
            setEditPreviewUrl(null)
        }
    }

    const currentUser = useSelector((state) => state.auth.userData)
    const isOwnProfile = currentUser?.$id === authorId
    
    const loading = loadingPosts || loadingProfile;

    const fetchProfile = React.useCallback(async () => {
        setLoadingProfile(true)
        try {
            const profile = await appwriteService.getUserProfile(authorId)
            if (profile) setAuthorProfile(profile)
        } catch (error) {
            console.error("Failed to fetch author profile:", error)
        } finally {
            setLoadingProfile(false)
        }
    }, [authorId])

    useEffect(() => {
        if (authorId) {
            fetchProfile()
        }
    }, [authorId, fetchProfile])

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        if (!editUsername.trim()) {
            setEditError("Username cannot be empty")
            return
        }

        setEditLoading(true)
        setEditError("")

        try {
            // Check username uniqueness
            const isTaken = await appwriteService.isUsernameTaken(editUsername, authorId)
            if (isTaken) {
                setEditError("This username is already taken. Please choose a different username.")
                setEditLoading(false)
                return
            }

            let newPicId = undefined
            if (editProfilePic && editProfilePic[0]) {
                const file = await appwriteService.uploadFile(editProfilePic[0])
                if (file) {
                    newPicId = file.$id
                    if (authorProfile?.profilePic) {
                        await appwriteService.deleteFile(authorProfile.profilePic)
                    }
                }
            }

            if (!authorProfile) {
                await appwriteService.createUserProfile({
                    userId: authorId,
                    username: editUsername,
                    profilePic: newPicId
                })
            } else {
                await appwriteService.updateUserProfile(authorId, {
                    username: editUsername,
                    profilePic: newPicId
                })
            }

            await fetchProfile()

            try {
                await authService.account.updateName(editUsername)
                const updatedUser = await authService.getCurrentUser()
                if (updatedUser) dispatch(login({ userData: updatedUser }))
            } catch (err) {
                console.log("Could not update Appwrite account name, but public profile was updated.", err)
            }

            dispatch(apiSlice.util.invalidateTags(['UserProfile', 'Post', 'AuthorPosts']))
            setIsEditing(false)
        } catch (error) {
            setEditError(error.message || "Failed to update profile")
        } finally {
            setEditLoading(false)
        }
    }

    let displayAuthorName = 'Author'
    if (authorProfile?.username) displayAuthorName = authorProfile.username
    else if (posts.length > 0 && posts[0].authorName) displayAuthorName = posts[0].authorName
    else if (isOwnProfile && currentUser?.name) displayAuthorName = currentUser.name

    const visiblePosts = posts.filter(post => isOwnProfile || post.status === 'active')

    // Calculate stats
    const totalViews = visiblePosts.reduce((sum, p) => sum + (p.views || 0), 0)
    const totalLikes = visiblePosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)

    const totalPages = Math.ceil(visiblePosts.length / POSTS_PER_PAGE)
    const paginatedPosts = visiblePosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    )

    return (
        <div className="w-full page-enter">
            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
                    <div className="relative w-full max-w-md rounded-2xl bg-surface-elevated shadow-2xl border border-border p-6 animate-scale-in">
                        <h3 className="text-xl font-bold text-text-primary mb-4">Edit Profile</h3>
                        
                        {editError && (
                            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-danger dark:bg-rose-900/20 dark:border-rose-800">
                                {editError}
                            </div>
                        )}

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <Input
                                label="Username"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                            
                            <div>
                                 <label className="inline-flex items-center gap-1 mb-1.5 pl-0.5 text-sm font-medium text-text-secondary">
                                     Profile Picture
                                 </label>
                                 {editPreviewUrl ? (
                                     <div className="mt-1 flex items-center gap-4 p-3 rounded-2xl bg-surface border border-border/80 shadow-sm">
                                         <img 
                                             src={editPreviewUrl} 
                                             alt="New Profile Preview" 
                                             className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-primary-500/50"
                                         />
                                         <div className="flex-1 min-w-0">
                                             <p className="text-xs font-semibold text-text-primary">New Photo Selected</p>
                                             <div className="flex items-center gap-3 mt-1">
                                                 <label className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 cursor-pointer">
                                                     Change
                                                     <input
                                                         type="file"
                                                         onChange={handleEditFileChange}
                                                         className="hidden"
                                                         accept="image/png, image/jpg, image/jpeg, image/gif"
                                                     />
                                                 </label>
                                                 <span className="text-text-muted text-xs">·</span>
                                                 <button
                                                     type="button"
                                                     onClick={() => {
                                                         setEditProfilePic(null)
                                                         setEditPreviewUrl(null)
                                                     }}
                                                     className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                                                 >
                                                     Remove
                                                 </button>
                                             </div>
                                         </div>
                                     </div>
                                 ) : (
                                     <div className="mt-1 relative rounded-2xl border-2 border-dashed border-border hover:border-primary-400 transition-all p-4 text-center bg-surface/50 hover:bg-surface group cursor-pointer">
                                         <input
                                             type="file"
                                             onChange={handleEditFileChange}
                                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                             accept="image/png, image/jpg, image/jpeg, image/gif"
                                         />
                                         <div className="flex items-center justify-center gap-3">
                                             {authorProfile?.profilePic ? (
                                                 <img 
                                                     src={appwriteService.getFilePreview(authorProfile.profilePic)} 
                                                     alt="Current Profile" 
                                                     className="w-10 h-10 rounded-full object-cover border border-border"
                                                 />
                                             ) : (
                                                 <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center text-sm font-bold">
                                                     {(displayAuthorName || 'A').charAt(0).toUpperCase()}
                                                 </div>
                                             )}
                                             <div className="text-left">
                                                 <span className="text-xs font-semibold text-text-primary group-hover:text-primary-600 transition-colors">Click to upload new photo</span>
                                                 <p className="text-[11px] text-text-muted">Leave empty to keep current picture</p>
                                             </div>
                                         </div>
                                     </div>
                                 )}
                             </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)} 
                                    variant="ghost"
                                    disabled={editLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" loading={editLoading}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Profile Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-500/20 via-primary-400/10 to-primary-300/5 dark:from-primary-900/30 dark:via-primary-800/10 dark:to-transparent pt-8 pb-12">
                {/* Decorative blurs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-300/10 dark:bg-primary-600/5 blur-[80px] rounded-full pointer-events-none"></div>

                <Container>
                    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary-600 transition-colors duration-200 mb-6 relative z-10">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-5 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-5">
                            {/* Avatar */}
                            <div 
                                onClick={() => isOwnProfile && setIsEditing(true)}
                                title={isOwnProfile ? "Click to change profile picture" : ""}
                                className={`relative group ${isOwnProfile ? 'cursor-pointer' : ''}`}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                                
                                <img 
                                    src={getAvatarUrl(authorProfile?.profilePic, authorProfile?.email || (isOwnProfile ? currentUser?.email : null), displayAuthorName)} 
                                    alt={displayAuthorName} 
                                    referrerPolicy="no-referrer"
                                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-xl border-4 border-surface-elevated group-hover:scale-105 transition-transform duration-300"
                                />

                                {isOwnProfile && (
                                    <div className="absolute bottom-0.5 right-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white border-2 border-surface-elevated flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 z-10">
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                                    {displayAuthorName}
                                </h1>
                                {/* Stats pills */}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated/80 border border-border/30 text-xs font-medium text-text-secondary shadow-sm">
                                        <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                        {loading ? '...' : `${visiblePosts.length} ${visiblePosts.length === 1 ? 'story' : 'stories'}`}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated/80 border border-border/30 text-xs font-medium text-text-secondary shadow-sm">
                                        <svg className="w-3.5 h-3.5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        {totalViews} views
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated/80 border border-border/30 text-xs font-medium text-text-secondary shadow-sm">
                                        <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        {totalLikes} likes
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Button */}
                        {isOwnProfile && (
                            <Button 
                                onClick={() => {
                                    setEditUsername(displayAuthorName)
                                    setIsEditing(true)
                                }}
                                variant="secondary"
                                className="mt-4 sm:mt-0"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </Container>
            </div>

            {/* Posts Grid */}
            <div className="py-10">
                <Container>
                    {loading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <LoadingSkeleton key={i} />
                            ))}
                        </div>
                    ) : visiblePosts.length === 0 ? (
                        <EmptyState
                            title="No stories yet"
                            description="This author hasn't published any stories yet."
                            icon="📝"
                        />
                    ) : (
                        <>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {paginatedPosts.map((post) => (
                                    <PostCard key={post.$id} {...post} showDelete={true} />
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </Container>
            </div>
        </div>
    )
}
