import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components';

function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 page-enter">
            <Container>
                <div className="flex flex-col items-center justify-center text-center">
                    {/* Animated 404 */}
                    <div className="relative mb-8">
                        <div className="text-[10rem] sm:text-[12rem] font-black leading-none gradient-text-light select-none opacity-90" style={{ animation: 'float 4s ease-in-out infinite' }}>
                            404
                        </div>
                        {/* Glow behind */}
                        <div className="absolute inset-0 text-[10rem] sm:text-[12rem] font-black leading-none text-primary-400/20 dark:text-primary-500/10 blur-xl select-none pointer-events-none" aria-hidden="true">
                            404
                        </div>
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 animate-fade-in">
                        Oops! This page wandered off
                    </h1>
                    <p className="text-base text-text-muted max-w-md mb-8 animate-fade-in leading-relaxed">
                        The story you're looking for doesn't exist, or maybe it's just being written. Let's get you back on track.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 animate-fade-in">
                        <Link 
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                        <Link 
                            to="/all-post"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-border text-text-secondary hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Explore Stories
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default NotFound;
