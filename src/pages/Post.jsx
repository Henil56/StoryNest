import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                    // Increment view count when post is successfully fetched
                    appwriteService.incrementView(slug, post.views || 0);
                }
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
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
    };

    return post ? (
        <div className="animate-fade-in">
            {/* Hero Image */}
            <div className="relative w-full max-h-[500px] overflow-hidden bg-slate-900">
                <img
                    src={appwriteService.getFilePreview(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {isAuthor && (
                    <div className="absolute right-6 top-6 flex gap-3">
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button variant="success" bgColor="bg-emerald-600" className="shadow-lg">
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Edit
                                </span>
                            </Button>
                        </Link>
                        <Button variant="danger" bgColor="bg-rose-600" onClick={deletePost} className="shadow-lg">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete
                            </span>
                        </Button>
                    </div>
                )}
            </div>

            {/* Article Content */}
            <Container>
                <article className="max-w-3xl mx-auto py-10 sm:py-16">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
                        {post.title}
                    </h1>
                    
                    {/* Engagement Bar */}
                    <div className="mt-6 flex items-center gap-6 text-text-secondary">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        {parse(post.content)}
                    </div>
                </article>
            </Container>
        </div>
    ) : (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-sm text-text-muted">Loading story...</p>
            </div>
        </div>
    );
}