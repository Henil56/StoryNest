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
            <div className="relative w-full py-16 overflow-hidden bg-surface flex items-center justify-center">
                {/* Faint ambient background for page atmosphere */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div 
                        className="absolute inset-0 opacity-20 blur-[100px] scale-150 transition-all duration-700"
                        style={{ 
                            backgroundImage: `url(${appwriteService.getFilePreview(post.featuredImage)})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
                </div>
                
                {/* Image with Dynamic Color Glow Border */}
                <div className="relative z-10 flex max-w-[90%] md:max-w-4xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] group">
                    {/* The Dynamic Glow */}
                    <div 
                        className="absolute -inset-1 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 group-hover:blur-2xl group-hover:-inset-2 transition-all duration-500"
                        style={{ 
                            backgroundImage: `url(${appwriteService.getFilePreview(post.featuredImage)})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                        }}
                    ></div>
                    
                    {/* The Sharp Image */}
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="relative z-10 w-full max-h-[550px] object-contain rounded-xl border border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-md transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.6)]"
                    />
                </div>
                
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