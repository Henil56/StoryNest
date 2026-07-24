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
import { useGetPostsByAuthorQuery } from '../store/apiSlice'

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

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false)
    const [editUsername, setEditUsername] = useState("")
    const [editProfilePic, setEditProfilePic] = useState(null)
    const [editLoading, setEditLoading] = useState(false)
    const [editError, setEditError] = useState("")

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
            let newPicId = undefined
            // Upload new picture if provided
            if (editProfilePic && editProfilePic[0]) {
                const file = await appwriteService.uploadFile(editProfilePic[0])
                if (file) {
                    newPicId = file.$id
                    // Delete old picture if it existed
                    if (authorProfile?.profilePic) {
                        await appwriteService.deleteFile(authorProfile.profilePic)
                    }
                }
            }

            // If the user profile doesn't exist yet (legacy user), create it
            if (!authorProfile) {
                await appwriteService.createUserProfile({
                    userId: authorId,
                    username: editUsername,
                    profilePic: newPicId
                })
            } else {
                // Update existing profile
                await appwriteService.updateUserProfile(authorId, {
                    username: editUsername,
                    profilePic: newPicId
                })
            }

            // Fetch updated profile
            await fetchProfile()

            // Update Redux state with new name if possible (optional)
            try {
                await authService.account.updateName(editUsername)
                const updatedUser = await authService.getCurrentUser()
                if (updatedUser) dispatch(login({ userData: updatedUser }))
            } catch (err) {
                console.log("Could not update Appwrite account name, but public profile was updated.", err)
            }

            setIsEditing(false)
        } catch (error) {
            setEditError(error.message || "Failed to update profile")
        } finally {
            setEditLoading(false)
        }
    }

    // Determine what to display for author name
    // Priority: Public Profile > Post's authorName > Appwrite User Data (if own profile) > authorId
    let displayAuthorName = 'Author'
    if (authorProfile?.username) displayAuthorName = authorProfile.username
    else if (posts.length > 0 && posts[0].authorName) displayAuthorName = posts[0].authorName
    else if (isOwnProfile && currentUser?.name) displayAuthorName = currentUser.name

    // Filter posts: author sees all posts (including drafts), visitors only see active/published posts
    const visiblePosts = posts.filter(post => isOwnProfile || post.status === 'active')

    const totalPages = Math.ceil(visiblePosts.length / POSTS_PER_PAGE)
    const paginatedPosts = visiblePosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    )

    return (
        <div className="w-full py-12 animate-fade-in relative">
            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
                    <div className="relative w-full max-w-md rounded-2xl bg-surface-elevated shadow-2xl border border-border p-6 animate-slide-up">
                        <h3 className="text-xl font-bold text-text-primary mb-4">Edit Profile</h3>
                        
                        {editError && (
                            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-danger">
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
                                <input
                                    type="file"
                                    onChange={(e) => setEditProfilePic(e.target.files)}
                                    className="text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer w-full border border-dashed border-border p-2 rounded-xl"
                                    accept="image/png, image/jpg, image/jpeg, image/gif"
                                />
                                <p className="text-xs text-text-muted mt-1">Leave empty to keep current picture.</p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)} 
                                    bgColor="bg-primary-100" 
                                    textColor="text-primary-800"
                                    className="hover:bg-primary-200"
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

            <Container>
                {/* Author Header */}
                <div className="mb-10">
                    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary-600 transition-colors duration-200 mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            {authorProfile?.profilePic ? (
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary-500 rounded-full blur group-hover:blur-md transition-all duration-300 opacity-20"></div>
                                    <img 
                                        src={appwriteService.getFilePreview(authorProfile.profilePic)} 
                                        alt={displayAuthorName} 
                                        className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover shadow-xl border-4 border-surface-elevated hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ) : (
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-xl border-4 border-surface-elevated hover:scale-105 transition-transform duration-300">
                                        {(displayAuthorName || authorId || 'A').charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                                    {displayAuthorName}
                                </h1>
                                <p className="mt-1 text-text-muted text-sm">
                                    {loading ? 'Loading...' : `${visiblePosts.length} ${visiblePosts.length === 1 ? 'story' : 'stories'} ${isOwnProfile ? 'total' : 'published'}`}
                                </p>
                            </div>
                        </div>

                        {/* Edit Profile Button */}
                        {isOwnProfile && (
                            <Button 
                                onClick={() => {
                                    setEditUsername(displayAuthorName)
                                    setIsEditing(true)
                                }}
                                className="mt-4 sm:mt-0 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 px-6 py-2.5 rounded-xl font-semibold"
                            >
                                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <div className="mt-6 h-px bg-border"></div>
                </div>

                {/* Posts Grid */}
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
    )
}
