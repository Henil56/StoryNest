import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { apiSlice } from "../store/apiSlice";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { Helmet } from 'react-helmet-async';

export default function Post() {
    const [post, setPost] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [authorProfile, setAuthorProfile] = useState(null);

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                    // Increment view count when post is successfully fetched
                    appwriteService.incrementView(slug, post.views || 0);
                    
                    // Fetch author profile
                    appwriteService.getUserProfile(post.userId).then((profile) => {
                        if (profile) setAuthorProfile(profile);
                    });
                }
                else navigate("/");
            }).catch(() => {
                navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = async () => {
        setDeleting(true);
        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                dispatch(apiSlice.util.invalidateTags(['Post', 'AuthorPosts']));
                navigate("/");
            }
        } catch (err) {
            console.error("Delete failed:", err);
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleLike = async () => {
        if (!userData) {
            navigate("/login");
            return;
        }

        const currentLikes = post.likes || [];
        const hasLiked = currentLikes.includes(userData.$id);
        
        // Optimistic UI update
        const newLikes = hasLiked
            ? currentLikes.filter(id => id !== userData.$id)
            : [...currentLikes, userData.$id];
            
        setPost(prev => ({ ...prev, likes: newLikes }));

        // Backend update
        await appwriteService.toggleLike(post.$id, userData.$id, currentLikes);
        dispatch(apiSlice.util.invalidateTags(['Post', 'AuthorPosts']));
    };

    // Calculate reading time
    const readingTime = post ? Math.max(1, Math.ceil((post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 200)) : 0;

    const displayAuthorName = authorProfile?.username || post?.authorName || 'Author';

    return post ? (
        <div className="animate-fade-in">
            <Helmet>
                <title>StoryNest</title>
                <meta name="description" content={(post.content || '').replace(/<[^>]*>?/gm, '').substring(0, 160)} />
            </Helmet>
            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={showDeleteConfirm}
                onConfirm={deletePost}
                onCancel={() => setShowDeleteConfirm(false)}
                title="Delete this story?"
                message="This will permanently remove your story and its featured image. This action cannot be undone."
                confirmText={deleting ? "Deleting..." : "Yes, delete"}
                loading={deleting}
                variant="danger"
            />

            {/* Hero Image Section */}
            <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden bg-surface flex items-center justify-center">
                {/* Blurred Background */}
                <div 
                    className="absolute inset-0 opacity-40 blur-3xl scale-110"
                    style={{ 
                        backgroundImage: `url(${appwriteService.getFilePreview(post.featuredImage)})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                ></div>
                
                {/* Actual Image (Contain) */}
                <img
                    src={appwriteService.getFilePreview(post.featuredImage)}
                    alt={post.title}
                    className="relative z-10 w-full h-full max-w-6xl object-contain p-4 sm:p-8 drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                />

                {/* Gradient Overlay to blend with the page */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-20 pointer-events-none"></div>
                
                {/* Edit Button */}
                {isAuthor && (
                    <div className="absolute right-6 top-6 flex gap-3 z-30">
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button variant="success" bgColor="bg-emerald-600" className="shadow-lg backdrop-blur-md bg-emerald-600/90 hover:bg-emerald-600">
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Edit
                                </span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Article Content */}
            <Container>
                <article className="max-w-3xl mx-auto py-10 sm:py-16">
                    {/* Category Badge */}
                    {post.category && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 mb-4">
                            {post.category}
                        </span>
                    )}

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
                        {post.title}
                    </h1>
                    
                    {/* Author & Meta Bar */}
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-text-secondary text-sm">
                        <Link 
                            to={`/author/${post.userId}`}
                            className="flex items-center gap-2 hover:text-primary-600 transition-colors duration-200"
                        >
                            {authorProfile?.profilePic ? (
                                <img 
                                    src={appwriteService.getFilePreview(authorProfile.profilePic)} 
                                    alt={displayAuthorName} 
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                                    {(displayAuthorName || 'A').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="font-medium">{displayAuthorName}</span>
                        </Link>

                        <span className="text-text-muted">·</span>

                        <span className="flex items-center gap-1.5 text-text-muted">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {readingTime} min read
                        </span>
                    </div>

                    {/* Engagement Bar */}
                    <div className="mt-6 flex items-center gap-6 text-text-secondary">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="font-medium">{post.views || 0} views</span>
                        </div>
                        
                        <button 
                            onClick={handleLike}
                            className={`flex items-center gap-2 transition-colors duration-200 ${userData && (post.likes || []).includes(userData.$id) ? 'text-rose-500 hover:text-rose-600' : 'hover:text-rose-500'}`}
                        >
                            <svg className={`w-5 h-5 ${userData && (post.likes || []).includes(userData.$id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-medium">{(post.likes || []).length} likes</span>
                        </button>
                    </div>

                    <div className="mt-6 h-px bg-border"></div>
                    <div className="mt-8 prose">
                        {parse(post.content || '')}
                    </div>
                </article>
            </Container>
        </div>
    ) : (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Helmet>
                <title>StoryNest</title>
            </Helmet>
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-sm text-text-muted">Loading story...</p>
            </div>
        </div>
    );
}