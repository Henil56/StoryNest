import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components';

function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12">
            <Container>
                <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="text-8xl md:text-9xl font-extrabold text-primary-500/20 mb-4 select-none">
                        404
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-lg text-text-muted max-w-md mb-8">
                        Oops! The page you are looking for doesn't exist or has been moved.
                    </p>
                    <Link 
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-xl bg-primary-600 text-white shadow-lg hover:bg-primary-700 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </Container>
        </div>
    );
}

export default NotFound;
