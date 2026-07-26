import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { apiSlice, useGetPostQuery, useGetUserProfileQuery } from "../store/apiSlice";
import { getAvatarUrl } from "../utils/avatar";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ShareModal from "../components/ui/ShareModal";
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { formatTimeAgo } from '../utils/timeAgo';

export default function Post() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);

    const { data: fetchedPost, error: postError } = useGetPostQuery(slug, { skip: !slug });
    const [post, setPost] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [readProgress, setReadProgress] = useState(0);
    const [authorImgError, setAuthorImgError] = useState(false);
    const hasIncrementedView = useRef(false);
    const articleRef = useRef(null);

    const { data: authorProfile } = useGetUserProfileQuery(post?.userId, { skip: !post?.userId });

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (postError) {
            navigate("/");
        }
    }, [postError, navigate]);

    useEffect(() => {
        if (fetchedPost) {
            setPost(fetchedPost);
        }
    }, [fetchedPost]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // Reading progress bar
    useEffect(() => {
        const handleScroll = () => {
            if (!articleRef.current) return;
            const element = articleRef.current;
            const rect = element.getBoundingClientRect();
            const totalHeight = element.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY - element.offsetTop;
            const progress = Math.min(Math.max(scrollTop / totalHeight, 0), 1);
            setReadProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [post]);

    useEffect(() => {
        if (fetchedPost && !hasIncrementedView.current) {
            hasIncrementedView.current = true;
            const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '[]');
            if (!viewedPosts.includes(slug)) {
                viewedPosts.push(slug);
                localStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
                appwriteService.incrementView(slug, fetchedPost.views || 0);
                setPost(prev => prev ? ({ ...prev, views: (prev.views || 0) + 1 }) : prev);
                dispatch(apiSlice.util.invalidateTags(['Post', 'AuthorPosts']));
            }
        }
    }, [fetchedPost, slug, dispatch]);

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
        <div className="page-enter" ref={articleRef}>
            {/* Reading Progress Bar */}
            <div 
                className="reading-progress-bar"
                style={{ transform: `scaleX(${readProgress})` }}
            />

            <Helmet>
                <title>{post.title} | StoryNest</title>
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
            <ShareModal
                open={showShareModal}
                onClose={() => setShowShareModal(false)}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={post.title}
            />

            {/* Hero Image Section with Dynamic Photo-Derived Ambient Background */}
            <div className="relative w-full py-10 sm:py-16 overflow-hidden bg-[#0A0F1D] dark:bg-[#070A14] flex items-center justify-center">
                {/* Dynamic Ambient Background Derived From Photo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div 
                        className="absolute inset-0 opacity-60 dark:opacity-50 blur-3xl scale-125 saturate-150 transition-all duration-700"
                        style={{ 
                            backgroundImage: `url(${appwriteService.getFilePreview(post.featuredImage, 400, 0, 100)})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                        }}
                    ></div>
                    {/* Vignette overlays for smooth blend */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-transparent to-[#0A0F1D]/80 dark:from-[#070A14] dark:to-[#070A14]/80"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1D]/60 via-transparent to-[#0A0F1D]/60 dark:from-[#070A14]/60 dark:to-[#070A14]/60"></div>
                </div>
                
                {/* Image */}
                <div className="relative z-10 flex max-w-[92%] md:max-w-4xl transition-all duration-500 hover:-translate-y-1 group px-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage, 1200, 0, 100)}
                        alt={post.title}
                        loading="lazy"
                        className="relative z-10 w-full max-h-[600px] object-contain rounded-2xl border border-white/20 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-500 ease-out group-hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.85)] group-hover:border-white/30"
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
                <article className="max-w-3xl mx-auto py-8 sm:py-12">
                    {/* Category Badge */}
                    {post.category && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-200/50 dark:border-primary-700/30 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
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
                            <img 
                                src={getAvatarUrl(authorProfile?.profilePic, authorProfile?.email, displayAuthorName)} 
                                alt={displayAuthorName} 
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-border/30"
                            />
                            <span className="font-semibold text-text-primary hover:text-primary-600 transition-colors duration-200">
                                {displayAuthorName}
                            </span>
                        </Link>

                        <span className="text-text-muted">·</span>

                        <span className="flex items-center gap-1.5 text-text-muted">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {readingTime} min read
                        </span>

                        {post?.$createdAt && (
                            <>
                                <span className="text-text-muted">·</span>
                                <span className="text-[#0284C7] dark:text-[#38BDF8] font-medium text-xs sm:text-sm">
                                    {formatTimeAgo(post.$createdAt)}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Engagement Bar — Pill Treatment */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface border border-border/50 text-sm text-text-secondary shadow-sm">
                            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="font-medium">{post.views || 0} views</span>
                        </div>
                        
                        <button 
                            onClick={handleLike}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm shadow-sm transition-transform transition-colors duration-200 hover:-translate-y-0.5 active:scale-95 ${
                                userData && (post.likes || []).includes(userData.$id) 
                                    ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400' 
                                    : 'bg-surface border-border/50 text-text-secondary hover:border-rose-300 hover:text-rose-500'
                            }`}
                        >
                            <svg className={`w-4 h-4 ${userData && (post.likes || []).includes(userData.$id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-medium">{(post.likes || []).length} likes</span>
                        </button>

                        {/* Share Button */}
                        <button
                            onClick={() => setShowShareModal(true)}
                            title="Share this story"
                            className="group/share inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border/50 bg-surface text-text-muted hover:border-primary-400 hover:text-primary-600 shadow-sm transition-transform transition-colors duration-200 hover:-translate-y-0.5 active:scale-95 ml-auto"
                        >
                            <svg className="w-4 h-4 transition-transform duration-200 group-hover/share:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span className="text-sm font-semibold">Share</span>
                        </button>
                    </div>

                    <div className="mt-8 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                    <div className="mt-8 prose">
                        {parse(DOMPurify.sanitize(post.content || ''))}
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